import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;

    // Mock text analysis result
    const mockAnalysisResult = {
      requestId: requestId,
      analysis: {
        overallLevel: 'Intermediate',
        vocabularyScore: 7.5,
        grammarScore: 8.0,
        fluencyScore: 6.5,
        suggestions: [
          'Work on expanding your vocabulary with more advanced words',
          'Practice using complex sentence structures',
          'Focus on improving sentence flow and transitions'
        ],
        strengths: [
          'Good basic grammar usage',
          'Clear communication of ideas',
          'Appropriate word choice for most contexts'
        ]
      },
      timestamp: new Date().toISOString()
    };

    // Return mock analysis as JSON
    return NextResponse.json(mockAnalysisResult, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    );
  }
}
