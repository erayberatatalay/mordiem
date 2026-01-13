import { cookies } from 'next/headers';
import { google } from 'googleapis';

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('youtube_access_token')?.value || null;
}

async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('youtube_refresh_token')?.value || null;
}

export async function getYoutubeToken(): Promise<string | null> {
  return await getAccessToken();
}

export async function getYoutubeClient() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/youtube/callback`;

  if (!clientId || !clientSecret) {
    throw new Error('YouTube credentials not configured');
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const token = await getYoutubeToken();
  if (token) {
    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: await getRefreshToken() || undefined,
    });
  }

  return oauth2Client;
}
