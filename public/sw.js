const CACHE_NAME = 'sunnahguide-v3'; // Increment version to clear old caches
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
  const url = new URL(event.request.url);
  
  // Strategy for index.html (Network First)
  // This ensures users get the latest version pointing to the correct assets
  if (event.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request, {cache: 'no-cache'}).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Strategy for all other requests (Network First for asset safety)
  // We want to avoid serving stale assets that might point to nonexistent hashes
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
