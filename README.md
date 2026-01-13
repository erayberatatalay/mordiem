# Mordiem - Spotify & YouTube Kontrol Merkezi

Arkadaşlarınızla Spotify şarkılarınızı ve YouTube videolarınızı paylaşabileceğiniz modern bir web uygulaması.

## Özellikler

- 🎵 **Spotify Entegrasyonu**: Spotify hesabınıza bağlanın ve şarkıları kontrol edin
  - Çalan şarkıyı görüntüleme
  - Play/Pause kontrolü
  - Sonraki/Önceki şarkıya geçme
  - Arkadaşlarınızın şarkılarınızı değiştirmesine izin verme

- ▶️ **YouTube Entegrasyonu**: YouTube videolarınızı kontrol edin
  - Video URL'si ile oynatma
  - Video bilgilerini görüntüleme
  - Arkadaşlarınızın videolarınızı değiştirmesine izin verme

## Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Spotify Developer hesabı
- Google Cloud Console hesabı (YouTube API için)

### Adımlar

1. **Projeyi klonlayın veya indirin**

```bash
cd Mordiem
```

2. **Bağımlılıkları yükleyin**

```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın**

`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Spotify API Bilgileri
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback

# YouTube API Bilgileri
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/youtube/callback

# Uygulama URL'si (Production için domain'inizi kullanın)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Spotify API Anahtarlarını Alma

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) adresine gidin
2. "Create App" butonuna tıklayın
3. Uygulama bilgilerini doldurun:
   - App name: Mordiem (veya istediğiniz isim)
   - App description: Spotify ve YouTube kontrol uygulaması
   - Redirect URI: `http://localhost:3000/api/spotify/callback` (development için)
   - Redirect URI: `https://mordiem.site/api/spotify/callback` (production için)
4. "Save" butonuna tıklayın
5. "Settings" sayfasında **Client ID** ve **Client Secret** değerlerini kopyalayın
6. `.env.local` dosyasına ekleyin

### YouTube API Anahtarlarını Alma

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun (veya mevcut projeyi seçin)
3. "APIs & Services" > "Library" menüsüne gidin
4. "YouTube Data API v3" arayın ve etkinleştirin
5. "APIs & Services" > "Credentials" menüsüne gidin
6. "Create Credentials" > "OAuth client ID" seçin
7. Application type olarak "Web application" seçin
8. Authorized redirect URIs kısmına ekleyin:
   - `http://localhost:3000/api/youtube/callback` (development için)
   - `https://mordiem.site/api/youtube/callback` (production için)
9. **Client ID** ve **Client Secret** değerlerini kopyalayın
10. `.env.local` dosyasına ekleyin

### Development Sunucusunu Başlatma

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

### Production Build

```bash
npm run build
npm start
```

## Kullanım

1. Uygulamayı açın
2. Spotify veya YouTube için "Bağlan" butonuna tıklayın
3. OAuth izin ekranında giriş yapın ve izinleri onaylayın
4. Bağlantı kurulduktan sonra:
   - **Spotify**: Çalan şarkıyı görüntüleyin, play/pause yapın, şarkı değiştirin
   - **YouTube**: Video URL'si yapıştırın ve oynatın

## Güvenlik Notları

- `.env.local` dosyasını asla git'e commit etmeyin (zaten .gitignore'da)
- Production ortamında HTTPS kullanın
- Cookie'ler httpOnly ve secure olarak ayarlanmıştır
- OAuth token'ları güvenli bir şekilde saklanmalıdır (production için database kullanımı önerilir)

## Teknolojiler

- **Next.js 14**: React framework (App Router)
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Modern UI tasarımı
- **Spotify Web API**: Spotify entegrasyonu
- **YouTube Data API v3**: YouTube entegrasyonu
- **OAuth 2.0**: Güvenli kimlik doğrulama

## Lisans

MIT

## Destek

Sorularınız için GitHub Issues kullanabilirsiniz.
