"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { fetchSingleParcel, fallbackParcels } from "../../lib/api";
import { isDagMatch } from "../../lib/digitConverter";
import { ILandParcel } from "../../types";
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  User,
  Scale,
  Lock,
  Printer,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function CheckBeforeYouBuyContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "1425";

  const [selectedDag, setSelectedDag] = useState(initialQuery);
  const [selectedMouza, setSelectedMouza] = useState("খাগান");
  const [loading, setLoading] = useState(false);
  const [parcel, setParcel] = useState<ILandParcel | null>(null);

  const sampleDags = [
    { dag: "1425", label: "দাগ ১৪২৫ (নিরাপদ / ৯৮%)", mouza: "খাগান" },
    { dag: "1426", label: "দাগ ১৪২৬ (ডাবল সেলিং ট্রানজিট লক!)", mouza: "খাগান" },
    { dag: "782", label: "দাগ ৭৮২ (ব্যাংক বন্ধকী জমি)", mouza: "বিরুলিয়া" },
    { dag: "991", label: "দাগ ৯৯১ (৪ ধারা অধিগ্রহণাধীন)", mouza: "বাইপাইল" },
    { dag: "302", label: "দাগ ৩০২ (১নং খাস জমি)", mouza: "বাইপাইল" },
  ];

  const handleAudit = async (dagToSearch: string) => {
    setLoading(true);
    const result = await fetchSingleParcel(dagToSearch);
    setParcel(result);
    setLoading(false);
  };

  useEffect(() => {
    if (initialQuery) {
      setSelectedDag(initialQuery);
      handleAudit(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-[#ECFDF5] text-[#064E3B] px-3 py-1 rounded-full text-xs font-bold border border-[#A7F3D0]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>কেনার আগে যাচাই প্রটোকল (Check Before You Buy)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B]">
          {language === "bn" ? "জমির ঝুঁকি মূল্যায়ন ও মালিকানা অডিট" : "Land Pre-Purchase Title & Risk Audit"}
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] max-w-2xl">
          {language === "bn"
            ? "টাকা বায়না করার পূর্বে যেকোনো প্লটের খতিয়ান চেইন, ব্যাংক লিয়েন, খাস জমি ও অধিগ্রহণ অবস্থা এক ক্লিকে যাচাই করুন।"
            : "Audit historical Khatian integrity, bank collateral liens, government Khas classification, and active court disputes."}
        </p>
      </div>

      {/* Search & Quick Pickers */}
      <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4">
        <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
          <Search className="w-4 h-4 text-[#064E3B]" />
          <span>{language === "bn" ? "দাগ বা ইউএলপিআইএন (ULPIN) নির্বাচন করুন" : "Select Parcel or Dag Number"}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-[#475569] block mb-1">বিভাগ ও জেলা</label>
            <input
              type="text"
              readOnly
              value="ঢাকা > ঢাকা জেলা"
              className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#475569] block mb-1">উপজেলা ও মৌজা</label>
            <select
              value={selectedMouza}
              onChange={(e) => setSelectedMouza(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-900 focus:outline-none focus:border-[#064E3B]"
            >
              <option value="খাগান">সাভার - খাগান (জেএল নং ৮২)</option>
              <option value="বিরুলিয়া">সাভার - বিরুলিয়া (জেএল নং ৪৫)</option>
              <option value="বাইপাইল">আশুলিয়া - বাইপাইল (জেএল নং ১০৩)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#475569] block mb-1">দাগ নম্বর</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedDag}
                onChange={(e) => setSelectedDag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAudit(selectedDag);
                  }
                }}
                placeholder="যেমন: ১৪২৫ বা 302"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:border-[#064E3B]"
              />
              <button
                onClick={() => handleAudit(selectedDag)}
                className="bg-[#064E3B] hover:bg-[#04382A] text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>অডিট করুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Demo Shortcuts */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#94A3B8] font-medium">দ্রুত পরীক্ষা করার নমুনা:</span>
          {sampleDags.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedDag(item.dag);
                setSelectedMouza(item.mouza);
                handleAudit(item.dag);
              }}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold transition cursor-pointer ${
                isDagMatch(selectedDag, item.dag) || (parcel && isDagMatch(parcel.dagNo, item.dag))
                  ? "bg-[#064E3B] text-white border-[#064E3B]"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Report Presentation */}
      {loading ? (
        <div className="civic-card p-12 text-center text-[#475569] space-y-3">
          <div className="w-8 h-8 border-4 border-[#064E3B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">ভূমি ডাটাবেজ, খতিয়ান চেইন ও ব্যাংক লিয়েন স্ক্যান করা হচ্ছে...</p>
        </div>
      ) : parcel ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Score Banner */}
          <div
            className={`civic-card p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
              parcel.riskLevel === "safe"
                ? "bg-[#ECFDF5] border-[#A7F3D0]"
                : parcel.riskLevel === "moderate"
                ? "bg-[#FFFBEB] border-[#FDE68A]"
                : "bg-[#FEF2F2] border-[#FCA5A5]"
            }`}
          >
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    parcel.riskLevel === "safe"
                      ? "bg-emerald-200 text-emerald-900"
                      : parcel.riskLevel === "moderate"
                      ? "bg-amber-200 text-amber-900"
                      : "bg-red-200 text-red-900"
                  }`}
                >
                  {parcel.riskLevel === "safe"
                    ? "নিরাপদ জমি (Safe Title)"
                    : parcel.riskLevel === "moderate"
                    ? "সতর্কতা প্রয়োজন (Caution)"
                    : "চরম ঝুঁকিপূর্ণ (High Risk)"}
                </span>
                <span className="text-xs text-slate-500 font-mono">ULPIN: {parcel.ulpin}</span>
              </div>

              <h2 className="text-2xl font-black text-[#0F172A]">
                মৌজা: {parcel.mouzaBn} | দাগ নং: {parcel.dagNo} (খতিয়ান: {parcel.currentKhatianNo})
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 max-w-xl">
                মোট জমির পরিমাণ: <span className="font-bold text-black">{parcel.totalAreaSatak} শতক</span> ({parcel.totalAreaKatha} কাঠা) | শ্রেণির ধরন: {parcel.landClassBn}
              </p>
            </div>

            {/* Circular Risk Score Gauge */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div
                className={`w-28 h-28 rounded-full border-8 flex flex-col items-center justify-center font-black text-2xl shadow-md ${
                  parcel.riskLevel === "safe"
                    ? "border-emerald-600 bg-white text-emerald-700"
                    : parcel.riskLevel === "moderate"
                    ? "border-amber-500 bg-white text-amber-700"
                    : "border-red-600 bg-white text-red-700"
                }`}
              >
                <span>{parcel.trustScore}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trust Score</span>
              </div>
            </div>
          </div>

          {/* Detailed Verification Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Check 1: Transit Lock */}
            <div className="civic-card p-4 space-y-2 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">ডাবল সেলিং স্ট্যাটাস</span>
                {parcel.transitLock.isLocked ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {parcel.transitLock.isLocked ? "ট্রানজিট লক সক্রিয়" : "কোনো ট্রানজিট লক নেই"}
              </h4>
              <p className="text-xs text-slate-500">
                {parcel.transitLock.isLocked
                  ? `দলিল নং ${parcel.transitLock.pendingDeedNo} সম্প্রতি রেজিস্ট্রি হয়েছে।`
                  : "জমির দাগ সম্পূর্ণ অবিক্রিত ও হস্তান্তরযোগ্য।"}
              </p>
            </div>

            {/* Check 2: Bank Liens */}
            <div className="civic-card p-4 space-y-2 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">ব্যাংক লিয়েন / বন্ধক</span>
                {parcel.liens.length > 0 ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {parcel.liens.length > 0 ? `${parcel.liens.length}টি ব্যাংক লিয়েন বিদ্যমান` : "দায়মুক্ত (Unencumbered)"}
              </h4>
              <p className="text-xs text-slate-500">
                {parcel.liens.length > 0
                  ? `${parcel.liens[0].bankNameBn} এ বন্ধক রয়েছে।`
                  : "কোনো ব্যাংক বা আর্থিক প্রতিষ্ঠানে বন্ধক নেই।"}
              </p>
            </div>

            {/* Check 3: Khas Status */}
            <div className="civic-card p-4 space-y-2 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">খাস ও অর্পিত সম্পত্তি</span>
                {parcel.isKhas ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {parcel.isKhas ? "১নং খাস খতিয়ানভুক্ত" : "ব্যক্তিমালিকানাধীন জোত"}
              </h4>
              <p className="text-xs text-slate-500">
                {parcel.isKhas ? "সরকারি সম্পত্তি, হস্তান্তর আইনত নিষিদ্ধ।" : "সরকারের কোনো দাবি নেই।"}
              </p>
            </div>

            {/* Check 4: Acquisition & Litigation */}
            <div className="civic-card p-4 space-y-2 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">অধিগ্রহণ ও আদালত মামলা</span>
                {parcel.isAcquiredByGovt || parcel.hasLitigation ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {parcel.isAcquiredByGovt
                  ? "ডিসি অফিসের ৪ ধারা নোটিশ"
                  : parcel.hasLitigation
                  ? "আদালতে মামলা চলমান"
                  : "মামলা ও নোটিশমুক্ত"}
              </h4>
              <p className="text-xs text-slate-500">
                {parcel.isAcquiredByGovt
                  ? "সরকারি অধিগ্রহণাধীন প্রকল্প এলাকা।"
                  : "কোনো নিষেধাজ্ঞা পাওয়া যায়নি।"}
              </p>
            </div>
          </div>

          {/* Audit Findings & Alerts */}
          <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-3">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>ভূমি-বন্ধন অডিট ফাইন্ডিংস ও পরামর্শ (Findings & Legal Advice)</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {parcel.riskSummaryBn.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[#064E3B] font-bold">»</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Current Owners Table */}
          <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <User className="w-4 h-4 text-[#064E3B]" />
              <span>বর্তমান রেকর্ডভুক্ত মালিক ও তাদের অংশীদারিত্ব (Co-Sharer Table)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="p-3">মালিকের নাম</th>
                    <th className="p-3">পিতার নাম</th>
                    <th className="p-3">এনআইডি (মাস্কড)</th>
                    <th className="p-3">খতিয়ানের হিস্যা (আনা)</th>
                    <th className="p-3">দশমিক অংশ</th>
                    <th className="p-3">জমির পরিমাণ (শতক)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {parcel.owners.map((owner) => (
                    <tr key={owner.ownerId} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#064E3B]">{owner.nameBn}</td>
                      <td className="p-3 text-slate-600">{owner.fatherNameBn}</td>
                      <td className="p-3 font-mono text-slate-500">{owner.nidMasked}</td>
                      <td className="p-3 font-bold">{owner.shareAnna}</td>
                      <td className="p-3 font-mono">{owner.shareDecimal.toFixed(4)}</td>
                      <td className="p-3 font-bold text-black">{owner.portionSatak} শতক</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="civic-card p-12 text-center text-[#94A3B8]">
          <p className="text-sm">কোনো তথ্য প্রদর্শিত হচ্ছে না। সঠিক দাগ নম্বর নির্বাচন করুন।</p>
        </div>
      )}
    </div>
  );
}

export default function CheckBeforeYouBuyPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">লোড হচ্ছে...</div>}>
      <CheckBeforeYouBuyContent />
    </Suspense>
  );
}
