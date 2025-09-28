import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import admin from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    // 1. Verify token
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Authorization token required' }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // 2. Fetch last 10 requests including input_data
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

export async function POST(req: NextRequest) {
  try {
    // 1. Verify token
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Authorization token required' }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // 2. Parse body
    const { module_id, input_data } = await req.json();
    if (!module_id || !input_data) {
      return NextResponse.json({ success: false, error: 'Missing required fields (module_id or input_data)' }, { status: 400 });
    }

    // 3. Insert new request
    await pool.query(
      `INSERT INTO requests (user_id, module_id, input_data, result_table_ref)
       VALUES ($1, $2, $3, $4)`,
      [uid, module_id, input_data, `${module_id.toLowerCase()}_results`]
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
