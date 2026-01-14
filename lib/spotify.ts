async function getAccessToken(): Promise<string | null> {
  // Environment variable'dan oku (herkes aynı token'ı kullanacak)
  return process.env.SPOTIFY_ACCESS_TOKEN || null;
}

async function getRefreshToken(): Promise<string | null> {
  // Environment variable'dan oku (herkes aynı token'ı kullanacak)
  return process.env.SPOTIFY_REFRESH_TOKEN || null;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

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
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();
    if (!response.ok) return null;

    // Yeni access token döndür (environment variable otomatik güncellenmez)
    // Kullanıcı token'ları environment variable'a eklemelidir
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

export async function getSpotifyToken(): Promise<string | null> {
  let token = await getAccessToken();
  
  if (!token) {
    token = await refreshAccessToken();
  }

  return token;
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
    // Try refreshing token
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
