import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { verifyIdToken } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    // Connect to emulators in development (temporarily disabled)
    // Uncomment when emulators are running
    // ...(process.env.NODE_ENV === 'development' && {
    //   projectId: 'demo-project',
    //   databaseURL: 'http://localhost:8080?project=demo-project'
    // })
  });
}

// PostgreSQL connection (you'll need to install pg package)
// npm install pg @types/pg
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Helper function to save request with specific status
async function saveRequestWithStatus(
  userId: string, 
  userEmail: string, 
  text: string, 
  requestId: string, 
  timestamp: string, 
  status: 'yes' | 'no' | 'quota_exceeded' | 'failed'
) {
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  const avgWordLength = text.replace(/[^a-zA-Z]/g, '').length / wordCount || 0;
  
  const query = `
    INSERT INTO english_assessments (
      user_id, 
      user_email, 
      submitted_text, 
      word_count, 
      sentence_count, 
      average_word_length, 
      assessed_level, 
      request_id,
      client_timestamp,
      request_processed,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
    RETURNING id
  `;

  const values = [
    userId,
    userEmail,
    text,
    wordCount,
    sentenceCount,
    avgWordLength.toFixed(2),
    'Pending', // Will be updated by listener
    requestId,
    timestamp,
    status
  ];

  return await pool.query(query, values);
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase token
    let decodedToken;
    try {
      decodedToken = await verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { text, userId, userEmail, requestId, timestamp } = await request.json();

    if (!text || !userId || !userEmail || !requestId || !timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Basic text analysis (you can enhance this with more sophisticated NLP)
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    const avgWordLength = text.replace(/[^a-zA-Z]/g, '').length / wordCount || 0;
    
    // Simple English level assessment based on text characteristics
    let englishLevel = 'Beginner';
    if (avgWordLength > 5 && wordCount > 50) {
      englishLevel = 'Advanced';
    } else if (avgWordLength > 4 && wordCount > 30) {
      englishLevel = 'Intermediate';
    }

    // Save to PostgreSQL with 'no' status (will be processed by listener later)
    const result = await saveRequestWithStatus(userId, userEmail, text, requestId, timestamp, 'no');

    return NextResponse.json({
      success: true,
      assessmentId: result.rows[0].id,
      requestId: requestId,
      message: 'Text submitted successfully. Processing will be done by background listener.',
      timestamps: {
        client: timestamp,
        server: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in evaluate_english_levels:', error);
    
    // Try to save the failed request if we have the data
    try {
      const { text, userId, userEmail, requestId, timestamp } = await request.json();
      if (text && userId && userEmail && requestId && timestamp) {
        await saveRequestWithStatus(userId, userEmail, text, requestId, timestamp, 'failed');
      }
    } catch (saveError) {
      console.error('Failed to save error record:', saveError);
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 