import { NextResponse } from 'next/server';
import { spotifyApiRequest } from '@/lib/spotify';

export async function POST() {
  try {
    const response = await spotifyApiRequest('/me/player/next', {
      method: 'POST',
    });

    if (!response.ok && response.status !== 204) {
      return NextResponse.json({ error: 'Failed to skip to next' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error skipping to next:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
