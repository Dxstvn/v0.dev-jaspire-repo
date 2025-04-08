"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function ConnectCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Log all search params for debugging
  console.log("Callback search params:", Object.fromEntries(searchParams.entries()))

  const handleContinue = () => {
    router.push("/banking")
  }

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 pb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Connection Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your account has been successfully connected. You can now track your transactions and cashback rewards.
            </p>
            <Button onClick={handleContinue} className="w-full rounded-full">
              Continue to Banking
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
