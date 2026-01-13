'use client';

import { useState, useEffect } from 'react';

interface SpotifyControlProps {
  connected: boolean;
  onConnectChange: (connected: boolean) => void;
}

export default function SpotifyControl({ connected, onConnectChange }: SpotifyControlProps) {
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected) {
      fetchCurrentTrack();
      const interval = setInterval(fetchCurrentTrack, 3000);
      return () => clearInterval(interval);
    }
  }, [connected]);

  const fetchCurrentTrack = async () => {
    try {
      const res = await fetch('/api/spotify/current');
      if (res.ok) {
        const data = await res.json();
        setCurrentTrack(data);
        setIsPlaying(data?.is_playing || false);
      }
    } catch (error) {
      console.error('Error fetching current track:', error);
    }
  };

  const handleConnect = () => {
    window.location.href = '/api/spotify/auth';
  };

  const handlePlayPause = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/spotify/play-pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ play: !isPlaying }),
      });
      if (res.ok) {
        setIsPlaying(!isPlaying);
        await fetchCurrentTrack();
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/spotify/next', { method: 'POST' });
      if (res.ok) {
        await fetchCurrentTrack();
      }
    } catch (error) {
      console.error('Error skipping to next:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/spotify/previous', { method: 'POST' });
      if (res.ok) {
        await fetchCurrentTrack();
      }
    } catch (error) {
      console.error('Error skipping to previous:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-green-500">●</span>
          Spotify
        </h2>
        {connected ? (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
            Bağlı
          </span>
        ) : (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-semibold">
            Bağlı Değil
          </span>
        )}
      </div>

      {!connected ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-green-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.3.421-1.02.599-1.559.3z" />
            </svg>
          </div>
          <p className="text-gray-300 mb-6">
            Spotify hesabınıza bağlanarak şarkılarınızı kontrol edin
          </p>
          <button
            onClick={handleConnect}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105"
          >
            Spotify'a Bağlan
          </button>
        </div>
      ) : (
        <div>
          {currentTrack && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                {currentTrack.album?.images?.[0]?.url && (
                  <img
                    src={currentTrack.album.images[0].url}
                    alt={currentTrack.album.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {currentTrack.name}
                  </h3>
                  <p className="text-gray-300">
                    {currentTrack.artists?.map((a: any) => a.name).join(', ')}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {currentTrack.album?.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={loading}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              onClick={handlePlayPause}
              disabled={loading}
              className="p-4 bg-green-500 hover:bg-green-600 rounded-full transition-all duration-200 disabled:opacity-50"
            >
              {isPlaying ? (
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
