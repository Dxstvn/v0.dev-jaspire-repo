import { NextResponse } from "next/server"

// Mock data for transactions
const mockTransactions = [
  {
    id: "txn_123456",
    date: "2025-03-18T10:30:00Z",
    description: "Grocery purchase",
    amount: 78.35,
    currency: "USD",
    category: "GROCERIES",
    merchant: {
      name: "Whole Foods Market",
      category: "GROCERY_STORE",
      logoUrl: "/placeholder.svg?height=40&width=40",
    },
    accountId: "acc_123456789",
    status: "COMPLETED",
  },
  {
    id: "txn_123457",
    date: "2025-03-17T14:15:00Z",
    description: "Coffee shop",
    amount: 5.75,
    currency: "USD",
    category: "FOOD_AND_DRINK",
    merchant: {
      name: "Starbucks",
      category: "COFFEE_SHOP",
      logoUrl: "/placeholder.svg?height=40&width=40",
    },
    accountId: "acc_123456789",
    status: "COMPLETED",
  },
  {
    id: "txn_123458",
    date: "2025-03-16T18:20:00Z",
    description: "Fitness subscription",
    amount: 12.99,
    currency: "USD",
    category: "HEALTH_AND_FITNESS",
    merchant: {
      name: "Peloton",
      category: "FITNESS",
      logoUrl: "/placeholder.svg?height=40&width=40",
    },
    accountId: "acc_123456789",
    status: "COMPLETED",
  },
  {
    id: "txn_123459",
    date: "2025-03-15T20:10:00Z",
    description: "Restaurant dinner",
    amount: 84.55,
    currency: "USD",
    category: "FOOD_AND_DRINK",
    merchant: {
      name: "Olive Garden",
      category: "RESTAURANT",
      logoUrl: "/placeholder.svg?height=40&width=40",
    },
    accountId: "acc_567891234",
    status: "COMPLETED",
  },
  {
    id: "txn_123460",
    date: "2025-03-14T09:45:00Z",
    description: "Gasoline",
    amount: 45.23,
    currency: "USD",
    category: "TRANSPORTATION",
    merchant: {
      name: "Shell",
      category: "GAS_STATION",
      logoUrl: "/placeholder.svg?height=40&width=40",
    },
    accountId: "acc_567891234",
    status: "COMPLETED",
  },
  {
    id: "txn_123461",
    date: "2025-03-12T13:30:00Z",
    description: "Monthly streaming",
    amount: 14.99,
    currency: "USD",
    category: "ENTERTAINMENT",
    merchant: {
      name: "Netflix",
      category: "STREAMING",
      logoUrl: "/placeholder.svg?height=40&width=40",
    },
    accountId: "acc_123456789",
    status: "COMPLETED",
  },
  {
    id: "txn_123462",
    date: "2025-03-10T16:20:00Z",
    description: "Online purchase",
    amount: 59.99,
    currency: "USD",
    category: "SHOPPING",
    merchant: {
      name: "Amazon",
      category: "ONLINE_RETAIL",
      logoUrl: "/placeholder.svg?height=40&width=40",
    },
    accountId: "acc_567891234",
    status: "COMPLETED",
  },
  {
    id: "txn_123463",
    date: "2025-03-07T11:15:00Z",
    description: "Pharmacy",
    amount: 27.84,
    currency: "USD",
    category: "HEALTH",
    merchant: {
      name: "CVS Pharmacy",
      category: "PHARMACY",
      logoUrl: "/placeholder.svg?height=40&width=40",
    },
    accountId: "acc_123456789",
    status: "COMPLETED",
  },
]

// Mock data for cashback rewards
const mockCashbackRewards = {
  txn_123456: 3.92, // 5% cashback on groceries
  txn_123457: 0.29, // 5% cashback on food
  txn_123458: 0.26, // 2% cashback on subscriptions
  txn_123459: 1.69, // 2% cashback on restaurants
  txn_123460: 2.26, // 5% cashback on gas
  txn_123461: 0.3, // 2% cashback on streaming
  txn_123462: 1.2, // 2% cashback on online shopping
  txn_123463: 0.56, // 2% cashback on health
}

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const accountId = url.searchParams.get("accountId")
    const startDate = url.searchParams.get("startDate")
    const endDate = url.searchParams.get("endDate")

    // In a real implementation, you would verify the user is authenticated
    // const auth = getAuth()
    // if (!auth.currentUser) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    // const userId = auth.currentUser.uid

    // For demo, use a mock user ID
    const userId = "demo_user_123"

    // Access the API key securely on the server
    const apiKey = process.env.MASTERCARD_API_KEY

    // In a real implementation, you would make API calls using the secure API key
    // const transactionsResponse = await fetch(
    //   `https://api.mastercard.com/openbanking/transactions?accountId=${accountId}&startDate=${startDate}&endDate=${endDate}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${apiKey}`,
    //     },
    //   },
    // )
    // const transactions = await transactionsResponse.json()
    //
    // const cashbackResponse = await fetch(`https://api.mastercard.com/openbanking/rewards`, {
    //   headers: {
    //     Authorization: `Bearer ${apiKey}`,
    //   },
    // })
    // const cashbackRewards = await cashbackResponse.json()

    // For demo, use mock data
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API delay

    // Filter transactions if accountId is provided
    let transactions = mockTransactions
    if (accountId) {
      transactions = transactions.filter((txn) => txn.accountId === accountId)
    }

    // Combine transactions with cashback data
    const transactionsWithCashback = transactions.map((transaction) => {
      return {
        ...transaction,
        cashback: mockCashbackRewards[transaction.id] || 0,
      }
    })

    return NextResponse.json(transactionsWithCashback)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

