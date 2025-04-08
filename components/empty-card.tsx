"use client"

import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"

export function EmptyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-48 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 p-6 flex flex-col justify-between shadow-xl overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "linear",
          repeatDelay: 1,
        }}
      />

      <div className="flex justify-between">
        <div className="text-xs font-light text-muted-foreground">Jaspire Rewards</div>
        <CreditCard className="h-8 w-8 text-primary/70" />
      </div>

      <div>
        <div className="font-mono text-lg tracking-wider text-muted-foreground">•••• •••• •••• ••••</div>
        <div className="flex justify-between mt-2">
          <div>
            <div className="text-xs font-light text-muted-foreground mb-1">Card Holder</div>
            <div className="font-medium text-muted-foreground">Your Name</div>
          </div>
          <div>
            <div className="text-xs font-light text-muted-foreground mb-1">Expires</div>
            <div className="text-muted-foreground">MM/YY</div>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-primary/30"
        animate={{
          width: ["0%", "100%"],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
          repeatDelay: 1,
        }}
      />
    </motion.div>
  )
}
