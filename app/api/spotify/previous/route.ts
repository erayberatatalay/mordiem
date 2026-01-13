import { NextResponse } from 'next/server';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const response = await spotifyApiRequest('/me/player/previous', {
      method: 'POST',
    });

    if (!response.ok && response.status !== 204) {
      return NextResponse.json({ error: 'Failed to skip to previous' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error skipping to previous:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
