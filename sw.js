
const CACHE_NAME = 'pharmasmart-v2-offline';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  '/types.ts',
  '/constants.tsx',
  '/translations.ts',
  '/App.tsx',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdn-icons-png.flaticon.com/512/883/883356.png',
  'https://picsum.photos/seed/doc/100/100'
];

// Install Event: Cache all essential UI assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event: Cache-First Strategy for static assets, Network-Fallback for API
self.addEventListener('fetch', (event) => {
  // Ignore Google GenAI API calls from caching as they require live connection
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Cache new successful requests dynamically
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Silent fail for offline fetch
        console.log('SW: Fetch failed, user is likely offline.');
      });
    })
  );
});
