// Sayuni Saccos - service worker (08/11/2026)
var TOLEO = 'sayuni-shell-v1';
var FAILI = ['./', './index.html', './watumishi.html', './manifest.webmanifest', './manifest-watumishi.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/mark.png', './icons/apple-180.png', './icons/favicon-64.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(TOLEO).then(function (c) { return c.addAll(FAILI); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== TOLEO; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
// shell: network first, then cache. Data ya app (Apps Script) haihifadhiwi hapa - app yenyewe ina cache yake.
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin || e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (r) {
    var nakala = r.clone(); caches.open(TOLEO).then(function (c) { c.put(e.request, nakala); }); return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('./index.html'); }); }));
});
// Web Push (itawashwa hatua inayofuata)
self.addEventListener('push', function (e) {
  var d = {}; try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Sayuni Saccos', { body: d.body || '', icon: './icons/icon-192.png', badge: './icons/icon-192.png', data: { url: d.url || './' } }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ws) {
    for (var i = 0; i < ws.length; i++) { if ('focus' in ws[i]) return ws[i].focus(); }
    return clients.openWindow(e.notification.data && e.notification.data.url || './');
  }));
});
