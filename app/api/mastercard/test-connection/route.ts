import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get credentials from environment variables
    const partnerId = process.env.NEXT_PUBLIC_MASTERCARD_PARTNER_ID
    const partnerSecret = process.env.MASTERCARD_PARTNER_SECRET
    const appKey = process.env.MASTERCARD_APP_KEY

    if (!partnerId || !partnerSecret || !appKey) {
      return NextResponse.json(
        {
          error: "Missing required environment variables",
          missingVars: {
            partnerId: !partnerId,
            partnerSecret: !partnerSecret,
            appKey: !appKey,
          },
        },
        { status: 500 },
      )
    }

    // Mask sensitive data for logging
    const maskedPartnerId = partnerId.substring(0, 4) + "..." + partnerId.substring(partnerId.length - 4)
    const maskedPartnerSecret = "****" + partnerSecret.substring(partnerSecret.length - 4)
    const maskedAppKey = appKey.substring(0, 4) + "..." + appKey.substring(appKey.length - 4)

    // Log the credentials being used (masked for security)
    console.log("Using credentials:", {
      partnerId: maskedPartnerId,
      partnerSecret: maskedPartnerSecret,
      appKey: maskedAppKey,
    })

    // Try different API endpoints
    const endpoints = [
      "https://api.finicity.com/aggregation/v2/partners/authentication",
      "https://api-sandbox.finicity.com/aggregation/v2/partners/authentication",
    ]

    const results = []

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`)

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Finicity-App-Key": appKey,
            Accept: "application/json",
          },
          body: JSON.stringify({
            partnerId,
            partnerSecret,
          }),
        })

        const responseText = await response.text()
        let responseData

        try {
          responseData = JSON.parse(responseText)
        } catch (e) {
          responseData = { rawText: responseText }
        }

        results.push({
          endpoint,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          data: responseData,
        })
      } catch (error: any) {
        results.push({
          endpoint,
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      credentials: {
        partnerId: maskedPartnerId,
        partnerSecret: maskedPartnerSecret,
        appKey: maskedAppKey,
      },
      results,
    })
  } catch (error: any) {
    console.error("Error testing connection:", error)
    return NextResponse.json(
      {
        error: `Error testing connection: ${error.message}`,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

