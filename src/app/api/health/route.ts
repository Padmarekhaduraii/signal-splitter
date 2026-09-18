import { NextResponse } from 'next/server';
import { getAIStatus } from '@/lib/ai/service';

export async function GET() {
  const status = getAIStatus();
  return NextResponse.json({
    status: 'ok',
    aiStatus: status,
    timestamp: new Date().toISOString(),
  });
}
