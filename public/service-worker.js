// This is the service worker for Jaspire PWA

// Cache name with version
const CACHE_NAME = "jaspire-cache-v1"

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Add other critical assets here
]

// Install event - precache critical assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")

  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting()

  // Precache critical assets
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching app shell and content")
        return cache.addAll(PRECACHE_ASSETS)
      })
      .catch((error) => {
        console.error("Service Worker: Precaching failed:", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")

  // Take control of all clients immediately
  event.waitUntil(self.clients.claim())

  // Remove old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Clearing old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Fetch event - network-first strategy with fallback to cache
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // Skip browser extension requests
  if (event.request.url.includes("/extension/")) {
    return
  }

  // Skip Firebase authentication requests
  if (
    event.request.url.includes("/__/auth/") ||
    event.request.url.includes("/api/auth") ||
    event.request.url.includes("googleapis.com/") ||
    event.request.url.includes("firebaseapp.com/")
  ) {
    return
  }

  // Network-first strategy with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If we got a valid response, clone it and cache it
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          // For navigation requests, return the offline page
          if (event.request.mode === "navigate") {
            return caches.match("/")
          }

          // Otherwise, return a simple error response
          return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          })
        })
      }),
  )
})

// Handle push notifications
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body || "New notification from Jaspire",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
    }

    event.waitUntil(self.registration.showNotification(data.title || "Jaspire", options))
  }
})

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // If a window client is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus()
        }
      }

      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || "/")
      }
    }),
  )
})
