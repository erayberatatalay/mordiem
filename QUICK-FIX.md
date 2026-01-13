# Hızlı Çözüm Rehberi

## 🔴 ŞU ANKİ HATALARIN ÇÖZÜMÜ

### HATA 1: 404 - Spotify Callback (ÖNCELİKLİ)

**Sorun:** `https://mordiem.site/api/spotify/callback` çalışmıyor

**Hızlı Çözüm:**

1. **Vercel Dashboard'a gidin**
2. **Projenize tıklayın**
3. **"Deployments"** sekmesine gidin
4. Son deployment'ın başarılı olup olmadığını kontrol edin
5. Eğer başarısızsa, **"Redeploy"** butonuna tıklayın
6. Eğer başarılıysa ama çalışmıyorsa:
   - **Environment Variables** kontrol edin
   - Tüm değişkenlerin doğru olduğundan emin olun
   - **"Redeploy"** yapın

**Environment Variables Kontrolü:**
```
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REDIRECT_URI=https://mordiem.site/api/spotify/callback
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REDIRECT_URI=https://mordiem.site/api/youtube/callback
NEXT_PUBLIC_BASE_URL=https://mordiem.site
```

---

### HATA 2: Google OAuth Verification (HIZLI ÇÖZÜM)

**Sorun:** YouTube API erişimi reddediliyor

**Hızlı Çözüm (5 dakika):**

1. **Google Cloud Console'a gidin**: https://console.cloud.google.com/
2. **APIs & Services** > **OAuth consent screen** menüsüne gidin
3. **"Test users"** sekmesine gidin
4. **"+ ADD USERS"** butonuna tıklayın
5. Şu e-posta adresini ekleyin: `erayberat37@gmail.com`
6. **SAVE** butonuna tıklayın
7. YouTube'a tekrar bağlanmayı deneyin

⚠️ **Not:** Bu şekilde sadece sizin e-posta adresinizle giriş yapabilirsiniz. 
Arkadaşlarınızın da kullanabilmesi için OAuth consent screen'i production'a almanız gerekir (TROUBLESHOOTING.md dosyasına bakın).

---

## ✅ KONTROL LİSTESİ (Şimdi Yapılacaklar)

- [ ] Vercel'de deployment başarılı mı kontrol et
- [ ] Environment variables doğru mu kontrol et
- [ ] Vercel'de "Redeploy" yap
- [ ] Google Cloud Console'da test kullanıcısı ekle (erayberat37@gmail.com)
- [ ] Privacy policy sayfası oluştur (app/privacy/page.tsx dosyası eklendi)
- [ ] Privacy policy'yi deploy et
- [ ] Spotify'a tekrar bağlanmayı dene
- [ ] YouTube'a tekrar bağlanmayı dene

---

## 📝 SONRAKI ADIMLAR

1. **Privacy Policy'yi oluşturun** (app/privacy/page.tsx dosyası hazır)
2. **GitHub'a push edin** (privacy page için)
3. **Vercel otomatik deploy yapacak**
4. **OAuth consent screen'i production'a alın** (TROUBLESHOOTING.md'ye bakın)

---

## 🆘 HALA ÇALIŞMIYORSA

1. **Vercel loglarını kontrol edin:**
   - Dashboard > Projeniz > Functions > API route'ları > Loglar

2. **Browser console'u kontrol edin:**
   - F12 > Console sekmesi
   - F12 > Network sekmesi

3. **TROUBLESHOOTING.md dosyasını okuyun** (daha detaylı çözümler için)
