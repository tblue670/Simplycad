/* Contabilità Cantieri v03.2 - cache per l'apertura veloce e senza rete.
   I dati dell'app NON passano da qui: restano nel browser (e nel backup). */
const CACHE = 'cantieri-v04.2';
const BASE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const mine = u.origin === location.origin;
  const lib = u.hostname === 'cdnjs.cloudflare.com' || u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if (!mine && !lib) return;
  if (mine) {
    // pagina e file dell'app: prima la rete (versione aggiornata), se manca la rete usa la copia
    e.respondWith(fetch(r, { cache: 'no-cache' }).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; }).catch(() => caches.match(r).then(m => m || caches.match('./index.html'))));
  } else {
    // librerie esterne (Excel, PDF, caratteri): copia salvata, aggiornata in secondo piano
    e.respondWith(caches.match(r).then(m => { const net = fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; }).catch(() => m); return m || net; }));
  }
});
