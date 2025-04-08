"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

export function EnvironmentDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [envInfo, setEnvInfo] = useState({
    nodeEnv: "",
    hostname: "",
    userAgent: "",
    windowDimensions: { width: 0, height: 0 },
    isMobile: false,
    isVercelProduction: false,
    isVercelPreview: false,
    isLocalhost: false,
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const userAgent = navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const hostname = window.location.hostname
    const isVercelProduction =
      hostname.includes("vercel.app") && !hostname.includes("-git-") && !hostname.includes("-vercel-")
    const isVercelPreview =
      hostname.includes("vercel.app") && (hostname.includes("-git-") || hostname.includes("-vercel-"))
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1"

    setEnvInfo({
      nodeEnv: process.env.NODE_ENV || "unknown",
      hostname,
      userAgent,
      windowDimensions: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      isMobile,
      isVercelProduction,
      isVercelPreview,
      isLocalhost,
    })
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto mt-4 bg-secondary/50 border-0">
      <CardHeader>
        <CardTitle className="text-lg">Environment Debug</CardTitle>
        <CardDescription>Current environment information</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex w-full justify-between">
              <span>Show Environment Info</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="font-mono text-sm">NODE_ENV</span>
              <span className="font-mono text-sm text-muted-foreground">{envInfo.nodeEnv}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="font-mono text-sm">Hostname</span>
              <span className="font-mono text-sm text-muted-foreground">{envInfo.hostname}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="font-mono text-sm">Environment</span>
              <span className="font-mono text-sm text-muted-foreground">
                {envInfo.isLocalhost
                  ? "Local Development"
                  : envInfo.isVercelProduction
                    ? "Vercel Production"
                    : envInfo.isVercelPreview
                      ? "Vercel Preview"
                      : "Unknown"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="font-mono text-sm">Device</span>
              <span className="font-mono text-sm text-muted-foreground">{envInfo.isMobile ? "Mobile" : "Desktop"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="font-mono text-sm">Window Size</span>
              <span className="font-mono text-sm text-muted-foreground">
                {envInfo.windowDimensions.width} x {envInfo.windowDimensions.height}
              </span>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
        <p>This information can help debug environment-specific issues.</p>
      </CardFooter>
    </Card>
  )
}
