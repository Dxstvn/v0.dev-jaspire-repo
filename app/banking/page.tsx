"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

import { AccountBalances } from "@/components/banking/account-balances"
import { TransactionList } from "@/components/banking/transaction-list"
import { CashbackInsights } from "@/components/banking/cashback-insights"

export default function Banking() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refreshing data
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Data refreshed",
        description: "Your financial data has been updated.",
      })
    }, 2000)
  }

  const handleAddAccount = () => {
    router.push("/banking/connect")
  }

  return (
    <AppShell>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Banking & Transactions</h1>
          <p className="text-muted-foreground">Track your accounts, transactions, and cashback rewards</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleAddAccount}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full grid grid-cols-3 h-12 p-0 bg-secondary/50 rounded-lg">
          <TabsTrigger
            value="overview"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-muted-foreground h-full"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-muted-foreground h-full"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="cashback"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-muted-foreground h-full"
          >
            Cashback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <AccountBalances className="md:col-span-2" onRefresh={handleRefresh} />
            <CashbackInsights />
            <TransactionList limit={5} showFilters={false} />
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <TransactionList className="mb-6" />
        </TabsContent>

        <TabsContent value="cashback" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <CashbackInsights className="md:col-span-2" />
            <TransactionList activeTab="cashback" showFilters={false} />
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  )
}
