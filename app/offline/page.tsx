"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function Offline() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check online status on mount
    setIsOnline(navigator.onLine)

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mb-6">
        <WifiOff className="h-10 w-10 text-red-400" />
      </div>

      <h1 className="text-3xl font-bold mb-4">You're Offline</h1>

      <p className="text-gray-400 mb-8 max-w-md">
        {isOnline
          ? "Your connection has been restored! You can continue using the app."
          : "It looks like you've lost your internet connection. Some features may be unavailable until you're back online."}
      </p>

      <div className="space-y-4">
        {isOnline ? (
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700">Return to App</Button>
          </Link>
        ) : (
          <Button onClick={handleRefresh} className="bg-gray-700 hover:bg-gray-600 flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>

      <div className="mt-12 text-sm text-gray-500">
        <p>You can still access previously loaded pages while offline.</p>
      </div>
    </div>
  )
}
