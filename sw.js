// /arabread_website---Salin/sw.js
const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const ROOT = '/arabread_website---Salin/';

// Halaman yang kita precache (jalan offline)
const PRECACHE_ASSETS = [
  `${ROOT}`,
  `${ROOT}index.html`,
  `${ROOT}cadangan.html`,

  // QUIZ
  `${ROOT}quiz-animals.html`,
  `${ROOT}quiz-family.html`,
  `${ROOT}quiz-school.html`,
  `${ROOT}quiz-taaruf.html`,

  // READING
  `${ROOT}reading-animals.html`,
  `${ROOT}reading-family.html`,
  `${ROOT}reading-school.html`,
  `${ROOT}reading-taaruf.html`,

  // VOCABULARY
  `${ROOT}vocabulary-animals.html`,
  `${ROOT}vocabulary-family.html`,
  `${ROOT}vocabulary-school.html`,
  `${ROOT}vocabulary-taaruf.html`,

  // JS lokal (ubah/ tambah jika ada file lain)
  `${ROOT}presence.js`,

  // Offline fallback + ikon
  `${ROOT}offline.html`,
  `${ROOT}icons/icon-192.png`,
  `${ROOT}icons/icon-512.png`,
];

// Install: simpan file penting
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(PRECACHE_ASSETS)));
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Hanya kelola request origin sendiri (GitHub Pages domain kamu)
  if (url.origin !== location.origin) return;

  // HTML: network-first (agar update cepat), fallback cache/offline
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => (await caches.match(req)) || caches.match(`${ROOT}offline.html`))
    );
    return;
  }

  // Audio besar → cache-first (hemat data saat diputar ulang)
  if (url.pathname.startsWith(`${ROOT}media/audio/`)) {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached ||
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
          return res;
        })
      )
    );
    return;
  }

  // Aset statis umum (css/js/png/jpg/svg/woff) → cache-first
  if (/\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached ||
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
          return res;
        })
      )
    );
    return;
  }

  // Default
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
