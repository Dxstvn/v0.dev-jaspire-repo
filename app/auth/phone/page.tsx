"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"

export default function PhoneAuth() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send a verification code
    console.log("Sending code to:", phoneNumber)
    setCodeSent(true)
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would verify the code
    console.log("Verifying code:", verificationCode)
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/auth/options")}
          className="text-white hover:text-white/80"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium ml-2">Phone Verification</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">{codeSent ? "Enter verification code" : "Verify your phone"}</h2>
            <p className="text-gray-400 mt-2">
              {codeSent ? "We've sent a 6-digit code to your phone" : "We'll send you a verification code"}
            </p>
          </div>

          {!codeSent ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-white py-6"
                />
              </div>

              <Button type="submit" className="w-full py-6 text-lg bg-green-600 hover:bg-green-700">
                Send Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-white py-6 text-center text-xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button type="submit" className="w-full py-6 text-lg bg-green-600 hover:bg-green-700">
                Verify Code
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setCodeSent(false)}
                  className="text-green-400 hover:text-green-300"
                >
                  Change phone number
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
