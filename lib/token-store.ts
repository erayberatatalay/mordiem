// Upstash Redis ile token yönetimi
// Ücretsiz: https://upstash.com

interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Token'ları Upstash'e kaydet
export async function saveSpotifyTokens(tokens: SpotifyTokens): Promise<boolean> {
  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.error('Upstash credentials not configured. URL:', !!UPSTASH_URL, 'TOKEN:', !!UPSTASH_TOKEN);
    return false;
  }

  try {
    // Upstash REST API - POST ile JSON gönder
    const response = await fetch(`${UPSTASH_URL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', 'spotify_tokens', JSON.stringify(tokens)]),
    });

    const result = await response.json();
    console.log('Upstash save result:', result);
    return response.ok;
  } catch (error) {
    console.error('Error saving tokens to Upstash:', error);
    return false;
  }
}

// Token'ları Upstash'ten oku
export async function getSpotifyTokens(): Promise<SpotifyTokens | null> {
  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.error('Upstash credentials not configured');
    return null;
  }

  try {
    const response = await fetch(`${UPSTASH_URL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['GET', 'spotify_tokens']),
    });

    if (!response.ok) {
      console.error('Upstash response not ok:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Upstash get result:', data);
    
    if (!data.result) return null;

    return JSON.parse(data.result);
  } catch (error) {
    console.error('Error reading tokens from Upstash:', error);
    return null;
  }
}

// Token'ları sil
export async function deleteSpotifyTokens(): Promise<boolean> {
  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return false;
  }

  try {
    const response = await fetch(`${UPSTASH_URL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['DEL', 'spotify_tokens']),
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting tokens from Upstash:', error);
    return false;
  }
}
