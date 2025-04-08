"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { getFirestore, doc, updateDoc } from "firebase/firestore"
import { useAuth } from "@/contexts/auth-context"
import { useInvestmentAccount } from "@/hooks/use-investment-account"
import { useRouter } from "next/navigation"

// Investment style definitions
const investmentStyles = [
  {
    id: "conservative",
    title: "Conservative",
    description: "Lower risk, stable returns",
    details:
      "Our conservative strategy focuses on capital preservation through high-grade bonds, blue-chip stocks, and stable dividend-paying companies. Perfect for those nearing retirement or preferring minimal market volatility.",
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-500",
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    id: "balanced",
    title: "Balanced",
    description: "Moderate risk and returns",
    details:
      "A balanced approach combining growth and stability through a diversified mix of stocks and bonds. Ideal for investors with a medium-term horizon seeking steady growth while managing risk.",
    color: "from-primary to-primary/70",
    textColor: "text-primary",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "aggressive",
    title: "Aggressive",
    description: "Higher risk, potential for higher returns",
    details:
      "Maximizing growth potential through a stock-heavy portfolio, including emerging markets and growth stocks. Suited for young investors or those comfortable with market volatility in pursuit of higher returns.",
    color: "from-red-500 to-red-600",
    textColor: "text-red-500",
    icon: (
      <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: "dividend",
    title: "Dividend",
    description: "Focus on income-generating assets",
    details:
      "Focusing on stable income through dividend-paying stocks, REITs, and high-yield bonds. Perfect for investors seeking regular income streams while maintaining potential for capital appreciation.",
    color: "from-purple-500 to-purple-600",
    textColor: "text-purple-500",
    icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
]

interface InvestmentPreferencesScreenProps {
  onComplete?: () => void
}

export function InvestmentPreferencesScreen({ onComplete }: InvestmentPreferencesScreenProps) {
  const [selectedStyle, setSelectedStyle] = useState("balanced")
  const [expandedStyle, setExpandedStyle] = useState<string | null>(null)
  const { user } = useAuth()
  const { createAccount } = useInvestmentAccount()
  const router = useRouter()

  // Handle style selection and save to Firestore
  const handleSelectStyle = async (styleId: string) => {
    setSelectedStyle(styleId)

    // Save the preference to Firestore
    if (user) {
      try {
        const db = getFirestore()
        const userRef = doc(db, "users", user.uid)

        await updateDoc(userRef, {
          "preferences.investmentStyle": styleId,
          "preferences.updatedAt": new Date().toISOString(),
        })
      } catch (error) {
        console.error("Error saving investment preference:", error)
      }
    }
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

  // Investment preferences UI
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 w-full"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Choose Your Investment Style</h1>
        <p className="text-muted-foreground text-sm sm:text-base px-2">
          Select an approach that matches your goals and risk tolerance.
        </p>
      </motion.div>

      {/* Strategy Selection Tabs */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md mb-6">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
          {investmentStyles.map((style) => (
            <motion.button
              key={style.id}
              variants={itemVariants}
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl transition-all
                ${selectedStyle === style.id ? "bg-white text-black" : "bg-gray-800/50 text-white hover:bg-gray-800/80"}
              `}
              onClick={() => handleSelectStyle(style.id)}
            >
              <div className="mb-2">{style.icon}</div>
              <div className="text-center">
                <p className="text-sm font-medium">{style.title}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Selected Strategy Details */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        {investmentStyles
          .filter((style) => style.id === selectedStyle)
          .map((style) => (
            <motion.div
              key={style.id}
              variants={itemVariants}
              className="bg-gray-800/50 rounded-xl p-5 backdrop-blur-sm"
            >
              <div className="flex items-start">
                <div className="mr-4 mt-1">{style.icon}</div>
                <div>
                  <h3 className="font-medium text-lg">{style.title}</h3>
                  <p className="text-muted-foreground">{style.description}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{style.details}</p>
                </div>
              </div>
            </motion.div>
          ))}

        <motion.div variants={itemVariants} className="mt-6 bg-secondary/50 p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            Don't worry, you can always change your investment style later in your profile settings.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
