const CACHE_NAME = 'andina-facility-v3';
const urlsToCache = [
  './',
  './index.html',
  './portal2.html',
  './offline.html',
  './static/img/fondo.webp',
  './static/img/icono.webp',
  './static/img/icono.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).catch(error => {
          // Si es una navegación (link a otra página) y falla por red, mostramos offline.html
          if (event.request.mode === 'navigate') {
            return caches.match('./offline.html');
          }
          throw error;
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
