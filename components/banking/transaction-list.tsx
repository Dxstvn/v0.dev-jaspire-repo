"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { mastercardApi, type MastercardTransaction, type MastercardAccount } from "@/lib/mastercard-api"
import { Search, ArrowUpRight, ArrowDownRight, Calendar, RefreshCw } from "lucide-react"

interface TransactionListProps {
  className?: string
  limit?: number
  showFilters?: boolean
  showTitle?: boolean
  onRefresh?: () => void
}

export function TransactionList({
  className = "",
  limit,
  showFilters = true,
  showTitle = true,
  onRefresh,
}: TransactionListProps) {
  const [transactions, setTransactions] = useState<MastercardTransaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<MastercardTransaction[]>([])
  const [accounts, setAccounts] = useState<MastercardAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAccount, setSelectedAccount] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "cashback">("all")

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchQuery, selectedAccount, selectedPeriod, activeTab])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [transactionsData, accountsData] = await Promise.all([
        mastercardApi.getTransactions(),
        mastercardApi.getAccounts(),
      ])

      setTransactions(transactionsData)
      setAccounts(accountsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = [...transactions]

    // Filter by tab
    if (activeTab === "cashback") {
      filtered = filtered.filter((txn) => (txn.cashback || 0) > 0)
    }

    // Filter by account
    if (selectedAccount !== "all") {
      filtered = filtered.filter((txn) => txn.accountId === selectedAccount)
    }

    // Filter by period
    if (selectedPeriod !== "all") {
      const now = new Date()
      let startDate: Date

      switch (selectedPeriod) {
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7))
          break
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1))
          break
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1))
          break
        default:
          startDate = new Date(0) // Beginning of time
      }

      filtered = filtered.filter((txn) => new Date(txn.date) >= startDate)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (txn) =>
          txn.description.toLowerCase().includes(query) ||
          txn.merchant.name.toLowerCase().includes(query) ||
          txn.category.toLowerCase().includes(query),
      )
    }

    // Apply limit if specified
    if (limit && filtered.length > limit) {
      filtered = filtered.slice(0, limit)
    }

    setFilteredTransactions(filtered)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setIsRefreshing(false)

    if (onRefresh) {
      onRefresh()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getAccountName = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId)
    return account ? account.name : "Unknown Account"
  }

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Your recent financial activity</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      )}

      {showFilters && (
        <div className="px-6 pb-2">
          <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="cashback">With Cashback</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-border/50">
                <div className="flex items-center">
                  <Skeleton className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-secondary/50 rounded-full flex items-center justify-center mr-3">
                      {transaction.amount > 0 ? (
                        <ArrowDownRight className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.merchant.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(transaction.date)}</span>
                        <span className="mx-1">•</span>
                        <span>{getAccountName(transaction.accountId)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.amount > 0 ? "text-green-500" : ""}`}>
                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    {transaction.cashback && transaction.cashback > 0 && (
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                        ${transaction.cashback.toFixed(2)} cashback
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No transactions found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or connect a new account</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {filteredTransactions.length > 0 && (
        <CardFooter className="flex justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
          {limit && transactions.length > limit && (
            <Button variant="ghost" size="sm">
              View All
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
