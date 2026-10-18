import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const rawDbUrl = (process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, "");
const neonDbUrl = "postgresql://neondb_owner:npg_laNY5swH2iqA@ep-fancy-cell-ao73a2mw-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

export default {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  jwtSecret: (process.env.JWT_SECRET || "bhumibandhan_secure_jwt_secret_token_2026").trim().replace(/^["']|["']$/g, ""),
  clientUrl: (process.env.CLIENT_URL || "https://frontend-nine-xi-36.vercel.app").trim().replace(/^["']|["']$/g, ""),
  databaseUrl: rawDbUrl || neonDbUrl,
};
