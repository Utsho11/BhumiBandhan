"use client";

import React from "react";
import Link from "next/link";
import { useAuth, IUser } from "../../context/AuthContext";
import { Lock, ShieldAlert, LogIn, ArrowRight, Sparkles } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: IUser["role"][];
  requiredRoleNameBn?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles,
  requiredRoleNameBn = "অনুমোদিত কর্মকর্তা",
}) => {
  const { user, isAuthenticated, isLoading, quickLogin } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 civic-card text-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#064E3B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">নিরাপত্তা প্রমাণীকরণ যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  // Check 1: User not logged in
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-lg mx-auto my-16 p-8 civic-card bg-white border border-[#E2E8F0] shadow-md text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900">লগইন প্রয়োজন (Authentication Required)</h2>
          <p className="text-xs text-slate-600">
            এই পৃষ্ঠা বা সেবাটি ব্যবহার করতে অনুগ্রহ করে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন।
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/login"
            className="bg-[#064E3B] hover:bg-[#04382A] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>লগইন পেজে যান</span>
          </Link>
          <button
            onClick={() => quickLogin("citizen")}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            <span>১-ক্লিকে নাগরিক লগইন</span>
          </button>
        </div>
      </div>
    );
  }

  // Check 2: Role restrictions (e.g. only ac_land, sub_registrar, admin allowed in /admin)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 civic-card bg-white border border-red-200 shadow-md space-y-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            অনুমতি সীমাবদ্ধ (Access Denied)
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">
            এই পোর্টালটি শুধুমাত্র {requiredRoleNameBn}-দের জন্য সংরক্ষিত
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            আপনি বর্তমানে <span className="font-bold text-[#064E3B]">{user.nameBn}</span> ({user.role}) হিসেবে লগইন অবস্থায় আছেন। কর্মকর্তাদের টুলস দেখতে অনুগ্রহ করে এসি ল্যান্ড বা সাব-রেজিস্ট্রার অ্যাকাউন্টে পরিবর্তন করুন।
          </p>
        </div>

        {/* 1-Click Role Switcher inside Guard */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-left">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#064E3B]" />
            <span>পরীক্ষা করার জন্য সরাসরি কর্মকর্তার রোলে স্যুইচ করুন:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => quickLogin("ac_land")}
              className="p-2.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-xs font-bold text-emerald-900 flex items-center justify-between cursor-pointer transition"
            >
              <span>👨‍💼 এসি ল্যান্ড (AC Land)</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => quickLogin("sub_registrar")}
              className="p-2.5 rounded-lg border border-sky-300 bg-white hover:bg-sky-50 text-xs font-bold text-sky-900 flex items-center justify-between cursor-pointer transition"
            >
              <span>📜 সাব-রেজিস্ট্রার (Sub-Registrar)</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
