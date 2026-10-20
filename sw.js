/* SimplyCAD Pro · funzionamento senza internet. A ogni nuova versione cambia VERSIONE. */
const VERSIONE = 'simplycad-v13.6';
const BASE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable.png'];
const LIBRERIE = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIONE).then(async c => {
    await c.addAll(BASE);
    await Promise.all(LIBRERIE.map(u => fetch(u, {mode: 'no-cors'}).then(r => c.put(u, r)).catch(() => {})));
  }));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('simplycad-') && k !== VERSIONE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'aggiorna') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url), pagina = req.mode === 'navigate' || (url.origin === location.origin && /\/(index\.html)?$/.test(url.pathname));
  if (pagina) {   /* la pagina: prima dalla rete (versione nuova), senza rete dalla copia salvata */
    e.respondWith(fetch(req).then(r => { const k = r.clone(); caches.open(VERSIONE).then(c => c.put('./index.html', k)); return r; }).catch(() => caches.match('./index.html').then(r => r || caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(req.url).then(hit => hit || fetch(req).then(r => {   /* il resto: dalla copia salvata, altrimenti dalla rete (e lo si conserva) */
    if (r && (r.ok || r.type === 'opaque')) { const k = r.clone(); caches.open(VERSIONE).then(c => c.put(req.url, k)); }
    return r;
  })));
});
