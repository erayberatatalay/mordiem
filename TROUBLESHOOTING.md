# Sorun Giderme Rehberi

## ❌ HATA 1: 404 - Spotify Callback Endpoint Bulunamıyor

**Hata Mesajı:**
```
404 Not Found
The resource requested could not be found on this server!
```

**URL:** `https://mordiem.site/api/spotify/callback?code=...`

### Çözüm Adımları:

#### 1. Vercel/Netlify'da Build Kontrolü

Eğer Vercel veya Netlify kullanıyorsanız:

1. **Dashboard'a gidin** ve **"Deployments"** sekmesine bakın
2. Son deployment'ın **başarılı** olduğundan emin olun
3. **Build loglarını kontrol edin** - hata var mı?
4. Eğer hata varsa, hata mesajını okuyun ve düzeltin

#### 2. Build'i Yeniden Yapın

Vercel kullanıyorsanız:
- GitHub'da değişiklik yapıp push edin (otomatik rebuild olur)
- Veya Vercel dashboard'dan "Redeploy" butonuna tıklayın

#### 3. Route Yapısını Kontrol Edin

Dosya yapısının doğru olduğundan emin olun:
```
app/
  api/
    spotify/
      callback/
        route.ts  ✅ Bu dosya olmalı
```

#### 4. Environment Variables Kontrolü

Vercel/Netlify dashboard'da **Environment Variables** kontrol edin:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI` = `https://mordiem.site/api/spotify/callback`
- `NEXT_PUBLIC_BASE_URL` = `https://mordiem.site`

**ÖNEMLİ:** Environment variables'ı ekledikten sonra **yeniden deploy** yapın!

#### 5. Next.js Build'i Kontrol Edin

Lokal olarak build yapıp hata olup olmadığını kontrol edin:
```bash
npm run build
```

Eğer build hatası varsa, hata mesajını çözün.

---

## ❌ HATA 2: Google OAuth Verification - Access Denied

**Hata Mesajı:**
```
Access blocked: mordiem.site has not completed the Google verification process
Error 403: access_denied
```

**Neden:** Google OAuth Consent Screen hala **"Testing"** modunda ve sadece test kullanıcıları erişebiliyor.

### Çözüm 1: Test Kullanıcısı Ekleme (Hızlı Çözüm)

Bu çözüm **sadece sizin** kullanmanız için geçicidir:

1. **Google Cloud Console'a** gidin: https://console.cloud.google.com/
2. **APIs & Services** > **OAuth consent screen** menüsüne gidin
3. **"Test users"** bölümüne gidin
4. **"+ ADD USERS"** butonuna tıklayın
5. **E-posta adresinizi ekleyin**: `erayberat37@gmail.com`
6. **SAVE** butonuna tıklayın
7. YouTube'a tekrar bağlanmayı deneyin

⚠️ **Not:** Bu şekilde sadece eklediğiniz e-posta adresiyle giriş yapabilirsiniz.

### Çözüm 2: OAuth Consent Screen'i Production'a Almak (Kalıcı Çözüm)

Herkesin kullanabilmesi için production'a almanız gerekir:

#### Adım 1: OAuth Consent Screen Bilgilerini Doldurun

1. **Google Cloud Console** > **APIs & Services** > **OAuth consent screen**
2. Gerekli bilgileri doldurun:
   - **App name**: Mordiem
   - **User support email**: erayberat37@gmail.com
   - **Developer contact information**: erayberat37@gmail.com
   - **App logo** (opsiyonel)
   - **App domain**: mordiem.site
   - **Privacy policy URL** (gerekli): 
     - Bir privacy policy sayfası oluşturun veya
     - Geçici olarak: `https://mordiem.site/privacy` (bu sayfayı oluşturmanız gerekir)
   - **Terms of service URL** (opsiyonel)

#### Adım 2: Scopes (İzinler) Kontrolü

1. **Scopes** sekmesine gidin
2. Aşağıdaki scope'ların ekli olduğundan emin olun:
   - `https://www.googleapis.com/auth/youtube.readonly`
   - `https://www.googleapis.com/auth/youtube.force-ssl`

#### Adım 3: Test Kullanıcıları (Opsiyonel)

Production'a geçmeden önce test kullanıcıları ekleyebilirsiniz.

#### Adım 4: Production'a Geçiş

1. **"PUBLISH APP"** butonuna tıklayın
2. Uyarı mesajını okuyun ve onaylayın
3. App production moduna geçecek
4. **Google'ın verification sürecinden geçmeniz gerekebilir** (basit uygulamalar için genellikle gerekmez)

⚠️ **ÖNEMLİ:** Production'a geçtikten sonra **Privacy Policy URL'i zorunludur!**

#### Adım 5: Privacy Policy Sayfası Oluşturun (Gerekli)

Vercel/Netlify'da basit bir privacy policy sayfası oluşturun:

**`app/privacy/page.tsx`** dosyası oluşturun:
```tsx
export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1>Privacy Policy</h1>
      <p>Bu uygulama Spotify ve YouTube API'lerini kullanır...</p>
      {/* Privacy policy içeriğinizi buraya ekleyin */}
    </div>
  );
}
```

---

## ✅ KONTROL LİSTESİ

### Spotify için:
- [ ] Vercel/Netlify'da build başarılı mı?
- [ ] Environment variables doğru mu?
- [ ] `SPOTIFY_REDIRECT_URI` = `https://mordiem.site/api/spotify/callback`
- [ ] Spotify Developer Dashboard'da redirect URI ekli mi?
- [ ] Deployment yeniden yapıldı mı?

### YouTube için:
- [ ] Test kullanıcısı eklendi mi? (veya)
- [ ] OAuth consent screen production'da mı?
- [ ] Privacy policy sayfası oluşturuldu mu?
- [ ] Google Cloud Console'da redirect URI ekli mi?
- [ ] `YOUTUBE_REDIRECT_URI` = `https://mordiem.site/api/youtube/callback`

---

## 🔍 DEBUGGING İPUÇLARI

### Vercel Logları Kontrolü

1. Vercel Dashboard > Projeniz > **"Functions"** sekmesi
2. **API route'larını** göreceksiniz
3. Her route'a tıklayıp **logları** kontrol edin
4. Hata mesajlarını okuyun

### Browser Console Kontrolü

1. Browser'da **F12** tuşuna basın (Developer Tools)
2. **Console** sekmesine gidin
3. **Network** sekmesine gidin
4. Sayfayı yenileyin
5. Hatalı istekleri (kırmızı) kontrol edin

### Test URL'leri

- Spotify Auth: `https://mordiem.site/api/spotify/auth`
- YouTube Auth: `https://mordiem.site/api/youtube/auth`
- Status Check: `https://mordiem.site/api/spotify/status`
- Status Check: `https://mordiem.site/api/youtube/status`

---

## 📞 DESTEK

Sorun devam ederse:

1. **Vercel/Netlify loglarını** kontrol edin
2. **Browser console** hatalarını kontrol edin
3. **GitHub Issues** açabilirsiniz (eğer repo public ise)
4. **Hosting sağlayıcınızın desteği** ile iletişime geçin
