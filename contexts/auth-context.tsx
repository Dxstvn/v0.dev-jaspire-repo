"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useRouter } from "next/navigation"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Define types for Firebase Auth
type User = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  authDomainError: boolean
  apiKeyError: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<User | null>
  updateUserProfile: (profileData: { displayName?: string; photoURL?: string }) => Promise<void>
  signOut: () => Promise<void>
  clearErrors: () => void
  initAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authDomainError, setAuthDomainError] = useState(false)
  const [apiKeyError, setApiKeyError] = useState(false)
  const [authInitialized, setAuthInitialized] = useState(false)
  const router = useRouter()

  // Initialize auth only when explicitly called
  const initAuth = async () => {
    if (authInitialized) return

    setLoading(true)
    clearErrors()

    try {
      // Dynamically import Firebase modules
      const { initializeFirebase, isConfigValid, getAuth } = await import("@/lib/firebase")

      // Initialize Firebase first
      await initializeFirebase()

      // Check if Firebase config is valid
      if (!isConfigValid()) {
        console.error("Firebase configuration is invalid")
        setError("Firebase configuration is invalid. Please check your environment variables.")
        setApiKeyError(true)
        setLoading(false)
        return
      }

      // Get auth after initialization
      const auth = await getAuth()

      if (!auth) {
        console.error("Firebase auth is not initialized")
        setError("Firebase authentication is not initialized. Please try again later.")
        setLoading(false)
        return
      }

      const { onAuthStateChanged } = await import("firebase/auth")

      // Set up auth state listener
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            setUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            })

            // Store auth token in cookie for middleware
            if (isBrowser) {
              document.cookie = `firebase-auth-token=${user.uid};path=/;max-age=3600;SameSite=Strict`
            }

            // Only redirect if on auth pages
            if (isBrowser && (window.location.pathname === "/" || window.location.pathname.startsWith("/auth"))) {
              router.push("/dashboard")
            }
          } else {
            setUser(null)
            // Clear auth token cookie
            if (isBrowser) {
              document.cookie = "firebase-auth-token=;path=/;max-age=0;SameSite=Strict"
            }
          }
          setLoading(false)
        },
        (error) => {
          console.error("Auth state change error:", error)
          handleAuthError(error)
          setLoading(false)
        },
      )

      setAuthInitialized(true)

      // Return unsubscribe function
      return () => unsubscribe()
    } catch (error) {
      console.error("Error initializing auth:", error)
      handleAuthError(error)
      setLoading(false)
    }

    // Inside initAuth function, after setting up auth state listener
  }

  const handleAuthError = (error: any) => {
    console.error("Auth error:", error)

    // Check for API key error
    if (
      error.code === "auth/api-key-not-valid" ||
      error.message?.includes("api-key-not-valid") ||
      error.code === "auth/invalid-api-key"
    ) {
      setError("Firebase API key is invalid. Please check your environment configuration.")
      setApiKeyError(true)
      return
    }

    // Enhanced logging for unauthorized domain error
    if (error.code === "auth/unauthorized-domain") {
      const currentDomain = isBrowser ? window.location.hostname : "unknown"

      // Create a more detailed error message for the console
      console.error(`
    =====================================================
    FIREBASE UNAUTHORIZED DOMAIN ERROR
    =====================================================
    Current domain: ${currentDomain}
    
    This domain is not authorized in your Firebase project.
    
    To fix this issue:
    1. Go to Firebase Console: https://console.firebase.google.com/
    2. Select your project: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project"}"
    3. Navigate to Authentication → Settings → Authorized domains
    4. Add "${currentDomain}" to the list of authorized domains
    
    Until then, please use email authentication instead.
    =====================================================
    `)

      setError(
        `This domain (${currentDomain}) is not authorized in Firebase. Add it to your Firebase console or use email authentication instead.`,
      )
      setAuthDomainError(true)
    } else {
      setError(error.message || "Authentication failed")
    }
  }

  const clearErrors = () => {
    setError(null)
    setAuthDomainError(false)
    setApiKeyError(false)
  }

  const signInWithGoogle = async () => {
    if (!isBrowser) return

    try {
      setLoading(true)
      clearErrors()

      // Initialize auth if not already initialized
      if (!authInitialized) {
        await initAuth()
      }

      // Original web browser flow
      // Dynamically import Firebase modules
      const { getAuth, getGoogleProvider } = await import("@/lib/firebase")

      const auth = await getAuth()
      const googleProvider = await getGoogleProvider()

      if (!auth || !googleProvider) {
        throw new Error("Firebase authentication is not initialized")
      }

      const { signInWithPopup } = await import("firebase/auth")

      // Use popup for sign in
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user) {
        // Store auth token in cookie for middleware
        document.cookie = `firebase-auth-token=${result.user.uid};path=/;max-age=3600;SameSite=Strict`
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error)
      handleAuthError(error)
      throw error
    } finally {
      // Set a timeout to prevent infinite loading
      const loadingTimeout = setTimeout(() => {
        if (setLoading) {
          setLoading(false)
          setError("Authentication timed out. Please try again.")
        }
      }, 30000) // 30 seconds timeout

      clearTimeout(loadingTimeout)
      setLoading(false)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!isBrowser) return

    try {
      setLoading(true)
      clearErrors()

      // Initialize auth if not already initialized
      if (!authInitialized) {
        await initAuth()
      }

      // Dynamically import Firebase modules
      const { getAuth } = await import("@/lib/firebase")

      const auth = await getAuth()

      if (!auth) {
        throw new Error("Firebase authentication is not initialized")
      }

      const { signInWithEmailAndPassword } = await import("firebase/auth")

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Store auth token in cookie for middleware
      if (userCredential.user) {
        document.cookie = `firebase-auth-token=${userCredential.user.uid};path=/;max-age=3600;SameSite=Strict`
      }

      // Explicitly navigate to dashboard after successful login
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error signing in with email:", error)
      handleAuthError(error)
      throw error
    } finally {
      // Set a timeout to prevent infinite loading
      const loadingTimeout = setTimeout(() => {
        if (setLoading) {
          setLoading(false)
          setError("Authentication timed out. Please try again.")
        }
      }, 30000) // 30 seconds timeout

      clearTimeout(loadingTimeout)
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    if (!isBrowser) return null

    try {
      setLoading(true)
      clearErrors()

      // Initialize auth if not already initialized
      if (!authInitialized) {
        await initAuth()
      }

      // Dynamically import Firebase modules
      const { getAuth } = await import("@/lib/firebase")

      const auth = await getAuth()

      if (!auth) {
        throw new Error("Firebase authentication is not initialized")
      }

      const { createUserWithEmailAndPassword } = await import("firebase/auth")

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Store auth token in cookie for middleware
      if (userCredential.user) {
        document.cookie = `firebase-auth-token=${userCredential.user.uid};path=/;max-age=3600;SameSite=Strict`
      }

      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      }
    } catch (error: any) {
      console.error("Error signing up with email:", error)
      handleAuthError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
    if (!isBrowser) return

    try {
      setLoading(true)
      setError(null)

      // Initialize auth if not already initialized
      if (!authInitialized) {
        await initAuth()
      }

      // Dynamically import Firebase modules
      const { getAuth } = await import("@/lib/firebase")
      const auth = await getAuth()

      if (!auth || !auth.currentUser) {
        throw new Error("No authenticated user found")
      }

      const { updateProfile } = await import("firebase/auth")

      await updateProfile(auth.currentUser, profileData)

      // Update the local user state to reflect the changes
      setUser({
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: profileData.displayName || auth.currentUser.displayName,
        photoURL: profileData.photoURL || auth.currentUser.photoURL,
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!isBrowser) return

    try {
      // Initialize auth if not already initialized
      if (!authInitialized) {
        await initAuth()
      }

      // Dynamically import Firebase modules
      const { getAuth } = await import("@/lib/firebase")
      const auth = await getAuth()

      if (!auth) {
        throw new Error("Firebase authentication is not initialized")
      }

      const { signOut: firebaseSignOut } = await import("firebase/auth")

      await firebaseSignOut(auth)

      // Clear auth token cookie
      document.cookie = "firebase-auth-token=;path=/;max-age=0;SameSite=Strict"

      router.push("/")
    } catch (error: any) {
      console.error("Error signing out:", error)
      setError(error.message || "Failed to sign out")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        authDomainError,
        apiKeyError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        updateUserProfile,
        signOut,
        clearErrors,
        initAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

