const staticCache = 'static-v1';
const dynamicCache = 'dynamic-v1';

const assets = [
  './css/layout.css',
  './css/primary.css',
  './',
  './index.html',
  './icons/external-link-square-alt-solid.svg',
  './icons/github-mark-icon.svg',
  './icons/github-mark-white.svg',
  './icons/noun-Bicep-icon.svg',
  './icons/noun-Brain-icon.svg',
  './icons/noun-Checklist-icon.svg',
  './icons/noun-snap-icon.svg',
  './icons/redux-icon.svg',
  './icons/redux-white-icon.svg',
  './icons/search-icon.svg',
  './pages/offline.html'
]

self.addEventListener('install', async event => {
  const cache = await caches.open(staticCache);
  cache.addAll(assets);
})

self.addEventListener('activate', async event => {
  const keys = await caches.keys();
  const oldCache = keys.filter(key => key !== staticCache && key !== dynamicCache);
  oldCache.forEach(key => caches.delete(key));
})

self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
        .then(fetchResponse => caches.open(dynamicCache)
          .then(cache => {
            cache.put(event.request.url, fetchResponse.clone())
            return fetchResponse
          }
        )
      ).catch(() => caches.match('/pages/offline.html'))
    )
  })