import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/portfolio", "/transactions", "/profile", "/onboarding", "/add-card"]

export function middleware(request: NextRequest) {
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Get the Firebase auth token from cookies
  const token = request.cookies.get("firebase-auth-token")?.value

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/transactions/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
    "/add-card/:path*",
  ],
}

