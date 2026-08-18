// Sefaperp Foods Service Worker — DISABLED for development
// All caching has been removed so changes show up immediately in the browser.
// Re-enable for production once the design is finalized.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Delete ALL existing caches to force a clean slate
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', () => {
  // No fetch interception — browser always goes to network
});
