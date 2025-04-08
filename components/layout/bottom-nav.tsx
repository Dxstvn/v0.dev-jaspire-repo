"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, PieChart, CreditCard, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Helper function to determine if a path is active
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true
    if (path === "/portfolio" && pathname === "/portfolio") return true
    if (path === "/transactions" && (pathname === "/transactions" || pathname.includes("/add-card"))) return true
    if (path === "/profile" && (pathname === "/profile" || pathname.startsWith("/profile/"))) return true
    return false
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/portfolio", icon: PieChart, label: "Portfolio" },
    { href: "/transactions", icon: CreditCard, label: "Cards" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="glass-dark border-t border-white/10 backdrop-blur-xl">
        <nav className="flex items-center justify-around no-select">
          {navItems.map((item) => {
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center py-3 px-3 relative native-active-state",
                  "touch-manipulation", // Better touch handling
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-secondary rounded-xl -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
