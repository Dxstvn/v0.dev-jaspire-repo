// Alpaca API helper functions

/**
 * Validates Alpaca API credentials by making a test request
 */
export async function validateAlpacaCredentials(): Promise<{
  valid: boolean
  message: string
  endpoint?: string
}> {
  try {
    const alpacaApiKey = process.env.ALPACA_API_KEY
    const alpacaApiSecret = process.env.ALPACA_API_SECRET
    const alpacaBaseUrl = process.env.ALPACA_BASE_URL || "https://broker-api.sandbox.alpaca.markets"

    if (!alpacaApiKey || !alpacaApiSecret) {
      return {
        valid: false,
        message: "Missing API credentials",
      }
    }

    // Test endpoint that doesn't modify any data
    const testEndpoint = `${alpacaBaseUrl}/v1/accounts`

    const response = await fetch(testEndpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "APCA-API-KEY-ID": alpacaApiKey,
        "APCA-API-SECRET-KEY": alpacaApiSecret,
      },
    })

    if (response.status === 403) {
      return {
        valid: false,
        message: "Authentication failed. Please check your API credentials.",
        endpoint: testEndpoint,
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      return {
        valid: false,
        message: `API error (${response.status}): ${errorText}`,
        endpoint: testEndpoint,
      }
    }

    return {
      valid: true,
      message: "API credentials validated successfully",
      endpoint: testEndpoint,
    }
  } catch (error: any) {
    return {
      valid: false,
      message: `Connection error: ${error.message}`,
    }
  }
}

/**
 * Formats data for Alpaca API requests
 */
export function formatAlpacaAccountData(formData: any) {
  // Format the phone number for the Alpaca API
  const formattedPhoneNumber = formatPhoneNumberForApi(formData.phone)

  return {
    contact: {
      email_address: formData.email,
      phone_number: formattedPhoneNumber,
      street_address: formData.streetAddress,
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
      tax_id: formData.ssn,
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
        agreement: "customer_agreement",
        signed_at: new Date().toISOString(),
        ip_address: "127.0.0.1", // This should be the user's actual IP in production
      },
      {
        agreement: "account_agreement",
        signed_at: new Date().toISOString(),
        ip_address: "127.0.0.1", // This should be the user's actual IP in production
      },
    ],
    documents: [], // Optional document uploads
    trusted_contact: {
      given_name: formData.trustedContactFirstName || formData.firstName,
      family_name: formData.trustedContactLastName || formData.lastName,
      email_address: formData.trustedContactEmail || formData.email,
    },
    enabled_assets: ["us_equity"], // Enable trading US equities
  }
}

// Function to format phone number for the Alpaca API
function formatPhoneNumberForApi(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "")

  // Add the country code if not present
  return cleaned.startsWith("1") ? `+${cleaned}` : `+1${cleaned}`
}
