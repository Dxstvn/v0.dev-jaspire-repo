"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useInvestmentAccount } from "@/hooks/use-investment-account"
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation"

export function SuccessScreen() {
  const router = useRouter()
  const { createAccount } = useInvestmentAccount()

  // Automatically create account and redirect
  useEffect(() => {
    let isMounted = true

    const setupAccount = async () => {
      try {
        // Trigger confetti animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })

        // Create the account
        await createAccount()

        // Redirect to dashboard after a brief delay to see the confetti
        if (isMounted) {
          setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
        }
      } catch (err) {
        console.error("Error creating account:", err)
        // Redirect anyway
        if (isMounted) {
          router.push("/dashboard")
        }
      }
    }

    setupAccount()

    return () => {
      isMounted = false
    }
  }, [createAccount, router])

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

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md mx-auto"
      >
        <motion.div variants={itemVariants}>
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-12 w-12 text-primary" />
          </div>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-2">
          You're All Set!
        </motion.h1>

        <motion.p variants={itemVariants} className="text-muted-foreground text-lg mb-8">
          Your Jaspire account is ready to help you track and invest cashback.
        </motion.p>

        <motion.div variants={itemVariants}>
          <div className="bg-secondary/50 p-6 rounded-xl max-w-md mx-auto mb-8 border border-muted">
            <h3 className="font-medium text-lg mb-4">What's Next?</h3>
            <ul className="space-y-4 text-left">
              <li className="flex items-start">
                <div className="bg-primary/20 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">Link a payment card to track cashback</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  Track your cashback and investment growth in the dashboard
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  Customize your investment strategy in your profile settings
                </span>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
