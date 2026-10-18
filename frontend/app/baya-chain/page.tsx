"use client";

import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { fallbackParcels } from "../../lib/api";
import {
  FileText,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Calculator,
  ArrowDown,
  Layers,
  History,
  ShieldCheck,
} from "lucide-react";

export default function BayaChainPage() {
  const { language } = useLanguage();
  const [selectedDag, setSelectedDag] = useState("1425");

  // Ana calculation state
  const [anna, setAnna] = useState<number>(8);
  const [ganda, setGanda] = useState<number>(0);
  const [kara, setKara] = useState<number>(0);
  const [kranti, setKranti] = useState<number>(0);

  const parcel = fallbackParcels.find((p) => p.dagNo === selectedDag) || fallbackParcels[0];

  // Ana to decimal conversion: 16 Anna = 1.000, 1 Anna = 20 Ganda, 1 Ganda = 4 Kara, 1 Kara = 3 Kranti
  // Total Krantis in 16 Anna = 16 * 20 * 4 * 3 = 3840 krantis
  const currentKrantis = anna * 240 + ganda * 12 + kara * 3 + kranti;
  const decimalShare = currentKrantis / 3840;
  const satakPortion = (decimalShare * parcel.totalAreaSatak).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="border-b border-[#E2E8F0] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-[#ECFDF5] text-[#064E3B] px-3 py-1 rounded-full text-xs font-bold border border-[#A7F3D0]">
          <History className="w-3.5 h-3.5" />
          <span>ঐতিহাসিক মালিকানা রেকর্ড ও বায়া দলিল চেইন</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B]">
          {language === "bn"
            ? "বায়া দলিল চেইন ও ১৬ আনা হিস্যা ব্যালেন্সিং"
            : "Baya Deed Chain & 16-Ana Fractional Share Balancing"}
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] max-w-2xl">
          {language === "bn"
            ? "CS থেকে BS জরিপ পর্যন্ত প্রতিটি হস্তান্তরের ধারাবাহিকতা ও ১৬ আনা (১.০০০) অংশের গাণিতিক বিশুদ্ধতা।"
            : "Verify chain of custody across Cadastral Surveys (CS -> SA -> RS -> BS) and reconcile archaic Bengali fractional shares."}
        </p>
      </div>

      {/* Main Grid: Chain Timeline + 16 Ana Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Interactive Baya Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#064E3B]" />
                  <span>মালিকানার ধারাবাহিকতা (Chain of Title)</span>
                </h3>
                <p className="text-xs text-slate-500">মৌজা: {parcel.mouzaBn} | দাগ নং: {parcel.dagNo}</p>
              </div>

              {/* Sample Switcher */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDag("1425")}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer ${
                    selectedDag === "1425"
                      ? "bg-[#064E3B] text-white border-[#064E3B]"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  দাগ ১৪২৫ (সম্পূর্ণ চেইন)
                </button>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-300">
              {parcel.bayaChain.map((node, index) => (
                <div key={index} className="relative group">
                  {/* Pin */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[10px] font-bold shadow">
                    {index + 1}
                  </div>

                  <div className="civic-card p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-[#064E3B] transition">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#064E3B] text-white text-xs font-bold px-2.5 py-0.5 rounded">
                          {node.surveyType} জরিপ ({node.year})
                        </span>
                        <span className="text-xs font-semibold text-slate-700">খতিয়ান: {node.khatianNo}</span>
                        <span className="text-xs font-mono text-slate-500">দাগ: {node.dagNo}</span>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>যাচাইকৃত (Verified)</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <p>
                        <span className="font-semibold text-slate-500">রেকর্ডভুক্ত মালিক:</span>{" "}
                        <span className="font-bold text-slate-900">{node.recordedOwnerBn}</span> ({node.recordedOwnerEn})
                      </p>
                      {node.transferredBy && (
                        <p>
                          <span className="font-semibold text-slate-500">হস্তান্তরের বিবরণ:</span>{" "}
                          <span className="text-slate-800 font-medium">{node.transferredBy}</span>
                        </p>
                      )}
                      {node.deedNo && (
                        <p className="font-mono text-[11px] text-slate-600">
                          রেজিস্ট্রিকৃত দলিল/নামজারি নং: {node.deedNo} ({node.deedDate})
                        </p>
                      )}
                      <p className="text-emerald-800 text-[11px] italic bg-emerald-50 p-1.5 rounded">
                        {node.notesBn}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: 16-Ana Fractional Calculator */}
        <div className="space-y-6">
          <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4">
            <div className="flex items-center gap-2 text-[#064E3B] font-bold text-sm">
              <Calculator className="w-4 h-4" />
              <span>১৬ আনা অংশের ফ্র্যাকশনাল ক্যালকুলেটর</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              বাংলাদেশের প্রাচীন ভূমি দলিলে ব্যবহৃত <span className="font-bold text-[#064E3B]">আনা-গণ্ডা-কড়া-ক্রান্তি</span> রূপান্তর করুন এবং জমির পরিমাণ হিসাব করুন।
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>আনা (Anna: ০ - ১৬)</span>
                  <span className="font-bold text-[#064E3B]">{anna} আনা</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={anna}
                  onChange={(e) => setAnna(parseInt(e.target.value))}
                  className="w-full accent-[#064E3B]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>গণ্ডা (Ganda: ০ - ১৯)</span>
                  <span className="font-bold text-[#064E3B]">{ganda} গণ্ডা</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="19"
                  value={ganda}
                  onChange={(e) => setGanda(parseInt(e.target.value))}
                  className="w-full accent-[#064E3B]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>কড়া (Kara: ০ - ৩)</span>
                  <span className="font-bold text-[#064E3B]">{kara} কড়া</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={kara}
                  onChange={(e) => setKara(parseInt(e.target.value))}
                  className="w-full accent-[#064E3B]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>ক্রান্তি (Kranti: ০ - ২)</span>
                  <span className="font-bold text-[#064E3B]">{kranti} ক্রান্তি</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  value={kranti}
                  onChange={(e) => setKranti(parseInt(e.target.value))}
                  className="w-full accent-[#064E3B]"
                />
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                রূপান্তরিত দশমিক অংশ (Decimal Share)
              </span>
              <div className="text-2xl font-black text-[#064E3B] font-mono">
                {decimalShare.toFixed(4)}
              </div>
              <p className="text-xs text-emerald-900 font-semibold">
                দাগের মোট জমি ({parcel.totalAreaSatak} শতক) এর প্রাপ্য অংশ:{" "}
                <span className="text-black font-extrabold">{satakPortion} শতক</span>
              </p>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
              <p className="font-bold text-slate-700">ঐতিহাসিক অনুপাত সূত্র:</p>
              <p>১৬ আনা = ১.০০০০ (সম্পূর্ণ মালিকানা)</p>
              <p>১ আনা = ২০ গণ্ডা | ১ গণ্ডা = ৪ কড়া | ১ কড়া = ৩ ক্রান্তি</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
