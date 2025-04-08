import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { redirectUri } = await request.json()

    if (!redirectUri) {
      return NextResponse.json({ error: "Missing redirectUri parameter" }, { status: 400 })
    }

    console.log("Generating Connect URL with redirectUri:", redirectUri)

    // Get required environment variables
    const partnerId = process.env.NEXT_PUBLIC_MASTERCARD_PARTNER_ID
    const partnerSecret = process.env.MASTERCARD_PARTNER_SECRET
    const appKey = process.env.MASTERCARD_APP_KEY

    if (!partnerId || !partnerSecret || !appKey) {
      console.error("Missing required environment variables")
      return NextResponse.json({ error: "Missing required Mastercard configuration" }, { status: 500 })
    }

    try {
      // Step 1: Get an access token
      console.log("Getting access token...")
      const authResponse = await fetch("https://api.finicity.com/aggregation/v2/partners/authentication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Finicity-App-Key": appKey,
        },
        body: JSON.stringify({
          partnerId,
          partnerSecret,
        }),
      })

      // Check if the response is XML (error case)
      const contentType = authResponse.headers.get("content-type") || ""
      if (contentType.includes("xml")) {
        const xmlText = await authResponse.text()
        console.error("Received XML response:", xmlText)

        // Extract error message from XML if possible
        let errorMessage = "Authentication failed with XML response"
        try {
          // Simple regex to extract error message from XML
          const match = xmlText.match(/<message>(.*?)<\/message>/)
          if (match && match[1]) {
            errorMessage = match[1]
          }
        } catch (parseError) {
          console.error("Error parsing XML:", parseError)
        }

        throw new Error(errorMessage)
      }

      if (!authResponse.ok) {
        const errorText = await authResponse.text()
        console.error("Authentication error:", errorText)
        throw new Error(`Authentication failed: ${authResponse.status} ${authResponse.statusText}`)
      }

      // Try to parse JSON response
      let authData
      try {
        authData = await authResponse.json()
      } catch (jsonError) {
        const responseText = await authResponse.text()
        console.error("Error parsing JSON:", jsonError, "Response:", responseText)
        throw new Error("Invalid JSON response from authentication endpoint")
      }

      const token = authData.token
      console.log("Got access token")

      // Step 2: Get or create a customer
      console.log("Creating test customer...")
      const customerResponse = await fetch("https://api.finicity.com/aggregation/v2/customers/testing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Finicity-App-Key": appKey,
          "Finicity-App-Token": token,
        },
        body: JSON.stringify({
          username: `user_${Date.now()}`,
          firstName: "Test",
          lastName: "User",
        }),
      })

      // Check if the response is XML (error case)
      const customerContentType = customerResponse.headers.get("content-type") || ""
      if (customerContentType.includes("xml")) {
        const xmlText = await customerResponse.text()
        console.error("Received XML response for customer creation:", xmlText)

        // Extract error message from XML if possible
        let errorMessage = "Customer creation failed with XML response"
        try {
          // Simple regex to extract error message from XML
          const match = xmlText.match(/<message>(.*?)<\/message>/)
          if (match && match[1]) {
            errorMessage = match[1]
          }
        } catch (parseError) {
          console.error("Error parsing XML:", parseError)
        }

        throw new Error(errorMessage)
      }

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text()
        console.error("Customer creation error:", errorText)
        throw new Error(`Customer creation failed: ${customerResponse.status} ${customerResponse.statusText}`)
      }

      // Try to parse JSON response
      let customerData
      try {
        customerData = await customerResponse.json()
      } catch (jsonError) {
        const responseText = await customerResponse.text()
        console.error("Error parsing JSON:", jsonError, "Response:", responseText)
        throw new Error("Invalid JSON response from customer creation endpoint")
      }

      const customerId = customerData.id
      console.log("Created customer with ID:", customerId)

      // Step 3: Generate a Connect URL
      console.log("Generating Connect URL...")
      const connectResponse = await fetch("https://api.finicity.com/connect/v2/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Finicity-App-Key": appKey,
          "Finicity-App-Token": token,
        },
        body: JSON.stringify({
          partnerId,
          customerId,
          redirectUri,
        }),
      })

      // Check if the response is XML (error case)
      const connectContentType = connectResponse.headers.get("content-type") || ""
      if (connectContentType.includes("xml")) {
        const xmlText = await connectResponse.text()
        console.error("Received XML response for Connect URL generation:", xmlText)

        // Extract error message from XML if possible
        let errorMessage = "Connect URL generation failed with XML response"
        try {
          // Simple regex to extract error message from XML
          const match = xmlText.match(/<message>(.*?)<\/message>/)
          if (match && match[1]) {
            errorMessage = match[1]
          }
        } catch (parseError) {
          console.error("Error parsing XML:", parseError)
        }

        throw new Error(errorMessage)
      }

      if (!connectResponse.ok) {
        const errorText = await connectResponse.text()
        console.error("Connect URL generation error:", errorText)
        throw new Error(`Connect URL generation failed: ${connectResponse.status} ${connectResponse.statusText}`)
      }

      // Try to parse JSON response
      let connectData
      try {
        connectData = await connectResponse.json()
      } catch (jsonError) {
        const responseText = await connectResponse.text()
        console.error("Error parsing JSON:", jsonError, "Response:", responseText)
        throw new Error("Invalid JSON response from Connect URL generation endpoint")
      }

      const connectUrl = connectData.link
      console.log("Generated Connect URL:", connectUrl)

      // Return the URL
      return NextResponse.json({ link: connectUrl })
    } catch (apiError: any) {
      console.error("API error:", apiError)
      return NextResponse.json({ error: apiError.message || "API error" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error in generate-connect-url API route:", error)
    return NextResponse.json({ error: "Failed to generate Connect URL", details: error.message }, { status: 500 })
  }
}
