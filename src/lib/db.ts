// src/lib/firebaseAdmin.ts


import pkg from 'pg';
const { Pool } = pkg;

if (!process.env.PG_USER || !process.env.PG_HOST || !process.env.PG_DATABASE || !process.env.PG_PASSWORD || !process.env.PG_PORT) {
  throw new Error('Database environment variables are missing. Please check .env.local');
}

export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10),
  ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10, // optional: max connections
});
