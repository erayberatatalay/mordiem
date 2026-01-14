import { NextRequest, NextResponse } from 'next/server';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackUri, playlistUri, episodeUri, showUri } = body;

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

    // Show (Podcast) çalma
    if (showUri) {
      const response = await spotifyApiRequest('/me/player/play', {
        method: 'PUT',
        body: JSON.stringify({
          context_uri: showUri,
        }),
      });

      if (response.status === 204 || response.ok) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Failed to play show' }, { status: response.status });
    }

    // Episode çalma
    if (episodeUri) {
      const response = await spotifyApiRequest('/me/player/play', {
        method: 'PUT',
        body: JSON.stringify({
          uris: [episodeUri],
        }),
      });

      if (response.status === 204 || response.ok) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Failed to play episode' }, { status: response.status });
    }

    if (!trackUri) {
      return NextResponse.json({ error: 'trackUri, playlistUri, episodeUri or showUri is required' }, { status: 400 });
    }

    // Tek şarkı çal - Spotify'ın autoplay özelliği benzer şarkılarla devam edecek
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
