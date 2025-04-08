"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { KycAmlScreen } from "@/components/onboarding/kyc-aml-screen"
import { PersonalInfoScreen } from "@/components/onboarding/personal-info-screen"
import { AddressInfoScreen } from "@/components/onboarding/address-info-screen"
import { DisclosuresScreen } from "@/components/onboarding/disclosures-screen"
import { AgreementsScreen } from "@/components/onboarding/agreements-screen"
import { ReviewScreen } from "@/components/onboarding/review-screen"
import { SubmissionScreen } from "@/components/onboarding/submission-screen"
import { useAuth } from "@/contexts/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function CardOnboarding() {
  const [step, setStep] = useState(0)
  // Only prefill name and email
  const [formData, setFormData] = useState({
    // Personal Info - keep these prefilled
    firstName: "John",
    lastName: "Tester",
    email: "john.tester@example.com",

    // Reset all other fields to empty
    phone: "",
    dateOfBirth: "",
    ssn: "",

    // Address Info
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA", // Keep default country

    // Disclosures
    isControlPerson: false,
    isAffiliatedExchangeOrFinra: false,
    isPoliticallyExposed: false,
    immediateFamilyExposed: false,

    // Agreements
    customerAgreement: false,
    accountAgreement: false,
    marginAgreement: false,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Fetch user data to pre-fill the form
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()

          // Pre-fill form with user data if available
          setFormData((prevData) => ({
            ...prevData,
            firstName: userData.firstName || user.displayName?.split(" ")[0] || prevData.firstName,
            lastName: userData.lastName || user.displayName?.split(" ").slice(1).join(" ") || prevData.lastName,
            email: userData.email || user.email || prevData.email,
            phone: userData.phone || user.phoneNumber || "",
            // Other fields remain as default
          }))
        } else if (user) {
          // If no Firestore data, use auth data if available
          setFormData((prevData) => ({
            ...prevData,
            firstName: user.displayName?.split(" ")[0] || prevData.firstName,
            lastName: user.displayName?.split(" ").slice(1).join(" ") || prevData.lastName,
            email: user.email || prevData.email,
            phone: user.phoneNumber || "",
          }))
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1)
    window.scrollTo(0, 0)
  }

  const handleUpdateForm = (data: Partial<typeof formData>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }))
  }

  const handleComplete = () => {
    // Redirect to add card page with query param
    router.push("/add-card?onboarding=complete")
  }

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return ""

    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "")

    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }

    return phone
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return <KycAmlScreen onNext={handleNext} />
      case 1:
        return (
          <PersonalInfoScreen
            formData={formData}
            onUpdateForm={handleUpdateForm}
            onNext={handleNext}
            onBack={handleBack}
            formatPhoneNumber={formatPhoneNumber}
          />
        )
      case 2:
        return (
          <AddressInfoScreen
            formData={formData}
            onUpdateForm={handleUpdateForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 3:
        return (
          <DisclosuresScreen
            formData={formData}
            onUpdateForm={handleUpdateForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 4:
        return (
          <AgreementsScreen
            formData={formData}
            onUpdateForm={handleUpdateForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 5:
        return (
          <ReviewScreen
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
            formatPhoneNumber={formatPhoneNumber}
          />
        )
      case 6:
        return <SubmissionScreen formData={formData} onComplete={handleComplete} onBack={handleBack} />
      default:
        return <KycAmlScreen onNext={handleNext} />
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-medium">Investment Account Setup</h1>
          {step > 0 && step < 6 && (
            <div className="mt-2 flex items-center">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${(step / 6) * 100}%` }} />
              </div>
              <span className="ml-2 text-sm text-muted-foreground">Step {step}/6</span>
            </div>
          )}
        </div>

        {renderStep()}
      </div>
    </AppShell>
  )
}
