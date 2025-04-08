"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function FinalGuidanceScreen() {
  const [showGuidance, setShowGuidance] = useState(true)
  const router = useRouter()

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGuidance(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Navigate to transactions page after guidance is dismissed
  useEffect(() => {
    if (!showGuidance) {
      const timer = setTimeout(() => {
        router.push("/transactions")
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [showGuidance, router])

  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white">
      {/* Simulated app background */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cards</h1>
        </div>

        {/* Simulated cards page content */}
        <div className="flex-1 px-4 pb-20 opacity-50">
          <div className="bg-gray-900 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Cards</h2>
              <Button variant="outline" size="sm" className="border-gray-700 hover:border-green-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </div>

            <div className="text-center py-8 text-gray-400">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payment methods added yet</p>
              <p className="text-sm mt-2">Add a card to start earning cashback</p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around py-3">
          <Button variant="ghost" size="icon" className="flex flex-col items-center text-gray-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Button>

          <Button variant="ghost" size="icon" className="flex flex-col items-center text-gray-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            <span className="text-xs mt-1">Portfolio</span>
          </Button>

          <Button variant="ghost" size="icon" className="flex flex-col items-center text-green-400">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs mt-1">Cards</span>
          </Button>

          <Button variant="ghost" size="icon" className="flex flex-col items-center text-gray-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>

      {/* Guidance overlay */}
      <AnimatePresence>
        {showGuidance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <div className="relative max-w-md mx-auto px-4">
              {/* Animated arrow pointing to Add Card button */}
              <motion.div
                initial={{ x: 0, y: 0 }}
                animate={{ x: 10, y: -10 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 1,
                }}
                className="absolute top-1/4 right-1/4"
              >
                <ArrowRight className="h-12 w-12 text-green-400" />
              </motion.div>

              {/* Animated circle around the Cards tab */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                  }}
                  className="w-20 h-20 rounded-full border-2 border-green-400"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <CreditCard className="h-8 w-8 text-green-400" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-900 p-6 rounded-xl border border-green-800"
              >
                <h2 className="text-xl font-bold mb-3">Add Your Cards</h2>
                <p className="text-gray-300 mb-4">
                  To start earning cashback, add your payment cards in the Cards section. Each purchase you make will
                  automatically earn cashback that gets invested.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setShowGuidance(false)}>
                  Got it
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
