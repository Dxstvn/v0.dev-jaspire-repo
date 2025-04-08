"use client"

import { motion } from "framer-motion"

export function CashbackScreen() {
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

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0, rotateY: 45 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Cashback</h1>
          <p className="text-gray-400 text-lg">Link your cards and track the cashback you earn from your purchases.</p>
        </motion.div>

        <motion.div variants={cardVariants} className="w-full mb-10">
          <div className="relative perspective-1000 flex justify-center">
            {/* Card stack animation */}
            <motion.div
              className="absolute -top-4 -left-4 w-64 h-40 bg-gradient-to-br from-green-800 to-green-900 rounded-xl shadow-lg"
              animate={{ rotate: -6 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                duration: 5,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute -top-2 -left-2 w-64 h-40 bg-gradient-to-br from-green-700 to-green-800 rounded-xl shadow-lg"
              animate={{ rotate: -3 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                duration: 6,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />

            <motion.div
              className="relative w-64 h-40 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-xl flex flex-col justify-between p-4"
              animate={{ rotate: 0 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                duration: 7,
                ease: "easeInOut",
                delay: 0.4,
              }}
            >
              <div className="flex justify-between">
                <div className="text-xs font-light">Your Card</div>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs font-light mb-1">Card Number</div>
                <div className="font-mono">•••• •••• •••• 4242</div>
              </div>
            </motion.div>

            {/* Improved Cashback animation - positioned better */}
            <motion.div
              className="absolute -top-2 -right-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div
                className="bg-green-500 text-black font-bold rounded-full px-3 py-1 text-sm"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(34, 197, 94, 0.4)",
                    "0 0 0 10px rgba(34, 197, 94, 0)",
                    "0 0 0 0 rgba(34, 197, 94, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                Track Cashback
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-4 mt-8">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Track Your Rewards</h3>
              <p className="text-gray-400 text-sm">
                Monitor the cashback you earn from your existing credit and debit cards.
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Automatic Tracking</h3>
              <p className="text-gray-400 text-sm">
                Just use your cards as you normally would. We'll track the cashback you earn automatically.
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
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Maximize Your Rewards</h3>
              <p className="text-gray-400 text-sm">
                Get insights on which cards offer the best rewards for different purchase categories.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
