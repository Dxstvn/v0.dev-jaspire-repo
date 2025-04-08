"use client"

import { useState, useEffect, useCallback } from "react"
import { usePlaidLink } from "react-plaid-link"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PlaidLinkButtonProps {
  onSuccess: (publicToken: string, metadata: any) => void
  onExit?: () => void
  className?: string
  buttonText?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function PlaidLinkButton({
  onSuccess,
  onExit,
  className,
  buttonText = "Connect Your Bank",
  variant = "default",
}: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const fetchLinkToken = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/plaid/create-link-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to create link token")
      }

      const data = await response.json()
      setLinkToken(data.link_token)
    } catch (error) {
      console.error("Error creating link token:", error)
      toast({
        title: "Connection Error",
        description: "Unable to initialize bank connection. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLinkToken()
  }, [fetchLinkToken])

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (publicToken, metadata) => {
      onSuccess(publicToken, metadata)
    },
    onExit: () => {
      if (onExit) {
        onExit()
      }
    },
  })

  const handleClick = () => {
    if (ready) {
      open()
    } else {
      // If not ready yet, try to get a new link token
      fetchLinkToken()
      toast({
        title: "Please wait",
        description: "Preparing bank connection...",
      })
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading || !linkToken} className={className} variant={variant}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        buttonText
      )}
    </Button>
  )
}
