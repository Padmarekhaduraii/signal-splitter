import { NextRequest, NextResponse } from 'next/server';
import { generateSinglePlatformContent } from '@/lib/ai/service';
import { BrandVoice, PlatformOutput, PlatformType, SourceAnalysis } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sourceTitle = '',
      sourceAnalysis,
      brandVoice,
      platforms = [],
    } = body as {
      sourceTitle: string;
      sourceText: string;
      sourceAnalysis: SourceAnalysis;
      brandVoice: BrandVoice;
      platforms: PlatformType[];
    };

    if (!sourceAnalysis || !sourceAnalysis.mainTopic) {
      return NextResponse.json(
        { error: 'Source analysis is required to generate platform-specific content.' },
        { status: 400 }
      );
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform must be selected for generation.' },
        { status: 400 }
      );
    }

    if (!brandVoice || !brandVoice.tone) {
      return NextResponse.json(
        { error: 'Brand voice settings are required.' },
        { status: 400 }
      );
    }

    const outputs: Partial<Record<PlatformType, PlatformOutput>> = {};
    let isDemoMode = false;

    // Generate content across all selected platforms
    const promises = platforms.map(async (platform) => {
      const result = await generateSinglePlatformContent(
        platform,
        sourceTitle,
        sourceAnalysis,
        brandVoice
      );
      if (result.isDemoMode) isDemoMode = true;
      outputs[platform] = result.output;
    });

    await Promise.all(promises);

    return NextResponse.json({
      success: true,
      outputs,
      isDemoMode,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('API /api/generate error:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
