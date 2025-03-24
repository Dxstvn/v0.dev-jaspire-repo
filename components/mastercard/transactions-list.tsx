"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  category: string
  merchant: {
    name: string
    category: string
    logoUrl?: string
  }
  accountId: string
  status: "COMPLETED" | "PENDING" | "DECLINED"
  cashback: number
}

interface TransactionsListProps {
  accountId?: string
  limit?: number
  showTitle?: boolean
  className?: string
  onViewAllClick?: () => void
}

export function TransactionsList({
  accountId,
  limit = 5,
  showTitle = true,
  className = "",
  onViewAllClick,
}: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        let url = "/api/mastercard/transactions"
        if (accountId) {
          url += `?accountId=${accountId}`
        }

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }

        const data = await response.json()
        setTransactions(data)
      } catch (err) {
        console.error("Error fetching transactions:", err)
        setError("Failed to load transactions. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load transactions. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [accountId])

  // Sort transactions by date (newest first) and limit them
  const displayedTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "GROCERIES":
        return "🛒"
      case "FOOD_AND_DRINK":
        return "🍽️"
      case "HEALTH_AND_FITNESS":
        return "💪"
      case "TRANSPORTATION":
        return "🚗"
      case "ENTERTAINMENT":
        return "🎬"
      case "SHOPPING":
        return "🛍️"
      case "HEALTH":
        return "💊"
      default:
        return "💳"
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
        )}
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
        )}
        <CardContent className="py-6 text-center">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No transactions found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          {onViewAllClick && (
            <Button variant="ghost" size="sm" onClick={onViewAllClick} className="text-primary text-sm">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <ScrollArea className="max-h-[400px]">
          {displayedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3 bg-secondary">
                  <AvatarImage src={transaction.merchant.logoUrl} alt={transaction.merchant.name} />
                  <AvatarFallback>{getCategoryIcon(transaction.category)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{transaction.merchant.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center font-medium">
                  {transaction.amount > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-red-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
                  )}
                  ${Math.abs(transaction.amount).toFixed(2)}
                </div>
                {transaction.cashback > 0 && (
                  <Badge variant="outline" className="text-primary border-primary text-xs">
                    +${transaction.cashback.toFixed(2)} cashback
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

