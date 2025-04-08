"use client"

import { motion } from "framer-motion"

export function EmptyChart() {
  return (
    <div className="h-48 mb-6 relative">
      <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
        {/* Chart grid lines */}
        <line x1="0" y1="0" x2="300" y2="0" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="0" y1="25" x2="300" y2="25" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="0" y1="50" x2="300" y2="50" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="0" y1="75" x2="300" y2="75" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="0" y1="100" x2="300" y2="100" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />

        {/* Placeholder dashed line */}
        <motion.path
          d="M 0 80 Q 75 60, 150 70 T 300 50"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeDasharray="5,5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Animated dot that follows the line */}
        <motion.circle
          cx="0"
          cy="0"
          r="4"
          fill="hsl(var(--primary))"
          animate={{
            cx: [0, 75, 150, 225, 300],
            cy: [80, 60, 70, 60, 50],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          }}
        />
      </svg>

      {/* Time labels */}
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>1M</span>
        <span>3M</span>
        <span>6M</span>
        <span>1Y</span>
        <span>All</span>
      </div>
    </div>
  )
}
