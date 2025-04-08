"use client"

import { motion } from "framer-motion"
import { CreditCard, Shield, Lock } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AddCard() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
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

  const router = useRouter()

  return (
    <AppShell>
      {/* Header with just the title, no back button */}
      <div className="mb-6">
        <h1 className="text-xl font-medium">Link Payment Card</h1>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-md mx-auto">
        <motion.div variants={itemVariants} className="mb-6 text-center">
          <p className="text-muted-foreground">Link your existing cards to track and invest the cashback you earn</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          {/* Card Preview */}
          <div className="relative h-48 mb-8 perspective">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/80 to-primary/40 p-6 flex flex-col justify-between shadow-xl">
              <div className="flex justify-between">
                <div className="text-xs font-light">Your Card</div>
                <CreditCard className="h-8 w-8" />
              </div>
              <div>
                <div className="font-mono text-lg tracking-wider">•••• •••• •••• ••••</div>
                <div className="flex justify-between mt-2">
                  <div>
                    <div className="text-xs font-light mb-1">Card Holder</div>
                    <div className="font-medium">Your Name</div>
                  </div>
                  <div>
                    <div className="text-xs font-light mb-1">Expires</div>
                    <div>MM/YY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connect Card Section */}
          <Card className="bg-secondary/50 border-0">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Connect Your Card</h2>
                  <p className="text-muted-foreground mb-4">
                    Securely connect your card to track transactions and cashback rewards
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-background/50 rounded-lg">
                    <Shield className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Bank-level Security</p>
                      <p className="text-sm text-muted-foreground">
                        Your credentials are never stored on our servers and all data is encrypted.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-background/50 rounded-lg">
                    <Lock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Read-only Access</p>
                      <p className="text-sm text-muted-foreground">
                        We can only view your transactions and account details, not move money without your explicit
                        permission.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-white text-black hover:bg-white/90 rounded-full"
                  onClick={() => router.push("/card-onboarding")}
                >
                  Connect Card
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  By connecting your card, you agree to our Terms of Service and Privacy Policy
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AppShell>
  )
}
