import { NextRequest, NextResponse } from 'next/server';
import { analyzeSourceDocument } from '@/lib/ai/service';
import { SourceType } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title = '', sourceType = 'Article', text = '' } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Source text is required and cannot be empty.' },
        { status: 400 }
      );
    }

    if (text.trim().split(/\s+/).length < 15) {
      return NextResponse.json(
        { error: 'Source text is too short. Please provide at least 15 words for a meaningful analysis.' },
        { status: 400 }
      );
    }

    const result = await analyzeSourceDocument(title, sourceType as SourceType, text);

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      isDemoMode: result.isDemoMode,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('API /api/analyze error:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
