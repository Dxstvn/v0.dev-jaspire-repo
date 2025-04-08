"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { isConfigValid } from "@/lib/firebase"

export function FirebaseConfigDebug() {
  const [isOpen, setIsOpen] = useState(false)

  // Check if config is valid
  const configValid = isConfigValid()

  // Get environment variables
  const envVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "Not set",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "Not set",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not set",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "Not set",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "Not set",
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "Not set",
  }

  // Find missing variables
  const missingVars = Object.entries(envVars)
    .filter(([_, value]) => value === "Not set" || value === "")
    .map(([key]) => key)

  return (
    <Card className="w-full max-w-md mx-auto mt-8 bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          Firebase Configuration
          {!configValid && <span className="ml-2 bg-red-900/50 text-red-400 text-xs px-2 py-1 rounded">Invalid</span>}
          {configValid && <span className="ml-2 bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded">Valid</span>}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {configValid
            ? "Your Firebase configuration appears to be valid."
            : "There are issues with your Firebase configuration."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!configValid && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
              <p>The following environment variables are missing:</p>
              <ul className="list-disc pl-5 mt-2">
                {missingVars.map((variable) => (
                  <li key={variable}>{variable}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex w-full justify-between border-gray-700">
              <span>Show Configuration Details</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2">
            {Object.entries(envVars).map(([key, value]) => {
              // Mask the value for security
              const displayValue =
                value === "Not set"
                  ? "Not set"
                  : value.length > 6
                    ? `${value.substring(0, 3)}...${value.substring(value.length - 3)}`
                    : value

              const isValid = value !== "Not set" && value !== ""

              return (
                <div key={key} className="flex justify-between py-2 border-b border-gray-800">
                  <span className="font-mono text-sm">{key}</span>
                  <span className={`font-mono text-sm ${isValid ? "text-green-400" : "text-red-400"}`}>
                    {displayValue}
                  </span>
                </div>
              )
            })}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="flex flex-col items-start text-sm text-gray-400">
        <p>
          {configValid
            ? "Your Firebase configuration is valid. If you're still experiencing issues, check domain authorization in Firebase console."
            : "You need to add the missing environment variables to your Vercel project settings."}
        </p>
      </CardFooter>
    </Card>
  )
}
