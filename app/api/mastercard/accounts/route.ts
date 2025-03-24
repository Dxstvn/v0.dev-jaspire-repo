import { NextResponse } from "next/server"

// Mock data for accounts
const mockAccounts = [
  {
    id: "acc_123456789",
    accountNumber: "****4567",
    accountType: "CHECKING",
    balance: 2580.42,
    currency: "USD",
    name: "Primary Checking",
    institution: {
      id: "chase",
      name: "Chase Bank",
      logoUrl: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "acc_987654321",
    accountNumber: "****7890",
    accountType: "SAVINGS",
    balance: 15750.68,
    currency: "USD",
    name: "High-Yield Savings",
    institution: {
      id: "ally",
      name: "Ally Bank",
      logoUrl: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "acc_567891234",
    accountNumber: "****2345",
    accountType: "CREDIT_CARD",
    balance: -450.32,
    currency: "USD",
    name: "Rewards Credit Card",
    institution: {
      id: "amex",
      name: "American Express",
      logoUrl: "/placeholder.svg?height=40&width=40",
    },
  },
]

export async function GET() {
  try {
    // In a real implementation, you would verify the user is authenticated
    // and use the Mastercard API to get accounts
    // const apiKey = process.env.MASTERCARD_API_KEY
    // const response = await fetch('https://api.mastercard.com/openbanking/accounts', {
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`
    //   }
    // })
    // const accounts = await response.json()

    // For sandbox mode, return mock data
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API delay

    return NextResponse.json(mockAccounts)
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

