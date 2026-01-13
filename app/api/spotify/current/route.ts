import { NextResponse } from 'next/server';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await spotifyApiRequest('/me/player/currently-playing');
    
    if (response.status === 204) {
      return NextResponse.json(null);
    }

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch current track' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      item: data.item,
      is_playing: data.is_playing || false,
    });
  } catch (error) {
    console.error('Error fetching current track:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
