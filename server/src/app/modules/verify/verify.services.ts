import crypto from "crypto";
import { ILandParcel, syntheticLandParcels } from "../../../data/land-records";
import { pool } from "../../../utils/pg";
import { isDagMatch, getSearchVariants } from "../../../utils/digitConverter";

export interface ICheckPlotInput {
  division: string;
  district: string;
  upazila: string;
  mouza: string;
  dagNo: string;
  khatianNo?: string;
  sellerNid?: string;
}

export const checkPlotRiskAudit = async (input: ICheckPlotInput) => {
  const dagVariants = getSearchVariants(input.dagNo);
  let parcel: ILandParcel | null = null;

  // 1. Try DB first
  try {
    for (const v of dagVariants) {
      const res = await pool.query(
        "SELECT data_json FROM land_parcels WHERE dag_no = $1 OR ulpin ILIKE $1 LIMIT 1;",
        [v]
      );
      if (res.rows.length > 0) {
        parcel = res.rows[0].data_json as ILandParcel;
        break;
      }
    }
  } catch (err) {
    console.warn("DB audit lookup fallback:", err);
  }

  // 2. Fallback to memory
  if (!parcel) {
    parcel =
      syntheticLandParcels.find((p) => {
        const matchDag = isDagMatch(p.dagNo, input.dagNo) || isDagMatch(p.ulpin, input.dagNo);
        if (!matchDag) return false;
        if (!input.mouza) return true;
        const m = input.mouza.toLowerCase();
        return (
          p.mouzaBn.toLowerCase().includes(m) ||
          m.includes(p.mouzaBn.toLowerCase()) ||
          p.mouzaEn.toLowerCase().includes(m) ||
          m.includes(p.mouzaEn.toLowerCase())
        );
      }) || null;
  }

  if (!parcel) {
    return {
      found: false,
      messageBn: "প্রদত্ত মৌজা ও দাগ নম্বরে কোনো তথ্য মেলেনি। অনুগ্রহ করে সঠিক তথ্য যাচাই করুন।",
      messageEn: "No record found for the provided Mouza and Dag number.",
    };
  }

  // Dynamic risk calculation
  let score = 100;
  const criticalFlagsBn: string[] = [];
  const criticalFlagsEn: string[] = [];
  const warningFlagsBn: string[] = [];
  const warningFlagsEn: string[] = [];

  // Check 1: Khas Property Check
  if (parcel.isKhas) {
    score -= 75;
    criticalFlagsBn.push("এটি সরকারের ১নং খাস খতিয়ানের জমি। ব্যক্তিমালিকানায় ক্রয়-বিক্রয় সম্পূর্ণ অবৈধ ও আইনত দণ্ডনীয়।");
    criticalFlagsEn.push("Official Government Khas property. Private conveyance is illegal and punishable by law.");
  }

  // Check 2: Acquisition Notice
  if (parcel.isAcquiredByGovt) {
    score -= 60;
    criticalFlagsBn.push("ঢাকা জেলা প্রশাসক (DC) কার্যালয় কর্তৃক ৪/৭ ধারার সরকারি অধিগ্রহণ নোটিশ জারি রয়েছে।");
    criticalFlagsEn.push("Government acquisition notice (Section 4/7) active by DC Office. Private sale barred.");
  }

  // Check 3: Transit Lock / Double Selling Attempt
  if (parcel.transitLock.isLocked) {
    score -= 55;
    criticalFlagsBn.push(
      `সাব-রেজিস্ট্রি অফিসে সম্প্রতি দলিল নং (${parcel.transitLock.pendingDeedNo}) রেজিস্ট্রি হয়েছে! বর্তমানে ই-নামজারি ট্রানজিট লক কার্যকর রয়েছে।`
    );
    criticalFlagsEn.push(
      `Recently registered deed (${parcel.transitLock.pendingDeedNo}) at Sub-Registry. Active e-Mutation Transit Lock detected.`
    );
  }

  // Check 4: Bank Mortgage Liens
  const activeLiens = parcel.liens.filter((l) => l.status === "active");
  if (activeLiens.length > 0) {
    const totalAmount = activeLiens.reduce((acc, curr) => acc + curr.mortgageAmountBdt, 0);
    score -= 35;
    warningFlagsBn.push(
      `ব্যাংক লিয়েন পাওয়া গেছে: ${activeLiens[0].bankNameBn}-এ মোট ${totalAmount.toLocaleString()} টাকার ঋণের দায়ে বন্ধক রয়েছে।`
    );
    warningFlagsEn.push(
      `Active bank mortgage lien found: ${activeLiens[0].bankNameEn} for BDT ${totalAmount.toLocaleString()}.`
    );
  }

  // Check 5: Active Litigation
  if (parcel.hasLitigation) {
    score -= 25;
    warningFlagsBn.push("আদালতে দেওয়ানি স্বত্ব মামলা বিচারাধীন রয়েছে। কোনো মধ্যবর্তী বায়না বা দখল পরিবর্তন ঝুঁকিপূর্ণ।");
    warningFlagsEn.push("Pending civil title suit in court. Any interim earnest money is at high legal risk.");
  }

  // Check 6: Baya Chain Integrity
  const verifiedNodes = parcel.bayaChain.filter((n) => n.status === "verified");
  if (verifiedNodes.length < parcel.bayaChain.length) {
    score -= 20;
    warningFlagsBn.push("বায়া দলিল ও খতিয়ান চেইনের সংযোগে ঘাটতি বা অসঙ্গতি পরিলক্ষিত হয়েছে।");
    warningFlagsEn.push("Discrepancy or gap observed in historical Baya deed chain continuity.");
  }

  score = Math.max(5, Math.min(score, 100));

  let riskLevel: "safe" | "moderate" | "critical" = "safe";
  if (score < 50) riskLevel = "critical";
  else if (score < 80) riskLevel = "moderate";

  return {
    found: true,
    parcel,
    auditReport: {
      calculatedScore: score,
      riskLevel,
      criticalFlagsBn,
      criticalFlagsEn,
      warningFlagsBn,
      warningFlagsEn,
      isCleanTitle: score >= 85,
      recommendationBn:
        score >= 85
          ? "এই জমির মালিকানা ও নথিপত্র নিষ্কলুষ বলে প্রতীয়মান হয়। সাব-রেজিস্ট্রি অফিসে বৈধ প্রক্রিয়ায় বায়না সম্পন্ন করতে পারেন।"
          : score >= 50
          ? "সতর্কতা প্রয়োজন। ব্যাংকের অনাপত্তিপত্র (NOC) বা প্রয়োজনীয় নথিপত্র আইনজীবী দ্বারা যাচাই না করে টাকা প্রদান করবেন না।"
          : "চরম ঝুঁকিপূর্ণ! জালিয়াতি, সরকারি খাস, বা একাধিকবার বিক্রির সুস্পষ্ট ঝুঁকি রয়েছে। কোনো অবস্থাতেই বায়না করবেন না।",
      recommendationEn:
        score >= 85
          ? "Plot demonstrates clear title integrity. Recommended safe for purchase subject to standard deed registration."
          : score >= 50
          ? "Proceed with caution. Clear bank liens or resolve legal conditions prior to issuing payments."
          : "CRITICAL RISK! High probability of land fraud, government property, or double-selling. Do not purchase.",
    },
  };
};

export const verifyDeedCryptographicSignature = (deedData: {
  deedNo: string;
  deedDate: string;
  subRegistryOffice: string;
  sellerNid: string;
  buyerNid: string;
  dagNo: string;
  khatianNo: string;
  areaSatak: number;
  providedHash?: string;
}) => {
  // Generate deterministic payload string
  const payload = [
    deedData.deedNo.trim(),
    deedData.deedDate.trim(),
    deedData.subRegistryOffice.trim(),
    deedData.sellerNid.trim(),
    deedData.buyerNid.trim(),
    deedData.dagNo.trim(),
    deedData.khatianNo.trim(),
    deedData.areaSatak.toString(),
  ].join("|");

  const calculatedHash = crypto.createHash("sha256").update(payload).digest("hex");

  const isValid = deedData.providedHash
    ? deedData.providedHash.toLowerCase() === calculatedHash.toLowerCase()
    : true;

  return {
    calculatedHash,
    isValid,
    timestamp: new Date().toISOString(),
    qrDataString: `BHUMIBANDHAN://DEED/${deedData.deedNo}?hash=${calculatedHash}`,
  };
};

export const testAntiDoubleSellingAttempt = (input: {
  dagNo: string;
  sellerNid: string;
  transferAreaSatak: number;
}) => {
  const parcel = syntheticLandParcels.find((p) => isDagMatch(p.dagNo, input.dagNo));

  if (!parcel) {
    return {
      allowed: false,
      reasonBn: "দাগ নম্বরটি ভূমি ডাটাবেজে অন্তর্ভুক্ত নয়।",
      reasonEn: "Dag number not found in official land database.",
    };
  }

  if (parcel.transitLock.isLocked) {
    return {
      allowed: false,
      collisionDetected: true,
      reasonBn: `জালিয়াতি প্রতিরোধ সতর্কতা: দাগ নং ${input.dagNo}-এ দলিল নং (${parcel.transitLock.pendingDeedNo}) ইতিমধ্যে প্রক্রিয়াধীন রয়েছে। ই-নামজারি নিষ্পত্তির পূর্বে দ্বিতীয়বার বিক্রি করা সম্পূর্ণ নিষিদ্ধ।`,
      reasonEn: `ANTI-DOUBLE-SELLING SHIELD TRIGGERED: Deed (${parcel.transitLock.pendingDeedNo}) is actively in transit on Dag #${input.dagNo}. Secondary transfer strictly blocked.`,
    };
  }

  if (parcel.isKhas || parcel.isAcquiredByGovt) {
    return {
      allowed: false,
      collisionDetected: true,
      reasonBn: "সরকারি সম্পত্তি বা অধিগ্রহণকৃত জমি হওয়ায় বিক্রি রেজিস্ট্রেশন অনুমোদন করা সম্ভব নয়।",
      reasonEn: "Registration blocked: Government Khas or acquired parcel.",
    };
  }

  return {
    allowed: true,
    collisionDetected: false,
    reasonBn: "দাগের মালিকানা ফাঁকা রয়েছে এবং হস্তান্তরের জন্য সম্পূর্ণ বৈধ।",
    reasonEn: "Parcel share is clear and approved for conveyance.",
  };
};
