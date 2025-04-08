"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authInitialized, setAuthInitialized] = useState(false)
  const router = useRouter()

  // Initialize auth on mount
  useEffect(() => {
    initAuth()
  }, [])

  // Initialize auth
  const initAuth = async () => {
    if (authInitialized) return

    setLoading(true)
    clearErrors()

    try {
      // Dynamically import Firebase modules
      const { initializeFirebase, getAuth } = await import("@/lib/firebase")

      // Initialize Firebase first
      await initializeFirebase()

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
          setError(error.message || "Authentication error")
          setLoading(false)
        },
      )

      setAuthInitialized(true)

      // Return unsubscribe function
      return () => unsubscribe()
    } catch (error: any) {
      console.error("Error initializing auth:", error)
      setError(error.message || "Failed to initialize authentication")
      setLoading(false)
    }
  }

  const clearErrors = () => {
    setError(null)
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

      // Log domain name when unauthorized domain error occurs
      if (error.code === "auth/unauthorized-domain") {
        const currentDomain = isBrowser ? window.location.hostname : "unknown"
        console.error(
          `Unauthorized domain error: Current domain (${currentDomain}) is not authorized for Google Sign-In.`,
        )
        console.log("To fix this, add this domain to your Firebase console: https://console.firebase.google.com/")
      }

      setError(error.message || "Failed to sign in with Google")
      throw error
    } finally {
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
      setError(error.message || "Failed to sign in with email")
      throw error
    } finally {
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
      setError(error.message || "Failed to sign up with email")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
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
