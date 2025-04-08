"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowUpRight, BarChart3, CreditCard, DollarSign, Building, ChevronRight, BanknoteIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AuthLoading } from "@/components/auth-loading"
import { shouldShowDemoData } from "@/utils/user-utils"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/empty-state"
import { WelcomeBanner } from "@/components/welcome-banner"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { AccountBalances } from "@/components/banking/account-balances"
import { CashbackInsights } from "@/components/banking/cashback-insights"
import { toast } from "@/hooks/use-toast"

export default function Dashboard() {
  const [cashbackTotal, setCashbackTotal] = useState(0)
  const [investedAmount, setInvestedAmount] = useState(0)
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [portfolioGrowth, setPortfolioGrowth] = useState(0)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const { user, loading, initAuth } = useAuth()
  const router = useRouter()
  const showDemoData = shouldShowDemoData(user)
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize auth when component mounts
  useEffect(() => {
    const initialize = async () => {
      await initAuth()
      setIsInitializing(false)
    }
    initialize()
  }, [initAuth])

  // Set demo data if the user is the demo account
  useEffect(() => {
    if (showDemoData) {
      setCashbackTotal(127.85)
      setInvestedAmount(1250.42)
      setPortfolioValue(1378.27)
      setPortfolioGrowth(10.22)
    } else {
      setCashbackTotal(0)
      setInvestedAmount(0)
      setPortfolioValue(0)
      setPortfolioGrowth(0)
    }
  }, [showDemoData])

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading && !isInitializing) {
      router.push("/")
    }
  }, [user, loading, router, isInitializing])

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return

      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (isCheckingOnboarding) {
          console.log("Onboarding check timed out")
          setIsCheckingOnboarding(false)
          setHasCompletedOnboarding(true) // Assume completed to prevent redirect loops
        }
      }, 5000) // 5 second timeout

      try {
        // Only import and use Firestore on the client side
        if (typeof window !== "undefined") {
          const { getFirestore, doc, getDoc, setDoc } = await import("firebase/firestore")
          const db = getFirestore()
          const userRef = doc(db, "users", user.uid)
          const userDoc = await getDoc(userRef)

          if (userDoc.exists()) {
            // Check if user has an investment account or has completed onboarding
            const userData = userDoc.data()
            setHasCompletedOnboarding(!!userData.hasCompletedOnboarding || !!userData.investmentAccountId)
          } else {
            // New user, create a basic user document
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date().toISOString(),
              hasCompletedOnboarding: false,
            })
            setHasCompletedOnboarding(false)
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error)
        // Default to not completed if there's an error
        setHasCompletedOnboarding(true) // Changed to true to prevent redirect loops
      } finally {
        setIsCheckingOnboarding(false)
        clearTimeout(timeoutId)
      }
    }

    if (user) {
      checkOnboardingStatus()
    }
  }, [user])

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!isCheckingOnboarding && !hasCompletedOnboarding && user) {
      router.push("/onboarding")
    }
  }, [isCheckingOnboarding, hasCompletedOnboarding, user, router])

  if (loading || isCheckingOnboarding || isInitializing) {
    return <AuthLoading />
  }

  // If no user, redirect to login
  if (!user) {
    router.push("/")
    return <AuthLoading />
  }

  const handleRefresh = async () => {
    // Simulate a refresh operation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // If showing demo data, we could refresh the data here
    if (showDemoData) {
      // Update with new random values to simulate refreshed data
      setPortfolioValue((prevValue) => +(prevValue * (1 + (Math.random() * 0.02 - 0.01))).toFixed(2))
      setPortfolioGrowth((prevGrowth) => +(prevGrowth * (1 + (Math.random() * 0.04 - 0.02))).toFixed(2))
    }
  }

  const handleInvestCashback = () => {
    toast({
      title: "Investing cashback",
      description: "Your cashback is being invested according to your preferences.",
    })
  }

  // Demo transactions for the demo account
  const recentTransactions = showDemoData
    ? [
        { merchant: "Amazon", amount: 3.25, date: "Mar 12", icon: "🛒", cashback: 0.1 },
        { merchant: "Starbucks", amount: 0.75, date: "Mar 10", icon: "☕", cashback: 0.02 },
        { merchant: "Target", amount: 2.15, date: "Mar 8", icon: "🎯", cashback: 0.06 },
        { merchant: "Uber", amount: 1.5, date: "Mar 5", icon: "🚗", cashback: 0.04 },
      ]
    : []

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <AppShell>
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Welcome message */}
        <div className="mb-6">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold">
            Welcome back, {user?.displayName?.split(" ")[0] || "there"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            {showDemoData ? "Your investments are growing steadily" : "Let's start your investment journey"}
          </motion.p>
        </div>

        {/* Show welcome banner for new users */}
        {!showDemoData && cashbackTotal === 0 && <WelcomeBanner userName={user?.displayName || "there"} />}

        {/* Main content - Tab alignment */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="w-full grid grid-cols-3 h-12 p-0 bg-secondary/50 rounded-lg">
            <TabsTrigger
              value="overview"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-muted-foreground h-full"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="cashback"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-muted-foreground h-full"
            >
              Cashback
            </TabsTrigger>
            <TabsTrigger
              value="banking"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-muted-foreground h-full"
            >
              Banking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              {/* Portfolio Summary Card */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-secondary to-background border-0 overflow-hidden relative card-hover">
                  <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-muted-foreground text-sm">Portfolio Value</p>
                        <h2 className="text-3xl font-bold">${showDemoData ? portfolioValue.toFixed(2) : "0.00"}</h2>
                      </div>
                      {showDemoData && (
                        <div className="bg-primary/20 px-2 py-1 rounded-full flex items-center">
                          <ArrowUpRight className="h-3 w-3 text-primary mr-1" />
                          <span className="text-primary text-xs font-medium">{portfolioGrowth}%</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-background/30 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-muted-foreground text-xs mb-1">Tracked Cashback</p>
                        <p className="text-lg font-semibold">${showDemoData ? cashbackTotal.toFixed(2) : "0.00"}</p>
                      </div>
                      <div className="bg-background/30 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-muted-foreground text-xs mb-1">Invested</p>
                        <p className="text-lg font-semibold">${showDemoData ? investedAmount.toFixed(2) : "0.00"}</p>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 bg-white text-black hover:bg-white/90"
                      disabled={!showDemoData && cashbackTotal <= 0}
                      onClick={handleInvestCashback}
                    >
                      {cashbackTotal > 0 ? "Invest Cashback" : "Link a Card to Track Cashback"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Banking Section */}
              <motion.div variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-blue-900/30 to-background border-0 overflow-hidden relative card-hover">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Bank Accounts</h3>
                        <Link href="/banking">
                          <Button variant="ghost" size="sm" className="text-primary text-sm">
                            View All
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      {showDemoData ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-background/40 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
                                <Building className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">Chase Checking</p>
                                <p className="text-xs text-muted-foreground">••••3456</p>
                              </div>
                            </div>
                            <p className="font-semibold">$3,200.45</p>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-background/40 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
                                <Building className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">Ally Savings</p>
                                <p className="text-xs text-muted-foreground">••••8321</p>
                              </div>
                            </div>
                            <p className="font-semibold">$12,750.33</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Building className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground mb-4">No linked accounts</p>
                          <Link href="/banking">
                            <Button variant="outline" className="mx-auto text-sm">
                              Link Account
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/30 to-background border-0 overflow-hidden relative card-hover">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Latest Transactions</h3>
                        <Link href="/transactions">
                          <Button variant="ghost" size="sm" className="text-primary text-sm">
                            View All
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      {showDemoData ? (
                        <div className="space-y-3">
                          {recentTransactions.slice(0, 2).map((tx, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-background/40 rounded-lg"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
                                  <span>{tx.icon}</span>
                                </div>
                                <p className="font-medium">{tx.merchant}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${tx.amount.toFixed(2)}</p>
                                <p className="text-xs text-primary">+${tx.cashback.toFixed(2)} cashback</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <CreditCard className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground mb-4">No transactions yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/add-card")}
                            className="mx-auto text-sm"
                          >
                            Link a Card
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
                <div className="grid grid-cols-3 gap-4 grid-adjust-mobile">
                  <Link href="/portfolio">
                    <Card className="bg-secondary/50 border-0 hover:bg-secondary transition-colors card-hover">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium">Portfolio</p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/banking">
                    <Card className="bg-secondary/50 border-0 hover:bg-secondary transition-colors card-hover">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                          <BanknoteIcon className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium">Banking</p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/add-card">
                    <Card className="bg-secondary/50 border-0 hover:bg-secondary transition-colors card-hover">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium">Link Card</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="cashback" className="space-y-6 mt-6">
            <CashbackInsights onInvest={handleInvestCashback} />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Cashback Earnings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-4 ${
                        index < recentTransactions.length - 1 ? "border-b border-border/50" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="text-lg">{transaction.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium">{transaction.merchant}</p>
                          <p className="text-muted-foreground text-sm">{transaction.date}</p>
                        </div>
                      </div>
                      <p className="text-primary font-medium">+${transaction.cashback.toFixed(2)}</p>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    icon={<DollarSign className="h-12 w-12 text-primary/70" />}
                    title="No cashback tracked yet"
                    description="Link your cards to start tracking the cashback you earn"
                    ctaText="Link Your First Card"
                    ctaLink="/add-card"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking" className="space-y-6 mt-6">
            <AccountBalances />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transfer Funds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <BanknoteIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-6">
                      Transfer funds from your bank account to your investment account.
                    </p>
                    <Link href="/banking">
                      <Button className="bg-primary hover:bg-primary/90">Go to Banking</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Link New Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-6">
                      Connect your bank accounts to track transactions and transfer funds.
                    </p>
                    <Link href="/banking">
                      <Button className="bg-primary hover:bg-primary/90">Connect Account</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PullToRefresh>
    </AppShell>
  )
}
