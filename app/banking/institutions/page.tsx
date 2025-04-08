// app/banking/institutions/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Institutions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleConnect = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Generated redirect URL:", `${window.location.origin}/banking/connect-callback`)
      console.log("Requesting Connect URL from API")

      const response = await fetch("/api/mastercard/institutions", {
        // Change to the correct endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redirectUrl: `${window.location.origin}/banking/connect-callback`,
        }),
      })

      console.log("Response status:", response.status)
      const text = await response.text()
      console.log("Raw response body:", text)

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} - ${text || "No response body"}`)
      }

      if (!text) {
        throw new Error("Empty response body received")
      }

      const data = JSON.parse(text)
      if (!data.connectUrl) {
        throw new Error("No Connect URL in response")
      }

      console.log("Connect URL received:", data.connectUrl)
      console.log("Redirecting to Connect URL")
      router.push(data.connectUrl) // Use router.push for better navigation
    } catch (err: any) {
      console.error("Failed to parse Connect URL API response:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Connect Your Bank</h1>
      <button
        onClick={handleConnect}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Connecting..." : "Connect Card"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
