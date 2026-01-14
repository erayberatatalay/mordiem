# Spotify Token Kurulum Rehberi

## Herkesin Aynı Spotify Hesabını Kullanması İçin

Sitenize giren herkesin **sizin Spotify hesabınıza** müdahale edebilmesi için token'ları environment variable olarak saklamalısınız.

## Adımlar

### 1. İlk Bağlantı ve Token Alma

1. **Spotify'a bağlanın**: `/api/spotify/auth` adresine gidin veya "Spotify'a Bağlan" butonuna tıklayın
2. **Spotify'da oturum açın** ve izinleri onaylayın
3. **Callback sonrası** (sayfa yönlendirildiğinde), sunucu loglarını kontrol edin
4. **Token'ları kopyalayın** (console loglarında görünecek)

### 2. Token'ları Environment Variable Olarak Ekleme

**Vercel Kullanıyorsanız:**

1. Vercel Dashboard > Projeniz > **Settings** > **Environment Variables**
2. Aşağıdaki değişkenleri ekleyin:
   ```
   SPOTIFY_ACCESS_TOKEN=<access_token_değeri>
   SPOTIFY_REFRESH_TOKEN=<refresh_token_değeri>
   ```
3. **"Redeploy"** yapın

**Lokal Geliştirme İçin:**

`.env.local` dosyasına ekleyin:
```
SPOTIFY_ACCESS_TOKEN=your_access_token_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

### 3. Token'ları Nereden Bulabilirim?

Callback sonrası sunucu loglarında görünecek. Vercel kullanıyorsanız:
- Vercel Dashboard > Projeniz > **Functions** > `/api/spotify/callback`
- **Logs** sekmesine gidin
- Token'ları göreceksiniz

### 4. Önemli Notlar

- ⚠️ **Access Token süresi dolabilir** (genellikle 1 saat)
- ✅ **Refresh Token kullanılarak otomatik yenilenir**
- ✅ Refresh token ile yeni access token alındığında, yeni token'ı environment variable'a eklemeniz gerekebilir
- 🔒 **Token'ları güvenli tutun** - GitHub'a commit etmeyin

### 5. Token Yenileme

Access token süresi dolduğunda, refresh token kullanılarak otomatik olarak yenilenir. Ancak yeni access token environment variable'a otomatik eklenmez.

**Yenileme yapıldığında:**
1. Sunucu loglarını kontrol edin
2. Yeni access token'ı görün
3. Environment variable'ı güncelleyin (opsiyonel - refresh token çalışıyorsa gerekmez)

### Alternatif: Otomatik Token Yönetimi

Daha gelişmiş bir çözüm için:
- Database kullanabilirsiniz (token'ları veritabanında saklayın)
- Veya bir admin paneli ekleyebilirsiniz (token'ları UI'dan yönetin)

## Şu Anki Durum

✅ Token'lar environment variable'dan okunuyor  
✅ Herkes aynı Spotify hesabını kullanacak  
✅ Refresh token ile otomatik yenileme çalışıyor  
⚠️ Yeni access token environment variable'a otomatik eklenmiyor (manuel ekleme gerekebilir)
