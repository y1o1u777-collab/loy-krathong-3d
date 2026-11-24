const CACHE_NAME = 'loy-krathong-3d-v2'
const APP_BASE = new URL('./', self.registration.scope)
const APP_SHELL = [
  './',
  './manifest.webmanifest',
  './favicon.svg',
  './apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
].map((path) => new URL(path, APP_BASE).href)
const APP_ENTRY = new URL('./', APP_BASE).href
const ASSET_PREFIX = new URL('./assets/', APP_BASE).pathname

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request)
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(APP_ENTRY, response.clone())
        }
        return response
      } catch {
        return (await caches.match(APP_ENTRY)) || Response.error()
      }
    })())
    return
  }

  if (url.pathname.startsWith(ASSET_PREFIX) || /\.(js|css|svg|png|woff2?)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(request)
      if (cached) return cached
      const response = await fetch(request)
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME)
        await cache.put(request, response.clone())
      }
      return response
    })())
  }
})
