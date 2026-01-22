const CACHE_VERSION = 'v2.0.1-icon-fix'; // Update versi ini jika ada perubahan file core (HTML structure/assets names)
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const ROOT = '/'; // Sesuaikan dengan path deployment (misal '/' jika di root domain)

// Assets inti yang WAJIB ada agar aplikasi jalan offline (App Shell)
const PRECACHE_ASSETS = [
  `${ROOT}`,
  `${ROOT}index.html`,
  `${ROOT}offline.html`,
  `${ROOT}manifest.webmanifest`,
  // `${ROOT}assets/css/styles.css`, // Enable jika sudah migrasi ke CSS fisil
  `${ROOT}icons/icon-192.png`,
  `${ROOT}icons/icon-512.png`
];

// URLs yang TIDAK BOLEH di-cache (API, Database, Auth)
const IGNORED_DOMAINS = [
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'www.googleapis.com' // Analytics dll
];

self.addEventListener('install', (event) => {
  // Pre-cache aset kritis
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  // Hapus cache lawas yang tidak cocok dengan versi sekarang
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== STATIC_CACHE && key !== RUNTIME_CACHE) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. SKIP request ke API Firebase/Google (biar realtime)
  if (IGNORED_DOMAINS.some(domain => url.hostname.includes(domain))) {
    return;
  }
  // 1.b SKIP request non-GET (POST/PUT/DELETE jangan di-cache)
  if (req.method !== 'GET') {
    return;
  }

  // 1.c SKIP request non-HTTP/HTTPS (Extension, data:, etc)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 2. STRATEGI: NETWORK FIRST (Untuk HTML)
  // Cocok untuk file yang sering berubah isinya (content).
  // Jika online -> ambil terbaru. Jika offline -> ambil cache.
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          return caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(req, networkRes.clone());
            return networkRes;
          });
        })
        .catch(() => {
          return caches.match(req).then((cachedRes) => {
            return cachedRes || caches.match(`${ROOT}offline.html`);
          });
        })
    );
    return;
  }

  // 3. STRATEGI: STALE-WHILE-REVALIDATE (Untuk CSS, JS, Images)
  // Sangat cepat. Tampilkan cache dulu, lalu download update di background untuk kunjungan berikutnya.
  // Ini solusi agar Anda TIDAK PERLU ganti versi cache manual tiap update kecil di aset.
  if (/\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|woff2?|json)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        const fetchPromise = fetch(req).then((networkRes) => {
           return caches.open(RUNTIME_CACHE).then((cache) => {
             cache.put(req, networkRes.clone());
             return networkRes;
           });
        });
        
        // Kembalikan cache jika ada, jika tidak tunggu network
        return cachedRes || fetchPromise;
      })
    );
    return;
  }

  // 4. Default Fallback
  event.respondWith(
    caches.match(req).then((cachedRes) => {
       return cachedRes || fetch(req);
    })
  );
});
