import jwt from "jsonwebtoken";
import config from "../../../config";

export interface IUserProfile {
  id: string;
  nameBn: string;
  nameEn: string;
  role: "citizen" | "ac_land" | "sub_registrar" | "bank_officer" | "admin";
  email: string;
  officeBn?: string;
  designationBn?: string;
}

const mockUsers: (IUserProfile & { password: string })[] = [
  {
    id: "USR-001",
    nameBn: "তানভীর আহমেদ (নাগরিক)",
    nameEn: "Tanvir Ahmed",
    role: "citizen",
    email: "citizen@bhumibandhan.gov.bd",
    password: "password123",
  },
  {
    id: "USR-002",
    nameBn: "জনাব মাহমুদ হাসান",
    nameEn: "Mr. Mahmud Hasan",
    role: "ac_land",
    email: "acland@bhumibandhan.gov.bd",
    password: "password123",
    officeBn: "সাভার উপজেলা ভূমি অফিস",
    designationBn: "সহকারী কমিশনার (ভূমি) / এসি ল্যান্ড",
  },
  {
    id: "USR-003",
    nameBn: "জনাব রফিকুল আলম",
    nameEn: "Mr. Rafiqul Alam",
    role: "sub_registrar",
    email: "subreg@bhumibandhan.gov.bd",
    password: "password123",
    officeBn: "সাভার সাব-রেজিস্ট্রার কার্যালয়",
    designationBn: "সাব-রেজিস্ট্রার",
  },
  {
    id: "USR-004",
    nameBn: "ফারহানা ইয়াসমিন",
    nameEn: "Farhana Yasmin",
    role: "bank_officer",
    email: "bank@bhumibandhan.gov.bd",
    password: "password123",
    officeBn: "সোনালী ব্যাংক পিএলসি, সাভার শাখা",
    designationBn: "সিনিয়র প্রিন্সিপাল অফিসার (ক্রেডিট)",
  },
  {
    id: "USR-005",
    nameBn: "সিস্টেম অ্যাডমিনিস্ট্রেটর",
    nameEn: "System Administrator",
    role: "admin",
    email: "admin@bhumibandhan.gov.bd",
    password: "password123",
    officeBn: "ভূমি ব্যবস্থাপনা অটোমেশন সেল (ভূমি মন্ত্রণালয়)",
    designationBn: "প্রধান সিস্টেম অ্যানালিস্ট",
  },
];

export const loginUser = async (credentials: { email: string; password?: string; role?: string }) => {
  const user = mockUsers.find(
    (u) =>
      u.email.toLowerCase() === credentials.email.toLowerCase() ||
      (credentials.role && u.role === credentials.role)
  );

  if (!user) {
    // Return default citizen profile for instant seamless demo without password friction
    const defaultCitizen: IUserProfile = {
      id: "DEMO-CITIZEN",
      nameBn: "ডেমো নাগরিক ব্যবহারকারী",
      nameEn: "Demo Citizen User",
      role: "citizen",
      email: credentials.email || "demo@citizen.bd",
    };
    const token = jwt.sign(defaultCitizen, config.jwtSecret, { expiresIn: "7d" });
    return { user: defaultCitizen, token };
  }

  const { password, ...userWithoutPassword } = user;
  const token = jwt.sign(userWithoutPassword, config.jwtSecret, { expiresIn: "7d" });

  return {
    user: userWithoutPassword,
    token,
  };
};

export const getAvailableDemoAccounts = async () => {
  return mockUsers.map(({ password, ...rest }) => rest);
};
