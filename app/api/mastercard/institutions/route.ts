import { NextResponse } from "next/server"

// Helper function to safely stringify objects for logging
function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj)
  } catch (error) {
    return `[Unstringifiable Object: ${error}]`
  }
}

async function getAccessToken(): Promise<string> {
  const partnerId = process.env.NEXT_PUBLIC_MASTERCARD_PARTNER_ID
  const partnerSecret = process.env.MASTERCARD_PARTNER_SECRET
  const appKey = process.env.MASTERCARD_APP_KEY

  console.log("Environment variables check:", {
    partnerId: partnerId ? "✓" : "✗",
    partnerSecret: partnerSecret ? "✓" : "✗",
    appKey: appKey ? "✓" : "✗",
  })

  if (!partnerId || !partnerSecret || !appKey) {
    throw new Error("Missing required environment variables for Mastercard API")
  }

  console.log("Step 1: Creating Access Token")

  try {
    const requestBody = {
      partnerId,
      partnerSecret,
    }

    console.log("Authentication request:", {
      url: "https://api.finicity.com/aggregation/v2/partners/authentication",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Finicity-App-Key": appKey,
        Accept: "application/json",
      },
      body: { partnerId: partnerId }, // Don't log the secret
    })

    const response = await fetch("https://api.finicity.com/aggregation/v2/partners/authentication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Finicity-App-Key": appKey,
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Authentication response status:", response.status)

    // Get response as text first
    const responseText = await response.text()
    console.log("Authentication response text:", responseText)

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status} - ${responseText}`)
    }

    // Parse the response text as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (error) {
      throw new Error(`Failed to parse authentication response: ${responseText}`)
    }

    if (!data.token) {
      throw new Error(`No token in authentication response: ${safeStringify(data)}`)
    }

    console.log("Authentication successful, token received")
    return data.token
  } catch (error: any) {
    console.error("Error in getAccessToken:", error)
    throw error
  }
}

async function createTestCustomer(appToken: string): Promise<string> {
  const appKey = process.env.MASTERCARD_APP_KEY

  if (!appKey) {
    throw new Error("Missing MASTERCARD_APP_KEY environment variable")
  }

  console.log("Step 2: Creating Test Customer")

  const username = `test-user-${Date.now()}`

  try {
    const response = await fetch("https://api.finicity.com/aggregation/v2/customers/testing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Finicity-App-Key": appKey,
        "Finicity-App-Token": appToken,
      },
      body: JSON.stringify({
        username,
      }),
    })

    console.log("Customer creation response status:", response.status)

    // Get response as text first
    const responseText = await response.text()
    console.log("Customer creation response text:", responseText)

    if (!response.ok) {
      throw new Error(`Customer creation failed: ${response.status} - ${responseText}`)
    }

    // Parse the response text as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (error) {
      throw new Error(`Failed to parse customer creation response: ${responseText}`)
    }

    if (!data.id) {
      throw new Error(`No customer ID in response: ${safeStringify(data)}`)
    }

    console.log("Customer created successfully with ID:", data.id)
    return data.id
  } catch (error: any) {
    console.error("Error in createTestCustomer:", error)
    throw error
  }
}

async function generateConnectUrl(appToken: string, customerId: string, redirectUri: string): Promise<string> {
  const appKey = process.env.MASTERCARD_APP_KEY
  const partnerId = process.env.NEXT_PUBLIC_MASTERCARD_PARTNER_ID

  if (!appKey || !partnerId) {
    throw new Error("Missing required environment variables for Connect URL generation")
  }

  console.log("Step 3: Generating Connect URL")

  try {
    const requestBody = {
      partnerId,
      customerId,
      redirectUri,
    }

    console.log("Connect URL request:", {
      url: "https://api.finicity.com/connect/v2/generate",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Finicity-App-Token": "***",
        "Finicity-App-Key": appKey,
      },
      body: requestBody,
    })

    const response = await fetch("https://api.finicity.com/connect/v2/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Finicity-App-Token": appToken,
        "Finicity-App-Key": appKey,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Connect URL generation response status:", response.status)

    // Get response as text first
    const responseText = await response.text()
    console.log("Connect URL generation response text:", responseText)

    if (!response.ok) {
      throw new Error(`Connect URL generation failed: ${response.status} - ${responseText}`)
    }

    // Parse the response text as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (error) {
      throw new Error(`Failed to parse Connect URL response: ${responseText}`)
    }

    if (!data.link) {
      throw new Error(`No link in Connect URL response: ${safeStringify(data)}`)
    }

    console.log("Connect URL generated successfully")
    return data.link
  } catch (error: any) {
    console.error("Error in generateConnectUrl:", error)
    throw error
  }
}

export async function POST(request: Request) {
  console.log("POST /api/mastercard/institutions - Request received")

  try {
    // Parse the request body
    let requestBody
    try {
      const requestText = await request.text()
      console.log("Request body text:", requestText)

      if (!requestText) {
        return NextResponse.json({ error: "Empty request body" }, { status: 400 })
      }

      try {
        requestBody = JSON.parse(requestText)
      } catch (error) {
        console.error("Failed to parse request body:", error)
        return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
      }
    } catch (error) {
      console.error("Failed to read request body:", error)
      return NextResponse.json({ error: "Failed to read request body" }, { status: 400 })
    }

    console.log("Parsed request body:", requestBody)

    const { redirectUrl } = requestBody
    if (!redirectUrl) {
      return NextResponse.json({ error: "Missing redirectUrl" }, { status: 400 })
    }

    // Check environment variables
    const requiredEnvVars = {
      NEXT_PUBLIC_MASTERCARD_PARTNER_ID: process.env.NEXT_PUBLIC_MASTERCARD_PARTNER_ID,
      MASTERCARD_PARTNER_SECRET: process.env.MASTERCARD_PARTNER_SECRET,
      MASTERCARD_APP_KEY: process.env.MASTERCARD_APP_KEY,
    }

    console.log("Environment variables check:", {
      NEXT_PUBLIC_MASTERCARD_PARTNER_ID: requiredEnvVars.NEXT_PUBLIC_MASTERCARD_PARTNER_ID ? "✓" : "✗",
      MASTERCARD_PARTNER_SECRET: requiredEnvVars.MASTERCARD_PARTNER_SECRET ? "✓" : "✗",
      MASTERCARD_APP_KEY: requiredEnvVars.MASTERCARD_APP_KEY ? "✓" : "✗",
    })

    const missingEnvVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingEnvVars.length > 0) {
      console.error("Missing environment variables:", missingEnvVars)
      return NextResponse.json(
        { error: `Missing required environment variables: ${missingEnvVars.join(", ")}` },
        { status: 500 },
      )
    }

    try {
      // Get access token
      const appToken = await getAccessToken()

      // Create test customer
      const customerId = await createTestCustomer(appToken)

      // Generate Connect URL
      const connectUrl = await generateConnectUrl(appToken, customerId, redirectUrl)

      // Return the Connect URL
      console.log("Successfully generated Connect URL")
      return NextResponse.json({ connectUrl })
    } catch (error: any) {
      console.error("API process error:", error)
      return NextResponse.json({ error: `Failed to generate Connect URL: ${error.message}` }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Unhandled error in API route:", error)
    return NextResponse.json({ error: `Unhandled server error: ${error.message}` }, { status: 500 })
  }
}

