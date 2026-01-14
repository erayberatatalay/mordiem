import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  noStore();
  
  try {
    const body = await request.json();
    const { trackUri, trackId, artistId } = body;

    if (!trackUri || !trackId) {
      return NextResponse.json({ error: 'trackUri and trackId are required' }, { status: 400 });
    }

    // 1. Önce benzer şarkıları getir (Recommendations API) - şarkı çalmadan önce
    const seedArtist = artistId || '';
    const seedTrack = trackId;
    
    let recommendedTracks: any[] = [];
    const recsResponse = await spotifyApiRequest(
      `/recommendations?seed_tracks=${seedTrack}${seedArtist ? `&seed_artists=${seedArtist}` : ''}&limit=20`
    );

    if (recsResponse.ok) {
      const recsData = await recsResponse.json();
      recommendedTracks = recsData.tracks || [];
    }

    // 2. Tüm şarkıları bir array olarak hazırla (seçilen şarkı + önerilenler)
    const allTrackUris = [trackUri];
    if (recommendedTracks.length > 0) {
      allTrackUris.push(...recommendedTracks.slice(0, 19).map(t => t.uri));
    }

    // 3. Tüm şarkıları bir context olarak çal (bu şekilde next butonu çalışır)
    const playResponse = await spotifyApiRequest('/me/player/play', {
      method: 'PUT',
      body: JSON.stringify({
        uris: allTrackUris,
        offset: { uri: trackUri }, // Seçilen şarkıdan başla
      }),
    });

    if (playResponse.status !== 204 && !playResponse.ok) {
      // Aktif cihaz yoksa
      if (playResponse.status === 404) {
        return NextResponse.json({ error: 'No active device' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to play track' }, { status: playResponse.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error playing with queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
