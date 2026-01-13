'use client';

import { useState, useEffect } from 'react';
import SpotifyControl from '@/components/SpotifyControl';

export default function Home() {
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  useEffect(() => {
    // Check connection status
    fetch('/api/spotify/status')
      .then(res => res.json())
      .then(data => setSpotifyConnected(data.connected))
      .catch(() => setSpotifyConnected(false));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Mordiem
          </h1>
          <p className="text-xl text-gray-300">
            Spotify kontrol merkezi
          </p>
          <p className="text-gray-400 mt-2">
            Arkadaşlarınızla şarkılarınızı paylaşın
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SpotifyControl 
            connected={spotifyConnected}
            onConnectChange={setSpotifyConnected}
          />
        </div>
      </div>
    </main>
  );
}
