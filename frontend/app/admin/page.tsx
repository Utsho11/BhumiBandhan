"use client";

import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { fallbackMutations, fallbackParcels } from "../../lib/api";
import { isDagMatch } from "../../lib/digitConverter";
import { IMutationApplication } from "../../types";
import {
  Lock,
  ShieldCheck,
  UserCheck,
  Building,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Key,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import { AuthGuard } from "../../components/auth/AuthGuard";

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={["admin", "ac_land", "sub_registrar"]} requiredRoleNameBn="ভূমি কর্মকর্তা (এসি ল্যান্ড বা সাব-রেজিস্ট্রার)">
      <AdminContent />
    </AuthGuard>
  );
}

function AdminContent() {
  const { language } = useLanguage();
  const [activeRole, setActiveRole] = useState<"ac_land" | "sub_registrar" | "admin">("ac_land");

  // Sub-Registrar Anti-Fraud Simulation State
  const [subRegDag, setSubRegDag] = useState("1426");
  const [sellerName, setSellerName] = useState("কামাল হোসেন");
  const [shieldAlert, setShieldAlert] = useState<{
    triggered: boolean;
    allowed: boolean;
    message: string;
  } | null>(null);

  // AC Land Mutations State
  const [mutationsList, setMutationsList] = useState<IMutationApplication[]>(fallbackMutations);

  const handleRunSubRegAudit = () => {
    const parcel = fallbackParcels.find((p) => isDagMatch(p.dagNo, subRegDag));
    if (!parcel) {
      setShieldAlert({
        triggered: true,
        allowed: false,
        message: "দাগ নম্বর খুঁজে পাওয়া যায়নি।",
      });
      return;
    }

    if (parcel.transitLock.isLocked) {
      setShieldAlert({
        triggered: true,
        allowed: false,
        message: `⛔ জালিয়াতি ও ডাবল সেলিং প্রতিরোধ সক্রিয়! দাগ নং ${subRegDag}-এ সম্প্রতি দলিল নং (${parcel.transitLock.pendingDeedNo}) রেজিস্ট্রি হয়েছে এবং ই-নামজারি ট্রানজিট লক কার্যকর আছে। দ্বিতীয়বার বিক্রির রেজিস্ট্রেশন স্বয়ংক্রিয়ভাবে বাতিল করা হলো।`,
      });
    } else if (parcel.isKhas) {
      setShieldAlert({
        triggered: true,
        allowed: false,
        message: "⛔ রেজিস্ট্রেশন ব্লকড! এটি সরকারের ১নং খাস খতিয়ানের জমি। বিক্রয় দলিল সম্পাদন ফৌজদারি অপরাধ।",
      });
    } else if (parcel.liens.some((l) => l.status === "active")) {
      setShieldAlert({
        triggered: true,
        allowed: false,
        message: "⚠️ ব্যাংক বন্ধক সতর্কতা: সোনালী ব্যাংক পিএলসির সক্রিয় লিয়েন বিদ্যমান। ব্যাংকের লিখিত অনাপত্তিপত্র (NOC) ব্যতিরেকে দলিল রেজিস্ট্রি করা যাবে না।",
      });
    } else {
      setShieldAlert({
        triggered: true,
        allowed: true,
        message: "✔ যাচাই সম্পন্ন: জমির মালিকানা নিষ্কলুষ, কোনো ট্রানজিট লক বা ব্যাংক লিয়েন নেই। নতুন দলিল রেজিস্ট্রেশন অনুমোদিত।",
      });
    }
  };

  const handleApproveMutation = (applicationId: string) => {
    setMutationsList((prev) =>
      prev.map((m) =>
        m.applicationId === applicationId
          ? {
              ...m,
              currentStage: "approved",
              remarksBn: "এসি ল্যান্ড কর্তৃক শুনানি ও মূল দলিল পর্যালোচনা অন্তে নামজারি মঞ্জুর এবং খতিয়ান অনুমোদিত হয়েছে।",
            }
          : m
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#ECFDF5] text-[#064E3B] px-3 py-1 rounded-full text-xs font-bold border border-[#A7F3D0]">
            <Lock className="w-3.5 h-3.5" />
            <span>ভূমি প্রশাসন ও কর্মকর্তা ব্যবস্থাপনা কনসোল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B]">
            {language === "bn" ? "ভূমি কর্মকর্তা ও সিস্টেম অ্যানালিস্ট পোর্টাল" : "Land Officer & System Analyst Console"}
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            এসি ল্যান্ড, সাব-রেজিস্ট্রার এবং ভূমি মন্ত্রণালয়ের সিস্টেম অ্যানালিস্টদের জন্য রিয়েলটাইম সিদ্ধান্ত গ্রহণ প্যানেল।
          </p>
        </div>

        {/* Role Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
          <button
            onClick={() => setActiveRole("ac_land")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeRole === "ac_land"
                ? "bg-[#064E3B] text-white shadow-sm"
                : "text-slate-600 hover:text-black"
            }`}
          >
            এসি ল্যান্ড (AC Land)
          </button>
          <button
            onClick={() => setActiveRole("sub_registrar")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeRole === "sub_registrar"
                ? "bg-[#064E3B] text-white shadow-sm"
                : "text-slate-600 hover:text-black"
            }`}
          >
            সাব-রেজিস্ট্রার
          </button>
          <button
            onClick={() => setActiveRole("admin")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeRole === "admin"
                ? "bg-[#064E3B] text-white shadow-sm"
                : "text-slate-600 hover:text-black"
            }`}
          >
            সিস্টেম মেট্রেক্স
          </button>
        </div>
      </div>

      {/* Role 1: AC Land Console */}
      {activeRole === "ac_land" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="civic-card p-5 bg-white border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-semibold text-slate-500">বিচারাধীন নামজারি আবেদন</span>
              <div className="text-2xl font-black text-[#064E3B]">০২ টি</div>
              <span className="text-[11px] text-amber-600 font-bold">তহশিল ও সার্ভেয়ার প্রতিবেদন সাপেক্ষ</span>
            </div>
            <div className="civic-card p-5 bg-white border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-semibold text-slate-500">মঞ্জুরকৃত খতিয়ান (এই মাসে)</span>
              <div className="text-2xl font-black text-[#059669]">৪৭ টি</div>
              <span className="text-[11px] text-emerald-600 font-bold">গড় নিষ্পত্তি সময়: ৭ দিন (পূর্বে ২৮ দিন)</span>
            </div>
            <div className="civic-card p-5 bg-white border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-semibold text-slate-500">স্বয়ংক্রিয়ভাবে আটকানো অসঙ্গতি</span>
              <div className="text-2xl font-black text-[#DC2626]">০৪ টি</div>
              <span className="text-[11px] text-red-600 font-bold">১৬ আনা অংশে অমিল শনাক্ত</span>
            </div>
          </div>

          {/* Pending Applications Review Table */}
          <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#064E3B]" />
                <span>ই-নামজারি শুনানির তালিকা ও সিদ্ধান্ত গ্রহণ</span>
              </span>
              <span className="text-xs text-slate-500">উপজেলা ভূমি অফিস, সাভার</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="p-3">টোকেন নং</th>
                    <th className="p-3">আবেদনকারী</th>
                    <th className="p-3">দাগ ও খতিয়ান</th>
                    <th className="p-3">বিক্রি দলিল নং</th>
                    <th className="p-3">বর্তমান পর্যায়</th>
                    <th className="p-3 text-right">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {mutationsList.map((app) => (
                    <tr key={app.applicationId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-[#064E3B]">{app.token}</td>
                      <td className="p-3 font-bold">{app.applicantNameBn}</td>
                      <td className="p-3">
                        দাগ: {app.dagNo} ({app.khatianNo})
                      </td>
                      <td className="p-3 font-mono">{app.deedNo}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.currentStage === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {app.currentStage === "approved" ? "মঞ্জুরকৃত" : app.currentStage}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {app.currentStage !== "approved" ? (
                          <button
                            onClick={() => handleApproveMutation(app.applicationId)}
                            className="bg-[#064E3B] hover:bg-[#04382A] text-white px-3 py-1 rounded text-xs font-bold transition cursor-pointer"
                          >
                            মঞ্জুর করুন
                          </button>
                        ) : (
                          <span className="text-emerald-700 text-xs font-bold">✔ অনুমোদিত</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Role 2: Sub-Registrar Anti-Double-Selling Sandbox */}
      {activeRole === "sub_registrar" && (
        <div className="space-y-6">
          <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4">
            <div className="flex items-center gap-2 text-[#064E3B] font-bold text-base">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>দলিল রেজিস্ট্রেশনের পূর্বে তাৎক্ষণিক মালিকানা ও ডাবল সেলিং অডিট</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              বিক্রেতা কোনো দলিল নিয়ে উপস্থিত হলে রেজিস্ট্রি চাপার পূর্বে দাগ নম্বর ও বিক্রেতার অংশ অডিট করুন। জমিটি বন্ধক রাখা, খাস বা ইতোমধ্যে বিক্রিত হলে লাল সতর্কবার্তা প্রদর্শিত হবে।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">দাগ নম্বর</label>
                <input
                  type="text"
                  value={subRegDag}
                  onChange={(e) => setSubRegDag(e.target.value)}
                  placeholder="যেমন: ১৪২৬"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">বিক্রেতার নাম</label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleRunSubRegAudit}
                  className="w-full bg-[#064E3B] hover:bg-[#04382A] text-white py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>রেজিস্ট্রি ক্লিয়ারেন্স অডিট চালান</span>
                </button>
              </div>
            </div>

            {/* Quick Testing Shortcodes */}
            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <span className="text-slate-400 font-medium">পরীক্ষা করুন:</span>
              <button
                onClick={() => {
                  setSubRegDag("1426");
                  setSellerName("কামাল হোসেন");
                }}
                className="px-2 py-0.5 rounded border border-red-300 bg-red-50 text-red-900 text-[11px] font-bold cursor-pointer"
              >
                দাগ ১৪২৬ (ইতোমধ্যে বিক্রিত - ট্রানজিট লক)
              </button>
              <button
                onClick={() => {
                  setSubRegDag("302");
                  setSellerName("ভুয়া দালাল");
                }}
                className="px-2 py-0.5 rounded border border-purple-300 bg-purple-50 text-purple-900 text-[11px] font-bold cursor-pointer"
              >
                দাগ ৩০২ (১নং খাস জমি)
              </button>
              <button
                onClick={() => {
                  setSubRegDag("1425");
                  setSellerName("শফিকুল ইসলাম");
                }}
                className="px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-emerald-900 text-[11px] font-bold cursor-pointer"
              >
                দাগ ১৪২৫ (নিষ্কলুষ জমি - রেজিস্ট্রেশন বৈধ)
              </button>
            </div>

            {/* Alert Result Box */}
            {shieldAlert && (
              <div
                className={`p-4 rounded-xl border space-y-2 mt-4 animate-fadeIn ${
                  shieldAlert.allowed
                    ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#064E3B]"
                    : "bg-[#FEF2F2] border-[#FCA5A5] text-[#DC2626]"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {shieldAlert.allowed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs font-bold leading-relaxed">{shieldAlert.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Role 3: System Analyst Performance Metrics */}
      {activeRole === "admin" && (
        <div className="space-y-6">
          <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4">
            <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#064E3B]" />
              <span>ভূমি-বন্ধন প্রটোকল গভর্নেন্স ও সিকিউরিটি অ্যানালিটিক্স</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">মোট রেজিস্ট্রিকৃত পার্সেল</span>
                <div className="text-2xl font-black text-[#064E3B] font-mono mt-1">১০,৪৫০+</div>
                <span className="text-[10px] text-emerald-700 font-bold">সাভার পাইলট ক্লাস্টার</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">ডাবল সেলিং প্রতিরোধ হার</span>
                <div className="text-2xl font-black text-[#DC2626] font-mono mt-1">১০০%</div>
                <span className="text-[10px] text-slate-500 font-bold">০টি ভুয়া ট্রানজিট হস্তান্তর</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">সংযুক্ত ব্যাংক ও শাখা</span>
                <div className="text-2xl font-black text-[#0284C7] font-mono mt-1">১২টি ব্যাংক</div>
                <span className="text-[10px] text-slate-500 font-bold">রিয়েলটাইম লিয়েন ইন্টিগ্রেশন</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">গড় নাগরিক রেটিং</span>
                <div className="text-2xl font-black text-[#D97706] font-mono mt-1">৪.৯ / ৫.০</div>
                <span className="text-[10px] text-slate-500 font-bold">১০ সেকেন্ড অডিট সন্তুষ্টি</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
