"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function PortfolioScreen() {
  const [activeSegment, setActiveSegment] = useState(0)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  const chartVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  }

  // Sample portfolio data
  const portfolioData = {
    totalValue: 1378.27,
    growth: 10.22,
    allocation: [
      { name: "Stocks", percentage: 55, color: "#10b981" },
      { name: "Bonds", percentage: 25, color: "#34d399" },
      { name: "ETFs", percentage: 15, color: "#2dd4bf" },
      { name: "Cash", percentage: 5, color: "#a7f3d0" },
    ],
    performance: [15, 25, 18, 30, 22, 35, 40, 45, 38, 50, 55, 60],
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Track Your Growth</h1>
          <p className="text-gray-400 text-lg">Watch your investments grow over time with detailed analytics.</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 mb-6 border border-gray-800"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Portfolio Value</p>
              <motion.h2
                className="text-2xl font-bold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                ${portfolioData.totalValue.toFixed(2)}
              </motion.h2>
            </div>
            <motion.div
              className="bg-green-900/50 px-2 py-1 rounded-full flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-3 h-3 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-green-400 text-xs font-medium">{portfolioData.growth}%</span>
            </motion.div>
          </div>

          {/* Animated Chart */}
          <div className="h-32 mb-4 relative">
            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
              {/* Chart grid lines */}
              <line x1="0" y1="0" x2="300" y2="0" stroke="#374151" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="25" x2="300" y2="25" stroke="#374151" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#374151" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="#374151" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="#374151" strokeWidth="0.5" strokeDasharray="2,2" />

              {/* Chart line */}
              <motion.path
                d={`M 0 ${100 - portfolioData.performance[0]} 
                    ${portfolioData.performance
                      .map((value, index) => {
                        const x = (index * 300) / (portfolioData.performance.length - 1)
                        const y = 100 - value
                        return `L ${x} ${y}`
                      })
                      .join(" ")}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={chartVariants}
              />

              {/* Area under the chart */}
              <motion.path
                d={`M 0 ${100 - portfolioData.performance[0]} 
                    ${portfolioData.performance
                      .map((value, index) => {
                        const x = (index * 300) / (portfolioData.performance.length - 1)
                        const y = 100 - value
                        return `L ${x} ${y}`
                      })
                      .join(" ")}
                    L 300 100 L 0 100 Z`}
                fill="url(#gradient)"
                fillOpacity="0.2"
                variants={chartVariants}
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Animated dot that follows the line */}
            <motion.div
              className="absolute w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"
              style={{ top: 0, left: 0 }}
              animate={{
                left: [0, 300],
                top: portfolioData.performance.map((value) => `calc(${100 - value}% - 6px)`),
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                times: portfolioData.performance.map((_, i) => i / (portfolioData.performance.length - 1)),
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="bg-gray-800 p-3 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <p className="text-gray-400 text-xs mb-1">Cashback</p>
              <p className="text-lg font-semibold">$127.85</p>
            </motion.div>
            <motion.div
              className="bg-gray-800 p-3 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <p className="text-gray-400 text-xs mb-1">Invested</p>
              <p className="text-lg font-semibold">$1,250.42</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Improved Pie chart for asset allocation */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 mb-6 border border-gray-800"
        >
          <h3 className="font-medium mb-4">Asset Allocation</h3>

          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Simplified pie chart with better performance */}
                {portfolioData.allocation.map((asset, index) => {
                  // Calculate the start and end angles for each segment
                  let startAngle = 0
                  for (let i = 0; i < index; i++) {
                    startAngle += portfolioData.allocation[i].percentage * 3.6 // 3.6 = 360 / 100
                  }
                  const endAngle = startAngle + asset.percentage * 3.6

                  // Convert angles to radians
                  const startRad = ((startAngle - 90) * Math.PI) / 180
                  const endRad = ((endAngle - 90) * Math.PI) / 180

                  // Calculate the SVG arc path
                  const x1 = 50 + 40 * Math.cos(startRad)
                  const y1 = 50 + 40 * Math.sin(startRad)
                  const x2 = 50 + 40 * Math.cos(endRad)
                  const y2 = 50 + 40 * Math.sin(endRad)

                  // Determine if the arc should be drawn as a large arc
                  const largeArcFlag = asset.percentage > 50 ? 1 : 0

                  // Create the SVG path
                  const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

                  return (
                    <path
                      key={index}
                      d={path}
                      fill={asset.color}
                      stroke="#1f2937"
                      strokeWidth="1"
                      opacity={activeSegment === index ? 1 : 0.8}
                      onClick={() => setActiveSegment(index)}
                      style={{
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    />
                  )
                })}

                {/* Simple inner circle */}
                <circle cx="50" cy="50" r="25" fill="#1f2937" />
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-medium">{portfolioData.allocation[activeSegment].name}</span>
                <span className="text-xs text-green-400 font-bold">
                  {portfolioData.allocation[activeSegment].percentage}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {portfolioData.allocation.map((asset, index) => (
              <motion.div
                key={index}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  activeSegment === index ? "bg-gray-800" : "hover:bg-gray-800/50"
                }`}
                onClick={() => setActiveSegment(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }} />
                <span className="text-sm">{asset.name}</span>
                <span className="ml-auto text-xs text-gray-400">{asset.percentage}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-4">
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg flex items-start"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="bg-green-900/30 p-2 rounded-full mr-4">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Detailed Analytics</h3>
              <p className="text-gray-400 text-sm">
                Track your portfolio performance with detailed charts and analytics.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg flex items-start"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="bg-green-900/30 p-2 rounded-full mr-4">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Real-time Updates</h3>
              <p className="text-gray-400 text-sm">
                Receive notifications about your investments and cashback earnings.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
