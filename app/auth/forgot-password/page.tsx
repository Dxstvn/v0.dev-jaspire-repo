"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Check } from "lucide-react"

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send a password reset email
    console.log("Sending password reset email to:", email)
    setSubmitted(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/auth/email")}
          className="text-white hover:text-white/80"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium ml-2">Reset Password</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Forgot your password?</h2>
                <p className="text-gray-400 mt-2">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-900 border-gray-700 text-white py-6"
                  />
                </div>

                <Button type="submit" className="w-full py-6 text-lg bg-green-600 hover:bg-green-700">
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Check your email</h2>
              <p className="text-gray-400 mt-2 mb-8">We've sent a password reset link to {email}</p>
              <Button onClick={() => router.push("/auth/email")} className="bg-green-600 hover:bg-green-700">
                Back to Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
