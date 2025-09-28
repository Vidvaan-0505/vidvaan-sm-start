// src/lib/db.ts


import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Please check .env.local');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // or { rejectUnauthorized: false } if needed
  max: 10,
});
