'use client';

import { useState, useEffect } from 'react';

interface YouTubeControlProps {
  connected: boolean;
  onConnectChange: (connected: boolean) => void;
}

export default function YouTubeControl({ connected, onConnectChange }: YouTubeControlProps) {
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (connected && videoId) {
      fetchVideoDetails();
    }
  }, [connected, videoId]);

  const fetchVideoDetails = async () => {
    if (!videoId) return;
    try {
      const res = await fetch(`/api/youtube/video/${videoId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentVideo(data);
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
    }
  };

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleConnect = () => {
    window.location.href = '/api/youtube/auth';
  };

  const handlePlayVideo = async () => {
    setLoading(true);
    try {
      const id = extractVideoId(videoUrl);
      if (!id) {
        alert('Geçersiz YouTube URL');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/youtube/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: id }),
      });

      if (res.ok) {
        setVideoId(id);
        setIsPlaying(true);
        await fetchVideoDetails();
        setVideoUrl('');
      } else {
        alert('Video oynatılamadı');
      }
    } catch (error) {
      console.error('Error playing video:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-red-500">▶</span>
          YouTube
        </h2>
        {connected ? (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
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
              className="w-24 h-24 mx-auto text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <p className="text-gray-300 mb-6">
            YouTube hesabınıza bağlanarak videolarınızı kontrol edin
          </p>
          <button
            onClick={handleConnect}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105"
          >
            YouTube'a Bağlan
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="YouTube video URL'si..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePlayVideo();
                  }
                }}
              />
              <button
                onClick={handlePlayVideo}
                disabled={loading || !videoUrl}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Oynat
              </button>
            </div>
          </div>

          {currentVideo && (
            <div className="mb-6">
              <div className="bg-black/30 rounded-lg p-4">
                {currentVideo.snippet?.thumbnails?.high?.url && (
                  <img
                    src={currentVideo.snippet.thumbnails.high.url}
                    alt={currentVideo.snippet.title}
                    className="w-full rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-bold text-white mb-2">
                  {currentVideo.snippet?.title}
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  {currentVideo.snippet?.channelTitle}
                </p>
                {isPlaying && (
                  <div className="flex items-center gap-2 text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-sm font-semibold">Oynatılıyor</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-center text-gray-400 text-sm">
            YouTube URL'sini yapıştırın ve oynatma kontrolünü arkadaşlarınızla paylaşın
          </div>
        </div>
      )}
    </div>
  );
}
