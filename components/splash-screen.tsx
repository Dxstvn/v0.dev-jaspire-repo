"use client"

import { motion } from "framer-motion"

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-6"
        >
          <motion.svg
            className="w-12 h-12 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </motion.svg>
        </motion.div>

        <motion.h1
          className="text-3xl font-bold mb-2 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Jaspire
        </motion.h1>

        <motion.p
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Invest your cashback wisely
        </motion.p>

        {/* Loading indicator */}
        <motion.div
          className="mt-8 w-12 h-1 bg-gray-800 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              delay: 1,
              duration: 1,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
