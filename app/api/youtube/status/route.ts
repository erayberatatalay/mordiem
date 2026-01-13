import { NextResponse } from 'next/server';
import { getYoutubeToken } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const token = await getYoutubeToken();
    return NextResponse.json({ connected: !!token });
  } catch (error) {
    return NextResponse.json({ connected: false });
  }
}
