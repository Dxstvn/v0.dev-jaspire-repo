"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Check, CreditCard } from "lucide-react"

interface PaymentScreenProps {
  onCardAdded: () => void
}

export function PaymentScreen({ onCardAdded }: PaymentScreenProps) {
  // Prefill with test card data
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "4111 1111 1111 1111",
    cardName: "John Tester",
    expiry: "12/25",
    cvv: "123",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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

    // Simulate API call to link card
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Wait a moment before completing
      setTimeout(() => {
        onCardAdded()
      }, 2000)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center p-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Add Payment Method</h1>
        <p className="text-gray-400 text-lg">Link a card to start earning cashback on your purchases.</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-md"
      >
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleChange}
                  required
                  maxLength={19}
                  className="bg-gray-900 border-gray-700 pl-10"
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
                className="bg-gray-900 border-gray-700"
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
                  className="bg-gray-900 border-gray-700"
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
                  type="password"
                  className="bg-gray-900 border-gray-700"
                  inputMode="numeric"
                  pattern="[0-9]+"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-6 mt-4 bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Add Card"}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Your card information is securely encrypted. We use industry-standard security measures to protect your
              data.
            </p>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Card Added Successfully!</h2>
            <p className="text-gray-400 mb-6">
              Your card has been successfully linked to your account. You can now start earning cashback on your
              purchases.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-gray-300">
                You can manage your payment methods and add more cards in the{" "}
                <span className="text-green-400">Profile → Payment Methods</span> section.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
