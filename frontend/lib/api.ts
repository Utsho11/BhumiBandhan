import { ILandParcel, IMutationApplication } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://server-pied-eta.vercel.app/api";

export const fetchParcels = async (query?: { mouza?: string; dag?: string; ulpin?: string }): Promise<ILandParcel[]> => {
  try {
    const params = new URLSearchParams();
    if (query?.mouza) params.append("mouza", query.mouza);
    if (query?.dag) params.append("dag", query.dag);
    if (query?.ulpin) params.append("ulpin", query.ulpin);

    const res = await fetch(`${API_BASE}/parcels?${params.toString()}`);
    if (!res.ok) throw new Error("Network response was not ok");
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn("Backend API unavailable, using built-in fallback dataset", error);
    return fallbackParcels;
  }
};

export const fetchSingleParcel = async (identifier: string): Promise<ILandParcel | null> => {
  try {
    const res = await fetch(`${API_BASE}/parcels/${encodeURIComponent(identifier)}`);
    if (!res.ok) throw new Error("Failed to fetch parcel");
    const json = await res.json();
    return json.data;
  } catch (error) {
    const found = fallbackParcels.find(
      (p) => p.dagNo === identifier || p.ulpin === identifier || p.currentKhatianNo.includes(identifier)
    );
    return found || null;
  }
};

export const checkPlotRiskAudit = async (input: {
  mouza: string;
  dagNo: string;
}) => {
  try {
    const res = await fetch(`${API_BASE}/verify/check-plot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return await res.json();
  } catch (error) {
    const parcel = fallbackParcels.find(
      (p) => p.dagNo === input.dagNo || p.mouzaBn.includes(input.mouza)
    );
    if (!parcel) {
      return {
        found: false,
        messageBn: "প্রদত্ত মৌজা ও দাগ নম্বরে কোনো তথ্য মেলেনি।",
      };
    }
    return {
      found: true,
      parcel,
      auditReport: {
        calculatedScore: parcel.trustScore,
        riskLevel: parcel.riskLevel,
        criticalFlagsBn: parcel.riskSummaryBn,
        warningFlagsBn: parcel.liens.length > 0 ? ["ব্যাংক লিয়েন রয়েছে"] : [],
        isCleanTitle: parcel.trustScore >= 80,
      },
    };
  }
};

export const fetchMutations = async (): Promise<IMutationApplication[]> => {
  try {
    const res = await fetch(`${API_BASE}/mutation`);
    if (!res.ok) throw new Error("Failed to fetch mutations");
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return fallbackMutations;
  }
};

export const fallbackParcels: ILandParcel[] = [
  {
    ulpin: "26-26-72-082-01425",
    divisionBn: "ঢাকা",
    divisionEn: "Dhaka",
    districtBn: "ঢাকা",
    districtEn: "Dhaka",
    upazilaBn: "সাভার",
    upazilaEn: "Savar",
    mouzaBn: "খাগান",
    mouzaEn: "Khagan",
    jlNo: "৮২",
    dagNo: "১৪২৫",
    currentKhatianNo: "BS-৫৬২১",
    khatianType: "BS",
    landClassBn: "বাস্তু/ভিটি",
    landClassEn: "Highland / Homestead",
    totalAreaSatak: 12.5,
    totalAreaKatha: 7.58,
    coordinates: { lat: 23.8789, lng: 90.3214 },
    owners: [
      {
        ownerId: "OWN-001",
        nameBn: "মোঃ শফিকুল ইসলাম",
        nameEn: "Md. Shafiqul Islam",
        fatherNameBn: "মৃত আজাহার আলী",
        nidMasked: "1988-XXXX-XXXX-0192",
        shareAnna: "০৮ আনা ০ গণ্ডা",
        shareDecimal: 0.5,
        portionSatak: 6.25,
      },
      {
        ownerId: "OWN-002",
        nameBn: "মোছাঃ ফাতেমা বেগম",
        nameEn: "Mst. Fatema Begum",
        fatherNameBn: "মৃত আজাহার আলী",
        nidMasked: "1992-XXXX-XXXX-4512",
        shareAnna: "০৮ আনা ০ গণ্ডা",
        shareDecimal: 0.5,
        portionSatak: 6.25,
      },
    ],
    bayaChain: [
      {
        surveyType: "CS",
        year: 1928,
        khatianNo: "CS-১৪২",
        dagNo: "CS-১১০৪",
        recordedOwnerBn: "রহিম বকশ",
        recordedOwnerEn: "Rahim Baksh",
        status: "verified",
        notesBn: "সিএস রেকর্ডে মূল প্রজা হিসেবে নথিভুক্ত।",
      },
      {
        surveyType: "SA",
        year: 1956,
        khatianNo: "SA-৩১৮",
        dagNo: "SA-১২০১",
        recordedOwnerBn: "আজাহার আলী",
        recordedOwnerEn: "Azahar Ali",
        transferredBy: "ওয়ারিশসূত্রে (Inherited)",
        status: "verified",
        notesBn: "এসএ রেকর্ডে ওয়ারিশ হস্তান্তর বৈধ।",
      },
      {
        surveyType: "RS",
        year: 1982,
        khatianNo: "RS-৮৯০",
        dagNo: "RS-১৪২৫",
        recordedOwnerBn: "আজাহার আলী",
        recordedOwnerEn: "Azahar Ali",
        status: "verified",
        notesBn: "আরএস জরিপে দাগ ও সীমানা সঠিক।",
      },
      {
        surveyType: "BS",
        year: 2012,
        khatianNo: "BS-৫৬২১",
        dagNo: "BS-১৪২৫",
        recordedOwnerBn: "মোঃ শফিকুল ইসলাম ও ফাতেমা বেগম",
        recordedOwnerEn: "Md. Shafiqul Islam & Fatema Begum",
        transferredBy: "ওয়ারিশ কায়েম সনদ ও নামজারি",
        deedNo: "MUT-2015-8821",
        deedDate: "2015-04-12",
        status: "verified",
        notesBn: "সর্বশেষ বিএস সিটি জরিপ খতিয়ান সম্পূর্ণ হালনাগাদ ও নিষ্কলুষ।",
      },
    ],
    liens: [],
    isKhas: false,
    isAcquiredByGovt: false,
    hasLitigation: false,
    transitLock: { isLocked: false },
    trustScore: 98,
    riskLevel: "safe",
    riskSummaryBn: [
      "বায়া দলিল চেইন (CS -> SA -> RS -> BS) সম্পূর্ণ অবিচ্ছিন্ন ও যাচাইকৃত।",
      "কোনো ব্যাংক বন্ধক বা আর্থিক দায়বদ্ধতা নেই।",
      "সরকারি খাস বা অধিগ্রহণ তালিকায় অন্তর্ভুক্ত নয়।",
      "আদালতে কোনো দেওয়ানি নিষেধাজ্ঞা নেই।",
    ],
    riskSummaryEn: [
      "Baya deed chain (CS -> SA -> RS -> BS) fully verified and intact.",
      "No active bank mortgage or financial encumbrance found.",
      "Not listed under government Khas or public acquisition status.",
    ],
  },
  {
    ulpin: "26-26-72-082-01426",
    divisionBn: "ঢাকা",
    divisionEn: "Dhaka",
    districtBn: "ঢাকা",
    districtEn: "Dhaka",
    upazilaBn: "সাভার",
    upazilaEn: "Savar",
    mouzaBn: "খাগান",
    mouzaEn: "Khagan",
    jlNo: "৮২",
    dagNo: "১৪২৬",
    currentKhatianNo: "BS-৫৬২২",
    khatianType: "BS",
    landClassBn: "নাল (কৃষি)",
    landClassEn: "Agricultural / Paddy",
    totalAreaSatak: 18.0,
    totalAreaKatha: 10.91,
    coordinates: { lat: 23.8795, lng: 90.3225 },
    owners: [
      {
        ownerId: "OWN-003",
        nameBn: "মোঃ কামাল হোসেন",
        nameEn: "Md. Kamal Hossain",
        fatherNameBn: "কফিল উদ্দিন",
        nidMasked: "1975-XXXX-XXXX-9941",
        shareAnna: "১৬ আনা ০ গণ্ডা",
        shareDecimal: 1.0,
        portionSatak: 18.0,
      },
    ],
    bayaChain: [],
    liens: [],
    isKhas: false,
    isAcquiredByGovt: false,
    hasLitigation: false,
    transitLock: {
      isLocked: true,
      lockedUntil: "2026-11-15T00:00:00.000Z",
      subRegistryOffice: "সাভার সাব-রেজিস্ট্রার কার্যালয়",
      pendingDeedNo: "DEED-2026-4521",
      buyerNameBn: "তারেক মাহমুদ",
    },
    trustScore: 42,
    riskLevel: "critical",
    riskSummaryBn: [
      "সতর্কতা: এই দাগের সম্পূর্ণ জমি সাভার সাব-রেজিস্ট্রি অফিসে সম্প্রতি বিক্রির দলিল (নং ৪৫২১/২০২৬) রেজিস্ট্রি হয়েছে!",
      "বর্তমানে 'ই-নামজারি ট্রানজিট লক' সক্রিয় রয়েছে। এই জমি পুনরায় ক্রয় বা বায়না করলে প্রতারিত হবেন।",
    ],
    riskSummaryEn: [
      "CRITICAL: Active deed registered at Sub-Registry. Secondary sale attempt detected.",
    ],
  },
  {
    ulpin: "26-26-72-045-00782",
    divisionBn: "ঢাকা",
    divisionEn: "Dhaka",
    districtBn: "ঢাকা",
    districtEn: "Dhaka",
    upazilaBn: "সাভার",
    upazilaEn: "Savar",
    mouzaBn: "বিরুলিয়া",
    mouzaEn: "Birulia",
    jlNo: "৪৫",
    dagNo: "৭৮২",
    currentKhatianNo: "BS-২১০৪",
    khatianType: "BS",
    landClassBn: "বাণিজ্যিক প্লট",
    landClassEn: "Commercial Plot",
    totalAreaSatak: 15.0,
    totalAreaKatha: 9.09,
    coordinates: { lat: 23.8645, lng: 90.3112 },
    owners: [
      {
        ownerId: "OWN-004",
        nameBn: "আনোয়ারুল ইসলাম চৌধুরী",
        nameEn: "Anwarul Islam Chowdhury",
        fatherNameBn: "মোজাম্মেল হক চৌধুরী",
        nidMasked: "1980-XXXX-XXXX-6612",
        shareAnna: "১৬ আনা ০ গণ্ডা",
        shareDecimal: 1.0,
        portionSatak: 15.0,
      },
    ],
    bayaChain: [],
    liens: [
      {
        lienId: "LIEN-SBL-2024-90",
        bankNameBn: "সোনালী ব্যাংক পিএলসি",
        bankNameEn: "Sonali Bank PLC",
        branchName: "সাভার কর্পোরেট শাখা",
        loanAccountNumber: "A/C-0142-SME-902",
        mortgageAmountBdt: 4500000,
        issueDate: "2024-06-18",
        status: "active",
        deedMortgagedNo: "MORT-2024-118",
      },
    ],
    isKhas: false,
    isAcquiredByGovt: false,
    hasLitigation: false,
    transitLock: { isLocked: false },
    trustScore: 48,
    riskLevel: "moderate",
    riskSummaryBn: [
      "সোনালী ব্যাংক পিএলসি-তে ৪৫,০০,০০০ টাকার ঋণের বিপরীতে জমিটি সরাসরি বন্ধক (Mortgage) রাখা আছে।",
      "ব্যাংকের লিখিত অনাপত্তিপত্র (NOC) ব্যতিরেকে জমি ক্রয় করা গুরুতর আর্থিক ঝুঁকি।",
    ],
    riskSummaryEn: ["Mortgage lien active with Sonali Bank PLC."],
  },
];

export const fallbackMutations: IMutationApplication[] = [
  {
    applicationId: "MUT-APP-2026-001",
    token: "MUT-2026-7841",
    ulpin: "26-26-72-082-01425",
    dagNo: "১৪২৫",
    khatianNo: "BS-৫৬২১",
    applicantNameBn: "মোঃ শফিকুল ইসলাম",
    applicantNidMasked: "1988-XXXX-XXXX-0192",
    applicantPhoneMasked: "01711-XXXX92",
    deedNo: "DEED-2026-1102",
    deedDate: "2026-01-14",
    transferredAreaSatak: 6.25,
    appliedDate: "2026-02-01",
    currentStage: "approved",
    hearingDate: "2026-02-28",
    acLandOfficeBn: "সাভার উপজেলা ভূমি অফিস",
    remarksBn: "সকল মূল বায়া দলিল ও ওয়ারিশ সনদ যাচাইপূর্বক নামজারি মঞ্জুর করা হয়েছে।",
  },
  {
    applicationId: "MUT-APP-2026-002",
    token: "MUT-2026-9912",
    ulpin: "26-26-72-082-01426",
    dagNo: "১৪২৬",
    khatianNo: "BS-৫৬২২",
    applicantNameBn: "তারেক মাহমুদ",
    applicantNidMasked: "1994-XXXX-XXXX-8819",
    applicantPhoneMasked: "01819-XXXX19",
    deedNo: "DEED-2026-4521",
    deedDate: "2026-10-10",
    transferredAreaSatak: 18.0,
    appliedDate: "2026-10-12",
    currentStage: "surveyor_inspection",
    hearingDate: "2026-10-25",
    acLandOfficeBn: "সাভার উপজেলা ভূমি অফিস",
    remarksBn: "ভূমি উপ-সহকারী কর্মকর্তা (তহশিলদার) কর্তৃক সরজমিন সীমানা পরিদর্শন চলমান।",
  },
];
