"use client"

import type React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, AlertCircle, Mail } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AuthLoading } from "@/components/auth-loading"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SplashScreen } from "@/components/splash-screen"
// Import toast at the top of the file
// Add this near the other imports
import { toast } from "@/hooks/use-toast"

export default function Home() {
  const { user, loading, error, authDomainError, apiKeyError, signInWithGoogle, clearErrors, initAuth } = useAuth()
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [googleSignInAttempted, setGoogleSignInAttempted] = useState(false)
  const [currentDomain, setCurrentDomain] = useState("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Set isClient to true when component mounts and get current domain
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== "undefined") {
      setCurrentDomain(window.location.hostname)
    }
  }, [])

  // Hide splash screen after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      // Check if there's a firebase-auth-token cookie
      const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
      const authCookie = cookies.find((cookie) => cookie.startsWith("firebase-auth-token="))

      if (authCookie) {
        // If there's an auth cookie, initialize auth to check if the user is logged in
        setIsAuthenticating(true)
        await initAuth()
        setIsAuthenticating(false)
      }
    }

    if (isClient) {
      checkAuth()
    }
  }, [isClient, initAuth])

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !loading && isClient) {
      router.push("/dashboard")
    }
  }, [user, loading, router, isClient])

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault()
    setGoogleSignInAttempted(true)
    setIsAuthenticating(true)

    try {
      await signInWithGoogle()
      // Only navigate if sign-in was successful
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google sign in error:", error)

      // If it's an unauthorized domain error, automatically redirect to email sign-in
      if (error.code === "auth/unauthorized-domain") {
        const currentDomain = window.location.hostname

        // Log detailed information about the domain issue
        console.error(`
    =====================================================
    GOOGLE SIGN-IN DOMAIN ERROR
    =====================================================
    Attempted to use Google Sign-In on: ${currentDomain}
    
    This domain is not in your Firebase authorized domains list.
    
    Current URL: ${window.location.href}
    User Agent: ${navigator.userAgent}
    Is Mobile: ${/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}
    
    Redirecting to email authentication as a fallback...
    =====================================================
    `)

        // Show a brief message before redirecting
        toast({
          title: "Domain not authorized",
          description: `${currentDomain} is not authorized. Redirecting to email sign-in.`,
          duration: 3000,
        })

        // Short delay before redirect
        setTimeout(() => {
          router.push("/auth/email")
        }, 1500)
      }
      // Other errors are already handled in the auth context
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleEmailSignIn = () => {
    // Initialize auth when user navigates to email sign in
    initAuth()
  }

  if (showSplash) {
    return <SplashScreen />
  }

  if (isAuthenticating) {
    return <AuthLoading />
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  // Determine if we should show Google Sign-In
  const showGoogleSignIn = !authDomainError || !googleSignInAttempted

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: "radial-gradient(circle at center, rgba(20, 184, 166, 0.2) 0%, rgba(15, 23, 42, 1) 70%)",
            backgroundSize: "100% 100%",
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-8 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-md text-center">
          {/* Logo and Title */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2">Jaspire</h1>
            <p className="text-xl text-muted-foreground">Invest your cashback wisely</p>
          </motion.div>

          {/* Unauthorized Domain Error Alert */}
          {authDomainError && (
            <motion.div variants={itemVariants}>
              <Alert variant="warning" className="mb-6 bg-amber-900/20 border-amber-800 text-amber-300">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Domain Not Authorized</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">
                    This domain is not authorized for Google Sign-In with Firebase. Please use email authentication
                    instead.
                  </p>
                  <p className="text-xs">
                    To fix this, add this domain to your Firebase project's authorized domains list.
                  </p>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* API Key Error Alert */}
          {apiKeyError && (
            <motion.div variants={itemVariants}>
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Firebase Configuration Error</AlertTitle>
                <AlertDescription>
                  There is an issue with the Firebase configuration. Please check your environment variables.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Other Error Alert */}
          {error && !authDomainError && !apiKeyError && (
            <motion.div variants={itemVariants}>
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Feature highlights */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-secondary/50 p-4 rounded-lg backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium mb-1">Earn Cashback</h3>
                <p className="text-xs text-muted-foreground">Up to 5% on purchases</p>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium mb-1">Auto-Invest</h3>
                <p className="text-xs text-muted-foreground">Effortless wealth building</p>
              </div>
            </div>
          </motion.div>

          {/* Auth Buttons */}
          <motion.div variants={itemVariants} className="space-y-4">
            {/* Only show Google Sign-In if appropriate */}
            {showGoogleSignIn && (
              <Button
                variant="default"
                className="w-full py-6 text-lg justify-between bg-primary hover:bg-primary/90 group transition-all duration-300"
                onClick={handleGoogleSignIn}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </div>
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            )}

            <Link href="/auth/email" className="block" onClick={handleEmailSignIn}>
              <Button
                variant={authDomainError ? "default" : "outline"}
                className={`w-full py-6 text-lg justify-between group transition-all duration-300 ${
                  authDomainError
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "border-muted hover:bg-secondary hover:border-primary"
                }`}
              >
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  Continue with Email
                </div>
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>

            <div className="text-center mt-6">
              <Link
                href="/auth/options"
                className="text-muted-foreground hover:text-primary text-sm transition-colors duration-300"
                onClick={handleEmailSignIn}
              >
                Other options
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground p-6 relative z-10">
        <p>
          By continuing you agree to the{" "}
          <Link href="/terms" className="underline hover:text-primary transition-colors duration-300">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-primary transition-colors duration-300">
            Privacy Policy
          </Link>
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-primary/70 to-primary rounded-full mx-auto mt-4"></div>
      </div>
    </div>
  )
}

