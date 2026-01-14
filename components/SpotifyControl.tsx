'use client';

import { useState, useEffect } from 'react';

interface SpotifyControlProps {
  connected: boolean;
  onConnectChange: (connected: boolean) => void;
}

interface Track {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: { name: string; uri: string; images: { url: string }[] };
  uri: string;
}

interface Playlist {
  id: string;
  name: string;
  uri: string;
  images: { url: string }[];
  owner: { display_name: string };
  tracks: { total: number };
}

export default function SpotifyControl({ connected, onConnectChange }: SpotifyControlProps) {
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playlistResults, setPlaylistResults] = useState<Playlist[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTab, setSearchTab] = useState<'tracks' | 'playlists'>('tracks');
  const [shuffleState, setShuffleState] = useState(false);
  const [previousTrackId, setPreviousTrackId] = useState<string | null>(null);
  const [autoNextEnabled, setAutoNextEnabled] = useState(true);

  useEffect(() => {
    if (connected) {
      fetchCurrentTrack();
      fetchShuffleState();
      // Daha sık kontrol et (autoplay için)
      const interval = setInterval(fetchCurrentTrack, 2000);
      return () => clearInterval(interval);
    }
  }, [connected]);

  const fetchShuffleState = async () => {
    try {
      const res = await fetch('/api/spotify/shuffle');
      if (res.ok) {
        const data = await res.json();
        setShuffleState(data.shuffle_state || false);
      }
    } catch (err) {
      console.error('Error fetching shuffle state:', err);
    }
  };

  const handleToggleShuffle = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/spotify/shuffle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: !shuffleState }),
      });
      if (res.ok) {
        setShuffleState(!shuffleState);
      } else if (res.status === 404) {
        setError('Spotify uygulamasını açın');
      }
    } catch (err) {
      console.error('Error toggling shuffle:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentTrack = async () => {
    try {
      const res = await fetch(`/api/spotify/current?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.item) {
          const currentTrackId = data.item.id;
          const wasPlaying = isPlaying;
          const nowPlaying = data.is_playing || false;
          const progress = data.progress_ms || 0;
          const duration = data.duration_ms || 0;
          
          // Şarkı bitti mi kontrol et (son 2 saniye içindeyse ve durduysa)
          if (wasPlaying && !nowPlaying && previousTrackId === currentTrackId) {
            // Şarkı durdu, otomatik next
            if (autoNextEnabled && duration > 0 && progress >= duration - 2000) {
              setTimeout(async () => {
                try {
                  await fetch('/api/spotify/next', { method: 'POST' });
                  setTimeout(() => fetchCurrentTrack(), 1000);
                } catch (err) {
                  console.error('Auto next error:', err);
                }
              }, 500);
            }
          }
          
          // Şarkı değişti mi kontrol et
          if (previousTrackId && previousTrackId !== currentTrackId && wasPlaying && !nowPlaying) {
            // Önceki şarkı bitti ve yeni şarkı başlamadı, otomatik next
            if (autoNextEnabled) {
              setTimeout(async () => {
                try {
                  await fetch('/api/spotify/next', { method: 'POST' });
                  setTimeout(() => fetchCurrentTrack(), 1000);
                } catch (err) {
                  console.error('Auto next error:', err);
                }
              }, 500);
            }
          }
          
          setCurrentTrack(data.item);
          setIsPlaying(nowPlaying);
          setPreviousTrackId(currentTrackId);
          setError(null);
        } else if (data === null) {
          setCurrentTrack(null);
          setIsPlaying(false);
          setPreviousTrackId(null);
        }
      }
    } catch (err) {
      console.error('Error fetching current track:', err);
    }
  };

  const handleConnect = () => {
    window.location.href = '/api/spotify/auth';
  };

  const handlePlayPause = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/spotify/play-pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ play: !isPlaying }),
      });
      
      if (res.ok) {
        setIsPlaying(!isPlaying);
        setTimeout(() => fetchCurrentTrack(), 500);
      } else {
        if (res.status === 404) {
          setError('Spotify uygulamasını açın ve bir şarkı çalın');
        } else {
          setError('Bir hata oluştu');
        }
      }
    } catch (err) {
      console.error('Error toggling play/pause:', err);
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/spotify/next', { method: 'POST' });
      if (res.ok) {
        setTimeout(() => fetchCurrentTrack(), 500);
      } else if (res.status === 404) {
        setError('Spotify uygulamasını açın');
      }
    } catch (err) {
      console.error('Error skipping to next:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/spotify/previous', { method: 'POST' });
      if (res.ok) {
        setTimeout(() => fetchCurrentTrack(), 500);
      } else if (res.status === 404) {
        setError('Spotify uygulamasını açın');
      }
    } catch (err) {
      console.error('Error skipping to previous:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError(null);
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.tracks || []);
        setPlaylistResults(data.playlists || []);
        setShowSearch(true);
      }
    } catch (err) {
      console.error('Error searching:', err);
    } finally {
      setSearching(false);
    }
  };

  const handlePlayTrack = async (track: Track) => {
    setLoading(true);
    setError(null);
    try {
      // Şarkıyı çal ve benzer şarkıları queue'ya ekle
      const res = await fetch('/api/spotify/play-with-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          trackUri: track.uri,
          trackId: track.id,
          artistId: track.artists?.[0]?.id || '',
        }),
      });
      if (res.ok) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
        setPlaylistResults([]);
        setIsPlaying(true);
        setTimeout(() => fetchCurrentTrack(), 500);
      } else if (res.status === 404) {
        setError('Spotify uygulamasını açın ve bir cihaz seçin');
      } else {
        setError('Şarkı çalınamadı');
      }
    } catch (err) {
      console.error('Error playing track:', err);
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPlaylist = async (playlist: Playlist) => {
    if (!playlist || !playlist.uri) {
      setError('Geçersiz playlist');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/spotify/play-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          playlistUri: playlist.uri,
        }),
      });
      if (res.ok) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
        setPlaylistResults([]);
        setIsPlaying(true);
        setTimeout(() => fetchCurrentTrack(), 500);
      } else if (res.status === 404) {
        setError('Spotify uygulamasını açın ve bir cihaz seçin');
      } else {
        setError('Playlist çalınamadı');
      }
    } catch (err) {
      console.error('Error playing playlist:', err);
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <span className="text-green-500 text-sm sm:text-base">●</span>
          Spotify
        </h2>
        {connected ? (
          <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm font-semibold">
            Bağlı
          </span>
        ) : (
          <span className="px-2 sm:px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs sm:text-sm font-semibold">
            Bağlı Değil
          </span>
        )}
      </div>

      {!connected ? (
        <div className="text-center py-8 sm:py-12">
          <div className="mb-4 sm:mb-6">
            <svg
              className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-green-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.3.421-1.02.599-1.559.3z" />
            </svg>
          </div>
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
            Spotify hesabınıza bağlanarak şarkılarınızı kontrol edin
          </p>
          <button
            onClick={handleConnect}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
          >
            Spotify'a Bağlan
          </button>
        </div>
      ) : (
        <div>
          {/* Hata Mesajı */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Arama Kutusu */}
          <div className="mb-4 sm:mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Şarkı veya playlist ara..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {searching ? '...' : 'Ara'}
              </button>
            </form>

            {/* Arama Sonuçları */}
            {showSearch && (searchResults.length > 0 || playlistResults.length > 0) && (
              <div className="mt-3 sm:mt-4">
                {/* Tab Seçici */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setSearchTab('tracks')}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      searchTab === 'tracks' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Şarkılar ({searchResults.length})
                  </button>
                  <button
                    onClick={() => setSearchTab('playlists')}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      searchTab === 'playlists' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Playlistler ({playlistResults.length})
                  </button>
                </div>

                {/* Şarkı Sonuçları */}
                {searchTab === 'tracks' && searchResults.length > 0 && (
                  <div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-2">
                    {searchResults.map((track) => (
                      <div
                        key={track.id}
                        onClick={() => handlePlayTrack(track)}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200"
                      >
                        {track.album?.images?.[2]?.url && (
                          <img
                            src={track.album.images[2].url}
                            alt={track.album.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate text-sm sm:text-base">{track.name}</p>
                          <p className="text-gray-400 text-xs sm:text-sm truncate">
                            {track.artists.map((a) => a.name).join(', ')}
                          </p>
                        </div>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                )}

                {/* Playlist Sonuçları */}
                {searchTab === 'playlists' && playlistResults.length > 0 && (
                  <div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-2">
                    {playlistResults.filter(p => p && p.id).map((playlist) => (
                      <div
                        key={playlist.id}
                        onClick={() => handlePlayPlaylist(playlist)}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200"
                      >
                        {playlist.images && playlist.images.length > 0 && playlist.images[0]?.url ? (
                          <img
                            src={playlist.images[0].url}
                            alt={playlist.name || 'Playlist'}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-white/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate text-sm sm:text-base">{playlist.name || 'Playlist'}</p>
                          <p className="text-gray-400 text-xs sm:text-sm truncate">
                            {playlist.owner?.display_name || 'Spotify'} • {playlist.tracks?.total || 0} şarkı
                          </p>
                        </div>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Çalan Şarkı */}
          {currentTrack ? (
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                {currentTrack.album?.images?.[0]?.url && (
                  <img
                    src={currentTrack.album.images[0].url}
                    alt={currentTrack.album.name}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg object-cover shadow-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-xl font-bold text-white mb-1 truncate">
                    {currentTrack.name}
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base truncate">
                    {currentTrack.artists?.map((a: any) => a.name).join(', ')}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1 truncate">
                    {currentTrack.album?.name}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 sm:mb-6 text-center py-4 sm:py-6 text-gray-400 text-sm">
              <p>Şu anda çalan şarkı yok</p>
              <p className="text-xs mt-1">Spotify uygulamasından bir şarkı başlatın</p>
            </div>
          )}

          {/* Kontrol Butonları */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={handleToggleShuffle}
              disabled={loading}
              className={`p-2 sm:p-3 rounded-full transition-all duration-200 disabled:opacity-50 active:scale-95 ${
                shuffleState 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={shuffleState ? 'Shuffle kapat' : 'Shuffle aç'}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>
            <button
              onClick={handlePrevious}
              disabled={loading}
              className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50 active:scale-95"
              title="Önceki şarkı"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              onClick={handlePlayPause}
              disabled={loading}
              className="p-3 sm:p-4 bg-green-500 hover:bg-green-600 rounded-full transition-all duration-200 disabled:opacity-50 active:scale-95 shadow-lg shadow-green-500/30"
              title={isPlaying ? 'Duraklat' : 'Oynat'}
            >
              {isPlaying ? (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50 active:scale-95"
              title="Sonraki şarkı"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
