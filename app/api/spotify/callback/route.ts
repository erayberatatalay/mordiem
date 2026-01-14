import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?error=no_code`);
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/spotify/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?error=config_error`);
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Token exchange failed');
    }

    // Token'ları environment variable olarak kullanılacak
    // Bu token'ları kopyalayıp environment variable'a ekleyin:
    // SPOTIFY_ACCESS_TOKEN=<access_token>
    // SPOTIFY_REFRESH_TOKEN=<refresh_token>
    
    // Şimdilik token'ları console'a yazdırıyoruz (production'da kaldırın)
    console.log('=== SPOTIFY TOKENS (Environment Variable olarak ekleyin) ===');
    console.log(`SPOTIFY_ACCESS_TOKEN=${data.access_token}`);
    if (data.refresh_token) {
      console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
    }
    console.log('=============================================================');

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?connected=spotify`);
  } catch (error) {
    console.error('Spotify callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?error=callback_error`);
  }
}
