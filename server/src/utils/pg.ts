import { Pool } from "pg";
import config from "../config";

const isLocalDatabase =
  /@(localhost|127\.0\.0\.1|\[::1\])/i.test(config.databaseUrl) ||
  process.env.DB_SSL === "false";

const ssl = isLocalDatabase ? false : { rejectUnauthorized: false };

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl,
  max: 10,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});
