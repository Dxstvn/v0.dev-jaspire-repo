"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, CreditCardIcon, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { AppShell } from "@/components/layout/app-shell"

export default function PaymentMethods() {
  const router = useRouter()
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "visa", last4: "4567", expiry: "05/25", name: "Alex Johnson", isDefault: true },
    { id: 2, type: "mastercard", last4: "8901", expiry: "12/24", name: "Alex Johnson", isDefault: false },
  ])
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })
  const [isAddingCard, setIsAddingCard] = useState(false)

  const handleCardInputChange = (e) => {
    const { name, value } = e.target
    setNewCard((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCard = (e) => {
    e.preventDefault()
    // In a real app, this would validate and process the card
    const newPaymentMethod = {
      id: Date.now(),
      type: "visa", // This would be determined by the card number
      last4: newCard.cardNumber.slice(-4),
      expiry: newCard.expiry,
      name: newCard.cardName,
      isDefault: paymentMethods.length === 0,
    }

    setPaymentMethods((prev) => [...prev, newPaymentMethod])
    setNewCard({
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
    })
    setIsAddingCard(false)

    toast({
      title: "Card added",
      description: "Your payment method has been added successfully.",
    })
  }

  const handleSetDefault = (id) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )

    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    })
  }

  const handleDeleteCard = (id) => {
    const isDefault = paymentMethods.find((method) => method.id === id)?.isDefault

    setPaymentMethods((prev) => {
      const filtered = prev.filter((method) => method.id !== id)

      // If we deleted the default card, set a new default
      if (isDefault && filtered.length > 0) {
        filtered[0].isDefault = true
      }

      return filtered
    })

    toast({
      title: "Card removed",
      description: "Your payment method has been removed.",
    })
  }

  const getCardIcon = (type) => {
    return <CreditCardIcon className="h-5 w-5" />
  }

  return (
    <AppShell>
      <div className="mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.push("/profile")} className="mr-2">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
        </div>
      </div>

      <Card className="bg-secondary/50 border-0 mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Your Cards</CardTitle>
            <CardDescription className="text-gray-400">Manage your payment methods</CardDescription>
          </div>
          <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background text-foreground border-muted">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Enter your card details to add a new payment method
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCard} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={newCard.cardNumber}
                    onChange={handleCardInputChange}
                    required
                    className="bg-background/50 border-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    value={newCard.cardName}
                    onChange={handleCardInputChange}
                    required
                    className="bg-background/50 border-muted"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      placeholder="MM/YY"
                      value={newCard.expiry}
                      onChange={handleCardInputChange}
                      required
                      className="bg-background/50 border-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={newCard.cvv}
                      onChange={handleCardInputChange}
                      required
                      className="bg-background/50 border-muted"
                    />
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingCard(false)}
                    className="border-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Add Card
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CreditCardIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payment methods added yet</p>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="p-4 border border-gray-800 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {getCardIcon(method.type)}
                    <div className="ml-3">
                      <p className="font-medium">
                        {method.type.charAt(0).toUpperCase() + method.type.slice(1)} •••• {method.last4}
                      </p>
                      <p className="text-sm text-gray-400">Expires {method.expiry}</p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <div className="bg-green-900/30 px-2 py-1 rounded-full">
                      <span className="text-green-400 text-xs">Default</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  {!method.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(method.id)}
                      className="text-xs border-gray-700 hover:bg-gray-800"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCard(method.id)}
                    className="text-xs border-gray-700 hover:bg-gray-800 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">Billing Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-gray-800 rounded-lg">
            <p className="font-medium">Alex Johnson</p>
            <p className="text-gray-400">123 Main Street</p>
            <p className="text-gray-400">San Francisco, CA 94105</p>
            <p className="text-gray-400">United States</p>

            <div className="flex justify-end mt-4">
              <Button size="sm" variant="outline" className="text-xs border-gray-700 hover:bg-gray-800">
                Edit Address
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
