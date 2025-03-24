"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, AlertCircle, Loader2 } from "lucide-react"
import { mastercardApi } from "@/lib/mastercard-api"

export default function ConnectCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function handleCallback() {
      try {
        // Log all search params for debugging
        console.log("Callback search params:", Object.fromEntries(searchParams.entries()))

        // Get the code from the URL (according to Mastercard documentation)
        const code = searchParams.get("code")
        const error = searchParams.get("error")

        // Check for errors from Mastercard
        if (error) {
          setStatus("error")
          setErrorMessage(error)
          return
        }

        // Ensure we have the required parameters
        if (!code) {
          setStatus("error")
          setErrorMessage("Missing required code parameter")
          return
        }

        // Handle the Connect callback
        const success = await mastercardApi.handleConnectCallback(code)

        if (success) {
          setStatus("success")
        } else {
          setStatus("error")
          setErrorMessage("Failed to complete connection")
        }
      } catch (error) {
        console.error("Error handling callback:", error)
        setStatus("error")
        setErrorMessage("An unexpected error occurred")
      }
    }

    handleCallback()
  }, [searchParams])

  const handleContinue = () => {
    router.push("/banking")
  }

  const handleRetry = () => {
    router.push("/add-card")
  }

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 pb-8 text-center">
            {status === "loading" && (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Connecting Your Account</h2>
                <p className="text-muted-foreground mb-6">Please wait while we complete your connection...</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Connection Successful!</h2>
                <p className="text-muted-foreground mb-6">
                  Your account has been successfully connected. You can now track your transactions and cashback
                  rewards.
                </p>
                <Button onClick={handleContinue} className="w-full">
                  Continue to Banking
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Connection Failed</h2>
                <p className="text-muted-foreground mb-2">We couldn't complete your account connection.</p>
                <p className="text-sm text-red-500 mb-6">{errorMessage || "Please try again later."}</p>
                <Button onClick={handleRetry} className="w-full">
                  Try Again
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

