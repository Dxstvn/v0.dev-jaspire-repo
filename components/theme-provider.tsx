"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "dark", storageKey = "theme", ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window !== "undefined" ? (localStorage.getItem(storageKey) as Theme) || defaultTheme : defaultTheme,
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes
    root.classList.remove("light", "dark")

    // Always use dark theme for this app
    root.classList.add("dark")

    // Set CSS variables to ensure consistent colors
    const style = document.documentElement.style

    // Set primary color to green
    style.setProperty("--primary", "142.1 76.2% 36.3%")
    style.setProperty("--ring", "142.1 76.2% 36.3%")

    // Set chart colors
    style.setProperty("--chart-1", "142.1 76.2% 36.3%")
    style.setProperty("--chart-2", "168 76.2% 36.3%")
    style.setProperty("--chart-3", "196 76.2% 36.3%")
    style.setProperty("--chart-4", "220 76.2% 36.3%")
    style.setProperty("--chart-5", "250 76.2% 36.3%")

    // Store theme preference
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
