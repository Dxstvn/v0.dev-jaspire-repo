"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

export function EnvDebug() {
  const [isOpen, setIsOpen] = useState(false)

  // Get environment variables (only NEXT_PUBLIC ones are available on client)
  const envVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "Not set",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "Not set",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not set",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "Not set",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "Not set",
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "Not set",
  }

  // Mask the values for security
  const maskedEnvVars = Object.entries(envVars).reduce((acc, [key, value]) => {
    // Mask the actual values for security
    const maskedValue = value
      ? typeof value === "string" && value.length > 6
        ? value.substring(0, 3) + "..." + value.substring(value.length - 3)
        : value
      : "Not set"

    return {
      ...acc,
      [key]: maskedValue,
    }
  }, {})

  return (
    <Card className="w-full max-w-md mx-auto mt-4 bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-lg">Environment Variables Debug</CardTitle>
        <CardDescription className="text-gray-400">Check your environment configuration</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex w-full justify-between border-gray-700">
              <span>Show Environment Variables</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2">
            {Object.entries(maskedEnvVars).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-800">
                <span className="font-mono text-sm">{key}</span>
                <span className="font-mono text-sm text-gray-400">{value as string}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-gray-400">
        <p>
          If you see "Not set" for any of these variables, you need to add them to your environment configuration in
          Vercel.
        </p>
      </CardFooter>
    </Card>
  )
}
