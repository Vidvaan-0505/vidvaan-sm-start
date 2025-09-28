// src/app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { getDb } from '@/lib/db';

// Lazy initialization of Firebase Admin
const admin = getFirebaseAdmin();

// TypeScript type for user response
type UserResponse = {
  user_id: string;
  email: string;
  phone: string | null;
  account_status: string;
  quota_limit_english: number;
  quota_used_english: number;
};

export async function POST(req: NextRequest) {
  try {
    const pool = getDb(); // ✅ init inside handler

    // 0️⃣ Check that admin & pool exist
    if (!admin || !pool) {
      console.warn('Firebase Admin or PostgreSQL pool not initialized.');
      return NextResponse.json(
        { error: 'Server not properly initialized. Check environment variables.' },
        { status: 500 }
      );
    }

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
    const email = decodedToken.email;

    if (!email) {
      return NextResponse.json(
        { error: 'User email not found in token. Please ensure your account has a valid email.' },
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
    return NextResponse.json({ success: true, user: result.rows[0] as UserResponse });
  } catch (err: any) {
    console.error('📝 /api/users POST error:', err);

    // Firebase token errors
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
