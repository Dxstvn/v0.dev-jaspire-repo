import { NextResponse } from "next/server"
import { getFirestore, doc, updateDoc, serverTimestamp } from "firebase/firestore"

// Explicitly set the Alpaca API endpoint for sandbox environment
const ALPACA_SANDBOX_URL = "https://broker-api.sandbox.alpaca.markets"
const ALPACA_API_ENDPOINT = `${ALPACA_SANDBOX_URL}/v1/accounts`

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.json()

    // Get Alpaca API credentials from environment variables
    const alpacaApiKey = process.env.ALPACA_API_KEY
    const alpacaApiSecret = process.env.ALPACA_API_SECRET

    // Check if API credentials are available
    if (!alpacaApiKey || !alpacaApiSecret) {
      console.error("Alpaca API credentials are not configured")
      // For development/testing: Create a mock account if credentials are missing
      return handleMockAccountCreation(formData)
    }

    // Create Basic Auth token from API key and secret
    const authToken = Buffer.from(`${alpacaApiKey}:${alpacaApiSecret}`).toString("base64")

    // Log the API configuration for debugging
    console.log("Alpaca API Configuration:")
    console.log(`- Using Sandbox URL: ${ALPACA_SANDBOX_URL}`)
    console.log(`- API Endpoint: ${ALPACA_API_ENDPOINT}`)
    console.log(`- Using Basic Auth: ${Boolean(authToken)}`)

    // Format the phone number for the Alpaca API
    const formattedPhoneNumber = formatPhoneNumberForApi(formData.phone)

    // Current timestamp for agreement signing
    const currentTimestamp = new Date().toISOString()
    const ipAddress = "127.0.0.1" // This should be the user's actual IP in production

    // Format the data for Alpaca API exactly as required by their documentation
    const alpacaData = {
      contact: {
        email_address: formData.email,
        phone_number: formattedPhoneNumber,
        street_address: [formData.streetAddress], // Convert to array as per example
        unit: formData.unit || "",
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country || "USA",
      },
      identity: {
        given_name: formData.firstName,
        family_name: formData.lastName,
        date_of_birth: formData.dateOfBirth, // Format: YYYY-MM-DD
        tax_id: formData.ssn.replace(/-/g, ""), // Remove hyphens if present
        tax_id_type: "USA_SSN",
        country_of_citizenship: formData.country || "USA",
        country_of_birth: formData.country || "USA",
        country_of_tax_residence: formData.country || "USA",
        funding_source: ["savings"],
      },
      disclosures: {
        is_control_person: formData.isControlPerson || false,
        is_affiliated_exchange_or_finra: formData.isAffiliatedExchangeOrFinra || false,
        is_politically_exposed: formData.isPoliticallyExposed || false,
        immediate_family_exposed: formData.immediateFamilyExposed || false,
      },
      agreements: [
        {
          agreement: "margin_agreement",
          signed_at: currentTimestamp,
          ip_address: ipAddress,
        },
        {
          agreement: "account_agreement",
          signed_at: currentTimestamp,
          ip_address: ipAddress,
        },
        {
          agreement: "customer_agreement",
          signed_at: currentTimestamp,
          ip_address: ipAddress,
        },
      ],
    }

    // Make the API call to Alpaca with Basic Auth as shown in the example
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`,
      },
      body: JSON.stringify(alpacaData),
    }

    console.log("Making Alpaca API call with data:", JSON.stringify(alpacaData, null, 2))

    // Make the actual API call to Alpaca
    const response = await fetch(ALPACA_API_ENDPOINT, options)

    // Get the response body as text first for better debugging
    const responseText = await response.text()
    console.log("Raw API response:", responseText)

    // Try to parse the response as JSON
    let alpacaResponse
    try {
      alpacaResponse = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse Alpaca API response as JSON:", responseText)
      throw new Error("Invalid response from Alpaca API")
    }

    // Check if the API call was successful
    if (!response.ok) {
      console.error("Alpaca API error:", alpacaResponse)
      console.error("Response status:", response.status)
      console.error("Response headers:", Object.fromEntries([...response.headers.entries()]))

      // Handle specific error cases
      if (response.status === 403) {
        throw new Error(
          "Authentication failed. Please check your Alpaca API credentials. Make sure they are sandbox credentials.",
        )
      } else if (response.status === 400) {
        throw new Error(alpacaResponse.message || "Invalid request data. Please check your form inputs.")
      } else {
        throw new Error(alpacaResponse.message || "Failed to create Alpaca account")
      }
    }

    console.log("Alpaca API response:", alpacaResponse)

    // Update the user's record in Firestore with the Alpaca account details
    if (formData.userId) {
      try {
        const db = getFirestore()
        const userRef = doc(db, "users", formData.userId)

        // Create a comprehensive update with all relevant Alpaca account information
        const userUpdate = {
          // Essential account identifiers
          alpacaAccountId: alpacaResponse.id,
          alpacaAccountNumber: alpacaResponse.account_number,
          alpacaAccountStatus: alpacaResponse.status,

          // Store the complete response for reference
          alpacaAccountDetails: alpacaResponse,

          // Track completion status
          hasCompletedInvestmentOnboarding: true,

          // Timestamps
          alpacaAccountCreatedAt: new Date().toISOString(),
          alpacaAccountUpdatedAt: new Date().toISOString(),

          // Use server timestamp for Firestore
          lastUpdated: serverTimestamp(),
        }

        console.log("Updating Firestore with Alpaca account details:", userUpdate)
        await updateDoc(userRef, userUpdate)
        console.log("Firestore update successful for user:", formData.userId)
      } catch (error) {
        console.error("Error updating Firestore with Alpaca account details:", error)
        // Continue execution even if Firestore update fails
        // We don't want to fail the entire request if just the database update fails
      }
    } else {
      console.warn("No userId provided, skipping Firestore update")
    }

    return NextResponse.json({
      success: true,
      account: alpacaResponse,
    })
  } catch (error: any) {
    console.error("Error creating Alpaca account:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
        details: error.stack,
      },
      { status: 500 },
    )
  }
}

// Mock implementation for development/testing when API credentials are not available
async function handleMockAccountCreation(formData: any) {
  console.log("Using mock Alpaca account creation")

  // Create a mock account response
  const mockAccountResponse = {
    id: "mock-" + Date.now(),
    account_number: "MOCK" + Math.floor(Math.random() * 1000000),
    status: "SUBMITTED",
    created_at: new Date().toISOString(),
    contact: {
      email_address: formData.email,
      phone_number: formData.phone,
      street_address: [formData.streetAddress],
      city: formData.city,
      state: formData.state,
      postal_code: formData.postalCode,
    },
    identity: {
      given_name: formData.firstName,
      family_name: formData.lastName,
    },
  }

  // Update the user's record in Firestore with the mock account ID
  if (formData.userId) {
    try {
      const db = getFirestore()
      const userRef = doc(db, "users", formData.userId)

      // Create a comprehensive update with all relevant mock account information
      const userUpdate = {
        // Essential account identifiers
        alpacaAccountId: mockAccountResponse.id,
        alpacaAccountNumber: mockAccountResponse.account_number,
        alpacaAccountStatus: mockAccountResponse.status,

        // Store the complete response for reference
        alpacaAccountDetails: mockAccountResponse,

        // Track completion status
        hasCompletedInvestmentOnboarding: true,

        // Timestamps
        alpacaAccountCreatedAt: new Date().toISOString(),
        alpacaAccountUpdatedAt: new Date().toISOString(),

        // Use server timestamp for Firestore
        lastUpdated: serverTimestamp(),

        // Flag to indicate this is a mock account
        isMockAccount: true,
      }

      console.log("Updating Firestore with mock account details:", userUpdate)
      await updateDoc(userRef, userUpdate)
      console.log("Firestore update successful for user:", formData.userId)
    } catch (error) {
      console.error("Error updating Firestore with mock account:", error)
    }
  } else {
    console.warn("No userId provided, skipping Firestore update")
  }

  return NextResponse.json({
    success: true,
    account: mockAccountResponse,
    isMock: true,
    message: "Using mock account because Alpaca API credentials are not configured",
  })
}

// Function to format phone number for the Alpaca API
function formatPhoneNumberForApi(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "")

  // Add the country code if not present
  return cleaned.startsWith("1") ? `+${cleaned}` : `+1${cleaned}`
}
