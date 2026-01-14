import { NextRequest, NextResponse } from 'next/server';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { play } = body;

    const endpoint = play ? '/me/player/play' : '/me/player/pause';
    const response = await spotifyApiRequest(endpoint, {
      method: 'PUT',
    });

    // 204 başarılı demek, 200-299 arası da başarılı
    if (response.status === 204 || response.ok) {
      return NextResponse.json({ success: true });
    }

    // Hata durumlarını kontrol et
    const errorData = await response.text();
    console.error('Spotify play/pause error:', response.status, errorData);
    
    if (response.status === 404) {
      return NextResponse.json({ error: 'No active device found' }, { status: 404 });
    }
    
    if (response.status === 403) {
      return NextResponse.json({ error: 'Premium required or restricted' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to control playback' }, { status: response.status });
  } catch (error) {
    console.error('Error controlling playback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
