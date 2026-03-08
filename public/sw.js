const CACHE_NAME = 'sunnahguide-v2'; // Increment version to clear old caches
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force new SW to become active immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use no-cache to ensure we get the latest files from the network
      return Promise.all(
        ASSETS.map(url => fetch(url, {cache: 'no-cache'}).then(response => {
           if(response.ok) return cache.put(url, response);
        }))
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Allow all fetches to go to network first if not in cache, 
  // and bypass cache for JS/CSS assets to avoid hash mismatch
  const url = new URL(event.request.url);
  if (url.pathname.includes('/assets/')) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
