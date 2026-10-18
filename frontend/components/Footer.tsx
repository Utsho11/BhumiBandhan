"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { ShieldCheck, Award, GraduationCap, Scale } from "lucide-react";

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#064E3B] text-white pt-12 pb-8 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-700/80 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                {t("app_title")} (BhumiBandhan)
              </span>
            </div>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed max-w-md">
              {language === "bn"
                ? "বাংলাদেশের ভূমি প্রশাসনকে স্বচ্ছ, নির্ভরযোগ্য ও নিরাপদ করতে সাব-রেজিস্ট্রার অফিস এবং এসি ল্যান্ড অফিসের সমন্বয়ে গঠিত ডিজিটাল ট্রাস্ট প্রটোকল।"
                : "A unified digital trust protocol interconnecting Sub-Registry and AC Land offices to establish tamper-evident land titles across Bangladesh."}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-200/90 pt-1">
              <Award className="w-4 h-4 text-[#FDE68A]" />
              <span>টিম: <strong>Porcha Builder DIU</strong> | LandTech Innovation Hackathon 2026</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {language === "bn" ? "প্রয়োজনীয় লিংক" : "Quick Services"}
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <Link href="/check-before-you-buy" className="hover:text-white transition">
                  {t("nav_check_buy")}
                </Link>
              </li>
              <li>
                <Link href="/baya-chain" className="hover:text-white transition">
                  {t("nav_baya_chain")}
                </Link>
              </li>
              <li>
                <Link href="/mutation" className="hover:text-white transition">
                  {t("nav_mutation")}
                </Link>
              </li>
              <li>
                <Link href="/bank-lien" className="hover:text-white transition">
                  {t("nav_bank_lien")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {language === "bn" ? "প্রতিষ্ঠান ও সহায়তা" : "Organized By"}
            </h4>
            <div className="space-y-2 text-xs text-emerald-100/80">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-300" />
                <span>Dept. of CSE & CSE-TECH, DIU</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-300" />
                <span>Supported by Dept. of Law, DIU</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 pt-2">
                Knowledge Tower, Daffodil Smart City, Ashulia, Dhaka
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-emerald-200/70 gap-3">
          <p>{t("footer_text")}</p>
          <div className="flex items-center gap-4">
            <span>গোপনীয়তা নীতি (Synthetic Data Only)</span>
            <span>•</span>
            <span>শর্তাবলী</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
