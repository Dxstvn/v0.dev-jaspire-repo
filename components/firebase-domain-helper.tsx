"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ExternalLink, Copy, Check } from "lucide-react"
import { firebaseConfig } from "@/lib/firebase"

export function FirebaseDomainHelper() {
  const [currentDomain, setCurrentDomain] = useState<string>("")
  const [projectId, setProjectId] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Get the current domain
    const domain = window.location.hostname
    setCurrentDomain(domain)

    // Get the project ID from environment variables or firebaseConfig
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig.projectId || "your-firebase-project"
    setProjectId(projectId)

    // Log detailed information about domains
    console.log(`
  =====================================================
  FIREBASE DOMAIN HELPER
  =====================================================
  Current domain: ${domain}
  Project ID: ${projectId}
  
  Common authorized domains in Firebase:
  - localhost
  - 127.0.0.1
  - ${projectId}.web.app
  - ${projectId}.firebaseapp.com
  
  If you're testing on a mobile device or custom domain,
  you'll need to add this domain to your Firebase project.
  =====================================================
  `)
  }, [])

  const copyDomain = () => {
    navigator.clipboard.writeText(currentDomain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Firebase Authentication Error</CardTitle>
          <CardDescription className="text-gray-400">Your current domain needs to be added to Firebase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unauthorized Domain</AlertTitle>
            <AlertDescription>
              Firebase authentication requires your domain to be authorized in the Firebase console.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Current Domain:</p>
              <div className="flex items-center">
                <code className="bg-gray-800 px-3 py-1 rounded text-sm flex-1">{currentDomain}</code>
                <Button variant="outline" size="sm" className="ml-2 border-gray-700" onClick={copyDomain}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Steps to fix:</p>
              <ol className="list-decimal pl-5 text-sm space-y-2">
                <li>
                  Go to the{" "}
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline inline-flex items-center"
                  >
                    Firebase Console
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
                <li>
                  Select your project: <span className="text-green-400">{projectId}</span>
                </li>
                <li>
                  Navigate to <span className="text-gray-300">Authentication → Settings → Authorized domains</span>
                </li>
                <li>
                  Click <span className="text-gray-300">Add domain</span> and enter your current domain:{" "}
                  <span className="text-green-400">{currentDomain}</span>
                </li>
                <li>Save and return to this page to try again</li>
              </ol>
            </div>

            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-gray-400 hover:text-white"
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Options
              </Button>

              {showAdvanced && (
                <div className="mt-2 p-3 bg-gray-800 rounded-md text-sm">
                  <p className="mb-2">Alternative options:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use email/password authentication instead of Google Sign-In</li>
                    <li>Deploy your app to a production domain that's authorized in Firebase</li>
                    <li>
                      For local development, add <code className="bg-gray-700 px-1 rounded">localhost</code> to
                      authorized domains
                    </li>
                    <li>Use Firebase Emulator for local development</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => window.location.reload()}>
            I've added the domain, try again
          </Button>

          <Link href="/auth/email" className="w-full">
            <Button variant="outline" className="w-full border-gray-700">
              Continue with Email Instead
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

// Add Link component for navigation
function Link({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
