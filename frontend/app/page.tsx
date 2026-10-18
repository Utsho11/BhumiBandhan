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
  LayoutDashboard,
  UserCheck,
  Calculator,
  QrCode,
  Building2,
  History,
  FileText,
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

  // 6 Primary Features prominently showcased
  const coreFeatures = [
    {
      titleBn: "কেনার আগে যাচাই (Risk Score)",
      titleEn: "Check Before You Buy",
      subtitleBn: "প্লটের খতিয়ান ধারাবাহিকতা, আদালতের মামলা ও অধিগ্রহণ নোটিশ রিয়েলটাইমে স্ক্যান করে ০-১০০% ঝুঁকি স্কোর প্রদান।",
      icon: Search,
      badgeBn: "জনপ্রিয় সেবা",
      badgeColor: "bg-emerald-100 text-[#064E3B] border-emerald-300",
      href: "/check-before-you-buy",
      actionTextBn: "জমি যাচাই করুন",
      borderColor: "hover:border-[#064E3B]",
    },
    {
      titleBn: "নাগরিক ভূমি ড্যাশবোর্ড (User Panel)",
      titleEn: "Citizen Land Dashboard",
      subtitleBn: "আপনার সংরক্ষিত খতিয়ান, চলমান নামজারি আবেদন, যাচাইকৃত দলিলের ইতিহাস ও ব্যাংক বন্ধক নোটিফিকেশন।",
      icon: LayoutDashboard,
      badgeBn: "আমার প্যানেল",
      badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
      href: "/dashboard",
      actionTextBn: "ড্যাশবোর্ডে প্রবেশ",
      borderColor: "hover:border-sky-600",
    },
    {
      titleBn: "স্মার্ট ই-নামজারি ট্র্যাকার",
      titleEn: "Smart e-Mutation Tracker",
      subtitleBn: "সাব-রেজিস্ট্রি দলিলের সরাসরি সংযোগ। ৫-ধাপের বাস্তব অগ্রগতি, শুনানির তারিখ ও ডিসিআর ডাউনলোড।",
      icon: UserCheck,
      badgeBn: "দ্রুত নিষ্পত্তি",
      badgeColor: "bg-emerald-100 text-[#064E3B] border-emerald-300",
      href: "/mutation",
      actionTextBn: "নামজারি ট্র্যাক করুন",
      borderColor: "hover:border-[#064E3B]",
    },
    {
      titleBn: "বায়া দলিল চেইন ও ১৬ আনা ব্যালেন্স",
      titleEn: "Baya Deed Lineage & 16-Ana Balance",
      subtitleBn: "CS থেকে BS জরিপ পর্যন্ত প্রতিটি হস্তান্তরের চেইন এবং আনা-গণ্ডা-কড়া-ক্রান্তির জটিল অংশের সঠিক মিল।",
      icon: History,
      badgeBn: "মালিকানা চেইন",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      href: "/baya-chain",
      actionTextBn: "বায়া চেইন দেখুন",
      borderColor: "hover:border-purple-600",
    },
    {
      titleBn: "অ্যান্টি-ডাবল সেলিং ট্রানজিট শিল্ড",
      titleEn: "Anti-Double Selling Shield",
      subtitleBn: "দলিল বিক্রির পর ৩০ দিনের অটোমেটিক ট্রানজিট লক। একই জমি দ্বিতীয়বার রেজিস্ট্রেশন চেষ্টা করলে সরাসরি ব্লক।",
      icon: AlertOctagon,
      badgeBn: "জালিয়াতি রোধ",
      badgeColor: "bg-red-100 text-red-900 border-red-300",
      href: "/check-before-you-buy?q=1426",
      actionTextBn: "প্রতারণা টেস্ট করুন",
      borderColor: "hover:border-red-600",
    },
    {
      titleBn: "কেন্দ্রীয় ব্যাংক লিয়েন রেজিস্ট্রি",
      titleEn: "Central Bank Lien Registry",
      subtitleBn: "ঋণের বিপরীতে বন্ধকী জমির তথ্য তাৎক্ষণিক সাব-রেজিস্ট্রার ও ক্রেতার সামনে উপস্থাপন করে দ্বৈত বন্ধক রোধ।",
      icon: Building2,
      badgeBn: "ব্যাংক সুরক্ষা",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      href: "/bank-lien",
      actionTextBn: "লিয়েন রেজিস্ট্রি দেখুন",
      borderColor: "hover:border-amber-600",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner with Civic Emerald Background */}
      <section className="relative bg-gradient-to-b from-[#064E3B] to-[#04382A] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#0D5C3A] border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>টিম: Porcha Builder DIU | LandTech 2026 Innovation Hackathon</span>
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

      {/* PROMINENT FEATURES GRID (Visible, Large, Direct Access) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#ECFDF5] text-[#064E3B] px-3 py-0.5 rounded-full text-xs font-bold border border-[#A7F3D0] mb-1">
                <Sparkles className="w-3 h-3" />
                <span>ফিচার হাব ও নাগরিক সেবাসমূহ</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#064E3B]">
                {language === "bn" ? "ভূমি-বন্ধন এর মূল প্রযুক্তিগত সেবাসমূহ" : "Core BhumiBandhan Digital Services"}
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              উন্নয়নে: <span className="text-[#064E3B] font-bold">Porcha Builder DIU</span>
            </span>
          </div>

          {/* 6 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className={`civic-card p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col justify-between space-y-4 transition hover:bg-white hover:shadow-md ${feat.borderColor}`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#064E3B] flex items-center justify-center font-bold shadow-xs">
                        <Icon className="w-5 h-5 text-[#064E3B]" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${feat.badgeColor}`}>
                        {feat.badgeBn}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">{feat.titleBn}</h3>
                      <p className="text-[11px] text-slate-500 font-medium">{feat.titleEn}</p>
                    </div>

                    <p className="text-xs text-[#475569] leading-relaxed">
                      {feat.subtitleBn}
                    </p>
                  </div>

                  <Link
                    href={feat.href}
                    className="w-full bg-[#064E3B] hover:bg-[#04382A] text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <span>{feat.actionTextBn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
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
              {language === "bn" ? "ভূমি কর্মকর্তা ও সিস্টেম অ্যানালিস্ট পোর্টাল" : "Land Officer Console"}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg">
              {language === "bn"
                ? "এসি ল্যান্ড, সাব-রেজিস্ট্রার ও ব্যাংক ক্রেডিট অফিসারদের জন্য তৈরি ডেডিকেটেড ড্যাশবোর্ড।"
                : "Protected institutional officer console for AC Land, Sub-Registrars, and Bank Credit officers."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="bg-emerald-800 hover:bg-emerald-900 border border-emerald-500/50 text-white px-5 py-3 rounded-xl font-bold text-xs transition"
            >
              {language === "bn" ? "নাগরিক ড্যাশবোর্ড" : "Citizen Dashboard"}
            </Link>
            <Link
              href="/admin"
              className="bg-white hover:bg-slate-100 text-[#064E3B] px-6 py-3 rounded-xl font-bold text-xs transition shadow-sm"
            >
              {language === "bn" ? "কর্মকর্তা প্যানেল প্রবেশ" : "Officer Console"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
