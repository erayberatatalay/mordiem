# Upstash Redis Kurulum Rehberi

## Neden Upstash?

Token'ları kaydetmek için ücretsiz bir veritabanı lazım. Upstash:
- ✅ **Ücretsiz** (10,000 request/gün)
- ✅ **Kolay kurulum** (5 dakika)
- ✅ **Vercel ile uyumlu**
- ✅ **REST API** (SDK gerektirmez)

## Kurulum Adımları

### 1. Upstash Hesabı Oluşturun

1. https://upstash.com adresine gidin
2. **"Sign Up"** veya **"Start for Free"** tıklayın
3. GitHub veya Google ile giriş yapın (en kolay yol)

### 2. Redis Database Oluşturun

1. Dashboard'da **"Create Database"** tıklayın
2. **Name**: `mordiem-tokens` (veya istediğiniz isim)
3. **Region**: En yakın bölgeyi seçin (örn: eu-west-1 veya us-east-1)
4. **"Create"** tıklayın

### 3. REST API Bilgilerini Alın

Database oluşturulduktan sonra:

1. Database'inize tıklayın
2. **"REST API"** sekmesine gidin
3. Şu bilgileri kopyalayın:
   - **UPSTASH_REDIS_REST_URL**: `https://xxx.upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN**: `AXxxxxxxxxxxxx...`

### 4. Vercel'e Environment Variables Ekleyin

1. **Vercel Dashboard** > Projeniz > **Settings** > **Environment Variables**
2. Şu değişkenleri ekleyin:

   | Name | Value |
   |------|-------|
   | `UPSTASH_REDIS_REST_URL` | `https://xxx.upstash.io` |
   | `UPSTASH_REDIS_REST_TOKEN` | `AXxxxxxxxxxxxx...` |

3. **"Save"** tıklayın
4. **"Redeploy"** yapın

### 5. Test Edin

1. Siteye gidin: https://mordiem.site
2. **"Spotify'a Bağlan"** butonuna tıklayın
3. Spotify'da oturum açın ve izinleri onaylayın
4. Başarılı olursa ana sayfaya yönlendirileceksiniz

### 6. Artık Herkes Kullanabilir!

- ✅ Bir kişi bağlandığında token'lar Upstash'e kaydedilir
- ✅ Başka biri siteye girdiğinde aynı token'ları kullanır
- ✅ Token süresi dolduğunda otomatik yenilenir
- ✅ Bağlantı kopana kadar herkes kullanabilir

## Sorun Giderme

### "Upstash credentials not configured" hatası

Environment variables eksik. Vercel'de şunları kontrol edin:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Token'lar kaydedilmiyor

1. Upstash dashboard'da database'inizin aktif olduğundan emin olun
2. REST API URL ve token'ın doğru olduğunu kontrol edin
3. Vercel'de "Redeploy" yapın

### Bağlantı kopuyor

Refresh token çalışmıyorsa:
1. Spotify Developer Dashboard'da uygulamanızı kontrol edin
2. Redirect URI'ların doğru olduğundan emin olun
3. Yeniden bağlanın: "Spotify'a Bağlan" butonuna tıklayın

## Ücretsiz Limitler

Upstash ücretsiz planı:
- ✅ 10,000 request/gün
- ✅ 256 MB veri
- ✅ Sınırsız süre

Bu limitler küçük-orta ölçekli siteler için fazlasıyla yeterli!

## Alternatifler

Upstash yerine kullanabileceğiniz diğer seçenekler:
- **Vercel KV**: Vercel'in kendi Redis'i (ücretli)
- **Railway**: Ücretsiz Redis (sınırlı)
- **MongoDB Atlas**: Ücretsiz tier (daha karmaşık)
