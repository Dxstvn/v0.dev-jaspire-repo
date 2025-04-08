import { NextResponse } from "next/server"
import { plaidApi } from "@/lib/plaid-api"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { publicToken } = body

    if (!publicToken) {
      return NextResponse.json({ error: "Public token is required" }, { status: 400 })
    }

    // In a real implementation, you would verify the user is authenticated
    // const auth = getAuth()
    // if (!auth.currentUser) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Exchange the public token for an access token
    const accessToken = await plaidApi.exchangePublicToken(publicToken)

    if (!accessToken) {
      return NextResponse.json({ error: "Failed to exchange token" }, { status: 500 })
    }

    // In a real implementation, you would store this access token securely
    // associated with the user, but never expose it to the client

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error exchanging token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
