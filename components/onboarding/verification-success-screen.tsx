"use client"

import { motion } from "framer-motion"
import { Check, CreditCard } from "lucide-react"

export function VerificationSuccessScreen() {
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

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3,
      },
    },
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center max-w-md">
        <motion.div variants={checkmarkVariants} className="mb-8">
          <div className="w-24 h-24 bg-green-900/30 rounded-full flex items-center justify-center mx-auto relative">
            <Check className="h-12 w-12 text-primary" />
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
          </div>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-2">
          Verification Successful!
        </motion.h1>

        <motion.p variants={itemVariants} className="text-muted-foreground text-lg mb-8">
          Your identity has been verified and your investment account is now being set up. This process is typically
          completed within minutes.
        </motion.p>

        <motion.div variants={itemVariants} className="bg-secondary/50 p-6 rounded-xl mb-8">
          <h3 className="font-semibold mb-2 flex items-center justify-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Next Step: Link Your Card
          </h3>
          <p className="text-sm text-muted-foreground">
            Now that your investment account is being set up, you can link your credit or debit card to start tracking
            and investing your cashback rewards.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="text-sm text-muted-foreground">
          You'll receive an email confirmation once your account setup is complete.
        </motion.div>
      </motion.div>
    </div>
  )
}
