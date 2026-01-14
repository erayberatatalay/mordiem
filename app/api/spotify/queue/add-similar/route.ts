import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  noStore();
  
  try {
    const body = await request.json();
    const { trackId, artistId } = body;

    if (!trackId) {
      return NextResponse.json({ error: 'trackId is required' }, { status: 400 });
    }

    // Benzer şarkıları getir
    const seedArtist = artistId || '';
    const seedTrack = trackId;
    
    const recsResponse = await spotifyApiRequest(
      `/recommendations?seed_tracks=${seedTrack}${seedArtist ? `&seed_artists=${seedArtist}` : ''}&limit=10`
    );

    if (!recsResponse.ok) {
      return NextResponse.json({ error: 'Failed to get recommendations' }, { status: recsResponse.status });
    }

    const recsData = await recsResponse.json();
    const recommendedTracks = recsData.tracks || [];

    // Önerilen şarkıları queue'ya ekle
    let addedCount = 0;
    for (const track of recommendedTracks.slice(0, 10)) {
      try {
        const queueResponse = await spotifyApiRequest(`/me/player/queue?uri=${encodeURIComponent(track.uri)}`, {
          method: 'POST',
        });
        
        if (queueResponse.status === 204 || queueResponse.status === 202 || queueResponse.ok) {
          addedCount++;
        }
        
        // Rate limiting için küçük bir bekleme
        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (err) {
        console.error(`Error adding ${track.name} to queue:`, err);
      }
    }

    return NextResponse.json({ success: true, added: addedCount });
  } catch (error) {
    console.error('Error adding similar tracks to queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
