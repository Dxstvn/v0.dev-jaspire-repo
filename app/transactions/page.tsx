"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Plus, ArrowDownUp, Calendar, Search } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { shouldShowDemoData } from "@/utils/user-utils"
import { EmptyState } from "@/components/empty-state"
import { EmptyCard } from "@/components/empty-card"
import { AppShell } from "@/components/layout/app-shell"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TransactionInsights } from "@/components/banking/transaction-insights"

export default function Transactions() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const { user } = useAuth()
  const showDemoData = shouldShowDemoData(user)
  const [timeFilter, setTimeFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")
  const [cashbackTotal, setCashbackTotal] = useState(0)

  const [cards, setCards] = useState([])
  const [transactions, setTransactions] = useState([])

  // Set demo data if the user is the demo account
  useEffect(() => {
    if (showDemoData) {
      setCards([
        {
          id: 1,
          name: "Chase Freedom",
          lastFour: "4567",
          cashbackRate: "5%",
          cashbackEarned: 85.42,
          color: "bg-gradient-to-r from-green-800 to-emerald-900",
          type: "visa",
        },
        {
          id: 2,
          name: "Citi Double Cash",
          lastFour: "8901",
          cashbackRate: "2%",
          cashbackEarned: 32.18,
          color: "bg-gradient-to-r from-gray-800 to-gray-900",
          type: "mastercard",
        },
        {
          id: 3,
          name: "Amex Blue Cash",
          lastFour: "2345",
          cashbackRate: "3%",
          cashbackEarned: 10.25,
          color: "bg-gradient-to-r from-teal-800 to-teal-900",
          type: "amex",
        },
      ])

      // These would come from the Mastercard Open Banking API in a real implementation
      setTransactions([
        {
          id: 1,
          merchant: "Amazon",
          amount: 65.42,
          cashback: 3.25,
          date: "Mar 12",
          cardLastFour: "4567",
          cardType: "visa",
          category: "Shopping",
          status: "Completed",
        },
        {
          id: 2,
          merchant: "Starbucks",
          amount: 15.3,
          cashback: 0.75,
          date: "Mar 10",
          cardLastFour: "8901",
          cardType: "mastercard",
          category: "Food & Drink",
          status: "Completed",
        },
        {
          id: 3,
          merchant: "Target",
          amount: 42.99,
          cashback: 2.15,
          date: "Mar 8",
          cardLastFour: "4567",
          cardType: "visa",
          category: "Shopping",
          status: "Completed",
        },
        {
          id: 4,
          merchant: "Uber",
          amount: 24.5,
          cashback: 1.5,
          date: "Mar 5",
          cardLastFour: "2345",
          cardType: "amex",
          category: "Transportation",
          status: "Completed",
        },
        {
          id: 5,
          merchant: "Walmart",
          amount: 87.65,
          cashback: 1.75,
          date: "Mar 3",
          cardLastFour: "8901",
          cardType: "mastercard",
          category: "Shopping",
          status: "Completed",
        },
        {
          id: 6,
          merchant: "Netflix",
          amount: 14.99,
          cashback: 0.3,
          date: "Mar 1",
          cardLastFour: "2345",
          cardType: "amex",
          category: "Entertainment",
          status: "Completed",
        },
      ])

      // Calculate total cashback
      const total = cards.reduce((sum, card) => sum + card.cashbackEarned, 0)
      setCashbackTotal(total)
    } else {
      setCards([])
      setTransactions([])
      setCashbackTotal(0)
    }
  }, [showDemoData])

  // Function to handle adding a card
  const handleAddCard = () => {
    router.push("/add-card")
  }

  // Filter transactions based on active tab, search query, and time filter
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by card type if not "all"
    if (activeTab !== "all" && transaction.cardType !== activeTab) {
      return false
    }

    // Filter by search query
    if (searchQuery && !transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by time
    if (timeFilter !== "all") {
      const txDate = new Date(transaction.date)
      const now = new Date()

      if (timeFilter === "week" && now.getTime() - txDate.getTime() > 7 * 24 * 60 * 60 * 1000) {
        return false
      } else if (timeFilter === "month" && now.getTime() - txDate.getTime() > 30 * 24 * 60 * 60 * 1000) {
        return false
      }
    }

    return true
  })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortOrder === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    } else if (sortOrder === "amount-high") {
      return b.amount - a.amount
    } else if (sortOrder === "amount-low") {
      return a.amount - b.amount
    }
    return 0
  })

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Transactions & Insights</h1>
        <p className="text-muted-foreground">Track your spending and cashback rewards</p>
      </div>

      {/* Cashback Summary */}
      {showDemoData && (
        <Card className="mb-6 bg-gradient-to-br from-primary/20 to-primary/5 border-0">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Cashback Earned</p>
                <p className="text-3xl font-bold">${cashbackTotal.toFixed(2)}</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">Invest Cashback</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[130px] h-10">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[130px] h-10">
              <ArrowDownUp className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Newest First" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="amount-high">Amount (High to Low)</SelectItem>
              <SelectItem value="amount-low">Amount (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transaction Insights */}
      {showDemoData && (
        <div className="mb-6">
          <TransactionInsights />
        </div>
      )}

      {/* Transactions List */}
      <Card className="mb-6">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Transaction History</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-0">
              <TabsList className="h-9 bg-secondary/50">
                <TabsTrigger value="all" className="text-xs px-3">
                  All
                </TabsTrigger>
                <TabsTrigger value="visa" className="text-xs px-3">
                  Visa
                </TabsTrigger>
                <TabsTrigger value="mastercard" className="text-xs px-3">
                  Mastercard
                </TabsTrigger>
                <TabsTrigger value="amex" className="text-xs px-3">
                  Amex
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          {sortedTransactions.length > 0 ? (
            <div>
              {sortedTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className={`flex justify-between items-center p-4 hover:bg-secondary/30 transition-colors ${
                    index < sortedTransactions.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                      {transaction.cardType === "visa" && <span className="font-bold text-xs">VISA</span>}
                      {transaction.cardType === "mastercard" && <span className="font-bold text-xs">MC</span>}
                      {transaction.cardType === "amex" && <span className="font-bold text-xs">AMEX</span>}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.merchant}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{transaction.date}</span>
                        <span className="mx-1">•</span>
                        <span>•••• {transaction.cardLastFour}</span>
                        <Badge variant="outline" className="ml-2 text-xs py-0 h-4">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                    <p className="text-primary text-xs">+${transaction.cashback.toFixed(2)} cashback</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CreditCard className="h-12 w-12 text-primary/70" />}
              title="No transactions found"
              description={
                searchQuery ? "Try adjusting your search or filters" : "Link a card to start tracking transactions"
              }
              action={
                !searchQuery && (
                  <Button className="bg-white text-black hover:bg-white/90" onClick={handleAddCard}>
                    <Plus className="h-4 w-4 mr-2" />
                    Link Card
                  </Button>
                )
              }
              className="py-12"
            />
          )}
        </CardContent>
      </Card>

      {/* Cards Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Cards</h2>
          <Button onClick={handleAddCard} className="bg-white text-black hover:bg-white/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>

        {cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card) => (
              <Card key={card.id} className={`${card.color} border-0 overflow-hidden relative card-hover`}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">{card.name}</p>
                      <p className="text-lg font-medium mt-1">•••• {card.lastFour}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="bg-white/10 px-3 py-1.5 rounded-full">
                        <span className="text-white text-xs font-medium">{card.cashbackRate} Cashback</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-300 text-xs">Cashback Earned</p>
                      <p className="text-xl font-semibold">${card.cashbackEarned.toFixed(2)}</p>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                      Invest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <EmptyCard />
            <EmptyState
              icon={<CreditCard className="h-16 w-16 text-primary/70" />}
              title="No cards added yet"
              description="Add your credit or debit cards to start earning cashback on your purchases."
              action={
                <Button className="bg-white text-black hover:bg-white/90" onClick={handleAddCard}>
                  <Plus className="h-4 w-4 mr-2" />
                  Link Your First Card
                </Button>
              }
            />
          </div>
        )}
      </div>
    </AppShell>
  )
}
