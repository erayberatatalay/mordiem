import { NextRequest, NextResponse } from 'next/server';
import { getYoutubeClient } from '@/lib/youtube';
import { google } from 'googleapis';

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const auth = await getYoutubeClient();
    const youtube = google.youtube({ version: 'v3', auth });

    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: [params.videoId],
    });

    if (!response.data.items || response.data.items.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(response.data.items[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
