// src/app/api/requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { getDb } from '@/lib/db';

// Lazy initialize Firebase Admin at import (okay, uses env available at build+runtime)
const admin = getFirebaseAdmin();

// Type definitions
type RequestData = {
  request_id: string;
  user_id: string;
  module_id: string;
  input_data: { text: string };
  status: string;
  created_at: string;
};

// ------------------ GET Handler ------------------
export async function GET(req: NextRequest) {
  try {
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Firebase Admin not initialized. Check environment variables.' },
        { status: 500 }
      );
    }

    // ✅ Lazy init DB here, not at module import time
    const pool = getDb();
    if (!pool) {
      return NextResponse.json(
        { success: false, error: 'Database not initialized. Check DATABASE_URL.' },
        { status: 500 }
      );
    }

    // Verify token
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Authorization token required' }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Fetch last 10 requests for this user
    const result = await pool.query(
      `SELECT request_id, module_id, input_data, status, created_at
       FROM requests
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [uid]
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (err: any) {
    console.error('📝 /api/requests (GET) error:', err);
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
      return NextResponse.json({ success: false, error: 'Authentication failed. Invalid or expired token' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ------------------ POST Handler ------------------
export async function POST(req: NextRequest) {
  try {
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Firebase Admin not initialized. Check environment variables.' },
        { status: 500 }
      );
    }

    // ✅ Lazy init DB here too
    const pool = getDb();
    if (!pool) {
      return NextResponse.json(
        { success: false, error: 'Database not initialized. Check DATABASE_URL.' },
        { status: 500 }
      );
    }

    // Verify token
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Authorization token required' }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Parse request body
    const body = await req.json();
    const { module_id, input_data } = body;
    if (!module_id || !input_data) {
      return NextResponse.json({ success: false, error: 'Missing required fields (module_id or input_data)' }, { status: 400 });
    }

    // Insert request into database
    await pool.query(
      `INSERT INTO requests (user_id, module_id, input_data)
       VALUES ($1, $2, $3)`,
      [uid, module_id, input_data]
    );

    return NextResponse.json({ success: true, message: 'Request submitted successfully' });
  } catch (err: any) {
    console.error('📝 /api/requests (POST) error:', err);

    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
      return NextResponse.json({ success: false, error: 'Authentication failed. Invalid or expired token' }, { status: 403 });
    }

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
