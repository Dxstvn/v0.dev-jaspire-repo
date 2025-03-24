"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, ExternalLink } from "lucide-react"
import { mastercardApi } from "@/lib/mastercard-api"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ConnectButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | undefined
  size?: "default" | "sm" | "lg" | "icon" | undefined
  className?: string
  onSuccess?: () => void
}

export function ConnectButton({
  variant = "default",
  size = "default",
  className = "",
  onSuccess,
}: ConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Generate the redirect URL (current origin + callback path)
      const redirectUrl = `${window.location.origin}/banking/connect-callback`
      console.log("Generated redirect URL:", redirectUrl)

      // Get the Connect URL from the API
      console.log("Requesting Connect URL from API")

      try {
        const connectUrl = await mastercardApi.generateConnectUrl(redirectUrl)

        // Log the URL for debugging
        console.log("Connect URL received:", connectUrl)

        if (!connectUrl) {
          throw new Error("Received empty Connect URL")
        }

        // Redirect the user to the Connect flow
        console.log("Redirecting to Connect URL")
        window.location.href = connectUrl
      } catch (apiError: any) {
        console.error("API error:", apiError)

        // If we get a fetch error, fall back to the institutions page
        if (apiError.message.includes("fetch failed")) {
          console.log("Falling back to institutions page due to fetch error")
          router.push("/banking/institutions")
          return
        }

        throw apiError
      }
    } catch (error: any) {
      console.error("Error initiating Connect flow:", error)
      const errorMessage = error.message || "Unknown error"
      setError(errorMessage)

      toast({
        title: "Connection Error",
        description: `Unable to initiate the connection process: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button variant={variant} size={size} className={className} onClick={handleConnect} disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Connecting...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Connect Card
            <ExternalLink className="ml-2 h-3 w-3" />
          </>
        )}
      </Button>

      {error && <div className="mt-2 text-sm text-red-500">Error: {error}</div>}
    </div>
  )
}

