import { NextResponse } from "next/server"
import { plaidApi } from "@/lib/plaid-api"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { amount, fromAccountId, toAccountId, description } = body

    if (!amount || !fromAccountId || !toAccountId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real implementation, you would verify the user is authenticated
    // const auth = getAuth()
    // if (!auth.currentUser) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Initiate the transfer
    const transfer = await plaidApi.initiateTransfer(amount, fromAccountId, toAccountId, description)

    if (!transfer) {
      return NextResponse.json({ error: "Failed to initiate transfer" }, { status: 500 })
    }

    return NextResponse.json(transfer)
  } catch (error) {
    console.error("Error initiating transfer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
