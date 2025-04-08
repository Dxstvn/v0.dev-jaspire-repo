"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { PieChart, BarChart, TrendingUp, ShoppingBag, Coffee, Utensils, Car, Home } from "lucide-react"

interface TransactionInsightsProps {
  className?: string
}

export function TransactionInsights({ className = "" }: TransactionInsightsProps) {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month")

  // These would come from the Mastercard Open Banking API in a real implementation
  const categories = [
    {
      name: "Shopping",
      amount: 450.75,
      percentage: 35,
      icon: <ShoppingBag className="h-4 w-4" />,
      color: "bg-primary",
    },
    { name: "Dining", amount: 320.5, percentage: 25, icon: <Utensils className="h-4 w-4" />, color: "bg-blue-500" },
    { name: "Coffee", amount: 128.25, percentage: 10, icon: <Coffee className="h-4 w-4" />, color: "bg-amber-500" },
    {
      name: "Transportation",
      amount: 192.3,
      percentage: 15,
      icon: <Car className="h-4 w-4" />,
      color: "bg-purple-500",
    },
    { name: "Housing", amount: 192.3, percentage: 15, icon: <Home className="h-4 w-4" />, color: "bg-emerald-500" },
  ]

  // Calculate total spending
  const totalSpending = categories.reduce((sum, category) => sum + category.amount, 0)

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Spending Insights</CardTitle>
            <CardDescription>Understand your spending patterns</CardDescription>
          </div>
          <Tabs value={period} onValueChange={(value) => setPeriod(value as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="week" className="text-xs px-2">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-2">
                Month
              </TabsTrigger>
              <TabsTrigger value="year" className="text-xs px-2">
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Spending</p>
            <p className="text-2xl font-bold">${totalSpending.toFixed(2)}</p>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center">
              <PieChart className="h-4 w-4" />
            </div>
            <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center">
              <BarChart className="h-4 w-4" />
            </div>
            <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-6 h-6 ${category.color} rounded-full flex items-center justify-center mr-2`}>
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">${category.amount.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground ml-2">({category.percentage}%)</span>
                </div>
              </div>
              <Progress value={category.percentage} className="h-1.5" indicatorClassName={category.color} />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">Powered by Mastercard Open Banking API</p>
        </div>
      </CardContent>
    </Card>
  )
}
