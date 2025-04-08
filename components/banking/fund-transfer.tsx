"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Loader2, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FundTransferProps {
  className?: string
  onTransferComplete?: () => void
}

export function FundTransfer({ className = "", onTransferComplete }: FundTransferProps) {
  const [step, setStep] = useState<"form" | "confirm" | "success">("form")
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [selectedAccount, setSelectedAccount] = useState("")

  // These would come from the Plaid API in a real implementation
  const accounts = [
    { id: "acc1", name: "Chase Checking", mask: "3456", balance: 3245.67 },
    { id: "acc2", name: "Chase Savings", mask: "8321", balance: 12750.89 },
  ]

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow valid currency input
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmount(value)
    }
  }

  const handleContinue = () => {
    if (!selectedAccount || !amount || Number.parseFloat(amount) <= 0) return
    setStep("confirm")
  }

  const handleConfirm = () => {
    setIsLoading(true)
    // In a real implementation, this would initiate the transfer via Plaid
    setTimeout(() => {
      setIsLoading(false)
      setStep("success")
    }, 1500)
  }

  const handleDone = () => {
    if (onTransferComplete) onTransferComplete()
    // Reset the form
    setAmount("")
    setSelectedAccount("")
    setStep("form")
  }

  const selectedAccountDetails = accounts.find((acc) => acc.id === selectedAccount)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Transfer Funds</CardTitle>
        <CardDescription>Add money to your investment account</CardDescription>
      </CardHeader>
      <CardContent>
        {step === "form" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account">From Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger id="account" className="bg-background/50">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex justify-between w-full">
                        <span>
                          {account.name} (•••{account.mask})
                        </span>
                        <span className="text-muted-foreground ml-2">${account.balance.toFixed(2)} available</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-8 bg-background/50"
                />
              </div>
            </div>

            <Alert className="bg-secondary/50 border-primary/20 mt-4">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription>
                Funds typically take 1-3 business days to arrive in your investment account.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleContinue}
              className="w-full bg-primary hover:bg-primary/90 mt-2"
              disabled={!selectedAccount || !amount || Number.parseFloat(amount) <= 0}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Continue
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">From Account</p>
              <p className="font-medium">
                {selectedAccountDetails?.name} (•••{selectedAccountDetails?.mask})
              </p>
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">To</p>
              <p className="font-medium">Jaspire Investment Account</p>
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Amount</p>
              <p className="text-2xl font-bold">${Number.parseFloat(amount).toFixed(2)}</p>
            </div>

            <Alert className="bg-secondary/50 border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription>
                By confirming, you authorize Jaspire to debit your account for the amount specified.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-3 mt-2">
              <Button variant="outline" onClick={() => setStep("form")} className="flex-1" disabled={isLoading}>
                Back
              </Button>
              <Button onClick={handleConfirm} className="flex-1 bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Transfer"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Transfer Initiated!</h3>
            <p className="text-muted-foreground mb-6">
              Your transfer of ${Number.parseFloat(amount).toFixed(2)} has been initiated. Funds should arrive in your
              investment account within 1-3 business days.
            </p>
            <Button onClick={handleDone} className="bg-primary hover:bg-primary/90">
              Done
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
