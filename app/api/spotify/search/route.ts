import { NextRequest, NextResponse } from 'next/server';
import { spotifyApiRequest } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') || '20';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const response = await spotifyApiRequest(
      `/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to search tracks' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data.tracks?.items || []);
  } catch (error) {
    console.error('Error searching tracks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
