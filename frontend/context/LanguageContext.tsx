"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "bn" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    // Nav & General
    gov_badge: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | ভূমি মন্ত্রণালয় ও আইন মন্ত্রণালয় সহায়ক প্রটোকল",
    app_title: "ভূমি-বন্ধন",
    app_tagline: "স্মার্ট ভূমি রেকর্ড, যাচাইকরণ ও জালিয়াতি-নিরোধক ই-গভর্ন্যান্স প্ল্যাটফর্ম",
    nav_home: "মূলপাতা",
    nav_check_buy: "কেনার আগে যাচাই",
    nav_baya_chain: "বায়া দলিল চেইন",
    nav_mutation: "স্মার্ট ই-নামজারি",
    nav_anti_fraud: "জালিয়াতি প্রতিরোধ",
    nav_bank_lien: "ব্যাংক লিয়েন চেক",
    nav_admin: "কর্মকর্তা প্যানেল",
    nav_login: "লগইন",
    lang_btn: "English",

    // Hero Section
    hero_title: "জমি কেনার আগে নিশ্চিত হোন, আপনার বিনিয়োগ সম্পূর্ণ নিরাপদ ও সুরক্ষিত",
    hero_subtitle: "সাব-রেজিস্ট্রি এবং এসি ল্যান্ড অফিসের ডাটাবেজের সরাসরি সমন্বয়। বায়া দলিল চেইন (CS-SA-RS-BS), খাস জমি, ব্যাংক বন্ধক ও একাধিকবার বিক্রি শনাক্তকরণ এক ক্লিকে।",
    hero_search_placeholder: "দাগ নম্বর (যেমন: ১৪২৫) বা ১৪ সংখ্যার ULPIN লিখুন...",
    hero_search_btn: "ভূমি যাচাই করুন",
    hero_pill_1: "✓ ১০০% অ্যানোনিমাস ডাটা",
    hero_pill_2: "✓ রিয়েলটাইম ব্যাংক লিয়েন",
    hero_pill_3: "✓ অ্যান্টি-ডাবল সেলিং শিল্ড",

    // Features Section
    feature_heading: "ভূমি-বন্ধন যেভাবে জমি জালিয়াতি শূন্যে নামিয়ে আনে",
    feature_1_title: "কেনার আগে যাচাই (Risk Score)",
    feature_1_desc: "প্লটের খতিয়ান ধারাবাহিকতা, আদালতের মামলা এবং অধিগ্রহণ অবস্থা বিবেচনা করে ০-১০০% ঝুঁকি স্কোর প্রদান করে।",
    feature_2_title: "অ্যান্টি-ডাবল সেলিং শিল্ড",
    feature_3_title: "বায়া দলিল ও ১৬ আনা হিসাব",
    feature_3_desc: "CS থেকে BS পর্যন্ত পূর্ববর্তী মালিকানার ধারাবাহিকতা এবং আনা-গণ্ডা-কড়া-ক্রান্তির জটিল অংশের সঠিক মিল নিশ্চিত করে।",
    feature_4_title: "কেন্দ্রীয় ব্যাংক লিয়েন রেজিস্ট্রি",
    feature_4_desc: "ঋণের বিপরীতে বন্ধকী জমির তথ্য তাৎক্ষণিক সাব-রেজিস্ট্রার ও ক্রেতার সামনে উপস্থাপন করে দ্বৈত বন্ধক রোধ করে।",

    // Quick Stats
    stat_dispute_reduction: "৮৫% ভূমি মামলা হ্রাস",
    stat_double_sell: "০% একাধিকবার বিক্রি",
    stat_instant_verify: "১০ সেকেন্ডে যাচাই",

    // Footer
    footer_text: "ল্যান্ডটেক ২০২৬ ইনোভেশন হ্যাকাথন — সিএসই ও আইন বিভাগ, ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি",
  },
  en: {
    // Nav & General
    gov_badge: "Government of the People's Republic of Bangladesh | Land Tech Protocol",
    app_title: "BhumiBandhan",
    app_tagline: "Smart Land Records, Verification & Anti-Fraud E-Governance Platform",
    nav_home: "Home",
    nav_check_buy: "Check Before You Buy",
    nav_baya_chain: "Baya Deed Chain",
    nav_mutation: "Smart e-Mutation",
    nav_anti_fraud: "Fraud Shield",
    nav_bank_lien: "Bank Lien Registry",
    nav_admin: "Officer Panel",
    nav_login: "Sign In",
    lang_btn: "বাংলা",

    // Hero Section
    hero_title: "Verify Before You Buy — Ensure Complete Title Security For Your Land Investment",
    hero_subtitle: "Direct synchronization between Sub-Registry and AC Land databases. Instantly detect Baya deed breaks (CS-SA-RS-BS), Khas land, bank mortgages, and duplicate sales.",
    hero_search_placeholder: "Enter Dag No (e.g. 1425) or 14-digit ULPIN...",
    hero_search_btn: "Audit Land Title",
    hero_pill_1: "✓ 100% Privacy Compliant",
    hero_pill_2: "✓ Real-time Bank Liens",
    hero_pill_3: "✓ Anti-Double-Selling Shield",

    // Features Section
    feature_heading: "How BhumiBandhan Eliminates Land Disputes in Bangladesh",
    feature_1_title: "Check Before You Buy (Risk Score)",
    feature_1_desc: "Generates an objective 0–100% Land Trust Score auditing title chain, court disputes, and acquisition notices.",
    feature_2_title: "Anti-Double-Selling Shield",
    feature_3_title: "Baya Deed Chain & 16-Ana Balance",
    feature_3_desc: "Validates historical lineage from CS to BS surveys and mathematically reconciles fractional inheritance shares.",
    feature_4_title: "Central Bank Lien Registry",
    feature_4_desc: "Instantly surfaces active mortgage collateral to prevent duplicate loans against identical property.",

    // Quick Stats
    stat_dispute_reduction: "85% Dispute Reduction",
    stat_double_sell: "0% Double Selling",
    stat_instant_verify: "10-Sec Instant Audit",

    // Footer
    footer_text: "LandTech 2026 Innovation Hackathon — Dept. of CSE & Dept. of Law, Daffodil International University",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("bn"); // Default Bangla

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "bn" ? "en" : "bn"));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
