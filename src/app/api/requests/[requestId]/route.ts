// src/app/api/requests/[requestId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { getDb } from '@/lib/db';

// Lazy initialize Firebase Admin
const admin = getFirebaseAdmin();

type RequestData = {
  request_id: string;
  user_id: string;
  module_id: string;
  input_data: { text: string };
  status: string;
  created_at: string;
};

type ApiResponse = {
  requestId: string;
  moduleId: string;
  inputData: { text: string };
  status: string;
  createdAt: string;
};

export async function GET(req: NextRequest, context: any) {
  // Lazy initialize DB inside handler
  const pool = getDb();

  const requestId = context?.params?.requestId;

  if (!requestId) {
    return NextResponse.json(
      { success: false, error: 'Request ID is required' },
      { status: 400 }
    );
  }

  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Firebase Admin not initialized' },
      { status: 500 }
    );
  }

  try {
    // 🔐 Authentication
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // 🗄️ Fetch request from DB
    const result = await pool.query<RequestData>(
      `SELECT request_id, user_id, module_id, input_data, status, created_at
       FROM requests
       WHERE request_id = $1 AND user_id = $2`,
      [requestId, uid]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Request not found or access denied' },
        { status: 404 }
      );
    }

    const request = result.rows[0];

    const response: ApiResponse = {
      requestId: request.request_id,
      moduleId: request.module_id,
      inputData: request.input_data,
      status: request.status,
      createdAt: request.created_at,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (err: any) {
    console.error('📝 /api/requests/[requestId] error:', err);

    // Firebase token errors
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
      return NextResponse.json(
        { success: false, error: 'Authentication failed. Invalid or expired token' },
        { status: 403 }
      );
    }

    // PostgreSQL invalid UUID
    if (err.code === '22P02') {
      return NextResponse.json(
        { success: false, error: 'Invalid request ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
