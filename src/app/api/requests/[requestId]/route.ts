import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import admin from '@/lib/firebaseAdmin';

// Type definitions for better type safety
type RequestData = {
  request_id: string;
  user_id: string;
  module_id: string;
  input_data: { text: string };
  status: string;
  created_at: string;
  result_table_ref: string;
};

type AnalysisResult = {
  request_id: string;
  assessed_level: string;
  word_count: number;
  grammar_score: number | null;
  analysis_pdf_url: string | null;
};

type ApiResponse = {
  requestId: string;
  moduleId: string;
  inputData: { text: string };
  status: string;
  createdAt: string;
  resultTableRef: string;
  analysis?: AnalysisResult;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    // 1. Verify authentication
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // 2. Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // 3. Parse request ID from params
    const { requestId } = params;
    if (!requestId) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // 4. Query database for the specific request
    const result = await pool.query(
      `SELECT request_id, user_id, module_id, input_data, status, created_at, result_table_ref
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

    const request: RequestData = result.rows[0];

    // 5. Fetch analysis results if table exists
    let analysis: AnalysisResult | undefined;
    try {
      if (request.result_table_ref) {
        const analysisResult = await pool.query(
          `SELECT * FROM ${request.result_table_ref} WHERE request_id = $1`,
          [requestId]
        );

        if (analysisResult.rows.length > 0) {
          const row = analysisResult.rows[0];
          analysis = {
            request_id: row.request_id,
            assessed_level: row.assessed_level || 'No Data available currently in the backend',
            word_count: row.word_count ?? 0,
            grammar_score: row.grammar_score ?? null,
            analysis_pdf_url: row.analysis_pdf_url ?? null,
          };
        }
      }
    } catch (err) {
      // Non-critical: Analysis might not exist yet
    }

    const response: ApiResponse = {
      requestId: request.request_id,
      moduleId: request.module_id,
      inputData: request.input_data,
      status: request.status,
      createdAt: request.created_at,
      resultTableRef: request.result_table_ref,
      ...(analysis && { analysis }),
    };

    return NextResponse.json({ success: true, data: response });

  } catch (err: any) {
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
      return NextResponse.json(
        { success: false, error: 'Authentication failed. Invalid or expired token' },
        { status: 403 }
      );
    }

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
