"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Handle beforeinstallprompt event (for non-iOS devices)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show the install prompt banner
      setShowPrompt(true)
    }

    // Check if already installed as PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://")

    // Only show for non-installed PWAs
    if (!isStandalone) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

      // For iOS, we'll show a custom prompt after a delay
      if (isIOSDevice) {
        const timer = setTimeout(() => {
          setShowPrompt(true)
        }, 5000)
        return () => clearTimeout(timer)
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!isIOS && deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      // We've used the prompt, and can't use it again, discard it
      setDeferredPrompt(null)
      // Hide our banner regardless of outcome
      setShowPrompt(false)
    }
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
    // Store in localStorage to prevent showing again for a while
    localStorage.setItem("pwaPromptDismissed", Date.now().toString())
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 mx-auto max-w-sm p-4">
      <div className="glass-dark rounded-lg p-4 shadow-lg">
        <button
          onClick={dismissPrompt}
          className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <h3 className="mb-2 text-sm font-semibold">Install App</h3>

        {isIOS ? (
          <p className="text-xs text-gray-300">
            To install this app, tap the share icon <span className="inline-block">⎙</span> and then "Add to Home
            Screen"
          </p>
        ) : (
          <>
            <p className="mb-3 text-xs text-gray-300">Install this app on your device for a better experience</p>
            <button
              onClick={handleInstall}
              className="w-full rounded-md bg-primary py-2 text-xs font-medium text-white"
            >
              Install
            </button>
          </>
        )}
      </div>
    </div>
  )
}
