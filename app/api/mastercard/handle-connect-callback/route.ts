import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const error = url.searchParams.get("error")

  console.log("Connect callback received:", { code, state, error })

  if (error) {
    console.error("Connect error:", error)
    return NextResponse.redirect(new URL("/banking?error=" + encodeURIComponent(error), request.url))
  }

  if (!code) {
    console.error("No code received in callback")
    return NextResponse.redirect(new URL("/banking?error=no_code", request.url))
  }

  try {
    // Store the code in the session or database for later use
    // This is where you would typically exchange the code for an access token
    // and store the customer ID and other relevant information

    // For now, we'll just redirect to a success page
    return NextResponse.redirect(new URL("/banking/connect-callback?success=true", request.url))
  } catch (error: any) {
    console.error("Error handling connect callback:", error)
    return NextResponse.redirect(new URL("/banking?error=" + encodeURIComponent(error.message), request.url))
  }
}

