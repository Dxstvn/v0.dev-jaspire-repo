"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, Loader2, Info } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SubmissionScreenProps {
  formData: any
  onComplete: (accountData?: any) => void
  onBack: () => void
}

export function SubmissionScreen({ formData, onComplete, onBack }: SubmissionScreenProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Preparing your information...")
  const [isComplete, setIsComplete] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [accountData, setAccountData] = useState(null)
  const [isMockAccount, setIsMockAccount] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const createAlpacaAccount = async () => {
      try {
        // Update progress indicators
        setProgress(25)
        setStatus("Validating your information...")

        // Add user ID to form data
        const completeFormData = {
          ...formData,
          userId: user?.uid,
        }

        // Short delay for UX
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setProgress(50)
        setStatus("Creating your investment account...")

        // Make API call to create Alpaca account
        const response = await fetch("/api/alpaca/create-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(completeFormData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to create investment account")
        }

        // Check if this is a mock account
        if (data.isMock) {
          setIsMockAccount(true)
          console.log("Using mock account:", data.message)
        }

        setProgress(75)
        setStatus("Finalizing your account setup...")

        // Short delay for UX
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Success!
        setAccountData(data.account)
        setProgress(100)
        setStatus("Account setup complete!")
        setIsComplete(true)

        // Log the account details for debugging
        console.log("Alpaca account created:", data.account)
      } catch (error: any) {
        console.error("Error creating Alpaca account:", error)
        setIsError(true)
        setErrorMessage(error.message || "An unexpected error occurred")
        setStatus("Account setup failed")
      }
    }

    createAlpacaAccount()
  }, [formData, user])

  const handleRetry = () => {
    setIsError(false)
    setProgress(0)
    setStatus("Preparing your information...")

    // Re-trigger the effect by creating a new function
    const retryCreateAccount = async () => {
      try {
        // Update progress indicators
        setProgress(25)
        setStatus("Validating your information...")

        // Add user ID to form data
        const completeFormData = {
          ...formData,
          userId: user?.uid,
        }

        // Short delay for UX
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setProgress(50)
        setStatus("Creating your investment account...")

        // Make API call to create Alpaca account
        const response = await fetch("/api/alpaca/create-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(completeFormData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to create investment account")
        }

        // Check if this is a mock account
        if (data.isMock) {
          setIsMockAccount(true)
          console.log("Using mock account:", data.message)
        }

        setProgress(75)
        setStatus("Finalizing your account setup...")

        // Short delay for UX
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Success!
        setAccountData(data.account)
        setProgress(100)
        setStatus("Account setup complete!")
        setIsComplete(true)

        // Log the account details for debugging
        console.log("Alpaca account created:", data.account)
      } catch (error: any) {
        console.error("Error creating Alpaca account:", error)
        setIsError(true)
        setErrorMessage(error.message || "An unexpected error occurred")
        setStatus("Account setup failed")
      }
    }

    retryCreateAccount()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 bg-secondary/50">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Setting Up Your Account</h2>
              <p className="text-muted-foreground">
                {isError ? "We encountered an issue" : "Please wait while we set up your investment account."}
              </p>
            </div>

            <div className="space-y-4">
              {!isError ? (
                <>
                  <Progress value={progress} className="h-2" />
                  <p className="text-center">{status}</p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <AlertTriangle className="h-16 w-16 text-red-500" />
                  <p className="font-medium text-red-500">Account setup failed</p>
                  <p className="text-sm text-muted-foreground text-center">{errorMessage}</p>
                </div>
              )}

              {isComplete && (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-primary" />
                  <p className="font-medium">Your investment account has been created successfully!</p>
                  <p className="text-sm text-muted-foreground text-center">
                    You're now ready to connect your card and start investing your cashback rewards.
                  </p>

                  {isMockAccount && (
                    <Alert className="bg-primary/10 border-primary/20 mt-4">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertDescription>
                        This is a demo account. In production, a real Alpaca brokerage account would be created.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center pt-4">
              {isError ? (
                <div className="space-x-4">
                  <Button type="button" variant="outline" onClick={onBack}>
                    Back
                  </Button>
                  <Button onClick={handleRetry}>Try Again</Button>
                </div>
              ) : !isComplete ? (
                <Button type="button" variant="outline" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </Button>
              ) : (
                <Button onClick={() => onComplete(accountData)}>Continue to Link Card</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
