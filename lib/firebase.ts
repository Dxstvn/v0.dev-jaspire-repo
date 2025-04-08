// First, check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Define the Firebase config with proper validation
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

// Initialize empty variables
let firebaseApp: any = null
let auth: any = null
let db: any = null
let googleProvider: any = null
let firebaseInitialized = false
let initializationPromise: Promise<void> | null = null

// Function to check if Firebase config is valid
export const isConfigValid = () => {
  return !!firebaseConfig.apiKey && !!firebaseConfig.authDomain && !!firebaseConfig.projectId && !!firebaseConfig.appId
}

// Function to initialize Firebase
export const initializeFirebase = async () => {
  // If already initialized or initializing, return the existing promise
  if (firebaseInitialized) return Promise.resolve()
  if (initializationPromise) return initializationPromise

  // Create a new initialization promise
  initializationPromise = new Promise<void>(async (resolve) => {
    try {
      // Only initialize in browser
      if (!isBrowser) {
        resolve()
        return
      }

      // Check if config is valid before initializing
      if (!isConfigValid()) {
        console.error("Firebase configuration is invalid. Check your environment variables.")
        resolve() // Resolve anyway to prevent hanging promises
        return
      }

      // Import Firebase modules
      const { initializeApp, getApps, getApp } = await import("firebase/app")
      const { getAuth, GoogleAuthProvider } = await import("firebase/auth")
      const { getFirestore } = await import("firebase/firestore")

      // Initialize Firebase only if config is valid
      try {
        firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
        auth = getAuth(firebaseApp)
        db = getFirestore(firebaseApp)
        googleProvider = new GoogleAuthProvider()

        // Add additional scopes if needed
        googleProvider.addScope("profile")
        googleProvider.addScope("email")

        firebaseInitialized = true
        console.log("Firebase initialized successfully")
      } catch (initError) {
        console.error("Firebase initialization error:", initError)
        // Still resolve to prevent hanging promises
      }

      resolve()
    } catch (error) {
      console.error("Error initializing Firebase:", error)
      resolve() // Resolve to prevent hanging
    }
  })

  return initializationPromise
}

// Function to get auth (ensures initialization)
export const getAuth = async () => {
  await initializeFirebase()
  return auth
}

// Function to get Firestore (ensures initialization)
export const getDb = async () => {
  await initializeFirebase()
  return db
}

// Function to get Google provider (ensures initialization)
export const getGoogleProvider = async () => {
  await initializeFirebase()
  return googleProvider
}

export { auth, db, googleProvider }
