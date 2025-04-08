"use client"

import { motion } from "framer-motion"

interface EmptyPieChartProps {
  colors: string[]
}

export function EmptyPieChart({ colors }: EmptyPieChartProps) {
  return (
    <div className="flex justify-center mb-6">
      <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-lg">
        {/* Inner circle with gradient */}
        <defs>
          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" />
            <stop offset="100%" stopColor="hsl(var(--background))" />
          </radialGradient>
        </defs>

        {/* Inner circle */}
        <circle cx="150" cy="150" r="60" fill="url(#centerGradient)" />

        {/* Dashed empty segments */}
        {colors.map((color, index) => {
          const segmentAngle = 360 / colors.length
          const startAngle = index * segmentAngle - 90
          const endAngle = startAngle + segmentAngle

          // Convert angles to radians
          const startRad = (startAngle * Math.PI) / 180
          const endRad = (endAngle * Math.PI) / 180

          // Calculate the SVG arc path
          const x1 = 150 + 80 * Math.cos(startRad)
          const y1 = 150 + 80 * Math.sin(startRad)
          const x2 = 150 + 80 * Math.cos(endRad)
          const y2 = 150 + 80 * Math.sin(endRad)

          // Create the SVG path
          const path = `M 150 150 L ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2} Z`

          return (
            <motion.path
              key={index}
              d={path}
              fill="transparent"
              stroke={color}
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            />
          )
        })}

        {/* Animated pulse to indicate empty state */}
        <motion.circle
          cx="150"
          cy="150"
          r="90"
          fill="transparent"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeDasharray="5,5"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            r: [85, 95, 85],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Center text */}
        <text x="150" y="145" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          No Investments
        </text>
        <text x="150" y="170" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="12">
          Add a card to get started
        </text>
      </svg>
    </div>
  )
}
