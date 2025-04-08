"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ClipboardCheck, Shield, FileText } from "lucide-react"

interface KycAmlScreenProps {
  onNext: () => void
}

export function KycAmlScreen({ onNext }: KycAmlScreenProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card className="border-0 bg-secondary/50">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Account Information</h2>
              <p className="text-muted-foreground">
                Before you can start investing your cashback rewards, we need to collect some information to set up your
                investment account.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-start p-4 bg-background/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Why we need this information</p>
                  <p className="text-sm text-muted-foreground">
                    Financial regulations require us to collect certain information before opening an investment
                    account. This helps prevent fraud and ensures compliance with securities laws.
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-background/50 rounded-lg">
                <FileText className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">What you'll need to provide</p>
                  <p className="text-sm text-muted-foreground">
                    Personal information, contact details, address, social security number, and answers to a few
                    regulatory questions. You'll also need to review and agree to account terms.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button onClick={onNext} className="w-full">
                Continue
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
