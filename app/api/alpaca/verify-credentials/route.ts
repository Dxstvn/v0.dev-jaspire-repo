import { NextResponse } from "next/server"

// Alpaca Sandbox URL
const ALPACA_SANDBOX_URL = "https://broker-api.sandbox.alpaca.markets"

export async function GET() {
  try {
    // Get Alpaca API credentials from environment variables
    const alpacaApiKey = process.env.ALPACA_API_KEY
    const alpacaApiSecret = process.env.ALPACA_API_SECRET

    // Check if API credentials are available
    if (!alpacaApiKey || !alpacaApiSecret) {
      return NextResponse.json({
        success: false,
        message: "Alpaca API credentials are not configured",
        environment: "sandbox",
      })
    }

    // Test endpoint that doesn't modify any data
    const testEndpoint = `${ALPACA_SANDBOX_URL}/v1/accounts`

    // Make a simple GET request to test authentication
    const response = await fetch(testEndpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "APCA-API-KEY-ID": alpacaApiKey,
        "APCA-API-SECRET-KEY": alpacaApiSecret,
      },
    })

    // Get response details
    const status = response.status
    const statusText = response.statusText
    const headers = Object.fromEntries([...response.headers.entries()])

    // Try to get the response body
    let responseBody
    try {
      responseBody = await response.json()
    } catch (e) {
      responseBody = await response.text()
    }

    // Return diagnostic information
    return NextResponse.json({
      success: response.ok,
      status,
      statusText,
      message: response.ok ? "API credentials are valid" : "API credentials validation failed",
      environment: "sandbox",
      endpoint: testEndpoint,
      responseHeaders: headers,
      responseBody: responseBody,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Error verifying credentials: ${error.message}`,
      environment: "sandbox",
      error: error.stack,
    })
  }
}
