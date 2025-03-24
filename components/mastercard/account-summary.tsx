"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Building, ChevronRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Account {
  id: string
  accountNumber: string
  accountType: string
  balance: number
  currency: string
  name: string
  institution: {
    id: string
    name: string
    logoUrl?: string
  }
}

interface AccountSummaryProps {
  onLinkAccount?: () => void
  className?: string
}

export function AccountSummary({ onLinkAccount, className = "" }: AccountSummaryProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/mastercard/accounts")
        if (!response.ok) {
          throw new Error("Failed to fetch accounts")
        }

        const data = await response.json()
        setAccounts(data)
      } catch (err) {
        console.error("Error fetching accounts:", err)
        setError("Failed to load accounts. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load accounts. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Your Accounts</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Your Accounts</CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (accounts.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Your Accounts</CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No linked accounts found.</p>
          {onLinkAccount && (
            <Button onClick={onLinkAccount} className="bg-primary hover:bg-primary/90">
              Link Your First Account
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Your Accounts</CardTitle>
        {onLinkAccount && (
          <Button variant="outline" size="sm" onClick={onLinkAccount}>
            Add Account
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {accounts.map((account) => (
          <div key={account.id} className="p-4 border-b border-border/50 hover:bg-secondary/30 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mr-3">
                  {account.institution.logoUrl ? (
                    <img
                      src={account.institution.logoUrl || "/placeholder.svg"}
                      alt={account.institution.name}
                      className="w-6 h-6"
                    />
                  ) : (
                    <Building className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {account.institution.name} • {account.accountNumber}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {account.accountType.toLowerCase().replace("_", " ")}
              </Badge>
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="text-lg font-bold">${account.balance.toFixed(2)}</div>
              <Link href={`/transactions?accountId=${account.id}`}>
                <Button variant="ghost" size="sm" className="text-xs">
                  View Transactions
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

