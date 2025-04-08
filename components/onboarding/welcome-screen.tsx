"use client"

import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"

export function WelcomeScreen() {
  const { user } = useAuth()
  // Extract first name from displayName or use a fallback
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "there"

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  }

  // Floating particles animation
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Animated background particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
          }}
        />
      ))}

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="z-10 max-w-md">
        <motion.div variants={iconVariants} className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto relative">
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 0.3, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <svg className="w-12 h-12 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-2">
            Welcome to Jaspire, <span className="text-primary">{firstName}!</span>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="text-muted-foreground text-lg mb-8">
            Let's get you set up to start tracking and investing the cashback you earn from your existing cards.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-secondary/50 p-6 rounded-xl max-w-md mx-auto border border-border backdrop-blur-sm"
        >
          <p className="text-base mb-6">
            In the next few steps, we'll show you how Jaspire works and help you set up your investment preferences.
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xs text-center">Track Cashback</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-xs text-center">Auto-Invest</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="text-xs text-center">Grow Wealth</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
