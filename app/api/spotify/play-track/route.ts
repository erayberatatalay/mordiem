import { NextRequest, NextResponse } from 'next/server';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackUri } = body;

    if (!trackUri) {
      return NextResponse.json({ error: 'trackUri is required' }, { status: 400 });
    }

    const response = await spotifyApiRequest('/me/player/play', {
      method: 'PUT',
      body: JSON.stringify({
        uris: [trackUri],
      }),
    });

    if (!response.ok && response.status !== 204) {
      return NextResponse.json({ error: 'Failed to play track' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error playing track:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
