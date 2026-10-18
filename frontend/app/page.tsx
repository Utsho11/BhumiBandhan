"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import {
  ShieldCheck,
  Search,
  FileCheck2,
  Lock,
  Building,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/check-before-you-buy?q=${encodeURIComponent(searchInput.trim())}`);
  };

  const sampleQuickQueries = [
    { label: "দাগ ১৪২৫ (নিষ্কলুষ জমি - ৯৮%)", query: "1425", color: "border-emerald-300 bg-emerald-50 text-emerald-800" },
    { label: "দাগ ১৪২৬ (ডাবল সেলিং ঝুঁকি!)", query: "1426", color: "border-red-300 bg-red-50 text-red-800" },
    { label: "দাগ ৭৮২ (ব্যাংক বন্ধকী জমি)", query: "782", color: "border-amber-300 bg-amber-50 text-amber-800" },
    { label: "দাগ ৯৯১ (সরকারি অধিগ্রহণাধীন)", query: "991", color: "border-red-300 bg-red-50 text-red-800" },
    { label: "দাগ ৩০২ (১নং খাস জমি)", query: "302", color: "border-purple-300 bg-purple-50 text-purple-800" },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner with Civic Emerald Background */}
      <section className="relative bg-gradient-to-b from-[#064E3B] to-[#04382A] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Civic Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#0D5C3A] border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>LandTech 2026: ডিজিটাল ভূমি রেকর্ড, যাচাইকরণ ও ডিজিটাইজেশন</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t("hero_title")}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {t("hero_subtitle")}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6">
            <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 border border-emerald-200">
              <div className="flex-1 flex items-center px-3 gap-2.5">
                <Search className="w-5 h-5 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t("hero_search_placeholder")}
                  className="w-full text-sm sm:text-base text-[#0F172A] focus:outline-none placeholder:text-[#94A3B8]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#064E3B] hover:bg-[#04382A] text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{t("hero_search_btn")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="space-y-2 pt-4">
            <p className="text-xs text-emerald-200/90 font-medium">
              {language === "bn" ? "পরীক্ষা করার জন্য নমুনা দাগ ক্লিক করুন:" : "Click sample parcel to test instantly:"}
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {sampleQuickQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => router.push(`/check-before-you-buy?q=${item.query}`)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition hover:scale-105 cursor-pointer ${item.color}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Highlights Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="civic-card-elevated p-6 bg-white border border-[#E2E8F0] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              {language === "bn" ? "কেনার আগে ঝুঁকি যাচাই (Risk Score)" : "Pre-Purchase Risk Score"}
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {language === "bn"
                ? "খতিয়ান চেইন, খারিজ খতিয়ান, এবং ডিসি অফিসের ৪ ধারা অধিগ্রহণ নোটিশ রিয়েলটাইমে স্ক্যান করে ০-১০০% সিকিউরিটি রিপোর্ট।"
                : "Real-time auditing across Khatian chains, mutation records, and DC office land acquisition notices."}
            </p>
            <Link
              href="/check-before-you-buy"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#064E3B] hover:underline pt-2"
            >
              <span>বিস্তারিত দেখুন</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="civic-card-elevated p-6 bg-white border border-[#E2E8F0] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-[#DC2626] flex items-center justify-center font-bold">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              {language === "bn" ? "অ্যান্টি-ডাবল সেলিং শিল্ড" : "Anti-Double-Selling Shield"}
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {language === "bn"
                ? "সাব-রেজিস্ট্রি অফিসে বিক্রি দলিল রেজিস্ট্রি হওয়ামাত্র ৩০ দিনের জন্য দাগের জমি ট্রানজিট লক হয়ে যায়। দ্বিতীয়বার বিক্রির সুযোগ নেই।"
                : "Automatic 30-day transit lock immediately upon deed registration, preventing fraudulent secondary transfers."}
            </p>
            <Link
              href="/check-before-you-buy?q=1426"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#DC2626] hover:underline pt-2"
            >
              <span>লক টেস্ট করুন (দাগ ১৪২৬)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="civic-card-elevated p-6 bg-white border border-[#E2E8F0] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center font-bold">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              {language === "bn" ? "কেন্দ্রীয় ব্যাংক লিয়েন রেজিস্ট্রি" : "Bank Lien Registry"}
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {language === "bn"
                ? "ব্যাংক ঋণের বিপরীতে বন্ধকী জমির তথ্য ডিজিটালভাবে সংরক্ষিত থাকে। একই জমি একাধিক ব্যাংকে বা ক্রেতার কাছে গোপন করা অসম্ভব।"
                : "Centralized mortgage encumbrance repository stopping repeated mortgaging of the same property across banks."}
            </p>
            <Link
              href="/bank-lien"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0284C7] hover:underline pt-2"
            >
              <span>লিয়েন রেজিস্ট্রি দেখুন</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Before vs After Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B]">
            {language === "bn"
              ? "বিদ্যমান প্রচলিত ব্যবস্থা বনাম ভূমি-বন্ধন প্রটোকল"
              : "Current Broken Land System vs. BhumiBandhan Protocol"}
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto">
            {language === "bn"
              ? "কেন এটি বাংলাদেশে ভূমি প্রশাসন ও নাগরিক সেবায় বৈপ্লবিক পরিবর্তন আনবে"
              : "Why this establishes an irreproachable trust layer in Bangladesh land governance"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Legacy System */}
          <div className="civic-card p-6 bg-red-50/40 border border-red-200 space-y-4">
            <div className="flex items-center gap-2 text-red-700 font-bold text-base">
              <XCircle className="w-5 h-5 text-red-600" />
              <span>{language === "bn" ? "বিদ্যমান প্রচলিত সীমাবদ্ধতা" : "Existing Conventional System"}</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#475569]">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>সাব-রেজিস্ট্রি এবং এসি ল্যান্ড অফিসের ডাটা আলাদা। দলিল বিক্রির খবর ভূমি অফিস জানতে পারে কয়েকমাস পর।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>অসাধু বিক্রেতারা এক দলিল দিয়ে একই জমি ৩-৪ জন ক্রেতার কাছে বিক্রি করে বায়না নিয়ে পালিয়ে যায়।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>খতিয়ানের আনা-গণ্ডা-কড়া-ক্রান্তি যোগ করতে গিয়ে জালিয়াতি ও ভুল অংশ তৈরি হয়।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>ব্যাংকের বন্ধকী জমির কোনো কেন্দ্রীয় ডাটাবেজ নেই; ভুয়া মূল দলিল দেখিয়ে বারবার লোন নেওয়া হয়।</span>
              </li>
            </ul>
          </div>

          {/* BhumiBandhan Protocol */}
          <div className="civic-card p-6 bg-emerald-50/40 border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2 text-[#064E3B] font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{language === "bn" ? "ভূমি-বন্ধন স্মার্ট সমাধান" : "BhumiBandhan Smart Protocol"}</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#475569]">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✔</span>
                <span>১৪ সংখ্যার ULPIN দ্বারা সাব-রেজিস্ট্রি ও এসি ল্যান্ড তাৎক্ষণিক ইন্টার-অপারেবল।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✔</span>
                <span>বিক্রি সম্পন্ন হওয়া মাত্র ৩০ দিনের জন্য জমি অটোমেশন ট্রানজিট লকে চলে যায়। ডাবল সেল ০%।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✔</span>
                <span>বায়া দলিল চেইনে ১৬ আনা ফ্র্যাকশনাল ব্যালেন্সিং অ্যালগরিদম দ্বারা অংশ নিশ্চিতকরণ।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✔</span>
                <span>সব ব্যাংক ও আর্থিক প্রতিষ্ঠানের জন্য রিয়েলটাইম লিয়েন রেজিস্ট্রি ও অনাপত্তিপত্র ট্র্যাকিং।</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#064E3B] rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">
              {language === "bn" ? "আপনি কি ভূমি কর্মকর্তা বা ব্যাংক কর্মকর্তা?" : "Are you an Officer or Auditor?"}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg">
              {language === "bn"
                ? "এসি ল্যান্ড, সাব-রেজিস্ট্রার ও ব্যাংক ক্রেডিট অফিসারদের জন্য তৈরি ডেডিকেটেড ড্যাশবোর্ডে লগইন করুন।"
                : "Access the institutional officer console for AC Land, Sub-Registrars, and Bank Credit officers."}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="bg-white hover:bg-slate-100 text-[#064E3B] px-6 py-3 rounded-xl font-bold text-sm transition shadow-sm"
            >
              {language === "bn" ? "কর্মকর্তা প্যানেল প্রবেশ" : "Open Officer Console"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
