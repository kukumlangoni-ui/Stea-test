// STEA Service Worker — Robust offline & PWA support
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const CACHE_NAME = `stea-v${BUILD_DATE}`;

const PRECACHE_ASSETS = [
  '/',
  '/student',
  '/duka/phones',
  '/prompts',
  '/digital-tools',
  '/websites',
  '/courses',
  '/tech-hub',
  '/offline.html',
  '/site.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .catch(() => console.warn('Pre-caching encountered issues, some assets may not be cached.'))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // API/Firebase calls — Network first with fallback
  if (
    request.url.includes('firebase') ||
    request.url.includes('firestore') ||
    request.url.includes('googleapis') ||
    request.url.includes('/api/')
  ) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Not GET
  if (request.method !== 'GET') return;

  // NAVIGATION — network first, fallback to offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then(cached => {
            return cached || caches.match('/offline.html');
          }).catch(() => caches.match('/offline.html'))
        )
    );
    return;
  }

  // HASHED JS/CSS ASSETS — cache first (immutable)
  if (/\/assets\/[^/]+-[a-f0-9]{8,}\.(js|css|woff2?)/.test(request.url)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return response;
        }).catch(err => console.warn('Fetching asset failed', err));
      })
    );
    return;
  }

  // IMAGES — stale-while-revalidate
  if (/\.(png|jpg|jpeg|svg|webp|gif|ico)$/.test(request.url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const fetchPromise = fetch(request).then(response => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // EVERYTHING ELSE — network first
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Sync handler
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    console.log('Background sync activated for forms');
    // Actual implementation depends on local indexedDB usage
  }
});

// Notifications click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it and navigate
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url && 'focus' in client) {
          return client.focus().then(c => c.navigate(urlToOpen));
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
