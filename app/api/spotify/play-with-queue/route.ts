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

    // 1. Önce seçilen şarkıyı çal
    const playResponse = await spotifyApiRequest('/me/player/play', {
      method: 'PUT',
      body: JSON.stringify({
        uris: [trackUri],
      }),
    });

    if (playResponse.status !== 204 && !playResponse.ok) {
      // Aktif cihaz yoksa
      if (playResponse.status === 404) {
        return NextResponse.json({ error: 'No active device' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to play track' }, { status: playResponse.status });
    }

    // 2. Benzer şarkıları getir (Recommendations API)
    const seedArtist = artistId || '';
    const seedTrack = trackId;
    
    const recsResponse = await spotifyApiRequest(
      `/recommendations?seed_tracks=${seedTrack}${seedArtist ? `&seed_artists=${seedArtist}` : ''}&limit=20`
    );

    if (recsResponse.ok) {
      const recsData = await recsResponse.json();
      const recommendedTracks = recsData.tracks || [];

      // 3. Önerilen şarkıları queue'ya ekle
      for (const track of recommendedTracks.slice(0, 15)) {
        try {
          await spotifyApiRequest(`/me/player/queue?uri=${encodeURIComponent(track.uri)}`, {
            method: 'POST',
          });
          // Rate limiting için küçük bir bekleme
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
          console.error('Error adding to queue:', err);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error playing with queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
