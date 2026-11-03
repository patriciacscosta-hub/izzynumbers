/* Izzy's Numbers - keeps the game working offline once it has been opened. */
const CACHE = 'izzy-numbers-v1';
const FILES = ['./', 'index.html', 'css/style.css', 'js/art.js', 'js/sound.js', 'js/fx.js', 'js/realms.js', 'js/game.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/apple-touch-icon.png'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
// Network first so updates arrive straight away; the cache is the fallback when offline.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
