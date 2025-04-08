"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AuthLoading } from "@/components/auth-loading"
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout"
import { WelcomeScreen } from "@/components/onboarding/welcome-screen"
import { CashbackScreen } from "@/components/onboarding/cashback-screen"
import { InvestmentScreen } from "@/components/onboarding/investment-screen"
import { InvestmentPreferencesScreen } from "@/components/onboarding/investment-preferences-screen"
import { useInvestmentAccount } from "@/hooks/use-investment-account"
import confetti from "canvas-confetti"
import { getFirestore, doc, updateDoc } from "firebase/firestore"

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const { user, loading } = useAuth()
  const router = useRouter()
  const totalSteps = 4
  const { createAccount } = useInvestmentAccount()

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return <AuthLoading />
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === totalSteps) {
      // This is the final step - handle completion
      handleComplete()
    }
  }

  const handleComplete = async () => {
    // Trigger confetti animation immediately
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    try {
      // Mark onboarding as completed in Firestore
      if (user) {
        const db = getFirestore()
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          hasCompletedOnboarding: true,
          onboardingCompletedAt: new Date().toISOString(),
        })
      }

      // Create the investment account in the background
      createAccount().catch((err) => {
        console.error("Error creating account:", err)
      })

      // Immediately redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
      // Fallback to direct navigation if there's an error
      router.push("/dashboard")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    // Skip directly to dashboard
    router.push("/dashboard")
  }

  // Render the appropriate screen based on current step
  const renderScreen = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeScreen />
      case 2:
        return <CashbackScreen />
      case 3:
        return <InvestmentScreen />
      case 4:
        return <InvestmentPreferencesScreen />
      default:
        return <WelcomeScreen />
    }
  }

  // Determine if we're on the final step
  const isFinalStep = currentStep === totalSteps

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSkip={handleSkip}
      nextLabel={isFinalStep ? "Complete" : "Continue"}
      showSkip={currentStep < totalSteps}
      isFinalStep={isFinalStep}
    >
      {renderScreen()}
    </OnboardingLayout>
  )
}
