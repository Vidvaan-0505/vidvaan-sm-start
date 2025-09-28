// src/lib/db.ts
import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDb(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      // 🚨 Don't crash at build time, just warn
      console.warn(
        "⚠️ DATABASE_URL is missing. Pool not initialized. " +
        "This is expected during build, but must be set at runtime."
      );
      throw new Error("Database connection attempted without DATABASE_URL.");
    }

    pool = new Pool({ connectionString });
    console.log("✅ PostgreSQL pool initialized");
  }

  return pool;
}
