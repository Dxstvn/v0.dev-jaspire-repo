/**
 * This script registers the app with Mastercard Open Banking Connect API.
 * It should be run MANUALLY and ONLY ONCE during initial setup.
 *
 * Usage:
 * - Local: npx ts-node scripts/register-mastercard-app.ts
 * - Or: npm run register-mastercard-app
 */

async function registerApp() {
  try {
    console.log("Registering app with Mastercard Open Banking Connect API...")

    // Use relative URL to avoid environment variable dependencies
    const response = await fetch("/api/mastercard/register-app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (data.success) {
      console.log("✅ Success:", data.message)
      if (data.data) {
        console.log("App details:", JSON.stringify(data.data, null, 2))
      }
    } else {
      console.error("❌ Error:", data.error)
      if (data.details) {
        console.error("Details:", data.details)
      }
      process.exit(1)
    }
  } catch (error) {
    console.error("❌ Failed to register app:", error)
    process.exit(1)
  }
}

// Only run if explicitly executed
if (require.main === module) {
  registerApp()
}
