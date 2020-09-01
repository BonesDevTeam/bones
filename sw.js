const appCache = '01.09-21:28';

self.addEventListener('install', (e) => {
  skipWaiting();
  e.waitUntil(
    (async () => {
      let response = await fetch('./files.json')
      let offlineFiles = await response.json()
      let cache = await caches.open(appCache)
      cache.addAll(offlineFiles)
    })()
  );
});

self.addEventListener('activate', (e) => {
  clients.claim();
  e.waitUntil(
    caches.keys().then( (keys) => {
      Promise.all(
        keys.map( (key) => key == appCache || caches.delete(key) )
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('files.json')) return;
  let cacheResponse = null;
  let fetchResponse = null;
  e.respondWith(
    (async () => {
      cacheResponse = await caches.match(e.request);
      if (cacheResponse) return cacheResponse;
      fetchResponse = await addCache(e.request);
      return fetchResponse;
    })()
  );
});

async function addCache(request) {
  let fetchResponse = new Response(new Blob, { 'status': 400, 'statusText': 'Bad request' });
  let response = await fetch(request);
  if (response.ok) {
    let cache = await caches.open(appCache);
    cache.put(request, response.clone());
    fetchResponse = response;
  };
  return fetchResponse;
};
