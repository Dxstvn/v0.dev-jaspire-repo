import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")

    if (!code) {
      return NextResponse.json({ error: "Connect code is required" }, { status: 400 })
    }

    // In a real implementation, you would exchange the code for an access token
    // using the Mastercard API

    // For demo, redirect to the callback page with the code
    return NextResponse.redirect(new URL(`/banking/connect-callback?code=${code}&state=${state || ""}`, request.url))
  } catch (error) {
    console.error("Error handling connect callback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
