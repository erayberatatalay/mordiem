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

    // 2. Seçilen şarkıyı çal
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

    // 3. Şarkı çalmaya başladıktan sonra kısa bir bekleme (player hazır olsun)
    await new Promise(resolve => setTimeout(resolve, 300));

    // 4. Önerilen şarkıları queue'ya ekle
    if (recommendedTracks.length > 0) {
      const tracksToAdd = recommendedTracks.slice(0, 20);
      let addedCount = 0;

      // İlk 5 şarkıyı hemen ekle (next butonu için hazır olsun)
      for (let i = 0; i < Math.min(5, tracksToAdd.length); i++) {
        const track = tracksToAdd[i];
        try {
          const queueResponse = await spotifyApiRequest(`/me/player/queue?uri=${encodeURIComponent(track.uri)}`, {
            method: 'POST',
          });
          
          if (queueResponse.status === 204 || queueResponse.status === 202 || queueResponse.ok) {
            addedCount++;
          } else {
            console.error(`Queue ekleme başarısız (${queueResponse.status}):`, track.name);
          }
        } catch (err) {
          console.error(`Error adding ${track.name} to queue:`, err);
        }
        
        // Rate limiting için küçük bir bekleme
        if (i < Math.min(5, tracksToAdd.length) - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Kalan şarkıları background'da ekle (response'u beklemeden)
      if (tracksToAdd.length > 5) {
        Promise.all(
          tracksToAdd.slice(5).map(async (track, index) => {
            await new Promise(resolve => setTimeout(resolve, index * 100));
            try {
              const queueResponse = await spotifyApiRequest(`/me/player/queue?uri=${encodeURIComponent(track.uri)}`, {
                method: 'POST',
              });
              return queueResponse.status === 204 || queueResponse.status === 202 || queueResponse.ok;
            } catch (err) {
              console.error(`Error adding ${track.name} to queue:`, err);
              return false;
            }
          })
        ).then(results => {
          const successCount = results.filter(r => r).length;
          console.log(`Queue'ya toplam ${addedCount + successCount}/${tracksToAdd.length} şarkı eklendi`);
        }).catch(err => {
          console.error('Queue ekleme hatası:', err);
        });
      } else {
        console.log(`Queue'ya ${addedCount} şarkı eklendi`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error playing with queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
