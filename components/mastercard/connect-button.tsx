"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ConnectButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ConnectButton({ className = "", variant = "default", size = "default" }: ConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    try {
      setIsLoading(true)

      // Generate the redirect URI
      const redirectUri = `${window.location.origin}/banking/connect-callback`
      console.log("Using redirect URI:", redirectUri)

      // Call our API to generate a Connect URL
      console.log("Requesting Connect URL from API...")

      const response = await fetch("/api/mastercard/generate-connect-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ redirectUri }),
      })

      // Get the response text first for better error handling
      let responseText
      try {
        responseText = await response.text()
        console.log("API response text:", responseText)
      } catch (textError) {
        console.error("Error getting response text:", textError)
        throw new Error("Failed to read API response")
      }

      // Try to parse as JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse API response as JSON:", parseError, "Response:", responseText)
        throw new Error(`API returned invalid JSON: ${responseText.substring(0, 100)}...`)
      }

      // Check if the response was successful
      if (!response.ok) {
        console.error("API error response:", data)
        throw new Error(data.error || data.details || `API error: ${response.status} ${response.statusText}`)
      }

      // Check if the link is present
      if (!data || !data.link) {
        throw new Error("Connect URL is missing from response")
      }

      // Log the URL we're redirecting to
      console.log("Redirecting to Connect URL:", data.link)

      // Redirect to the Connect URL
      window.location.href = data.link
    } catch (error: any) {
      console.error("Connection error:", error)
      toast({
        title: "Connection Error",
        description: error.message || "Unable to initiate the connection process.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className={`rounded-full ${className}`}
      variant={variant}
      size={size}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Connect Card
        </>
      )}
    </Button>
  )
}
