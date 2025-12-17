// SAYA UBAH VERSI CACHE MENJADI v3 AGAR BROWSER MEMUAT ULANG SCRIPT BARU
const CACHE = 'dvteam-v3';
const ASSETS = [
    './',
    'index.html',
    'dashboard.html',
    'list.html',
    'network.html',
    'style.css',
    'script.js',
    'icon.png'
];

// Install: Cache semua file
self.addEventListener('install', e => {
    self.skipWaiting(); // Paksa SW baru untuk segera aktif
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

// Activate: Hapus cache lama (v1, v2, dll)
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(k => {
                if (k !== CACHE) return caches.delete(k);
            })
        ))
    );
    self.clients.claim(); // Ambil alih kontrol halaman segera
});

// Fetch: Ambil dari cache, jika tidak ada ambil dari jaringan
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
