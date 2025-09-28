// /api/users/route.ts
import admin from '@/lib/firebaseAdmin';
import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Read ID token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }
    const idToken = authHeader.split(' ')[1];

    // 2️⃣ Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email; // Could be null for phone-only accounts

    if (!email) {
      return NextResponse.json(
        { error: 'User email not found in token. Please ensure your account has a valid email address.' },
        { status: 400 }
      );
    }

    // 3️⃣ Parse optional body data (e.g., phone)
    const body = await req.json();
    const phone = body.phone || null;

    // 4️⃣ UPSERT user in PostgreSQL
    const result = await pool.query(
      `INSERT INTO users (user_id, email, phone)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id)
       DO UPDATE SET 
         email = EXCLUDED.email,
         phone = COALESCE(EXCLUDED.phone, users.phone),
         last_login = CURRENT_TIMESTAMP
       RETURNING user_id, email, phone, account_status, quota_limit_english, quota_used_english`,
      [uid, email, phone]
    );

    // 5️⃣ Return user object
    return NextResponse.json({ success: true, user: result.rows[0] });
  } catch (err: any) {

    // Specific Firebase token errors
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
      return NextResponse.json(
        { error: 'Authentication failed. Please log in again.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
