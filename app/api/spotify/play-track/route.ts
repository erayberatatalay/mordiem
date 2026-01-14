import { NextRequest, NextResponse } from 'next/server';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackUri, contextUri, playlistUri } = body;

    // Playlist çalma
    if (playlistUri) {
      const response = await spotifyApiRequest('/me/player/play', {
        method: 'PUT',
        body: JSON.stringify({
          context_uri: playlistUri,
        }),
      });

      if (response.status === 204 || response.ok) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Failed to play playlist' }, { status: response.status });
    }

    if (!trackUri) {
      return NextResponse.json({ error: 'trackUri or playlistUri is required' }, { status: 400 });
    }

    // Eğer context (albüm) varsa, albüm içinde o şarkıdan başlat
    if (contextUri) {
      const response = await spotifyApiRequest('/me/player/play', {
        method: 'PUT',
        body: JSON.stringify({
          context_uri: contextUri,
          offset: { uri: trackUri },
        }),
      });

      if (response.status === 204 || response.ok) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Failed to play track in context' }, { status: response.status });
    }

    // Context yoksa queue'ya ekle ve çal
    // Önce şarkıyı queue'ya ekle
    const queueResponse = await spotifyApiRequest(`/me/player/queue?uri=${encodeURIComponent(trackUri)}`, {
      method: 'POST',
    });

    if (queueResponse.status === 204 || queueResponse.ok) {
      // Sonra sonraki şarkıya geç (queue'daki şarkıyı çal)
      const skipResponse = await spotifyApiRequest('/me/player/next', {
        method: 'POST',
      });
      
      if (skipResponse.status === 204 || skipResponse.ok) {
        return NextResponse.json({ success: true });
      }
    }

    // Queue çalışmazsa direkt çal
    const response = await spotifyApiRequest('/me/player/play', {
      method: 'PUT',
      body: JSON.stringify({
        uris: [trackUri],
      }),
    });

    if (response.status === 204 || response.ok) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to play track' }, { status: response.status });
  } catch (error) {
    console.error('Error playing track:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
