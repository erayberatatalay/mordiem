import { NextResponse } from 'next/server';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const response = await spotifyApiRequest('/me/player/currently-playing');
    
    if (response.status === 204) {
      // Hiçbir şey çalmıyor
      return new NextResponse(JSON.stringify(null), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    if (!response.ok) {
      console.error('Spotify API error:', response.status);
      return NextResponse.json({ error: 'Failed to fetch current track' }, { status: response.status });
    }

    const data = await response.json();
    
    return new NextResponse(JSON.stringify({
      item: data.item,
      is_playing: data.is_playing || false,
      progress_ms: data.progress_ms || 0,
      duration_ms: data.item?.duration_ms || 0,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching current track:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
