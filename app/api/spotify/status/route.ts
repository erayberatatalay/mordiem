import { NextResponse } from 'next/server';
import { getSpotifyToken } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const token = await getSpotifyToken();
    return NextResponse.json({ connected: !!token });
  } catch (error) {
    return NextResponse.json({ connected: false });
  }
}
