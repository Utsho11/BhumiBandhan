"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  Search,
  FileText,
  Building2,
  Lock,
  UserCheck,
  Globe,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav_home"), icon: ShieldCheck },
    { href: "/dashboard", label: language === "bn" ? "নাগরিক প্যানেল" : "User Panel", icon: LayoutDashboard },
    { href: "/check-before-you-buy", label: t("nav_check_buy"), icon: Search },
    { href: "/baya-chain", label: t("nav_baya_chain"), icon: FileText },
    { href: "/mutation", label: t("nav_mutation"), icon: UserCheck },
    { href: "/bank-lien", label: t("nav_bank_lien"), icon: Building2 },
    { href: "/admin", label: t("nav_admin"), icon: Lock },
  ];

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "ac_land":
        return { label: "এসি ল্যান্ড", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
      case "sub_registrar":
        return { label: "সাব-রেজিস্ট্রার", color: "bg-sky-100 text-sky-800 border-sky-300" };
      case "bank_officer":
        return { label: "ব্যাংক অফিসার", color: "bg-amber-100 text-amber-800 border-amber-300" };
      case "admin":
        return { label: "অ্যাডমিন", color: "bg-purple-100 text-purple-800 border-purple-300" };
      default:
        return { label: "নাগরিক", color: "bg-slate-100 text-slate-800 border-slate-300" };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      {/* Top Civic Strip */}
      <div className="bg-[#064E3B] text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
          <span className="font-medium tracking-wide">{t("gov_badge")}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] opacity-90">
          <span className="hidden sm:inline">টিম: Porcha Builder DIU | LandTech 2026</span>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-[#0D5C3A] hover:bg-[#04382A] text-white px-2.5 py-0.5 rounded-full text-xs font-semibold transition border border-emerald-600/40 cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            <span>{t("lang_btn")}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-[#064E3B] tracking-tight">
                  {t("app_title")}
                </span>
                <span className="bg-[#FEF2F2] text-[#DC2626] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#FCA5A5]">
                  SMART BD
                </span>
              </div>
              <p className="text-[11px] text-[#475569] hidden sm:block">
                টিম: Porcha Builder DIU | {t("app_tagline")}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#ECFDF5] text-[#064E3B] font-bold border border-[#A7F3D0]"
                      : "text-[#475569] hover:text-[#064E3B] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#064E3B]" : "text-[#94A3B8]"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Status & Quick Switch */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <Link href="/dashboard" className="w-7 h-7 rounded-lg bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs hover:scale-105 transition">
                  <User className="w-4 h-4 text-emerald-300" />
                </Link>
                <Link href="/dashboard" className="text-left hidden sm:block hover:opacity-80">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 leading-none">{user.nameBn}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">{user.officeBn || user.email}</span>
                </Link>
                <button
                  onClick={logout}
                  title="লগআউট"
                  className="p-1 rounded text-slate-400 hover:text-red-600 transition ml-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 bg-[#064E3B] hover:bg-[#04382A] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>লগইন</span>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#475569] hover:bg-[#F1F5F9]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#ECFDF5] text-[#064E3B] font-bold"
                    : "text-[#475569] hover:bg-[#F1F5F9]"
                }`}
              >
                <Icon className="w-4 h-4 text-[#064E3B]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
