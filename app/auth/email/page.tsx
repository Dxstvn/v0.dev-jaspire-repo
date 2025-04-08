"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EmailAuth() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signInWithEmail, signUpWithEmail, updateUserProfile, apiKeyError, user, loading, initAuth } = useAuth()
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize auth when component mounts
  useEffect(() => {
    const initialize = async () => {
      await initAuth()

      // Check if mode=signup is in the URL
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search)
        if (params.get("mode") === "signup") {
          setIsLogin(false)
        }
      }

      setIsInitializing(false)
    }
    initialize()
  }, [initAuth])

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading && !isInitializing) {
      router.push("/dashboard")
    }
  }, [user, loading, router, isInitializing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      if (isLogin) {
        await signInWithEmail(email, password)
        // Explicitly navigate to dashboard after successful login
        router.push("/dashboard")
      } else {
        // For signup, first create the account
        const user = await signUpWithEmail(email, password)

        // Then update the profile with the name
        if (name && user) {
          await updateUserProfile({ displayName: name })
        }

        // Explicitly navigate to dashboard after successful signup
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Authentication error:", error)

      // Format error message for better user experience
      let errorMessage = error.message || "Authentication failed"

      if (errorMessage.includes("auth/email-already-in-use")) {
        errorMessage = "This email is already registered. Please sign in instead."
      } else if (errorMessage.includes("auth/user-not-found")) {
        errorMessage = "No account found with this email. Please check your email or sign up."
      } else if (errorMessage.includes("auth/wrong-password")) {
        errorMessage = "Incorrect password. Please try again."
      } else if (errorMessage.includes("auth/weak-password")) {
        errorMessage = "Password should be at least 6 characters."
      } else if (errorMessage.includes("auth/invalid-email")) {
        errorMessage = "Please enter a valid email address."
      } else if (errorMessage.includes("auth/unauthorized-domain")) {
        errorMessage =
          "This domain is not authorized for Firebase authentication. Email/password authentication should still work."
      } else if (errorMessage.includes("api-key-not-valid") || errorMessage.includes("invalid-api-key")) {
        errorMessage = "Firebase API key is invalid. Please check your environment configuration."
      }

      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while checking auth
  if (loading || isInitializing) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-4" />
        <p>Loading authentication...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-white hover:text-white/80">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium ml-2">{isLogin ? "Sign In" : "Create Account"}</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">{isLogin ? "Welcome back" : "Join Jaspire"}</h2>
            <p className="text-gray-400 mt-2">
              {isLogin
                ? "Sign in to access your investment portfolio"
                : "Create an account to start investing your cashback"}
            </p>
          </div>

          {/* API Key Error Alert */}
          {apiKeyError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                There is an issue with the Firebase configuration. Please check your environment variables.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field - only shown for signup */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white py-6"
                  disabled={isSubmitting}
                />
              </div>
            )}

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
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-white py-6 pr-10"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-sm text-green-400 hover:text-green-300">
                  Forgot password?
                </Link>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-400 hover:text-green-300"
              disabled={isSubmitting}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
