import { NextResponse } from "next/server"
import { validateAlpacaCredentials } from "@/lib/alpaca-api"

export async function GET() {
  try {
    // Test the Alpaca API connection
    const result = await validateAlpacaCredentials()

    // Return the validation result
    return NextResponse.json({
      success: result.valid,
      message: result.message,
      endpoint: result.endpoint,
      apiKeyExists: Boolean(process.env.ALPACA_API_KEY),
      apiSecretExists: Boolean(process.env.ALPACA_API_SECRET),
      baseUrlExists: Boolean(process.env.ALPACA_BASE_URL),
      baseUrl: process.env.ALPACA_BASE_URL || "https://broker-api.sandbox.alpaca.markets",
    })
  } catch (error: any) {
    console.error("Error testing Alpaca connection:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
