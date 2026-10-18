"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface IUser {
  id: string;
  nameBn: string;
  nameEn: string;
  role: "citizen" | "ac_land" | "sub_registrar" | "bank_officer" | "admin";
  email: string;
  nidMasked?: string;
  phoneMasked?: string;
  officeBn?: string;
  designationBn?: string;
}

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  quickLogin: (role: IUser["role"]) => Promise<void>;
  register: (payload: { nameBn: string; email: string; nid: string; phone: string; password?: string }) => Promise<boolean>;
  logout: () => void;
}

export const DEMO_USERS: Record<IUser["role"], IUser> = {
  citizen: {
    id: "USR-001",
    nameBn: "তানভীর আহমেদ",
    nameEn: "Tanvir Ahmed",
    role: "citizen",
    email: "citizen@bhumibandhan.gov.bd",
    nidMasked: "1988-XXXX-XXXX-0192",
    phoneMasked: "01711-XXXX92",
    designationBn: "সাধারণ নাগরিক (জমি ক্রেতা)",
  },
  ac_land: {
    id: "USR-002",
    nameBn: "জনাব মাহমুদ হাসান",
    nameEn: "Mr. Mahmud Hasan",
    role: "ac_land",
    email: "acland@bhumibandhan.gov.bd",
    officeBn: "সাভার উপজেলা ভূমি অফিস",
    designationBn: "সহকারী কমিশনার (ভূমি) / এসি ল্যান্ড",
  },
  sub_registrar: {
    id: "USR-003",
    nameBn: "জনাব রফিকুল আলম",
    nameEn: "Mr. Rafiqul Alam",
    role: "sub_registrar",
    email: "subreg@bhumibandhan.gov.bd",
    officeBn: "সাভার সাব-রেজিস্ট্রার কার্যালয়",
    designationBn: "সাব-রেজিস্ট্রার",
  },
  bank_officer: {
    id: "USR-004",
    nameBn: "ফারহানা ইয়াসমিন",
    nameEn: "Farhana Yasmin",
    role: "bank_officer",
    email: "bank@bhumibandhan.gov.bd",
    officeBn: "সোনালী ব্যাংক পিএলসি, সাভার শাখা",
    designationBn: "সিনিয়র প্রিন্সিপাল অফিসার (ক্রেডিট)",
  },
  admin: {
    id: "USR-005",
    nameBn: "সিস্টেম অ্যাডমিনিস্ট্রেটর",
    nameEn: "System Administrator",
    role: "admin",
    email: "admin@bhumibandhan.gov.bd",
    officeBn: "ভূমি ব্যবস্থাপনা অটোমেশন সেল (ভূমি মন্ত্রণালয়)",
    designationBn: "প্রধান সিস্টেম অ্যানালিস্ট",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("bhumibandhan_user");
      const storedToken = localStorage.getItem("bhumibandhan_token");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        // Default guest or citizen session for smooth hackathon demo
        setUser(DEMO_USERS.citizen);
        setToken("demo_citizen_token_2026");
      }
    } catch (e) {
      console.warn("Storage access failed", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      // Find matching demo user or send to backend
      const found = Object.values(DEMO_USERS).find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      const activeUser = found || {
        id: `USR-${Date.now().toString().slice(-4)}`,
        nameBn: email.split("@")[0],
        nameEn: email.split("@")[0],
        role: "citizen" as const,
        email,
        designationBn: "নিবন্ধিত নাগরিক",
      };

      const demoToken = `jwt_token_${activeUser.role}_${Date.now()}`;
      setUser(activeUser);
      setToken(demoToken);
      localStorage.setItem("bhumibandhan_user", JSON.stringify(activeUser));
      localStorage.setItem("bhumibandhan_token", demoToken);
      return true;
    } catch {
      return false;
    }
  };

  const quickLogin = async (role: IUser["role"]) => {
    const selectedUser = DEMO_USERS[role];
    const demoToken = `jwt_token_${role}_${Date.now()}`;
    setUser(selectedUser);
    setToken(demoToken);
    localStorage.setItem("bhumibandhan_user", JSON.stringify(selectedUser));
    localStorage.setItem("bhumibandhan_token", demoToken);

    if (role === "ac_land" || role === "sub_registrar" || role === "admin") {
      router.push("/admin");
    } else if (role === "bank_officer") {
      router.push("/bank-lien");
    } else {
      router.push("/");
    }
  };

  const register = async (payload: {
    nameBn: string;
    email: string;
    nid: string;
    phone: string;
    password?: string;
  }): Promise<boolean> => {
    const newUser: IUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      nameBn: payload.nameBn,
      nameEn: payload.nameBn,
      role: "citizen",
      email: payload.email,
      nidMasked: payload.nid.slice(0, 4) + "-XXXX-XXXX-" + payload.nid.slice(-4),
      phoneMasked: payload.phone.slice(0, 5) + "-XXXX" + payload.phone.slice(-2),
      designationBn: "নিবন্ধিত নাগরিক",
    };

    const demoToken = `jwt_token_citizen_${Date.now()}`;
    setUser(newUser);
    setToken(demoToken);
    localStorage.setItem("bhumibandhan_user", JSON.stringify(newUser));
    localStorage.setItem("bhumibandhan_token", demoToken);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bhumibandhan_user");
    localStorage.removeItem("bhumibandhan_token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
