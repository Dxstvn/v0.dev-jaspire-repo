"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { firebaseConfig } from "@/lib/firebase"

export function FirebaseDebug() {
  const [isOpen, setIsOpen] = useState(false)

  // Mask the values for security
  const maskedConfig = Object.entries(firebaseConfig).reduce((acc, [key, value]) => {
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
        <CardTitle className="text-lg">Firebase Configuration Debug</CardTitle>
        <CardDescription className="text-gray-400">Current Firebase configuration</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex w-full justify-between border-gray-700">
              <span>Show Firebase Configuration</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2">
            {Object.entries(maskedConfig).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-800">
                <span className="font-mono text-sm">{key}</span>
                <span className="font-mono text-sm text-gray-400">{value as string}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-gray-400">
        <p>These are the actual values being used for Firebase initialization.</p>
      </CardFooter>
    </Card>
  )
}
