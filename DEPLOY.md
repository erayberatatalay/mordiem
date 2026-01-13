# FTP ile Sunucuya Deployment Rehberi

## ⚠️ ÖNEMLİ NOTLAR

Next.js uygulaması bir **Node.js uygulamasıdır**. Bu yüzden:

1. **Sunucunuzda Node.js kurulu olmalı** (18+ versiyonu)
2. FTP sadece dosyaları yüklemek için kullanılır
3. Sunucuda uygulama **build edilmeli** ve **çalıştırılmalı**
4. Sunucuda **PM2** veya benzeri bir process manager kullanmanız önerilir

## 📋 GEREKLİ BİLGİLER

Sunucu bilgileriniz:
- **FTP Adresi**: ftp.mordiem.site
- **Kullanıcı Adı**: mordiems
- **Şifre**: 69csl64SMl

⚠️ **GÜVENLİK UYARISI**: Bu bilgileri paylaştıktan sonra şifrenizi değiştirmeniz önerilir!

## 📦 YÜKLENECEK DOSYALAR

FTP ile şu dosya ve klasörleri yükleyin:

### ✅ Yüklenecekler:
- `app/` klasörü (tüm içerik)
- `components/` klasörü (tüm içerik)
- `lib/` klasörü (tüm içerik)
- `public/` klasörü (varsa, tüm içerik)
- `package.json`
- `package-lock.json` (varsa)
- `tsconfig.json`
- `next.config.mjs`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `.gitignore`
- `.env.local` (önemli! API anahtarlarınızla)

### ❌ YÜKLENMEYECEKLER:
- `node_modules/` klasörü (sunucuda npm install ile yüklenecek)
- `.next/` klasörü (sunucuda build ile oluşturulacak)
- `.git/` klasörü (varsa)
- `README.md` (opsiyonel)

## 🚀 DEPLOYMENT ADIMLARI

### ADIM 1: Lokal Bilgisayarda Hazırlık

1. **Projeyi build edin** (isteğe bağlı, sunucuda da yapabilirsiniz):
```bash
npm install
npm run build
```

2. **.env.local dosyasını hazırlayın**:
```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://mordiem.site/api/spotify/callback

YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_REDIRECT_URI=https://mordiem.site/api/youtube/callback

NEXT_PUBLIC_BASE_URL=https://mordiem.site
```

⚠️ **ÖNEMLİ**: Production için redirect URI'ları `https://mordiem.site` olarak ayarlayın!

### ADIM 2: FTP ile Dosya Yükleme

1. **FTP Client Kullanın** (FileZilla, WinSCP, Cyberduck vb.)

2. **Bağlantı Bilgileri**:
   - **Host**: ftp.mordiem.site
   - **Kullanıcı Adı**: mordiems
   - **Şifre**: 69csl64SMl
   - **Port**: 21 (standart FTP)

3. **Dosyaları Yükleyin**:
   - Yukarıda listelenen tüm dosya ve klasörleri sunucuya yükleyin
   - Genellikle sunucuda `public_html/`, `www/`, veya `htdocs/` klasörüne yüklenir
   - Hosting sağlayıcınızdan doğru klasörü öğrenin

### ADIM 3: Sunucuda Kurulum (SSH ile)

FTP ile dosyaları yükledikten sonra, **SSH ile sunucuya bağlanmanız** gerekiyor:

1. **SSH ile Bağlanın**:
```bash
ssh mordiems@mordiem.site
# veya
ssh mordiems@ftp.mordiem.site
```

2. **Proje Klasörüne Gidin**:
```bash
cd public_html
# veya hosting sağlayıcınızın belirttiği klasör
```

3. **Node.js Versiyonunu Kontrol Edin**:
```bash
node --version
# Node.js 18+ olmalı
```

4. **Bağımlılıkları Yükleyin**:
```bash
npm install --production
```

5. **Uygulamayı Build Edin**:
```bash
npm run build
```

6. **.env.local Dosyasını Kontrol Edin**:
```bash
cat .env.local
# API anahtarlarının doğru olduğundan emin olun
```

### ADIM 4: Uygulamayı Çalıştırma

#### Seçenek 1: PM2 ile (ÖNERİLEN)

PM2, Node.js uygulamalarını arka planda çalıştırmak için kullanılır:

1. **PM2'yi yükleyin** (global):
```bash
npm install -g pm2
```

2. **Uygulamayı PM2 ile başlatın**:
```bash
pm2 start npm --name "mordiem" -- start
```

3. **PM2'yi sistem açılışında başlatmak için**:
```bash
pm2 startup
pm2 save
```

4. **Durumu kontrol edin**:
```bash
pm2 status
pm2 logs mordiem
```

#### Seçenek 2: Direkt Çalıştırma (Test için)

```bash
npm start
```

⚠️ **Not**: Bu şekilde çalıştırırsanız, SSH bağlantınızı kapatınca uygulama durur. PM2 kullanmanız önerilir.

### ADIM 5: Port ve Domain Ayarları

Next.js varsayılan olarak **3000 portunda** çalışır. Ancak web siteniz genellikle **80 (HTTP)** veya **443 (HTTPS)** portunda çalışır.

**Çözüm seçenekleri**:

#### Seçenek A: Reverse Proxy (Nginx)

Nginx kuruluysa, reverse proxy ayarı yapın:

```nginx
server {
    listen 80;
    server_name mordiem.site;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Seçenek B: Port Değiştirme

`.env.local` dosyasına ekleyin:
```env
PORT=80
```

Ve `package.json`'da start script'ini değiştirin:
```json
"start": "next start -p ${PORT:-3000}"
```

#### Seçenek C: Hosting Sağlayıcınızın Panelini Kullanın

Bazı hosting sağlayıcıları Node.js uygulamaları için özel ayarlar sunar. Hosting sağlayıcınızın dokümantasyonuna bakın.

## 🔍 SORUN GİDERME

### "Command not found: node" hatası
- Node.js sunucuda kurulu değil
- Hosting sağlayıcınızdan Node.js kurulum desteği isteyin

### "Port 3000 already in use" hatası
- Başka bir uygulama 3000 portunu kullanıyor
- Farklı bir port kullanın veya çakışan uygulamayı durdurun

### API'ler çalışmıyor
- `.env.local` dosyasını kontrol edin
- Redirect URI'ların production URL'si ile eşleştiğinden emin olun
- Spotify ve YouTube API ayarlarında redirect URI'ları güncelleyin

### "Module not found" hatası
- `npm install` komutunu çalıştırın
- `node_modules` klasörünün mevcut olduğundan emin olun

## 📞 ALTERNATİF ÇÖZÜM: Vercel/Netlify

Eğer sunucunuzda Node.js yoksa veya yukarıdaki adımlar zor geliyorsa, Next.js uygulamaları için özel olarak tasarlanmış **Vercel** veya **Netlify** kullanabilirsiniz:

- **Vercel**: https://vercel.com (Next.js'in yaratıcıları tarafından)
- **Netlify**: https://netlify.com

Bu platformlar:
- Ücretsiz planlar sunar
- Otomatik deployment yapar
- SSL sertifikası sağlar
- Git entegrasyonu ile kolay güncelleme

## ✅ KONTROL LİSTESİ

- [ ] .env.local dosyasını production URL'leri ile hazırladım
- [ ] Spotify API redirect URI'larını güncelledim
- [ ] YouTube API redirect URI'larını güncelledim
- [ ] Dosyaları FTP ile yükledim
- [ ] SSH ile sunucuya bağlandım
- [ ] npm install çalıştırdım
- [ ] npm run build çalıştırdım
- [ ] PM2 ile uygulamayı başlattım
- [ ] Port/Domain ayarlarını yaptım
- [ ] Site çalışıyor mu test ettim

## 🎉 BAŞARILI DEPLOYMENT SONRASI

Uygulamanız `https://mordiem.site` adresinde çalışıyor olmalı!

Sorularınız varsa hosting sağlayıcınızın destek ekibiyle iletişime geçebilirsiniz.
