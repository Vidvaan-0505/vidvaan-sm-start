import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, userId, userEmail, requestId, timestamp } = await request.json();

    if (!text || !userId || !userEmail || !requestId || !timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Basic text analysis (you can enhance this with more sophisticated NLP)
    const wordCount = text.split(/\s+/).filter((word: string) => word.length > 0).length;
    const sentenceCount = text.split(/[.!?]+/).filter((sentence: string) => sentence.trim().length > 0).length;
    const avgWordLength = text.replace(/[^a-zA-Z]/g, '').length / wordCount || 0;
    
    // Simple English level assessment based on text characteristics
    let englishLevel = 'Beginner';
    if (avgWordLength > 5 && wordCount > 50) {
      englishLevel = 'Advanced';
    } else if (avgWordLength > 4 && wordCount > 30) {
      englishLevel = 'Intermediate';
    }

    // Simulate database save (without actually saving)
    const assessmentId = Math.floor(Math.random() * 10000);

    return NextResponse.json({
      success: true,
      assessmentId: assessmentId,
      requestId: requestId,
      englishLevel: englishLevel,
      analysis: {
        wordCount,
        sentenceCount,
        averageWordLength: avgWordLength.toFixed(2)
      },
      message: 'Text analyzed successfully (simulated database save)',
      timestamps: {
        client: timestamp,
        server: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in evaluate_english_levels_simple:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 