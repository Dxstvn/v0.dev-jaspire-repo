import { NextResponse } from "next/server"
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authToken = request.headers.get("Authorization")?.split("Bearer ")[1]
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For this implementation, we'll use a placeholder
    // In a real app, you would verify the token with Firebase
    // const decodedToken = await auth.verifyIdToken(authToken);
    // const userId = decodedToken.uid;
    const userId = "user123"

    // Get user data from request
    const requestData = await request.json()

    // Create Firestore instance
    const db = getFirestore()

    // Check if user exists
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user already has an investment account
    const existingUserData = userDoc.data()
    if (existingUserData.investmentAccountId) {
      return NextResponse.json(
        {
          error: "User already has an investment account",
          accountId: existingUserData.investmentAccountId,
        },
        { status: 400 },
      )
    }

    // Create a placeholder account instead of using Alpaca
    const accountId = `placeholder-${Date.now()}`

    // Get the investment style preference
    const investmentStyle = existingUserData.preferences?.investmentStyle || "balanced"

    // Create investment account in Firestore
    const investmentAccount = {
      userId,
      status: "ACTIVE",
      balance: 0,
      cashback: 0,
      invested: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      investmentStyle,
    }

    const accountRef = doc(db, "investmentAccounts", accountId)
    await setDoc(accountRef, investmentAccount)

    // Update user with reference to investment account
    await updateDoc(userRef, {
      investmentAccountId: accountId,
      hasCompletedOnboarding: true,
    })

    return NextResponse.json({
      success: true,
      accountId,
      status: "ACTIVE",
    })
  } catch (error: any) {
    console.error("Error creating investment account:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
