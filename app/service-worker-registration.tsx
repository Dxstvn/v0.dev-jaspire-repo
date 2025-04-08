"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && window.workbox !== undefined) {
      // Register the service worker
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope)

            // Check for updates
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    // New service worker available, show update notification
                    if (window.confirm("New version available! Reload to update?")) {
                      window.location.reload()
                    }
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error)
          })
      }

      // Handle offline status changes
      window.addEventListener("online", () => {
        console.log("App is online")
        document.dispatchEvent(new CustomEvent("app-online"))
      })

      window.addEventListener("offline", () => {
        console.log("App is offline")
        document.dispatchEvent(new CustomEvent("app-offline"))
      })
    }
  }, [])

  return null
}
