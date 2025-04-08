"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building, Lock, Check, ChevronRight, Shield, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ConnectBankAccountProps {
  onConnect: () => void
  className?: string
}

export function ConnectBankAccount({ onConnect, className = "" }: ConnectBankAccountProps) {
  const [step, setStep] = useState<"intro" | "consent" | "success">("intro")
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = () => {
    setIsLoading(true)
    // In a real implementation, this would trigger Plaid Link
    setTimeout(() => {
      setIsLoading(false)
      setStep("consent")
    }, 1000)
  }

  const handleConsent = () => {
    setIsLoading(true)
    // In a real implementation, this would complete the connection process
    setTimeout(() => {
      setIsLoading(false)
      setStep("success")
      onConnect()
    }, 1500)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Connect Your Bank</CardTitle>
        <CardDescription>Securely link your accounts to track transactions and transfer funds</CardDescription>
      </CardHeader>
      <CardContent>
        {step === "intro" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Link Your Bank Account</h3>
              <p className="text-muted-foreground text-center mb-4">
                Connect your bank account to track transactions and easily transfer funds to your investment account.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start p-3 bg-secondary/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Bank-level Security</p>
                  <p className="text-sm text-muted-foreground">
                    Your credentials are never stored on our servers and all data is encrypted.
                  </p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-secondary/50 rounded-lg">
                <Lock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Read-only Access</p>
                  <p className="text-sm text-muted-foreground">
                    We can only view your transactions and account details, not move money without your explicit
                    permission.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleConnect} className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect with Plaid"}
              {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </motion.div>
        )}

        {step === "consent" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Authorize Access</h3>
              <p className="text-muted-foreground text-center mb-4">
                Please review and authorize the following permissions for your bank account.
              </p>
            </div>

            <Alert className="bg-secondary/50 border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription>Your bank login credentials are never stored on our servers.</AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                <Check className="h-4 w-4 text-primary mr-3" />
                <p className="text-sm">View account balances and details</p>
              </div>
              <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                <Check className="h-4 w-4 text-primary mr-3" />
                <p className="text-sm">View transaction history</p>
              </div>
              <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                <Check className="h-4 w-4 text-primary mr-3" />
                <p className="text-sm">Initiate transfers (with your explicit approval)</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep("intro")} className="flex-1" disabled={isLoading}>
                Back
              </Button>
              <Button onClick={handleConsent} className="flex-1 bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Authorizing..." : "Authorize"}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Account Connected!</h3>
            <p className="text-muted-foreground mb-6">
              Your bank account has been successfully connected. You can now track transactions and transfer funds.
            </p>
            <Button onClick={onConnect} className="bg-primary hover:bg-primary/90">
              Continue
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
