"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function AuthOptions() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-white hover:text-white/80">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium ml-2">Other Options</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Choose a sign-in method</h2>
            <p className="text-gray-400 mt-2">Select one of the following options to continue</p>
          </div>

          <div className="space-y-4">
            <Link href="/auth/email" className="block">
              <Button
                variant="outline"
                className="w-full py-6 text-lg justify-between border-gray-700 hover:bg-gray-900 hover:border-green-700"
              >
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  Continue with Email
                </div>
                <ChevronLeft className="h-5 w-5 rotate-180" />
              </Button>
            </Link>

            <Link href="/auth/phone" className="block">
              <Button
                variant="outline"
                className="w-full py-6 text-lg justify-between border-gray-700 hover:bg-gray-900 hover:border-green-700"
              >
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3" />
                  Continue with Phone
                </div>
                <ChevronLeft className="h-5 w-5 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 p-6">
        <p>
          By continuing you agree to the{" "}
          <Link href="/terms" className="underline hover:text-gray-400">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-gray-400">
            Privacy Policy
          </Link>
        </p>
        <div className="w-16 h-1 bg-gray-700 rounded-full mx-auto mt-4"></div>
      </div>
    </div>
  )
}
