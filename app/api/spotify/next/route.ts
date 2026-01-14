import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function POST() {
  noStore();
  
  try {
    const response = await spotifyApiRequest('/me/player/next', {
      method: 'POST',
    });

    // 204 başarılı, 202 de kabul edildi demek
    if (response.status === 204 || response.status === 202 || response.ok) {
      return NextResponse.json({ success: true });
    }

    // Aktif cihaz yoksa
    if (response.status === 404) {
      return NextResponse.json({ error: 'No active device' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to skip to next' }, { status: response.status });
  } catch (error) {
    console.error('Error skipping to next:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
