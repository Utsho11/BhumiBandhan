import jwt from "jsonwebtoken";
import config from "../../../config";
import { pool } from "../../../utils/pg";

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
  const nidMasked = payload.nid.slice(0, 4) + "-XXXX-XXXX-" + payload.nid.slice(-4);
  const phoneMasked = payload.phone.slice(0, 5) + "-XXXX" + payload.phone.slice(-2);
  const newId = `USR-${Date.now().toString().slice(-5)}`;

  try {
    await pool.query(
      `INSERT INTO users (id, name_bn, name_en, email, password, role, nid_masked, phone_masked, designation_bn)
       VALUES ($1, $2, $3, $4, $5, 'citizen', $6, $7, 'নিবন্ধিত নাগরিক')
       ON CONFLICT (email) DO NOTHING;`,
      [newId, payload.nameBn, payload.nameEn || payload.nameBn, payload.email, payload.password || "password123", nidMasked, phoneMasked]
    );
  } catch (error) {
    console.warn("DB user insert fallback:", error);
  }

  const newUser: IUserProfile = {
    id: newId,
    nameBn: payload.nameBn,
    nameEn: payload.nameEn || payload.nameBn,
    role: "citizen",
    email: payload.email,
    nidMasked,
    phoneMasked,
    designationBn: "নিবন্ধিত নাগরিক",
  };

  mockUsers.push({ ...newUser, password: payload.password || "password123" });
  const token = jwt.sign(newUser, config.jwtSecret, { expiresIn: "7d" });
  return { user: newUser, token };
};

export const loginUser = async (credentials: { email: string; password?: string; role?: string }) => {
  try {
    const res = await pool.query(
      "SELECT id, name_bn, name_en, email, role, nid_masked, phone_masked, office_bn, designation_bn FROM users WHERE email ILIKE $1 OR role = $2 LIMIT 1;",
      [credentials.email, credentials.role || ""]
    );
    if (res.rows.length > 0) {
      const dbUser = res.rows[0];
      const userObj: IUserProfile = {
        id: dbUser.id,
        nameBn: dbUser.name_bn,
        nameEn: dbUser.name_en || dbUser.name_bn,
        role: dbUser.role,
        email: dbUser.email,
        nidMasked: dbUser.nid_masked,
        phoneMasked: dbUser.phone_masked,
        officeBn: dbUser.office_bn,
        designationBn: dbUser.designation_bn,
      };
      const token = jwt.sign(userObj, config.jwtSecret, { expiresIn: "7d" });
      return { user: userObj, token };
    }
  } catch (error) {
    console.warn("DB user login fallback:", error);
  }

  const user = mockUsers.find(
    (u) =>
      u.email.toLowerCase() === credentials.email.toLowerCase() ||
      (credentials.role && u.role === credentials.role)
  );

  if (!user) {
    const defaultCitizen: IUserProfile = {
      id: "DEMO-CITIZEN",
      nameBn: "তানভীর আহমেদ (নাগরিক)",
      nameEn: "Tanvir Ahmed",
      role: "citizen",
      email: credentials.email || "demo@citizen.bd",
      designationBn: "অতিথি নাগরিক",
    };
    const token = jwt.sign(defaultCitizen, config.jwtSecret, { expiresIn: "7d" });
    return { user: defaultCitizen, token };
  }

  const { password, ...userWithoutPassword } = user;
  const token = jwt.sign(userWithoutPassword, config.jwtSecret, { expiresIn: "7d" });
  return { user: userWithoutPassword, token };
};

export const getAvailableDemoAccounts = async () => {
  try {
    const res = await pool.query("SELECT id, name_bn, name_en, email, role, office_bn, designation_bn FROM users;");
    if (res.rows.length > 0) {
      return res.rows.map((r) => ({
        id: r.id,
        nameBn: r.name_bn,
        nameEn: r.name_en,
        email: r.email,
        role: r.role,
        officeBn: r.office_bn,
        designationBn: r.designation_bn,
      }));
    }
  } catch (error) {
    console.warn("DB accounts fallback:", error);
  }
  return mockUsers.map(({ password, ...rest }) => rest);
};
