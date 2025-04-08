import { getFirestore, doc, getDoc } from "firebase/firestore"

/**
 * Fetches the Alpaca account details for a user from Firestore
 * @param userId The user ID to fetch Alpaca account details for
 * @returns The Alpaca account details or null if not found
 */
export async function getAlpacaAccountDetails(userId: string) {
  if (!userId) {
    console.warn("No userId provided to getAlpacaAccountDetails")
    return null
  }

  try {
    const db = getFirestore()
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      console.warn(`User ${userId} not found in Firestore`)
      return null
    }

    const userData = userDoc.data()

    // Check if the user has an Alpaca account
    if (!userData.alpacaAccountId) {
      console.warn(`User ${userId} does not have an Alpaca account`)
      return null
    }

    // Return the Alpaca account details
    return {
      accountId: userData.alpacaAccountId,
      accountNumber: userData.alpacaAccountNumber,
      status: userData.alpacaAccountStatus,
      createdAt: userData.alpacaAccountCreatedAt,
      updatedAt: userData.alpacaAccountUpdatedAt,
      details: userData.alpacaAccountDetails || null,
      isMockAccount: userData.isMockAccount || false,
    }
  } catch (error) {
    console.error("Error fetching Alpaca account details:", error)
    return null
  }
}

/**
 * Checks if a user has completed the investment onboarding process
 * @param userId The user ID to check
 * @returns True if the user has completed investment onboarding, false otherwise
 */
export async function hasCompletedInvestmentOnboarding(userId: string) {
  if (!userId) {
    return false
  }

  try {
    const db = getFirestore()
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return false
    }

    const userData = userDoc.data()
    return userData.hasCompletedInvestmentOnboarding === true
  } catch (error) {
    console.error("Error checking investment onboarding status:", error)
    return false
  }
}
