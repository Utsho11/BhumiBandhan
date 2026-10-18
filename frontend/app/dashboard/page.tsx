"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { AuthGuard } from "../../components/auth/AuthGuard";
import { fallbackParcels, fallbackMutations } from "../../lib/api";
import {
  User,
  ShieldCheck,
  FileText,
  Clock,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  PlusCircle,
  ExternalLink,
  Layers,
  Search,
  Bell,
  CreditCard,
  QrCode,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <UserDashboardContent />
    </AuthGuard>
  );
}

function UserDashboardContent() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"parcels" | "mutations" | "history">("parcels");

  // Citizen's owned parcels
  const myParcels = [fallbackParcels[0], fallbackParcels[2]];
  // Citizen's mutation applications
  const myMutations = [fallbackMutations[0]];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Citizen Digital ID Header */}
      <div className="bg-gradient-to-r from-[#064E3B] to-[#0D5C3A] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-2xl text-emerald-300 shadow-inner">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{user?.nameBn || "নাগরিক ব্যবহারকারী"}</h1>
              <span className="bg-[#ECFDF5] text-[#064E3B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                যাচাইকৃত নাগরিক
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 font-mono">
              এনআইডি: {user?.nidMasked || "1988-XXXX-XXXX-0192"} | মোবাইল: {user?.phoneMasked || "01711-XXXX92"}
            </p>
            <p className="text-[11px] text-emerald-200/80">
              ঠিকানা: ঢাকা জেলা, সাভার উপজেলা | ইউজার আইডি: {user?.id}
            </p>
          </div>
        </div>

        {/* Quick Action Button in Header */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/check-before-you-buy"
            className="bg-white hover:bg-slate-100 text-[#064E3B] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Search className="w-4 h-4" />
            <span>নতুন জমি যাচাই করুন</span>
          </Link>
          <Link
            href="/mutation"
            className="bg-emerald-800/80 hover:bg-emerald-900 border border-emerald-500/40 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ই-নামজারি আবেদন</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="civic-card p-5 bg-white border border-[#E2E8F0] space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>সংরক্ষিত খতিয়ান ও দাগ</span>
            <FileText className="w-4 h-4 text-[#064E3B]" />
          </div>
          <div className="text-2xl font-black text-[#064E3B] font-mono">০২ টি</div>
          <span className="text-[11px] text-emerald-700 font-medium">মোট ২৭.৫ শতক জমি</span>
        </div>

        <div className="civic-card p-5 bg-white border border-[#E2E8F0] space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>ই-নামজারি আবেদন</span>
            <Clock className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="text-2xl font-black text-[#0284C7] font-mono">০১ টি</div>
          <span className="text-[11px] text-emerald-600 font-bold">✔ নামজারি মঞ্জুর ও ডিসিআর প্রাপ্ত</span>
        </div>

        <div className="civic-card p-5 bg-white border border-[#E2E8F0] space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>ব্যাংক লিয়েন ও বন্ধক</span>
            <Building className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-black text-[#D97706] font-mono">০১ টি সক্রিয়</div>
          <span className="text-[11px] text-amber-600 font-medium">দাগ ৭৮২ এ সোনালী ব্যাংক ঋণ</span>
        </div>

        <div className="civic-card p-5 bg-white border border-[#E2E8F0] space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>পোর্টফোলিও সিকিউরিটি</span>
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-2xl font-black text-[#059669] font-mono">৮৮%</div>
          <span className="text-[11px] text-emerald-600 font-medium">আদালত মামলা বা নোটিশমুক্ত</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#E2E8F0] flex gap-2">
        <button
          onClick={() => setActiveTab("parcels")}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "parcels"
              ? "border-b-2 border-[#064E3B] text-[#064E3B]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>আমার জমি ও খতিয়ান তালিকা ({myParcels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("mutations")}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "mutations"
              ? "border-b-2 border-[#064E3B] text-[#064E3B]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>আমার নামজারি আবেদন ({myMutations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "history"
              ? "border-b-2 border-[#064E3B] text-[#064E3B]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>যাচাইকৃত দলিলের ইতিহাস</span>
        </button>
      </div>

      {/* Tab 1: My Land Parcels */}
      {activeTab === "parcels" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myParcels.map((parcel) => (
              <div
                key={parcel.ulpin}
                className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">
                      ULPIN: {parcel.ulpin}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      মৌজা: {parcel.mouzaBn} | দাগ নং: {parcel.dagNo}
                    </h3>
                    <p className="text-xs text-slate-600">
                      খতিয়ান নং: <span className="font-bold">{parcel.currentKhatianNo}</span> ({parcel.khatianType})
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      parcel.riskLevel === "safe"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {parcel.trustScore}% ট্রাস্ট স্কোর
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700">
                  <p>
                    মোট জমির পরিমাণ: <span className="font-bold text-black">{parcel.totalAreaSatak} শতক</span> ({parcel.totalAreaKatha} কাঠা)
                  </p>
                  <p>জমির শ্রেণি: <span className="font-semibold">{parcel.landClassBn}</span></p>
                  <p>উপজেলা: সাভার, ঢাকা</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href={`/check-before-you-buy?q=${parcel.dagNo}`}
                    className="flex-1 bg-[#064E3B] hover:bg-[#04382A] text-white py-2 px-3 rounded-lg text-xs font-bold text-center transition flex items-center justify-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>পূর্ণ অডিট দেখুন</span>
                  </Link>

                  <Link
                    href={`/baya-chain`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>বায়া চেইন</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: My Mutations */}
      {activeTab === "mutations" && (
        <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-sm font-bold text-[#0F172A]">ই-নামজারি ও খারিজ আবেদন তালিকা</h3>
            <Link
              href="/mutation"
              className="text-xs font-bold text-[#064E3B] hover:underline flex items-center gap-1"
            >
              <span>নতুন আবেদন করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myMutations.map((m) => (
              <div
                key={m.applicationId}
                className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-sm font-bold text-[#064E3B] font-mono">{m.token}</span>
                    <p className="text-xs text-slate-600">
                      দাগ নং: {m.dagNo} | দলিল নং: {m.deedNo} ({m.deedDate})
                    </p>
                  </div>
                  <span className="bg-emerald-200 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
                    ✔ নামজারি মঞ্জুর ও খতিয়ান সৃজিত
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  {m.remarksBn}
                </p>

                <div className="flex justify-end gap-2 text-xs">
                  <Link
                    href={`/mutation`}
                    className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>ট্র্যাক করুন</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Verification History */}
      {activeTab === "history" && (
        <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A]">সাম্প্রতিক দলিল ও খতিয়ান যাচাইয়ের হিস্টোরি</h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">দলিল নং DEED-2026-1102 (সাভার সাব-রেজিস্ট্রি)</p>
                <p className="text-slate-500 font-mono text-[11px]">SHA-256 Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                বৈধ দলিল (Valid)
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">দাগ নং ১৪২৬ - ডাবল সেলিং ট্রানজিট চেক</p>
                <p className="text-slate-500 text-[11px]">ফলাফল: ট্রানজিট লক সক্রিয়, দ্বিতীয় বিক্রি বাতিল</p>
              </div>
              <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">
                প্রতারণা শনাক্ত (Blocked)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
