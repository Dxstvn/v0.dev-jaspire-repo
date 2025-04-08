"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore"

interface UseInvestmentAccountReturn {
  createAccount: () => Promise<{ success: boolean; accountId?: string; error?: string }>
  isCreating: boolean
  error: string | null
}

export function useInvestmentAccount(): UseInvestmentAccountReturn {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const createAccount = async () => {
    if (!user) {
      setError("You must be logged in to create an investment account")
      return { success: false, error: "Not authenticated" }
    }

    setIsCreating(true)
    setError(null)

    try {
      // Add a small delay to prevent UI glitches
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Create a placeholder account ID
      const accountId = `placeholder-${Date.now()}`

      // Store in Firestore
      const db = getFirestore()

      // Get user preferences if they exist
      const userRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userRef)
      const userData = userDoc.exists() ? userDoc.data() : {}

      // Get the investment style preference
      const investmentStyle = userData?.preferences?.investmentStyle || "balanced"

      // Create a placeholder investment account
      const investmentAccount = {
        userId: user.uid,
        status: "ACTIVE",
        balance: 0,
        cashback: 0,
        invested: 0,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        investmentStyle,
      }

      // Save to Firestore
      const accountRef = doc(db, "investmentAccounts", accountId)
      await setDoc(accountRef, investmentAccount)

      // Update user with reference to investment account
      await updateDoc(userRef, {
        investmentAccountId: accountId,
        hasCompletedOnboarding: true,
      })

      return {
        success: true,
        accountId,
      }
    } catch (err: any) {
      console.error("Error creating investment account:", err)
      setError(err.message)
      return {
        success: false,
        error: err.message,
      }
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createAccount,
    isCreating,
    error,
  }
}
