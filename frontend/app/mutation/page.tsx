"use client";

import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { fallbackMutations } from "../../lib/api";
import { IMutationApplication } from "../../types";
import {
  UserCheck,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  Building,
  FileCheck,
  ArrowRight,
  PlusCircle,
  FileBadge,
} from "lucide-react";

export default function MutationPage() {
  const { language } = useLanguage();
  const [tokenInput, setTokenInput] = useState("MUT-2026-7841");
  const [activeApp, setActiveApp] = useState<IMutationApplication>(fallbackMutations[0]);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Form submission state
  const [formName, setFormName] = useState("");
  const [formDag, setFormDag] = useState("1425");
  const [formDeed, setFormDeed] = useState("DEED-2026-9988");
  const [formArea, setFormArea] = useState("5.0");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const stages = [
    { key: "submitted", label: "আবেদন দাখিল", desc: "অনলাইন সিস্টেমে আবেদন ও কোর্ট ফি গ্রহণ" },
    { key: "tehsil_review", label: "তহশিলদার প্রতিবেদন", desc: "ভূমি উপ-সহকারী কর্মকর্তার রেকর্ড যাচাই" },
    { key: "surveyor_inspection", label: "সার্ভেয়ার পরিদর্শন", desc: "সরজমিন দাগ ও সীমানা মাপজোক" },
    { key: "hearing_scheduled", label: "শুনানি পর্যায়", desc: "এসি ল্যান্ড কর্তৃক মূল দলিল পরীক্ষা" },
    { key: "approved", label: "নামজারি মঞ্জুর", desc: "খতিয়ান সৃজন ও ডিসিআর (DCR) প্রদান" },
  ];

  const getStageIndex = (stage: string) => {
    switch (stage) {
      case "submitted":
        return 0;
      case "tehsil_review":
        return 1;
      case "surveyor_inspection":
        return 2;
      case "hearing_scheduled":
        return 3;
      case "approved":
        return 4;
      default:
        return 0;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = fallbackMutations.find((m) => m.token === tokenInput || m.applicationId === tokenInput);
    if (found) {
      setActiveApp(found);
    }
  };

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: IMutationApplication = {
      applicationId: `MUT-APP-2026-${Math.floor(100 + Math.random() * 900)}`,
      token: `MUT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ulpin: "26-26-72-082-01425",
      dagNo: formDag,
      khatianNo: "BS-৫৬২১",
      applicantNameBn: formName || "আবেদনকারী নাগরিক",
      applicantNidMasked: "1995-XXXX-XXXX-7721",
      applicantPhoneMasked: "01712-XXXX11",
      deedNo: formDeed,
      deedDate: "2026-10-15",
      transferredAreaSatak: parseFloat(formArea) || 5.0,
      appliedDate: "2026-10-18",
      currentStage: "submitted",
      acLandOfficeBn: "সাভার উপজেলা ভূমি অফিস",
      remarksBn: "সিস্টেমে নতুন আবেদন দাখিল হয়েছে। বায়া দলিল চেইন প্রাথমিক যাচাই সফল।",
    };

    fallbackMutations.unshift(newApp);
    setActiveApp(newApp);
    setTokenInput(newApp.token);
    setSubmitSuccess(true);
    setTimeout(() => {
      setShowApplyModal(false);
      setSubmitSuccess(false);
    }, 1500);
  };

  const currentStepIdx = getStageIndex(activeApp.currentStage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#ECFDF5] text-[#064E3B] px-3 py-1 rounded-full text-xs font-bold border border-[#A7F3D0]">
            <UserCheck className="w-3.5 h-3.5" />
            <span>স্মার্ট ই-নামজারি ট্র্যাকার ও অটোমেশন</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B]">
            {language === "bn" ? "ই-নামজারি অবস্থা ও নতুন আবেদন" : "Smart e-Mutation Tracking & Filing"}
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            সাব-রেজিস্ট্রি থেকে দলিলের তথ্য সরাসরি সংযুক্ত থাকায় দ্রুততম সময়ে নামজারি সম্পন্ন হয়।
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="bg-[#064E3B] hover:bg-[#04382A] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন আবেদন দাখিল করুন</span>
        </button>
      </div>

      {/* Tracker Search Form */}
      <div className="civic-card p-6 bg-white border border-[#E2E8F0] space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center px-3 border border-slate-300 rounded-lg">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="আবেদন ট্র্যাকিং টোকেন লিখুন (যেমন: MUT-2026-7841)"
              className="w-full text-xs sm:text-sm p-2 text-slate-900 focus:outline-none font-bold"
            />
          </div>
          <button
            type="submit"
            className="bg-[#064E3B] hover:bg-[#04382A] text-white px-6 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            ট্র্যাক করুন
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">নমুনা টোকেন:</span>
          {fallbackMutations.map((m) => (
            <button
              key={m.token}
              onClick={() => {
                setTokenInput(m.token);
                setActiveApp(m);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border transition cursor-pointer ${
                activeApp.token === m.token
                  ? "bg-[#064E3B] text-white border-[#064E3B]"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {m.token} ({m.applicantNameBn})
            </button>
          ))}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="civic-card p-6 sm:p-8 bg-white border border-[#E2E8F0] space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#064E3B]">{activeApp.token}</span>
              <span className="bg-emerald-100 text-[#064E3B] text-xs font-bold px-2 py-0.5 rounded">
                দাগ নং: {activeApp.dagNo}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              আবেদনকারী: <span className="font-bold text-slate-800">{activeApp.applicantNameBn}</span> | দাখিলের তারিখ: {activeApp.appliedDate}
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-500 block">উপজেলা ভূমি অফিস</span>
            <span className="font-bold text-[#064E3B]">{activeApp.acLandOfficeBn}</span>
          </div>
        </div>

        {/* 5-Step Civic Progression */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStepIdx || activeApp.currentStage === "approved";
            const isCurrent = idx === currentStepIdx && activeApp.currentStage !== "approved";

            return (
              <div
                key={stage.key}
                className={`p-3 rounded-xl border text-center space-y-1.5 transition ${
                  isCompleted
                    ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#064E3B]"
                    : isCurrent
                    ? "bg-[#FFFBEB] border-[#FDE68A] text-[#D97706] ring-2 ring-amber-400/40"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center font-bold text-xs shadow-sm bg-white">
                  {isCompleted ? "✔" : idx + 1}
                </div>
                <h4 className="text-xs font-bold">{stage.label}</h4>
                <p className="text-[10px] leading-tight opacity-80">{stage.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Current Stage Box & Hearing Details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#064E3B]" />
            <span>সর্বশেষ অগ্রগতি ও মন্তব্য:</span>
          </h4>
          <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
            {activeApp.remarksBn}
          </p>

          {activeApp.hearingDate && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>শুনানির নির্ধারিত তারিখ: {activeApp.hearingDate} (এসি ল্যান্ড এজলাস)</span>
            </div>
          )}
        </div>
      </div>

      {/* New Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-[#064E3B]">নতুন স্মার্ট ই-নামজারি আবেদন</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-6 text-center space-y-2 text-emerald-700 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                <h4 className="font-bold text-sm">আবেদন সফলভাবে দাখিল হয়েছে!</h4>
                <p className="text-xs">টোকেন নম্বর স্বয়ংক্রিয়ভাবে জেনারেট হয়েছে।</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitNew} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">আবেদনকারীর নাম (বাংলায়)</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="যেমন: তাহমিদ জামান"
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#064E3B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">দাগ নম্বর</label>
                    <input
                      type="text"
                      required
                      value={formDag}
                      onChange={(e) => setFormDag(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">বিক্রি দলিলের নম্বর</label>
                    <input
                      type="text"
                      required
                      value={formDeed}
                      onChange={(e) => setFormDeed(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">জমির পরিমাণ (শতক)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-bold"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="bg-[#064E3B] hover:bg-[#04382A] text-white px-5 py-2 rounded-lg font-bold"
                  >
                    আবেদন নিশ্চিত করুন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
