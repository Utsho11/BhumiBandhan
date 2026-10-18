import { ILandParcel, IMutationApplication } from "../types";
import { isDagMatch, getSearchVariants, toBengaliNumerals, toEnglishNumerals } from "./digitConverter";

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
    let filtered = [...fallbackParcels];
    if (query?.dag) {
      filtered = filtered.filter((p) => isDagMatch(p.dagNo, query.dag));
    }
    if (query?.ulpin) {
      filtered = filtered.filter((p) => isDagMatch(p.ulpin, query.ulpin));
    }
    if (query?.mouza) {
      const m = query.mouza.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.mouzaBn.toLowerCase().includes(m) ||
          m.includes(p.mouzaBn.toLowerCase()) ||
          p.mouzaEn.toLowerCase().includes(m)
      );
    }
    return filtered;
  }
};

export const fetchSingleParcel = async (identifier: string): Promise<ILandParcel | null> => {
  const trimmed = identifier.trim();
  const variants = getSearchVariants(trimmed);

  // 1. Try querying the backend with each variant
  for (const v of variants) {
    try {
      const res = await fetch(`${API_BASE}/parcels/${encodeURIComponent(v)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Continue to next variant or fallback
    }
  }

  // 2. Resilient memory fallback matching both scripts and prefixes
  const found = fallbackParcels.find(
    (p) =>
      isDagMatch(p.dagNo, trimmed) ||
      isDagMatch(p.ulpin, trimmed) ||
      variants.some((v) => p.currentKhatianNo.toLowerCase().includes(v.toLowerCase()))
  );
  return found || null;
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
    if (res.ok) {
      const json = await res.json();
      if (json.found) return json;
    }
  } catch (error) {
    console.warn("Verify API unavailable, using resilient fallback", error);
  }

  const parcel = fallbackParcels.find((p) => {
    const matchDag = isDagMatch(p.dagNo, input.dagNo) || isDagMatch(p.ulpin, input.dagNo);
    if (!matchDag) return false;
    if (!input.mouza) return true;
    const m = input.mouza.toLowerCase();
    return (
      p.mouzaBn.toLowerCase().includes(m) ||
      m.includes(p.mouzaBn.toLowerCase()) ||
      p.mouzaEn.toLowerCase().includes(m)
    );
  });

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
    bayaChain: [
      {
        surveyType: "CS",
        year: 1928,
        khatianNo: "CS-১৪৩",
        dagNo: "CS-১১০৫",
        recordedOwnerBn: "কফিল উদ্দিন",
        recordedOwnerEn: "Kafil Uddin",
        status: "verified",
        notesBn: "সিএস রেকর্ড সংরক্ষিত।",
      },
      {
        surveyType: "RS",
        year: 1982,
        khatianNo: "RS-৮৯১",
        dagNo: "RS-১৪২৬",
        recordedOwnerBn: "মোঃ কামাল হোসেন",
        recordedOwnerEn: "Md. Kamal Hossain",
        status: "verified",
        notesBn: "আরএস খতিয়ানে হালনাগাদ।",
      },
    ],
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
    bayaChain: [
      {
        surveyType: "RS",
        year: 1985,
        khatianNo: "RS-৪২০",
        dagNo: "RS-৭৮২",
        recordedOwnerBn: "মোজাম্মেল হক চৌধুরী",
        recordedOwnerEn: "Mozammel Haque Chowdhury",
        status: "verified",
        notesBn: "মূল মালিকানার দলিল বিদ্যমান।",
      },
    ],
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
  {
    ulpin: "26-26-72-103-00991",
    divisionBn: "ঢাকা",
    divisionEn: "Dhaka",
    districtBn: "ঢাকা",
    districtEn: "Dhaka",
    upazilaBn: "আশুলিয়া",
    upazilaEn: "Ashulia",
    mouzaBn: "বাইপাইল",
    mouzaEn: "Baipail",
    jlNo: "১০৩",
    dagNo: "৯৯১",
    currentKhatianNo: "BS-৯০৮১",
    khatianType: "BS",
    landClassBn: "রাস্তা সংলগ্ন ভিটি",
    landClassEn: "Roadside Highland",
    totalAreaSatak: 24.0,
    totalAreaKatha: 14.55,
    coordinates: { lat: 23.9421, lng: 90.2819 },
    owners: [
      {
        ownerId: "OWN-005",
        nameBn: "বজলুর রহমান",
        nameEn: "Bazlur Rahman",
        fatherNameBn: "মকবুল হোসেন",
        nidMasked: "1972-XXXX-XXXX-1123",
        shareAnna: "১৬ আনা ০ গণ্ডা",
        shareDecimal: 1.0,
        portionSatak: 24.0,
      },
    ],
    bayaChain: [
      {
        surveyType: "RS",
        year: 1980,
        khatianNo: "RS-১২১",
        dagNo: "RS-৯৯১",
        recordedOwnerBn: "বজলুর রহমান",
        recordedOwnerEn: "Bazlur Rahman",
        status: "verified",
        notesBn: "মূল রেকর্ডভুক্ত মালিক।",
      },
    ],
    liens: [],
    isKhas: false,
    isAcquiredByGovt: true,
    hasLitigation: true,
    transitLock: { isLocked: false },
    trustScore: 20,
    riskLevel: "critical",
    riskSummaryBn: [
      "বিপদজনক: ঢাকা জেলা প্রশাসক (DC) কার্যালয় কর্তৃক মহাসড়ক প্রশস্তকরণ প্রকল্পে ৪ ধারা ও ৭ ধারা অধিগ্রহণ নোটিশ জারি করা হয়েছে।",
      "জমির ক্ষতিপূরণ সরকারের রাজস্ব বিভাগ থেকে প্রদান করা হবে; ব্যক্তিগত হস্তান্তর সম্পূর্ণ নিষিদ্ধ।",
      "যুগ্ম জেলা জজ আদালত-২ এ অংশীদারিত্ব নিয়ে স্বত্ব মোকদ্দমা (Title Suit # ১৪/২০২৩) চলমান রয়েছে।",
    ],
    riskSummaryEn: [
      "CRITICAL: Section 4 & 7 Government Land Acquisition notices issued by DC Office for highway expansion.",
      "Private conveyance is legally barred; compensation will be disbursed directly by District Land Acquisition Officer.",
      "Pending ownership dispute in Joint District Judge Court (Title Suit # 14/2023).",
    ],
  },
  {
    ulpin: "26-26-72-103-00302",
    divisionBn: "ঢাকা",
    divisionEn: "Dhaka",
    districtBn: "ঢাকা",
    districtEn: "Dhaka",
    upazilaBn: "আশুলিয়া",
    upazilaEn: "Ashulia",
    mouzaBn: "বাইপাইল",
    mouzaEn: "Baipail",
    jlNo: "১০৩",
    dagNo: "৩০২",
    currentKhatianNo: "BS-১১৪৪",
    khatianType: "BS",
    landClassBn: "ডোবা / জলাশয়",
    landClassEn: "Wetland / Pond",
    totalAreaSatak: 35.0,
    totalAreaKatha: 21.21,
    coordinates: { lat: 23.9482, lng: 90.2845 },
    owners: [
      {
        ownerId: "OWN-006",
        nameBn: "বাংলাদেশ সরকার (খাস খতিয়ান-১)",
        nameEn: "Government of Bangladesh (Khas)",
        fatherNameBn: "প্রতিনিধি: কালেক্টর / ডিসি ঢাকা",
        nidMasked: "GOVT-KHAS-PARCEL-01",
        shareAnna: "১৬ আনা ০ গণ্ডা",
        shareDecimal: 1.0,
        portionSatak: 35.0,
      },
    ],
    bayaChain: [
      {
        surveyType: "SA",
        year: 1956,
        khatianNo: "SA-০১",
        dagNo: "SA-৩০২",
        recordedOwnerBn: "বাংলাদেশ সরকার (১নং খাস খতিয়ান)",
        recordedOwnerEn: "Govt. of Bangladesh",
        status: "verified",
        notesBn: "রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন ১৯৫০ অনুযায়ী সরকারের অনুকূলে ভেস্টেড।",
      },
    ],
    liens: [],
    isKhas: true,
    isAcquiredByGovt: false,
    hasLitigation: false,
    transitLock: { isLocked: false },
    trustScore: 5,
    riskLevel: "critical",
    riskSummaryBn: [
      "গুরুতর সতর্কতা: এটি ১নং খাস খতিয়ানের সরকারি সম্পত্তি।",
      "কোনো দালাল বা ব্যক্তিমালিক ভুয়া দলিল সৃষ্টি করে এই দাগের জমি বিক্রি করার চেষ্টা করলে তা ফৌজদারি অপরাধ বলে গণ্য হবে।",
    ],
    riskSummaryEn: [
      "CRITICAL: Officially registered Government Khas (Schedule 1) public property.",
      "Any private sale deed or power of attorney is counterfeit and constitutes a criminal offense.",
    ],
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
