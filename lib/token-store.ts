// Upstash Redis ile token yönetimi
// Ücretsiz: https://upstash.com

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Token'ları Upstash'e kaydet
export async function saveSpotifyTokens(tokens: SpotifyTokens): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.error('Upstash credentials not configured');
    return false;
  }

  try {
    const response = await fetch(`${UPSTASH_URL}/set/spotify_tokens/${encodeURIComponent(JSON.stringify(tokens))}`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error saving tokens to Upstash:', error);
    return false;
  }
}

// Token'ları Upstash'ten oku
export async function getSpotifyTokens(): Promise<SpotifyTokens | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.error('Upstash credentials not configured');
    return null;
  }

  try {
    const response = await fetch(`${UPSTASH_URL}/get/spotify_tokens`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.result) return null;

    return JSON.parse(data.result);
  } catch (error) {
    console.error('Error reading tokens from Upstash:', error);
    return null;
  }
}

// Token'ları sil
export async function deleteSpotifyTokens(): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return false;
  }

  try {
    const response = await fetch(`${UPSTASH_URL}/del/spotify_tokens`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting tokens from Upstash:', error);
    return false;
  }
}
