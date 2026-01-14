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
    <main className="min-h-screen bg-[#2a0a0a] relative overflow-hidden">
      {/* Arka plan deseni */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3a0f0f] via-[#2a0a0a] to-[#1a0505]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-wide">
            MORDIEM
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 tracking-widest font-light">
            AJANS RADYOSU
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <SpotifyControl 
            connected={spotifyConnected}
            onConnectChange={setSpotifyConnected}
          />
        </div>
      </div>
    </main>
  );
}
