"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowUpRight, BarChart3, Info, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { shouldShowDemoData } from "@/utils/user-utils"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EmptyState } from "@/components/empty-state"
import { EmptyPieChart } from "@/components/empty-pie-chart"
import Link from "next/link"

export default function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("allocation")
  const router = useRouter()
  const { user } = useAuth()
  const showDemoData = shouldShowDemoData(user)
  const chartRef = useRef(null)
  const dotRef = useRef({ x: 0, y: 80 })
  const animationRef = useRef(null)
  const [dotVisible, setDotVisible] = useState(false)

  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    growth: 0,
    allocation: [],
    hasData: false,
    performance: {
      "1m": 0,
      "3m": 0,
      "6m": 0,
      "1y": 0,
      all: 0,
    },
  })

  // Set demo data if the user is the demo account
  useEffect(() => {
    if (showDemoData) {
      setPortfolioData({
        totalValue: 1378.27,
        growth: 10.22,
        allocation: [
          {
            name: "Stocks",
            percentage: 55,
            value: 758.05,
            color: "hsl(var(--chart-1))",
            holdings: [
              { name: "Apple (AAPL)", value: 250.3, percentage: 33, growth: 12.5 },
              { name: "Microsoft (MSFT)", value: 180.75, percentage: 24, growth: 8.3 },
              { name: "Amazon (AMZN)", value: 165.5, percentage: 22, growth: -2.1 },
              { name: "Tesla (TSLA)", value: 161.5, percentage: 21, growth: 15.7 },
            ],
          },
          {
            name: "Bonds",
            percentage: 25,
            value: 344.57,
            color: "hsl(var(--chart-2))",
            holdings: [
              { name: "US Treasury 10Y", value: 172.28, percentage: 50, growth: 3.2 },
              { name: "Corporate Bond ETF", value: 103.37, percentage: 30, growth: 2.8 },
              { name: "Municipal Bonds", value: 68.92, percentage: 20, growth: 1.9 },
            ],
          },
          {
            name: "ETFs",
            percentage: 15,
            value: 206.74,
            color: "hsl(var(--chart-3))",
            holdings: [
              { name: "Vanguard S&P 500 (VOO)", value: 103.37, percentage: 50, growth: 9.4 },
              { name: "iShares Russell 2000 (IWM)", value: 62.02, percentage: 30, growth: 5.2 },
              { name: "Invesco QQQ Trust", value: 41.35, percentage: 20, growth: 11.8 },
            ],
          },
          {
            name: "Cash",
            percentage: 5,
            value: 68.91,
            color: "hsl(var(--chart-4))",
            holdings: [{ name: "High-Yield Savings", value: 68.91, percentage: 100, growth: 0.5 }],
          },
        ],
        hasData: true,
        performance: {
          "1m": 2.4,
          "3m": 5.7,
          "6m": 8.1,
          "1y": 12.3,
          all: 15.8,
        },
      })
    } else {
      // Empty portfolio data for new users
      setPortfolioData({
        totalValue: 0,
        growth: 0,
        allocation: [
          { name: "Stocks", percentage: 0, value: 0, color: "hsl(var(--chart-1))", holdings: [] },
          { name: "Bonds", percentage: 0, value: 0, color: "hsl(var(--chart-2))", holdings: [] },
          { name: "ETFs", percentage: 0, value: 0, color: "hsl(var(--chart-3))", holdings: [] },
          { name: "Cash", percentage: 0, value: 0, color: "hsl(var(--chart-4))", holdings: [] },
        ],
        hasData: false,
        performance: {
          "1m": 0,
          "3m": 0,
          "6m": 0,
          "1y": 0,
          all: 0,
        },
      })
    }
  }, [showDemoData])

  // Calculate the total circumference
  const radius = 80
  const circumference = 2 * Math.PI * radius

  const handleSegmentClick = (index: number) => {
    setActiveIndex(index)
    setShowDetails(true)
  }

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

  // Define default chart points for empty state
  const emptyChartPoints = [
    { x: 0, y: 80 },
    { x: 60, y: 70 },
    { x: 120, y: 75 },
    { x: 180, y: 65 },
    { x: 240, y: 60 },
    { x: 300, y: 50 },
  ]

  // Define the path points for the performance chart with more points for smoother curve
  const demoChartPoints = [
    { x: 0, y: 100 - portfolioData.performance["1m"] },
    { x: 30, y: 100 - (portfolioData.performance["1m"] + portfolioData.performance["3m"]) / 2 }, // Midpoint
    { x: 60, y: 100 - portfolioData.performance["3m"] },
    { x: 90, y: 100 - (portfolioData.performance["3m"] + portfolioData.performance["6m"]) / 2 }, // Midpoint
    { x: 120, y: 100 - portfolioData.performance["6m"] },
    { x: 150, y: 100 - (portfolioData.performance["6m"] + portfolioData.performance["1y"]) / 2 }, // Midpoint
    { x: 180, y: 100 - portfolioData.performance["1y"] },
    { x: 240, y: 100 - (portfolioData.performance["1y"] + portfolioData.performance["all"]) / 2 }, // Midpoint
    { x: 300, y: 100 - portfolioData.performance["all"] },
  ]

  // Use the appropriate chart points based on data availability
  const chartPoints = portfolioData.hasData ? demoChartPoints : emptyChartPoints

  // Create a smooth curve using bezier curves
  const createSmoothPath = (points) => {
    if (points.length < 2) return ""

    let path = `M ${points[0].x} ${points[0].y}`

    // Use cubic bezier curves for smoothing
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i]
      const next = points[i + 1]

      // Calculate control points
      const controlX1 = current.x + (next.x - current.x) / 3
      const controlY1 = current.y
      const controlX2 = next.x - (next.x - current.x) / 3
      const controlY2 = next.y

      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`
    }

    return path
  }

  // Create the SVG path string with smooth curves
  const pathD = createSmoothPath(chartPoints)

  // Create the area path string
  const areaPathD = `${pathD} L ${chartPoints[chartPoints.length - 1].x} 100 L ${chartPoints[0].x} 100 Z`

  // Handle dot animation when tab changes
  useEffect(() => {
    // Initialize dot position
    dotRef.current = { x: chartPoints[0].x, y: chartPoints[0].y }

    // Only show dot and start animation when performance tab is active
    if (activeTab === "performance") {
      setDotVisible(true)

      let pointIndex = 0

      // Animation function
      const animateDot = () => {
        // Move to next point
        pointIndex = (pointIndex + 1) % chartPoints.length

        // Update ref (not state) to avoid re-renders
        dotRef.current = {
          x: chartPoints[pointIndex].x,
          y: chartPoints[pointIndex].y,
        }

        // Force a repaint of the dot
        const dotElement = document.getElementById("chart-dot")
        if (dotElement) {
          dotElement.style.transform = `translate(${dotRef.current.x - 8}px, ${dotRef.current.y - 8}px)`
        }

        // Schedule next animation frame
        animationRef.current = setTimeout(animateDot, 2000)
      }

      // Start animation
      animationRef.current = setTimeout(animateDot, 2000)

      // Cleanup function
      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current)
          animationRef.current = null
        }
        setDotVisible(false)
      }
    }
  }, [activeTab, chartPoints])

  return (
    <AppShell>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Portfolio Summary */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-secondary to-background border-0 overflow-hidden relative card-hover">
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-muted-foreground text-sm">Portfolio Value</p>
                  <h2 className="text-3xl font-bold">${portfolioData.totalValue.toFixed(2)}</h2>
                </div>
                {portfolioData.hasData && (
                  <div className="bg-primary/20 px-2 py-1 rounded-full flex items-center">
                    <ArrowUpRight className="h-3 w-3 text-primary mr-1" />
                    <span className="text-primary text-xs font-medium">{portfolioData.growth}%</span>
                  </div>
                )}
              </div>

              {portfolioData.hasData && (
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground mb-1">All-time growth</div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${portfolioData.performance.all}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Portfolio Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="allocation" onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-12 p-0 bg-secondary/50 rounded-lg">
              <TabsTrigger
                value="allocation"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-muted-foreground h-full"
              >
                Allocation
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-muted-foreground h-full"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger
                value="holdings"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-muted-foreground h-full"
              >
                Holdings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="allocation" className="mt-6">
              <Card className="bg-secondary/50 border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Asset Allocation</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click segments to see investment details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  {portfolioData.hasData ? (
                    <>
                      {/* Enhanced SVG Pie Chart */}
                      <div className="flex justify-center mb-6">
                        <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-lg">
                          {/* Inner circle with gradient */}
                          <defs>
                            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                              <stop offset="0%" stopColor="hsl(var(--secondary))" />
                              <stop offset="100%" stopColor="hsl(var(--background))" />
                            </radialGradient>
                          </defs>
                          <circle cx="150" cy="150" r="60" fill="url(#centerGradient)" />

                          {/* Outer glow for active segment */}
                          {hoveredIndex !== null && (
                            <circle
                              cx="150"
                              cy="150"
                              r="100"
                              fill="transparent"
                              stroke={portfolioData.allocation[hoveredIndex].color}
                              strokeWidth="2"
                              strokeOpacity="0.3"
                              className="animate-pulse-glow"
                            />
                          )}

                          {/* Calculate and render segments */}
                          {(() => {
                            let offset = 0
                            const segments = []

                            portfolioData.allocation.forEach((asset, index) => {
                              const segmentLength = (asset.percentage / 100) * circumference
                              const isActive = index === activeIndex

                              segments.push(
                                <circle
                                  key={index}
                                  className="transition-all duration-300 cursor-pointer"
                                  cx="150"
                                  cy="150"
                                  r="80"
                                  fill="transparent"
                                  stroke={asset.color}
                                  strokeWidth={isActive ? "45" : "40"}
                                  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                                  strokeDashoffset={-offset}
                                  transform="rotate(-90, 150, 150)"
                                  onClick={() => handleSegmentClick(index)}
                                  onMouseEnter={() => setHoveredIndex(index)}
                                  onMouseLeave={() => setHoveredIndex(null)}
                                  style={{
                                    filter: isActive ? "brightness(1.2)" : "none",
                                    transition: "all 0.3s ease",
                                  }}
                                />,
                              )
                              offset += segmentLength
                            })

                            return segments
                          })()}

                          {/* Center text with gradient */}
                          <text x="150" y="145" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                            {portfolioData.allocation[activeIndex].name}
                          </text>
                          <text
                            x="150"
                            y="170"
                            textAnchor="middle"
                            fill="hsl(var(--primary))"
                            fontSize="14"
                            fontWeight="bold"
                          >
                            {portfolioData.allocation[activeIndex].percentage}%
                          </text>
                        </svg>
                      </div>

                      <AnimatePresence>
                        {showDetails && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 p-4 bg-background/50 rounded-lg mb-4 backdrop-blur-sm">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium text-lg">
                                  {portfolioData.allocation[activeIndex].name} Holdings
                                </h3>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowDetails(false)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  Close
                                </Button>
                              </div>
                              {portfolioData.allocation[activeIndex].holdings.map((holding, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center p-3 bg-background/50 rounded-lg"
                                >
                                  <span>{holding.name}</span>
                                  <div className="text-right">
                                    <div className="font-medium">${holding.value.toFixed(2)}</div>
                                    <div className="flex items-center text-xs">
                                      <span className={holding.growth >= 0 ? "text-green-400" : "text-red-400"}>
                                        {holding.growth >= 0 ? "+" : ""}
                                        {holding.growth}%
                                      </span>
                                      <span className="text-muted-foreground ml-2">{holding.percentage}%</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-2 mt-4">
                        {portfolioData.allocation.map((asset, index) => (
                          <div
                            key={index}
                            className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              index === activeIndex ? "bg-background/50 backdrop-blur-sm" : "hover:bg-background/30"
                            }`}
                            onClick={() => setActiveIndex(index)}
                          >
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
                              <span>{asset.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-muted-foreground">{asset.percentage}%</span>
                              <span className="font-medium">${asset.value.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <EmptyState
                      icon={<EmptyPieChart colors={portfolioData.allocation.map((a) => a.color)} />}
                      title="No investments yet"
                      description="Start by linking a card to track cashback, which will be automatically invested based on your preferences."
                      action={
                        <div className="flex flex-col space-y-3">
                          <Link href="/add-card">
                            <Button className="bg-white text-black hover:bg-white/90 w-full">
                              <Plus className="h-4 w-4 mr-2" />
                              Link Card
                            </Button>
                          </Link>
                          <Link href="/profile">
                            <Button variant="outline" className="border-muted hover:border-primary w-full">
                              Set Investment Preferences
                            </Button>
                          </Link>
                        </div>
                      }
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <Card className="bg-secondary/50 border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Performance</CardTitle>
                  <CardDescription>Track your investment growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 mb-6 relative">
                    {portfolioData.hasData ? (
                      <>
                        {/* Simplified performance chart */}
                        <div className="relative h-full w-full">
                          {/* Grid lines */}
                          <div className="absolute inset-0 grid grid-rows-4 w-full h-full">
                            {[0, 1, 2, 3].map((i) => (
                              <div key={i} className="border-t border-border/50 h-full"></div>
                            ))}
                          </div>

                          {/* Performance line */}
                          <div className="absolute inset-0 flex items-end">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className="relative h-[85%] w-full"
                            >
                              {/* The actual line */}
                              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"></div>

                              {/* Performance points */}
                              {["1m", "3m", "6m", "1y", "all"].map((period, index) => {
                                const value = portfolioData.performance[period]
                                const x = `${index * 25}%`
                                const height = `${Math.min(85, value * 5)}%`

                                return (
                                  <motion.div
                                    key={period}
                                    className="absolute bottom-0 w-1 bg-primary rounded-t-full"
                                    style={{ left: x, height: 0 }}
                                    animate={{ height }}
                                    transition={{
                                      delay: index * 0.2,
                                      duration: 0.8,
                                      ease: "easeOut",
                                    }}
                                  >
                                    {/* Highlight dot */}
                                    <motion.div
                                      className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: index * 0.2 + 0.5, duration: 0.3 }}
                                    />
                                  </motion.div>
                                )
                              })}
                            </motion.div>
                          </div>
                        </div>

                        {/* Time labels */}
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>1M</span>
                          <span>3M</span>
                          <span>6M</span>
                          <span>1Y</span>
                          <span>All</span>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <motion.div
                          className="w-full h-[2px] bg-primary/30"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5 }}
                        >
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary/30" />
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {portfolioData.hasData ? (
                    <div className="grid grid-cols-2 gap-4 grid-adjust-mobile">
                      <div className="bg-background/30 p-4 rounded-lg backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm">1 Month</p>
                        <p className="text-primary text-lg font-medium">+{portfolioData.performance["1m"]}%</p>
                      </div>
                      <div className="bg-background/30 p-4 rounded-lg backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm">3 Months</p>
                        <p className="text-primary text-lg font-medium">+{portfolioData.performance["3m"]}%</p>
                      </div>
                      <div className="bg-background/30 p-4 rounded-lg backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm">6 Months</p>
                        <p className="text-primary text-lg font-medium">+{portfolioData.performance["6m"]}%</p>
                      </div>
                      <div className="bg-background/30 p-4 rounded-lg backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm">1 Year</p>
                        <p className="text-primary text-lg font-medium">+{portfolioData.performance["1y"]}%</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <EmptyState
                        icon={<BarChart3 className="h-12 w-12 text-primary/70" />}
                        title="No performance data yet"
                        description="Once you start investing, you'll see your performance metrics here."
                        ctaText="Link Card to Start"
                        ctaLink="/add-card"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="holdings" className="mt-6">
              <Card className="bg-secondary/50 border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Your Holdings</CardTitle>
                  <CardDescription>All investments in your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  {portfolioData.hasData ? (
                    <div className="space-y-4">
                      {portfolioData.allocation.flatMap((category) =>
                        category.holdings.map((holding, idx) => (
                          <div
                            key={`${category.name}-${idx}`}
                            className="flex justify-between items-center p-3 bg-background/30 rounded-lg backdrop-blur-sm"
                          >
                            <div>
                              <div className="font-medium">{holding.name}</div>
                              <div className="text-xs text-muted-foreground">{category.name}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${holding.value.toFixed(2)}</div>
                              <div className={`text-xs ${holding.growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                                {holding.growth >= 0 ? "+" : ""}
                                {holding.growth}%
                              </div>
                            </div>
                          </div>
                        )),
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<BarChart3 className="h-12 w-12 text-primary/70" />}
                      title="No holdings yet"
                      description="Your investments will appear here once you start investing."
                      ctaText="Link Card"
                      ctaLink="/add-card"
                      className="py-8"
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 gap-4">
            {/* Fixed Rebalance button - now using white background with black text for consistency */}
            <Button
              className="bg-white text-black hover:bg-white/90"
              disabled={!portfolioData.hasData}
              title={!portfolioData.hasData ? "You need investments to rebalance" : "Rebalance your portfolio"}
            >
              Rebalance
            </Button>
            <Link href="/add-card" className="w-full">
              <Button className="bg-white text-black hover:bg-white/90 w-full">Link Card</Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  )
}
