import app from "../src/app";
import { initDatabase } from "../src/utils/initDb";

let dbInitialized = false;

export default async function handler(req: any, res: any) {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (err: any) {
      console.warn("DB init warning on serverless function:", err?.message || err);
    }
  }
  return app(req, res);
}
