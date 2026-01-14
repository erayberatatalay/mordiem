import { getSpotifyTokens, saveSpotifyTokens } from './token-store';

// Token'ları Upstash'ten oku
async function getAccessToken(): Promise<string | null> {
  const tokens = await getSpotifyTokens();
  return tokens?.access_token || null;
}

async function getRefreshToken(): Promise<string | null> {
  const tokens = await getSpotifyTokens();
  return tokens?.refresh_token || null;
}

// Access token'ı yenile
async function refreshAccessToken(): Promise<string | null> {
  const tokens = await getSpotifyTokens();
  if (!tokens?.refresh_token) return null;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokens.refresh_token,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Token refresh failed:', data);
      return null;
    }

    // Yeni token'ları Upstash'e kaydet
    const newTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || tokens.refresh_token,
      expires_at: Date.now() + (data.expires_in * 1000),
    };
    await saveSpotifyTokens(newTokens);

    console.log('Token refreshed successfully');
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

export async function getSpotifyToken(): Promise<string | null> {
  const tokens = await getSpotifyTokens();
  
  // Token yoksa null döndür
  if (!tokens) return null;
  
  // Token süresi dolmuşsa yenile
  if (tokens.expires_at && Date.now() > tokens.expires_at - 60000) {
    console.log('Token expired, refreshing...');
    return await refreshAccessToken();
  }
  
  return tokens.access_token;
}

export async function spotifyApiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getSpotifyToken();
  if (!token) {
    throw new Error('No Spotify token available');
  }

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token geçersiz, yenilemeyi dene
    console.log('Token invalid, trying to refresh...');
    const newToken = await refreshAccessToken();
    if (newToken) {
      return fetch(`https://api.spotify.com/v1${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    }
  }

  return response;
}
