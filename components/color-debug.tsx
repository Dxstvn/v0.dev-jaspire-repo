"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

export function ColorDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [cssVars, setCssVars] = useState<Record<string, string>>({})
  const [environment, setEnvironment] = useState("")

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Get computed CSS variables
    const computedStyle = getComputedStyle(document.documentElement)
    const variables = {
      "--primary": computedStyle.getPropertyValue("--primary"),
      "--primary-foreground": computedStyle.getPropertyValue("--primary-foreground"),
      "--ring": computedStyle.getPropertyValue("--ring"),
      "--chart-1": computedStyle.getPropertyValue("--chart-1"),
      "--chart-2": computedStyle.getPropertyValue("--chart-2"),
      "--chart-3": computedStyle.getPropertyValue("--chart-3"),
      "--chart-4": computedStyle.getPropertyValue("--chart-4"),
      "--chart-5": computedStyle.getPropertyValue("--chart-5"),
    }

    setCssVars(variables)

    // Determine environment
    const hostname = window.location.hostname
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      setEnvironment("Development (localhost)")
    } else if (hostname.includes("vercel.app") && (hostname.includes("-git-") || hostname.includes("-vercel-"))) {
      setEnvironment("Vercel Preview")
    } else if (hostname.includes("vercel.app")) {
      setEnvironment("Vercel Production")
    } else {
      setEnvironment("Unknown")
    }
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto mt-4 bg-secondary/50 border-0">
      <CardHeader>
        <CardTitle className="text-lg">Color Debug ({environment})</CardTitle>
        <CardDescription>Check CSS color variables</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex w-full justify-between">
              <span>Show Color Variables</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2">
            {Object.entries(cssVars).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-border">
                <span className="font-mono text-sm">{key}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">{value}</span>
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      backgroundColor: `hsl(${value})`,
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  />
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2 w-full">
          <div className="p-4 bg-primary text-primary-foreground rounded">Primary</div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded">Secondary</div>
          <div className="p-4 bg-muted text-muted-foreground rounded">Muted</div>
          <div className="p-4 bg-accent text-accent-foreground rounded">Accent</div>
        </div>
      </CardFooter>
    </Card>
  )
}
