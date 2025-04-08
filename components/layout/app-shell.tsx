"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { BottomNav } from "./bottom-nav"
import { TopBar } from "./top-bar"
import { PWAInstallPrompt } from "../pwa-install-prompt"
import { OfflineIndicator } from "../offline-indicator"

// Routes that should not show the navigation
const fullScreenRoutes = ["/", "/auth/email", "/auth/phone", "/auth/options", "/auth/forgot-password", "/onboarding"]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if current route should be full screen
  const isFullScreen = fullScreenRoutes.includes(pathname) || pathname.startsWith("/onboarding/")

  if (isFullScreen) {
    return (
      <main className="prevent-overflow">
        <OfflineIndicator />
        {children}
      </main>
    )
  }

  return (
    <div className="flex min-h-screen flex-col prevent-overflow">
      <TopBar />
      <main className="flex-1 pb-16 pt-safe">
        <OfflineIndicator />
        <div className="container px-4 py-4">{children}</div>
      </main>
      <BottomNav />
      <PWAInstallPrompt />
    </div>
  )
}
