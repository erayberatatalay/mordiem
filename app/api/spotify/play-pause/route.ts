import { NextRequest, NextResponse } from 'next/server';
import { spotifyApiRequest } from '@/lib/spotify';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { play } = body;

    const endpoint = play ? '/me/player/play' : '/me/player/pause';
    const response = await spotifyApiRequest(endpoint, {
      method: 'PUT',
    });

    if (!response.ok && response.status !== 204) {
      return NextResponse.json({ error: 'Failed to control playback' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error controlling playback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
