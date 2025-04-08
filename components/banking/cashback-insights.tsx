"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { mastercardApi, type MastercardTransaction } from "@/lib/mastercard-api"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, ShoppingBag, Coffee, Utensils, Car, Home } from "lucide-react"

interface CashbackInsightsProps {
  className?: string
}

interface CategoryInsight {
  name: string
  amount: number
  cashback: number
  percentage: number
  icon: JSX.Element
  color: string
}

export function CashbackInsights({ className = "" }: CashbackInsightsProps) {
  const [transactions, setTransactions] = useState<MastercardTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryInsights, setCategoryInsights] = useState<CategoryInsight[]>([])
  const [totalCashback, setTotalCashback] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (transactions.length > 0) {
      processTransactions()
    }
  }, [transactions])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const transactionsData = await mastercardApi.getTransactions()
      setTransactions(transactionsData)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const processTransactions = () => {
    // Group transactions by category and calculate cashback
    const categories: Record<string, CategoryInsight> = {}
    let total = 0

    transactions.forEach((transaction) => {
      const cashback = transaction.cashback || 0
      total += cashback

      const category = transaction.category.toLowerCase()

      if (!categories[category]) {
        let icon = <ShoppingBag className="h-4 w-4" />
        let color = "bg-primary"

        // Assign icons and colors based on category
        switch (category) {
          case "groceries":
            icon = <ShoppingBag className="h-4 w-4" />
            color = "bg-primary"
            break
          case "food_and_drink":
            icon = <Utensils className="h-4 w-4" />
            color = "bg-blue-500"
            break
          case "transportation":
            icon = <Car className="h-4 w-4" />
            color = "bg-purple-500"
            break
          case "entertainment":
            icon = <Coffee className="h-4 w-4" />
            color = "bg-amber-500"
            break
          case "health":
          case "health_and_fitness":
            icon = <Home className="h-4 w-4" />
            color = "bg-emerald-500"
            break
          default:
            icon = <CreditCard className="h-4 w-4" />
            color = "bg-gray-500"
        }

        categories[category] = {
          name: formatCategoryName(category),
          amount: Math.abs(transaction.amount),
          cashback,
          percentage: 0, // Will calculate after summing all
          icon,
          color,
        }
      } else {
        categories[category].amount += Math.abs(transaction.amount)
        categories[category].cashback += cashback
      }
    })

    // Calculate percentages
    Object.values(categories).forEach((category) => {
      category.percentage = total > 0 ? (category.cashback / total) * 100 : 0
    })

    // Sort by cashback amount (descending)
    const sortedCategories = Object.values(categories).sort((a, b) => b.cashback - a.cashback)

    setCategoryInsights(sortedCategories)
    setTotalCashback(total)
  }

  const formatCategoryName = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Cashback Rewards</CardTitle>
        <CardDescription>Track your cashback earnings by category</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-24 mb-2" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Total Cashback Earned</p>
              <p className="text-3xl font-bold">${totalCashback.toFixed(2)}</p>
            </div>

            <div className="space-y-4">
              {categoryInsights.length > 0 ? (
                categoryInsights.map((category, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 ${category.color} rounded-full flex items-center justify-center mr-2`}>
                          {category.icon}
                        </div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">${category.cashback.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground ml-2">({category.percentage.toFixed(0)}%)</span>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-1.5" indicatorClassName={category.color} />
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-2">No cashback data available</p>
                  <p className="text-sm text-muted-foreground">
                    Connect your accounts to start tracking cashback rewards
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">Powered by Mastercard Open Banking</p>
        </div>
      </CardContent>
    </Card>
  )
}
