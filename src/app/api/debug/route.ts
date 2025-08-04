import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables (without exposing sensitive data)
    const envCheck = {
      hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasFirebaseClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasFirebasePrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      hasDbUser: !!process.env.DB_USER,
      hasDbHost: !!process.env.DB_HOST,
      hasDbName: !!process.env.DB_NAME,
      hasDbPassword: !!process.env.DB_PASSWORD,
      hasDbPort: !!process.env.DB_PORT,
      nodeEnv: process.env.NODE_ENV,
    };

    return NextResponse.json({
      success: true,
      message: 'Debug information',
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Debug API failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 