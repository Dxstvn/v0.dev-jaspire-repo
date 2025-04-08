import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { ServiceWorkerRegistration } from "@/app/service-worker-registration"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

function DomainLogger() {
  React.useEffect(() => {
    console.log("Current window domain:", window.location.hostname)
  }, [])
  return null
}
;("use client")

import React from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Jaspire" />

        {/* iOS splash screens */}
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1668-2388.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1536-2048.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1125-2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1242-2688.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-828-1792.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1242-2208.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-750-1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-640-1136.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />

        {/* Add a style tag to ensure consistent colors */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          :root {
            --primary: 142.1 76.2% 36.3%;
            --primary-foreground: 355.7 100% 97.3%;
            --ring: 142.1 76.2% 36.3%;
            --chart-1: 142.1 76.2% 36.3%;
            --chart-2: 168 76.2% 36.3%;
            --chart-3: 196 76.2% 36.3%;
            --chart-4: 220 76.2% 36.3%;
            --chart-5: 250 76.2% 36.3%;
          }
        `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <DomainLogger />
          <AuthProvider>
            {children}
            <ServiceWorkerRegistration />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
