import { NextResponse } from "next/server"
import { plaidApi } from "@/lib/plaid-api"

export async function POST() {
  try {
    // In a real implementation, you would verify the user is authenticated
    // const auth = getAuth()
    // if (!auth.currentUser) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    // const userId = auth.currentUser.uid

    // For demo, use a mock user ID
    const userId = "demo_user_123"

    // Create a link token
    const linkToken = await plaidApi.createLinkToken(userId)

    if (!linkToken) {
      return NextResponse.json({ error: "Failed to create link token" }, { status: 500 })
    }

    return NextResponse.json({ link_token: linkToken })
  } catch (error) {
    console.error("Error creating link token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
