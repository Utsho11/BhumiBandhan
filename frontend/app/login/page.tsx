"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, DEMO_USERS, IUser } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  ShieldCheck,
  Lock,
  Mail,
  Key,
  ArrowRight,
  UserCheck,
  Building,
  Scale,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const { language } = useLanguage();
  const { login, quickLogin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("অনুগ্রহ করে ইমেইল ঠিকানা দিন");
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      router.push("/");
    } else {
      setErrorMsg("লগইন ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন।");
    }
  };

  const demoRoles: {
    role: IUser["role"];
    titleBn: string;
    officeBn: string;
    icon: any;
    color: string;
  }[] = [
    {
      role: "ac_land",
      titleBn: "সহকারী কমিশনার (ভূমি) / এসি ল্যান্ড",
      officeBn: "সাভার উপজেলা ভূমি অফিস",
      icon: Scale,
      color: "bg-emerald-50 border-emerald-300 text-[#064E3B] hover:bg-emerald-100",
    },
    {
      role: "sub_registrar",
      titleBn: "সাব-রেজিস্ট্রার",
      officeBn: "সাভার সাব-রেজিস্ট্রার কার্যালয়",
      icon: UserCheck,
      color: "bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100",
    },
    {
      role: "bank_officer",
      titleBn: "ব্যাংক ক্রেডিট অফিসার",
      officeBn: "সোনালী ব্যাংক পিএলসি, সাভার শাখা",
      icon: Building,
      color: "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100",
    },
    {
      role: "citizen",
      titleBn: "সাধারণ নাগরিক (জমি ক্রেতা)",
      officeBn: "নাগরিক সেবা পোর্টাল",
      icon: UserCheck,
      color: "bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100",
    },
    {
      role: "admin",
      titleBn: "সিস্টেম অ্যাডমিনিস্ট্রেটর",
      officeBn: "ভূমি ব্যবস্থাপনা অটোমেশন সেল",
      icon: ShieldCheck,
      color: "bg-purple-50 border-purple-300 text-purple-900 hover:bg-purple-100",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
          <ShieldCheck className="w-7 h-7 text-emerald-300" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B]">
          {language === "bn" ? "ভূমি-বন্ধন সিস্টেমে লগইন করুন" : "Sign In to BhumiBandhan"}
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto">
          {language === "bn"
            ? "ভূমি কর্মকর্তা, ব্যাংক প্রতিনিধি অথবা সাধারণ নাগরিক হিসেবে সিস্টেমে প্রবেশ করুন।"
            : "Access your verified role console as a Land Officer, Bank Inspector, or Citizen."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: 1-Click Role Switcher for Hackathon Judges */}
        <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#064E3B] font-bold text-sm border-b pb-3">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>১-ক্লিকে ডেমো কর্মকর্তা ও নাগরিক ভূমিকা নির্বাচন</span>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            বিচারক ও পরীক্ষকদের সুবিধার জন্য পাসওয়ার্ড ছাড়াই যে কোনো অফিশিয়াল রোলে সরাসরি লগইন করার ব্যবস্থা:
          </p>

          <div className="space-y-2.5 pt-1">
            {demoRoles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.role}
                  onClick={() => quickLogin(item.role)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition cursor-pointer text-left ${item.color}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{item.titleBn}</h4>
                      <p className="text-[10px] opacity-75">{item.officeBn}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Standard Email/Password Login Form */}
        <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b pb-3">
            <Lock className="w-4 h-4 text-[#064E3B]" />
            <span>ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ</span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">ইমেইল ঠিকানা</label>
              <div className="flex items-center px-3 border border-slate-300 rounded-lg">
                <Mail className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="যেমন: citizen@bhumibandhan.gov.bd"
                  className="w-full p-2.5 text-slate-900 focus:outline-none text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">পাসওয়ার্ড</label>
              <div className="flex items-center px-3 border border-slate-300 rounded-lg">
                <Key className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 text-slate-900 focus:outline-none text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#064E3B] hover:bg-[#04382A] text-white py-3 rounded-xl font-bold text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <span>{loading ? "যাচাই করা হচ্ছে..." : "লগইন করুন"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t text-center text-xs text-slate-500">
            <span>নতুন ব্যবহারকারী? </span>
            <Link href="/register" className="font-bold text-[#064E3B] hover:underline">
              নাগরিক হিসেবে নিবন্ধন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
