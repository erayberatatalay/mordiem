export const metadata = {
  title: 'Privacy Policy - Mordiem',
  description: 'Mordiem Privacy Policy',
};

export default function Privacy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">1. Veri Kullanımı</h2>
            <p className="text-gray-300 mb-6">
              Mordiem, Spotify ve YouTube API'lerini kullanarak müzik ve video kontrolü sağlar. 
              Uygulama, OAuth 2.0 protokolü kullanarak güvenli bir şekilde Spotify ve YouTube 
              hesaplarınıza erişir.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">2. Toplanan Veriler</h2>
            <p className="text-gray-300 mb-6">
              Uygulama şu verileri toplar:
            </p>
            <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
              <li>Spotify OAuth token'ları (tarayıcı cookie'lerinde saklanır)</li>
              <li>YouTube OAuth token'ları (tarayıcı cookie'lerinde saklanır)</li>
              <li>Çalan şarkı bilgileri (sadece görüntüleme için)</li>
              <li>Video bilgileri (sadece görüntüleme için)</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">3. Veri Saklama</h2>
            <p className="text-gray-300 mb-6">
              OAuth token'ları sadece tarayıcınızın cookie'lerinde saklanır ve sunucuya 
              kaydedilmez. Bu token'lar, Spotify ve YouTube API'lerine erişmek için kullanılır.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">4. Üçüncü Taraf Servisleri</h2>
            <p className="text-gray-300 mb-6">
              Uygulama aşağıdaki üçüncü taraf servisleri kullanır:
            </p>
            <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
              <li><strong>Spotify Web API:</strong> Müzik kontrolü için</li>
              <li><strong>YouTube Data API v3:</strong> Video kontrolü için</li>
            </ul>
            <p className="text-gray-300 mb-6">
              Bu servislerin kendi gizlilik politikaları geçerlidir.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">5. Cookie Kullanımı</h2>
            <p className="text-gray-300 mb-6">
              Uygulama, OAuth token'larını saklamak için HTTP-only cookie'ler kullanır. 
              Bu cookie'ler sadece sunucu tarafında okunabilir ve güvenlik için tasarlanmıştır.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">6. Veri Paylaşımı</h2>
            <p className="text-gray-300 mb-6">
              Uygulama, toplanan verileri üçüncü taraflarla paylaşmaz. Veriler sadece 
              Spotify ve YouTube API'leri ile paylaşılır ve bu, uygulamanın çalışması için gereklidir.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">7. Güvenlik</h2>
            <p className="text-gray-300 mb-6">
              Uygulama, OAuth 2.0 protokolü kullanarak güvenli kimlik doğrulama sağlar. 
              Tüm API iletişimleri HTTPS üzerinden şifrelenir.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">8. İletişim</h2>
            <p className="text-gray-300 mb-6">
              Sorularınız için: erayberat37@gmail.com
            </p>

            <p className="text-gray-400 text-sm mt-8">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
