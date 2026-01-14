import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  noStore();
  
  try {
    const response = await spotifyApiRequest('/me/player');
    
    if (response.status === 204 || !response.ok) {
      return NextResponse.json({ shuffle_state: false });
    }

    const data = await response.json();
    return NextResponse.json({ shuffle_state: data.shuffle_state || false });
  } catch (error) {
    console.error('Error getting shuffle state:', error);
    return NextResponse.json({ shuffle_state: false });
  }
}

export async function PUT(request: NextRequest) {
  noStore();
  
  try {
    const body = await request.json();
    const { state } = body;

    if (typeof state !== 'boolean') {
      return NextResponse.json({ error: 'state must be a boolean' }, { status: 400 });
    }

    const response = await spotifyApiRequest(`/me/player/shuffle?state=${state}`, {
      method: 'PUT',
    });

    if (response.status === 204 || response.ok) {
      return NextResponse.json({ success: true, shuffle_state: state });
    }

    return NextResponse.json({ error: 'Failed to set shuffle' }, { status: response.status });
  } catch (error) {
    console.error('Error setting shuffle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
