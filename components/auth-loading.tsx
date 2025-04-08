"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function AuthLoading() {
  const [showBypass, setShowBypass] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Show bypass button after 10 seconds
    const timer = setTimeout(() => {
      setShowBypass(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleBypass = () => {
    // Use window.location for a hard navigation to ensure complete reset
    window.location.href = "/"
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mb-8 flex flex-col items-center">
        <div className="shimmer mb-6 h-16 w-16 rounded-full bg-primary/20"></div>
        <h1 className="mb-2 text-2xl font-bold">Authenticating...</h1>
        <p className="text-muted-foreground">Please wait while we securely sign you in</p>
      </div>

      <div className="relative h-2 w-64 overflow-hidden rounded-full bg-secondary">
        <div className="shimmer absolute inset-0 h-full w-full"></div>
      </div>

      {showBypass && (
        <div className="mt-8 flex flex-col items-center">
          <p className="mb-4 text-sm text-muted-foreground">Taking longer than expected?</p>
          <Button variant="outline" onClick={handleBypass} className="native-active-state">
            Return to Login
          </Button>
        </div>
      )}
    </div>
  )
}
