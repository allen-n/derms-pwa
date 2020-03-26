const version = 'v1/';
const assetsToCache = [
    '/',
    '/src.7ed060e2.js',
    '/src.7ed060e2.css',
    '/manifest.webmanifest',
    '/icon-128x128.3915c9ec.png',
    '/icon-256x256.3b420b72.png',
    '/icon-512x512.fd0e04dd.png',
];

// Cache the necessary files
self.addEventListener('install', (event) => {
    // Reasining src: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
    self.skipWaiting(); // forces activation of current Service worker

    // SW wont move on until 'caches' is resolved
    event.waitUntil(
        caches
            .open(version + 'assetsToCache')
            .then((cache) => cache.addAll(assetsToCache))
            .then(() => console.log('assets cached')),
    );
});

// Serve the cached files when the network fails
self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            }),
        );
    }
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });

// Delete old caches
// self.addEventListener('activate', function(event) {
//     event.waitUntil(
//       caches.keys().then(function(cacheNames) {
//         return Promise.all(
//           cacheNames.filter(function(cacheName) {
//             // Return true if you want to remove this cache,
//             // but remember that caches are shared across
//             // the whole origin
//           }).map(function(cacheName) {
//             return caches.delete(cacheName);
//           })
//         );
//       })
//     );
//   });

/**
 * Note:
 Use of --no-content-hash in package.json makes parcel src
 file prefixes dependent on location, not file contents,
 so we don;t have to change 'assetsToCache' too often
 */
