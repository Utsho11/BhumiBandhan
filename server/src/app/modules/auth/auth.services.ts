import jwt from "jsonwebtoken";
import config from "../../../config";

export interface IUserProfile {
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

let mockUsers: (IUserProfile & { password: string })[] = [
  {
    id: "USR-001",
    nameBn: "তানভীর আহমেদ",
    nameEn: "Tanvir Ahmed",
    role: "citizen",
    email: "citizen@bhumibandhan.gov.bd",
    password: "password123",
    nidMasked: "1988-XXXX-XXXX-0192",
    phoneMasked: "01711-XXXX92",
    designationBn: "সাধারণ নাগরিক (জমি ক্রেতা/মালিক)",
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

export const registerUser = async (payload: {
  nameBn: string;
  nameEn?: string;
  email: string;
  password?: string;
  nid: string;
  phone: string;
}) => {
  const existing = mockUsers.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (existing) {
    throw new Error("এই ইমেইল ঠিকানা দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত রয়েছে।");
  }

  const newUser: IUserProfile & { password: string } = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    nameBn: payload.nameBn,
    nameEn: payload.nameEn || payload.nameBn,
    role: "citizen",
    email: payload.email,
    password: payload.password || "password123",
    nidMasked: payload.nid.slice(0, 4) + "-XXXX-XXXX-" + payload.nid.slice(-4),
    phoneMasked: payload.phone.slice(0, 5) + "-XXXX" + payload.phone.slice(-2),
    designationBn: "নিবন্ধিত নাগরিক",
  };

  mockUsers.push(newUser);

  const { password, ...userWithoutPassword } = newUser;
  const token = jwt.sign(userWithoutPassword, config.jwtSecret, { expiresIn: "7d" });

  return { user: userWithoutPassword, token };
};

export const loginUser = async (credentials: { email: string; password?: string; role?: string }) => {
  const user = mockUsers.find(
    (u) =>
      u.email.toLowerCase() === credentials.email.toLowerCase() ||
      (credentials.role && u.role === credentials.role)
  );

  if (!user) {
    const defaultCitizen: IUserProfile = {
      id: "DEMO-CITIZEN",
      nameBn: "ডেমো নাগরিক ব্যবহারকারী",
      nameEn: "Demo Citizen User",
      role: "citizen",
      email: credentials.email || "demo@citizen.bd",
      designationBn: "অতিথি নাগরিক",
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
