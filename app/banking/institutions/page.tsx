"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function InstitutionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      console.log("Initiating Connect flow...")

      // Make the API request
      const response = await fetch("/api/mastercard/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redirectUrl: `${window.location.origin}/api/mastercard/handle-connect-callback`,
        }),
      })

      console.log("API response status:", response.status)

      // Get the response as text first
      const responseText = await response.text()
      console.log("API response text:", responseText)

      // If the response is empty, show an error
      if (!responseText) {
        setDebugInfo("Empty response received from server")
        throw new Error("Server returned an empty response")
      }

      // Try to parse the response as JSON
      let data
      try {
        data = JSON.parse(responseText)
        console.log("Parsed response data:", data)
      } catch (parseError) {
        setDebugInfo(`Failed to parse response as JSON: ${responseText}`)
        throw new Error("Invalid JSON response from server")
      }

      // Check if the response contains an error
      if (data.error) {
        setDebugInfo(`Server error: ${data.error}`)
        throw new Error(data.error)
      }

      // Check if the response contains a connectUrl
      if (!data.connectUrl) {
        setDebugInfo(`Missing connectUrl in response: ${JSON.stringify(data)}`)
        throw new Error("No connect URL in response")
      }

      // Redirect to the Connect URL
      console.log("Redirecting to Connect URL:", data.connectUrl)
      window.location.href = data.connectUrl
    } catch (err: any) {
      console.error("Connect error:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connect Your Bank Account</CardTitle>
          <CardDescription>Connect your bank account to enable automatic cashback investments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleConnect} disabled={loading} className="w-full">
            {loading ? "Connecting..." : "Connect with Mastercard Open Banking"}
          </Button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {debugInfo && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
              <p className="font-medium">Debug Info:</p>
              <p className="break-all">{debugInfo}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

