"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Loader2, CreditCard, ArrowRight, Check } from "lucide-react"
import { PlaidLinkButton } from "@/components/plaid/plaid-link-button"
import { plaidApi } from "@/lib/plaid-api"

interface PlaidAccount {
  id: string
  mask: string
  name: string
  subtype: string
  type: string
  balances: {
    available: number
    current: number
    iso_currency_code: string
  }
}

interface FundsTransferProps {
  className?: string
  onTransferComplete?: () => void
}

export function FundsTransfer({ className = "", onTransferComplete }: FundsTransferProps) {
  const [accounts, setAccounts] = useState<PlaidAccount[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferComplete, setTransferComplete] = useState(false)
  const [hasLinkedAccounts, setHasLinkedAccounts] = useState(false)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true)
        const fetchedAccounts = await plaidApi.getAccounts("demo_user_123")
        setAccounts(fetchedAccounts)
        setHasLinkedAccounts(fetchedAccounts.length > 0)

        if (fetchedAccounts.length > 0) {
          setSelectedAccountId(fetchedAccounts[0].id)
        }
      } catch (error) {
        console.error("Error fetching accounts:", error)
        toast({
          title: "Error",
          description: "Failed to retrieve linked accounts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow valid currency input
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmount(value)
    }
  }

  const handlePlaidSuccess = async (publicToken: string, metadata: any) => {
    try {
      // Exchange the public token for an access token
      await fetch("/api/plaid/exchange-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicToken }),
      })

      // Refresh the account list
      const fetchedAccounts = await plaidApi.getAccounts("demo_user_123")
      setAccounts(fetchedAccounts)
      setHasLinkedAccounts(fetchedAccounts.length > 0)

      if (fetchedAccounts.length > 0) {
        setSelectedAccountId(fetchedAccounts[0].id)
      }

      toast({
        title: "Account linked",
        description: "Your bank account has been successfully linked.",
      })
    } catch (error) {
      console.error("Error linking account:", error)
      toast({
        title: "Error",
        description: "Failed to link your bank account. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTransfer = async () => {
    if (!selectedAccountId || !amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please select an account and enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsTransferring(true)

      // Call the transfer API
      const response = await fetch("/api/plaid/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          fromAccountId: selectedAccountId,
          toAccountId: "jaspire_investment_account", // This would be the user's Jaspire investment account
          description: "Investment Deposit",
        }),
      })

      if (!response.ok) {
        throw new Error("Transfer failed")
      }

      // Show success state
      setTransferComplete(true)
      toast({
        title: "Transfer initiated",
        description: `$${amount} is being transferred to your investment account.`,
      })

      // Callback if provided
      if (onTransferComplete) {
        onTransferComplete()
      }

      // Reset form after a delay
      setTimeout(() => {
        setAmount("")
        setTransferComplete(false)
      }, 5000)
    } catch (error) {
      console.error("Error transferring funds:", error)
      toast({
        title: "Transfer failed",
        description: "We couldn't process your transfer. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsTransferring(false)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Add Funds</CardTitle>
          <CardDescription>Transfer money to your investment account</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (!hasLinkedAccounts) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Add Funds</CardTitle>
          <CardDescription>Connect a bank account to invest</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-6">
            You need to connect a bank account before you can add funds to your investment account.
          </p>
          <PlaidLinkButton
            onSuccess={handlePlaidSuccess}
            className="bg-primary hover:bg-primary/90 w-full"
            buttonText="Connect a Bank Account"
          />
        </CardContent>
      </Card>
    )
  }

  if (transferComplete) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Transfer Successful</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">${amount} Transfer Initiated</h3>
          <p className="text-muted-foreground mb-6">
            Your funds are on their way to your investment account. This process typically takes 1-3 business days.
          </p>
          <Button onClick={() => setTransferComplete(false)} variant="outline" className="mx-auto">
            Make Another Transfer
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Add Funds</CardTitle>
        <CardDescription>Transfer money to your investment account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account">From Account</Label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
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
                      <span className="text-muted-foreground ml-2">
                        ${account.balances.available.toFixed(2)} available
                      </span>
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

          <div className="pt-4">
            <Button
              type="button"
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleTransfer}
              disabled={isTransferring || !selectedAccountId || !amount || Number.parseFloat(amount) <= 0}
            >
              {isTransferring ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {isTransferring ? "Processing..." : "Transfer Funds"}
            </Button>
          </div>

          <div className="pt-2 text-center">
            <Button type="button" variant="link" size="sm" className="text-xs text-muted-foreground">
              <PlaidLinkButton
                onSuccess={handlePlaidSuccess}
                variant="link"
                buttonText="Link another account"
                className="text-xs text-muted-foreground h-auto p-0"
              />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
