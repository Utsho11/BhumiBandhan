"use client";

import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { fallbackParcels } from "../../lib/api";
import { IBankLien } from "../../types";
import {
  Building2,
  Search,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  PlusCircle,
  FileBadge2,
  ShieldAlert,
} from "lucide-react";

export default function BankLienPage() {
  const { language } = useLanguage();
  const [selectedDag, setSelectedDag] = useState("782");
  const [activeLiens, setActiveLiens] = useState<IBankLien[]>(
    fallbackParcels.find((p) => p.dagNo === "782")?.liens || []
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [bankName, setBankName] = useState("সোনালী ব্যাংক পিএলসি");
  const [amount, setAmount] = useState("4500000");
  const [accountNo, setAccountNo] = useState("A/C-0142-SME-902");

  const handleSearch = (dag: string) => {
    setSelectedDag(dag);
    const parcel = fallbackParcels.find((p) => p.dagNo === dag);
    setActiveLiens(parcel ? parcel.liens : []);
  };

  const handleRelease = (lienId: string) => {
    setActiveLiens((prev) =>
      prev.map((l) => (l.lienId === lienId ? { ...l, status: "released" } : l))
    );
  };

  const handleAddLien = (e: React.FormEvent) => {
    e.preventDefault();
    const newLien: IBankLien = {
      lienId: `LIEN-AUTO-${Math.floor(100 + Math.random() * 900)}`,
      bankNameBn: bankName,
      bankNameEn: "Bank Collateral",
      branchName: "সাভার কর্পোরেট শাখা",
      loanAccountNumber: accountNo,
      mortgageAmountBdt: parseFloat(amount) || 2500000,
      issueDate: new Date().toISOString().split("T")[0],
      status: "active",
      deedMortgagedNo: `MORT-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setActiveLiens([newLien, ...activeLiens]);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#ECFDF5] text-[#064E3B] px-3 py-1 rounded-full text-xs font-bold border border-[#A7F3D0]">
            <Building2 className="w-3.5 h-3.5" />
            <span>আর্থিক প্রতিষ্ঠান ও ব্যাংক বন্ধক প্রটোকল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B]">
            {language === "bn" ? "কেন্দ্রীয় ব্যাংক লিয়েন রেজিস্ট্রি" : "Centralized Bank Lien & Collateral Registry"}
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] max-w-2xl">
            {language === "bn"
              ? "একই জমি একাধিক ব্যাংকে বন্ধক রেখে ঋণ জালিয়াতি প্রতিরোধে সব বাণিজ্যিক ব্যাংকের জন্য সমন্বিত তথ্যভাণ্ডার।"
              : "Prevents multi-bank collateral fraud by establishing a single source of truth for all land mortgage encumbrances."}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#064E3B] hover:bg-[#04382A] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন ব্যাংক লিয়েন এন্ট্রি</span>
        </button>
      </div>

      {/* Query Bar */}
      <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center px-3 border border-slate-300 rounded-lg">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={selectedDag}
              onChange={(e) => setSelectedDag(e.target.value)}
              placeholder="দাগ নম্বর লিখুন (যেমন: ৭৮২)"
              className="w-full text-xs sm:text-sm p-2 text-slate-900 focus:outline-none font-bold"
            />
          </div>
          <button
            onClick={() => handleSearch(selectedDag)}
            className="bg-[#064E3B] hover:bg-[#04382A] text-white px-6 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            অনুসন্ধান
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">নমুনা দাগ:</span>
          <button
            onClick={() => handleSearch("782")}
            className="px-2.5 py-1 rounded text-[11px] font-bold border border-amber-300 bg-amber-50 text-amber-900 cursor-pointer"
          >
            দাগ ৭৮২ (সক্রিয় বন্ধক - ৪৫ লাখ টাকা)
          </button>
          <button
            onClick={() => handleSearch("1425")}
            className="px-2.5 py-1 rounded text-[11px] font-bold border border-emerald-300 bg-emerald-50 text-emerald-900 cursor-pointer"
          >
            দাগ ১৪২৫ (সম্পূর্ণ বন্ধকমুক্ত)
          </button>
        </div>
      </div>

      {/* Liens List / Status */}
      <div className="civic-card p-6 sm:p-8 bg-white border border-[#E2E8F0] space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#064E3B]" />
            <span>দাগ নং {selectedDag}-এর বন্ধকী রেকর্ড তালিকা</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">মোট রেকর্ড: {activeLiens.length}টি</span>
        </div>

        {activeLiens.length === 0 ? (
          <div className="p-8 text-center text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-sm">কোনো সক্রিয় বন্ধক বা ব্যাংক দায় নেই</h4>
            <p className="text-xs text-emerald-800">এই জমির দাগে কোনো ব্যাংকের ঋণ স্থিতি রেকর্ডভুক্ত হয়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLiens.map((lien) => (
              <div
                key={lien.lienId}
                className={`p-5 rounded-xl border space-y-3 transition ${
                  lien.status === "active"
                    ? "bg-amber-50/70 border-amber-300"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{lien.lienId}</span>
                    <h4 className="text-sm font-bold text-slate-900">{lien.bankNameBn}</h4>
                    <p className="text-xs text-slate-600">{lien.branchName}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      lien.status === "active"
                        ? "bg-amber-200 text-amber-900"
                        : "bg-emerald-200 text-emerald-900"
                    }`}
                  >
                    {lien.status === "active" ? "সক্রিয় বন্ধক (Active)" : "খালাসকৃত (Released)"}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1 font-medium text-slate-700">
                  <p>
                    লোন অ্যাকাউন্ট: <span className="font-mono font-bold text-slate-900">{lien.loanAccountNumber}</span>
                  </p>
                  <p>
                    বন্ধকী ঋণের পরিমাণ: <span className="font-bold text-red-600 font-mono">৳ {lien.mortgageAmountBdt.toLocaleString()}</span>
                  </p>
                  <p>
                    বন্ধকী দলিল নং: <span className="font-mono text-slate-600">{lien.deedMortgagedNo}</span> | তারিখ: {lien.issueDate}
                  </p>
                </div>

                {lien.status === "active" && (
                  <button
                    onClick={() => handleRelease(lien.lienId)}
                    className="w-full text-xs font-bold bg-white hover:bg-slate-100 text-emerald-700 border border-emerald-300 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>এনওসি যাচাই করে লিয়েন খালাস করুন</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Lien Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-[#064E3B]">নতুন বন্ধকী লিয়েন রেজিস্ট্রি</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLien} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ব্যাংকের নাম</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
                >
                  <option value="সোনালী ব্যাংক পিএলসি">সোনালী ব্যাংক পিএলসি</option>
                  <option value="ব্র্যাক ব্যাংক পিএলসি">ব্র্যাক ব্যাংক পিএলসি</option>
                  <option value="সিটি ব্যাংক পিএলসি">সিটি ব্যাংক পিএলসি</option>
                  <option value="ইসলামী ব্যাংক বাংলাদেশ পিএলসি">ইসলামী ব্যাংক বাংলাদেশ পিএলসি</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">লোন অ্যাকাউন্ট নং</label>
                <input
                  type="text"
                  required
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">বন্ধকী ঋণের পরিমাণ (টাকা)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-[#064E3B] hover:bg-[#04382A] text-white px-5 py-2 rounded-lg font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
