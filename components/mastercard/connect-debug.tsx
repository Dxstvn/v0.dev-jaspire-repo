"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ConnectDebug() {
  const [customUrl, setCustomUrl] = useState("")
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({
    partnerId: process.env.NEXT_PUBLIC_MASTERCARD_PARTNER_ID || "Not set",
    redirectUrl: typeof window !== "undefined" ? `${window.location.origin}/banking/connect-callback` : "Not available",
  })

  const handleGenerateManualUrl = () => {
    // Generate a manual Connect URL for testing
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/banking/connect-callback` : ""
    const partnerId = process.env.NEXT_PUBLIC_MASTERCARD_PARTNER_ID || ""
    const customerId = "demo-customer-123"
    const state = Math.random().toString(36).substring(2)

    const url = `https://connect.finicity.com?partnerId=${partnerId}&customerId=${customerId}&redirectUri=${encodeURIComponent(redirectUrl)}&state=${state}`

    setCustomUrl(url)
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Connect Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Environment Variables</Label>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          <div>
            <Button onClick={handleGenerateManualUrl} variant="outline" size="sm">
              Generate Manual URL
            </Button>
            {customUrl && (
              <div className="mt-2">
                <Label>Manual Connect URL</Label>
                <Input value={customUrl} readOnly className="mt-1 text-xs" />
                <Button onClick={() => window.open(customUrl, "_blank")} variant="secondary" size="sm" className="mt-2">
                  Open in New Tab
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

