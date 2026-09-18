import { NextRequest, NextResponse } from 'next/server';
import { generateSinglePlatformContent } from '@/lib/ai/service';
import { BrandVoice, PlatformType, SourceAnalysis } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      platform,
      sourceTitle = '',
      sourceAnalysis,
      brandVoice,
      customInstructions = '',
    } = body as {
      platform: PlatformType;
      sourceTitle: string;
      sourceAnalysis: SourceAnalysis;
      brandVoice: BrandVoice;
      currentContent?: string;
      customInstructions?: string;
    };

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform identifier is required for regeneration.' },
        { status: 400 }
      );
    }

    if (!sourceAnalysis) {
      return NextResponse.json(
        { error: 'Source analysis is required for regeneration.' },
        { status: 400 }
      );
    }

    const result = await generateSinglePlatformContent(
      platform,
      sourceTitle,
      sourceAnalysis,
      brandVoice,
      customInstructions
    );

    return NextResponse.json({
      success: true,
      platform,
      output: result.output,
      isDemoMode: result.isDemoMode,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('API /api/regenerate error:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
