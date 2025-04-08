import type { User } from "firebase/auth"

// Function to check if the current user should see demo data
export function shouldShowDemoData(user: User | null): boolean {
  // Only show demo data for the specific email
  return user?.email === "jasmindustin@gmail.com"
}

// Function to get a placeholder avatar for users without a photo
export function getInitialsAvatar(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}
