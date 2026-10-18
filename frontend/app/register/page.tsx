"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  CreditCard,
  Key,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const { language } = useLanguage();
  const { register } = useAuth();
  const router = useRouter();

  const [nameBn, setNameBn] = useState("");
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register({
      nameBn,
      email,
      nid: nid || "1992882199210",
      phone: phone || "01712999888",
      password,
    });
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
          <ShieldCheck className="w-7 h-7 text-emerald-300" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#064E3B]">
          {language === "bn" ? "নতুন নাগরিক নিবন্ধন" : "Citizen Registration"}
        </h1>
        <p className="text-xs text-[#475569]">
          ভূমি সেবা গ্রহণ ও নামজারি আবেদন ট্র্যাক করার জন্য বিনামূল্যে অ্যাকাউন্ট খুলুন।
        </p>
      </div>

      <div className="civic-card p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        {success ? (
          <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm">নিবন্ধন সফল হয়েছে!</h3>
            <p className="text-xs">ভূমি-বন্ধন সিস্টেমে প্রবেশ করা হচ্ছে...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">পূর্ণ নাম (বাংলায়)</label>
              <div className="flex items-center px-3 border border-slate-300 rounded-lg">
                <User className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="w-full p-2.5 text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">ইমেইল ঠিকানা</label>
              <div className="flex items-center px-3 border border-slate-300 rounded-lg">
                <Mail className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">জাতীয় পরিচয়পত্র (NID)</label>
                <div className="flex items-center px-2.5 border border-slate-300 rounded-lg">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                  <input
                    type="text"
                    value={nid}
                    onChange={(e) => setNid(e.target.value)}
                    placeholder="১০ বা ১৭ ডিজিট"
                    className="w-full p-2 text-slate-900 focus:outline-none text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">মোবাইল নম্বর</label>
                <div className="flex items-center px-2.5 border border-slate-300 rounded-lg">
                  <Phone className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full p-2 text-slate-900 focus:outline-none text-[11px]"
                  />
                </div>
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
                  placeholder="নূন্যতম ৬ অক্ষর"
                  className="w-full p-2.5 text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#064E3B] hover:bg-[#04382A] text-white py-3 rounded-xl font-bold text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>নিবন্ধন সম্পন্ন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-2 border-t text-center text-xs text-slate-500">
          <span>ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
          <Link href="/login" className="font-bold text-[#064E3B] hover:underline">
            লগইন করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
