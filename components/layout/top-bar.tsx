"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, ChevronLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { getInitialsAvatar } from "@/utils/user-utils"

export function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(3)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Determine if we should show back button
  const showBackButton = pathname !== "/dashboard" && pathname !== "/"

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/portfolio") return "Portfolio"
    if (pathname === "/transactions") return "Cards & Transactions"
    if (pathname === "/profile") return "Profile"
    if (pathname.startsWith("/profile/")) {
      const section = pathname.split("/").pop()
      if (section === "personal-info") return "Personal Information"
      if (section === "security") return "Security"
      if (section === "payment-methods") return "Payment Methods"
      if (section === "notifications") return "Notifications"
      return "Profile"
    }
    if (pathname === "/add-card") return "Add Card"
    if (pathname === "/learn") return "Learn"
    return ""
  }

  const pageTitle = getPageTitle()

  return (
    <header className="sticky top-0 z-40 pt-safe">
      <div className="glass-dark border-b border-white/10 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full native-active-state"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Link href="/dashboard" className="flex items-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                    <span className="text-primary-foreground font-bold text-sm">J</span>
                  </div>
                  <span className="font-bold text-lg gradient-text">Jaspire</span>
                </motion.div>
              </Link>
            )}

            {pageTitle && (
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-medium">
                {pageTitle}
              </motion.h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full relative native-active-state">
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full relative native-active-state">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full text-[10px] flex items-center justify-center text-primary-foreground">
                  {notifications}
                </span>
              )}
            </Button>

            <Link href="/profile">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full overflow-hidden native-active-state",
                  pathname.startsWith("/profile") && "ring-2 ring-primary",
                )}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL || "/placeholder.svg"}
                    alt={user.displayName || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-sm">
                      {user?.displayName ? getInitialsAvatar(user.displayName) : "U"}
                    </span>
                  </div>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
