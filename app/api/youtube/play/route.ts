import { NextRequest, NextResponse } from 'next/server';
import { getYoutubeClient } from '@/lib/youtube';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    // Note: YouTube Data API v3 doesn't have a direct "play video" endpoint
    // This endpoint validates the video exists and returns video info
    // Actual playback control would need to be implemented client-side or via YouTube Player API
    const auth = await getYoutubeClient();
    const youtube = google.youtube({ version: 'v3', auth });

    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails'],
      id: [videoId],
    });

    if (!response.data.items || response.data.items.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      video: response.data.items[0],
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`
    });
  } catch (error) {
    console.error('Error playing video:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
