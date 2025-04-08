"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { mastercardApi, type MastercardAccount } from "@/lib/mastercard-api"
import { Plus, RefreshCw, CreditCard, Building } from "lucide-react"
import { useRouter } from "next/navigation"

interface AccountBalancesProps {
  className?: string
  onRefresh?: () => void
}

export function AccountBalances({ className = "", onRefresh }: AccountBalancesProps) {
  const router = useRouter()
  const [accounts, setAccounts] = useState<MastercardAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    setIsLoading(true)
    try {
      const accountsData = await mastercardApi.getAccounts()
      setAccounts(accountsData)
    } catch (error) {
      console.error("Error fetching accounts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAccounts()
    setIsRefreshing(false)

    if (onRefresh) {
      onRefresh()
    }
  }

  const handleAddAccount = () => {
    router.push("/banking/connect")
  }

  const getAccountIcon = (accountType: string) => {
    switch (accountType) {
      case "CREDIT_CARD":
        return <CreditCard className="h-5 w-5" />
      default:
        return <Building className="h-5 w-5" />
    }
  }

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => {
      // Only add positive balances (exclude credit card debt)
      return sum + (account.balance > 0 ? account.balance : 0)
    }, 0)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Accounts</CardTitle>
            <CardDescription>Connected financial accounts</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddAccount}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-32 mb-2" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center">
                  <Skeleton className="w-10 h-10 rounded-md mr-3" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Total Available Balance</p>
              <p className="text-3xl font-bold">${getTotalBalance().toFixed(2)}</p>
            </div>

            <div className="space-y-3">
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex justify-between items-center p-3 border border-border/50 rounded-lg hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-secondary/50 rounded-md flex items-center justify-center mr-3">
                        {getAccountIcon(account.accountType)}
                      </div>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {account.institution.name} • {account.accountNumber}
                        </p>
                      </div>
                    </div>
                    <p className={`font-medium ${account.balance < 0 ? "text-red-500" : ""}`}>
                      ${account.balance.toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No accounts connected</p>
                  <Button onClick={handleAddAccount}>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Account
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
      {accounts.length > 0 && (
        <CardFooter className="flex justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">Powered by Mastercard Open Banking</p>
        </CardFooter>
      )}
    </Card>
  )
}
