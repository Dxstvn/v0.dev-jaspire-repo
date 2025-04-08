"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CreditCard,
  Edit2,
  LogOut,
  Mail,
  Shield,
  User,
  ChevronRight,
  BarChart3,
  TrendingUp,
  DollarSign,
  Lock,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AuthLoading } from "@/components/auth-loading"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AppShell } from "@/components/layout/app-shell"

// Investment style definitions with more subtle visual elements
const investmentStyles = [
  {
    id: "conservative",
    title: "Conservative",
    description: "Lower risk, stable returns",
    details:
      "Our conservative strategy focuses on capital preservation through high-grade bonds, blue-chip stocks, and stable dividend-paying companies. Perfect for those nearing retirement or preferring minimal market volatility.",
    riskLevel: 2,
    expectedReturn: "4-6%",
    allocation: {
      stocks: 30,
      bonds: 50,
      cash: 15,
      alternatives: 5,
    },
    icon: <Lock className="h-5 w-5" />,
  },
  {
    id: "balanced",
    title: "Balanced",
    description: "Moderate risk and returns",
    details:
      "A balanced approach combining growth and stability through a diversified mix of stocks and bonds. Ideal for investors with a medium-term horizon seeking steady growth while managing risk.",
    riskLevel: 5,
    expectedReturn: "6-8%",
    allocation: {
      stocks: 50,
      bonds: 30,
      cash: 10,
      alternatives: 10,
    },
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    id: "aggressive",
    title: "Aggressive",
    description: "Higher risk, potential for higher returns",
    details:
      "Maximizing growth potential through a stock-heavy portfolio, including emerging markets and growth stocks. Suited for young investors or those comfortable with market volatility in pursuit of higher returns.",
    riskLevel: 8,
    expectedReturn: "8-12%",
    allocation: {
      stocks: 75,
      bonds: 15,
      cash: 5,
      alternatives: 5,
    },
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    id: "dividend",
    title: "Dividend-focused",
    description: "Emphasis on income-generating assets",
    details:
      "Focusing on stable income through dividend-paying stocks, REITs, and high-yield bonds. Perfect for investors seeking regular income streams while maintaining potential for capital appreciation.",
    riskLevel: 4,
    expectedReturn: "5-7%",
    allocation: {
      stocks: 60,
      bonds: 25,
      cash: 5,
      alternatives: 10,
    },
    icon: <DollarSign className="h-5 w-5" />,
  },
]

export default function Profile() {
  const router = useRouter()
  const [expandedStyle, setExpandedStyle] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState("balanced")
  const [activeTab, setActiveTab] = useState("overview")
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return <AuthLoading />
  }

  // If not logged in, redirect to login page
  if (!user && !loading) {
    router.push("/")
    return <AuthLoading />
  }

  const name = user?.displayName || "User"
  const email = user?.email || "user@example.com"

  const handleLogout = async () => {
    await signOut()
  }

  // Get the selected investment style object
  const selectedStyleObj = investmentStyles.find((style) => style.id === selectedStyle) || investmentStyles[1]

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="flex items-center mb-6">
        {user?.photoURL ? (
          <img
            src={user.photoURL || "/placeholder.svg"}
            alt={name}
            className="w-16 h-16 rounded-full mr-4 object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-green-900 flex items-center justify-center text-2xl font-bold mr-4">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-gray-400">{email}</p>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Edit2 className="h-5 w-5" />
        </Button>
      </div>

      {/* REFINED: Investment Preferences with more subtle colors */}
      <Card className="bg-secondary/50 border-0 mb-6 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Investment Strategy</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-primary/70" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Your investment strategy determines how your cashback is invested. Choose a strategy that matches
                    your risk tolerance and financial goals.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Strategy Tabs */}
          <Tabs defaultValue={selectedStyle} onValueChange={setSelectedStyle} className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-12 p-0 bg-background/50 rounded-lg">
              {investmentStyles.map((style) => (
                <TabsTrigger
                  key={style.id}
                  value={style.id}
                  className={`rounded-lg h-full transition-all duration-300 ${
                    selectedStyle === style.id
                      ? "bg-white text-black border-b-2 border-primary/50"
                      : "text-muted-foreground"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {style.icon}
                    <span className="text-xs mt-1">{style.title}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Strategy Content */}
            <div className="mt-6 p-4 bg-background/30 rounded-lg backdrop-blur-sm border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary">{selectedStyleObj.title}</h3>
                  <p className="text-muted-foreground text-sm">{selectedStyleObj.description}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {selectedStyleObj.icon}
                </div>
              </div>

              {/* Expected Return */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Expected Annual Return</span>
                  <span className="text-primary">{selectedStyleObj.expectedReturn}</span>
                </div>
              </div>

              {/* Asset Allocation */}
              <div className="mb-2">
                <h4 className="text-sm font-medium mb-2">Asset Allocation</h4>
                <div className="flex h-8 mb-1 rounded-lg overflow-hidden">
                  <div className="bg-primary/80" style={{ width: `${selectedStyleObj.allocation.stocks}%` }}></div>
                  <div className="bg-primary/60" style={{ width: `${selectedStyleObj.allocation.bonds}%` }}></div>
                  <div className="bg-primary/40" style={{ width: `${selectedStyleObj.allocation.cash}%` }}></div>
                  <div
                    className="bg-primary/20"
                    style={{ width: `${selectedStyleObj.allocation.alternatives}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs text-center">
                  <div>
                    <div className="text-primary font-medium">{selectedStyleObj.allocation.stocks}%</div>
                    <div className="text-muted-foreground">Stocks</div>
                  </div>
                  <div>
                    <div className="text-primary font-medium">{selectedStyleObj.allocation.bonds}%</div>
                    <div className="text-muted-foreground">Bonds</div>
                  </div>
                  <div>
                    <div className="text-primary font-medium">{selectedStyleObj.allocation.cash}%</div>
                    <div className="text-muted-foreground">Cash</div>
                  </div>
                  <div>
                    <div className="text-primary font-medium">{selectedStyleObj.allocation.alternatives}%</div>
                    <div className="text-muted-foreground">Other</div>
                  </div>
                </div>
              </div>

              {/* Strategy Details */}
              <div className="mt-4 text-sm text-muted-foreground">
                <p>{selectedStyleObj.details}</p>
              </div>

              {/* Apply Button */}
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90">Apply This Strategy</Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <h2 className="text-xl font-semibold mb-3">Account Settings</h2>
      <Card className="bg-secondary/50 border-0 mb-6">
        <CardContent className="p-0">
          <Link href="/profile/personal-info">
            <div className="flex justify-between items-center p-4 border-b border-gray-800 hover:bg-gray-800">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <span>Personal Information</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
          </Link>

          <Link href="/profile/payment-methods">
            <div className="flex justify-between items-center p-4 border-b border-gray-800 hover:bg-gray-800">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                <span>Payment Methods</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
          </Link>

          <Link href="/profile/notifications">
            <div className="flex justify-between items-center p-4 border-b border-gray-800 hover:bg-gray-800">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span>Notifications</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
          </Link>

          <Link href="/profile/security">
            <div className="flex justify-between items-center p-4 hover:bg-gray-800">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                <span>Security</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button
        variant="outline"
        className="w-full border-gray-700 text-red-400 hover:text-red-300 hover:bg-gray-900"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 mr-2" />
        Log Out
      </Button>
    </AppShell>
  )
}
