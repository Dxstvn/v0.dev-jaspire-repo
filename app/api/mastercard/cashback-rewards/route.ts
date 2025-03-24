import { NextResponse } from "next/server"

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

export async function GET() {
  try {
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

    // In a real implementation, you would make an API call using the secure API key
    // const response = await fetch(`https://api.mastercard.com/openbanking/rewards`, {
    //   headers: {
    //     Authorization: `Bearer ${apiKey}`,
    //   },
    // })
    // const cashbackRewards = await response.json()

    // For demo, use mock data
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API delay
    const cashbackRewards = mockCashbackRewards

    return NextResponse.json(cashbackRewards)
  } catch (error) {
    console.error("Error fetching cashback rewards:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

