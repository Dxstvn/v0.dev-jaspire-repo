"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, Check, Lock, ArrowLeft } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function ManualCardEntry() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })

  // Clean up any timeouts on unmount
  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
      setCardDetails({ ...cardDetails, [name]: formatted })
      return
    }

    // Format expiry date
    if (name === "expiry") {
      const formatted = value.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2")
      setCardDetails({ ...cardDetails, [name]: formatted })
      return
    }

    setCardDetails({ ...cardDetails, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Redirect after success with a smooth transition
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }, 1500)
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
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-medium">Manual Card Entry</h1>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isExiting ? "exit" : "visible"}
          exit="exit"
          className="max-w-md mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-6 text-center">
            <p className="text-muted-foreground">Enter your card details manually to track cashback</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            {/* Card Preview */}
            <div className="relative h-48 mb-8 perspective">
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/80 to-primary/40 p-6 flex flex-col justify-between shadow-xl"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: step === 2 ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex justify-between">
                  <div className="text-xs font-light">Your Card</div>
                  <CreditCard className="h-8 w-8" />
                </div>
                <div>
                  <div className="font-mono text-lg tracking-wider">
                    {cardDetails.cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div className="flex justify-between mt-2">
                    <div>
                      <div className="text-xs font-light mb-1">Card Holder</div>
                      <div className="font-medium">{cardDetails.cardName || "Your Name"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-light mb-1">Expires</div>
                      <div>{cardDetails.expiry || "MM/YY"}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 flex flex-col justify-between shadow-xl"
                initial={{ rotateY: -180 }}
                animate={{ rotateY: step === 2 ? 0 : -180 }}
                transition={{ duration: 0.6 }}
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="h-10 bg-gray-700 mt-4"></div>
                <div className="flex justify-end items-center">
                  <div className="bg-white/20 h-8 w-12 mr-4 rounded flex items-center justify-center text-sm">
                    {cardDetails.cvv || "CVV"}
                  </div>
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex justify-between">
                  <div className="text-xs font-light">Secured</div>
                </div>
              </motion.div>
            </div>

            {/* Card Form */}
            {!isSuccess ? (
              <Card className="bg-secondary/50 border-0">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {step === 1 ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardDetails.cardNumber}
                              onChange={handleChange}
                              required
                              maxLength={19}
                              className="bg-background/50 pl-10"
                              inputMode="numeric"
                              pattern="[0-9\s]+"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            placeholder="John Doe"
                            value={cardDetails.cardName}
                            onChange={handleChange}
                            required
                            className="bg-background"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              name="expiry"
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={handleChange}
                              required
                              maxLength={5}
                              className="bg-background"
                              inputMode="numeric"
                              pattern="[0-9/]+"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              value={cardDetails.cvv}
                              onChange={handleChange}
                              required
                              maxLength={3}
                              className="bg-background"
                              inputMode="numeric"
                              pattern="[0-9]+"
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() => setStep(2)}
                        >
                          Continue
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="bg-background/30 p-4 rounded-lg backdrop-blur-sm">
                            <h3 className="font-medium mb-2">Card Benefits</h3>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                                <span>Track cashback from your existing cards</span>
                              </li>
                              <li className="flex items-start">
                                <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                                <span>Automatically invest your earned cashback</span>
                              </li>
                              <li className="flex items-start">
                                <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                                <span>Monitor your spending and investment growth</span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-background/30 p-4 rounded-lg backdrop-blur-sm">
                            <div className="flex items-start">
                              <Lock className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <p className="text-sm">
                                Your card information is securely encrypted. We use industry-standard security measures
                                to protect your data.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-muted hover:border-primary"
                            onClick={() => setStep(1)}
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-primary hover:bg-primary/90"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Processing..." : "Link Card"}
                          </Button>
                        </div>
                      </>
                    )}
                  </form>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Card Linked Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your card has been successfully linked to your account. You can now track and invest the cashback you
                  earn.
                </p>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="text-sm">
                    You can manage your linked cards in the <span className="text-primary">Cards & Transactions</span>{" "}
                    section.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </AppShell>
  )
}
