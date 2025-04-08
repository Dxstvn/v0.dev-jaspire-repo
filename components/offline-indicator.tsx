"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Check online status on mount
    setIsOffline(!navigator.onLine)

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Listen for custom events from service worker
    document.addEventListener("app-online", handleOnline)
    document.addEventListener("app-offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      document.removeEventListener("app-online", handleOnline)
      document.removeEventListener("app-offline", handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-900 text-white p-2 text-center"
        >
          <div className="flex items-center justify-center">
            <WifiOff className="h-4 w-4 mr-2" />
            <span>You're offline. Some features may be unavailable.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
