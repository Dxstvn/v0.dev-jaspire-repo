// Mastercard Open Banking US API integration
// Based on: https://developer.mastercard.com/open-banking-us/documentation/

import { toast } from "@/hooks/use-toast"

// Types for the Mastercard Open Banking API
export interface MastercardTransaction {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  category: string
  merchant: {
    name: string
    category: string
    logoUrl?: string
  }
  accountId: string
  status: "COMPLETED" | "PENDING" | "DECLINED"
  cashback?: number
}

export interface MastercardAccount {
  id: string
  accountNumber: string
  accountType: string
  balance: number
  currency: string
  name: string
  institution: {
    id: string
    name: string
    logoUrl?: string
  }
}

export interface FinancialInstitution {
  id: string
  name: string
  logoUrl: string
  type: string
  country: string
}

// Client-side API class for interacting with server endpoints
export class MastercardOpenBankingAPI {
  /**
   * Generate a Connect URL for linking a financial institution
   * Following the Mastercard Open Banking US documentation
   */
  public async generateConnectUrl(redirectUrl: string): Promise<string> {
    try {
      console.log("Requesting Connect URL with redirectUrl:", redirectUrl)

      const response = await fetch("/api/mastercard/generate-connect-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ redirectUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate Connect URL")
      }

      const data = await response.json()

      if (!data.connectUrl) {
        throw new Error("Connect URL is missing from response")
      }

      return data.connectUrl
    } catch (error: any) {
      console.error("Error generating Connect URL:", error)
      toast({
        title: "Connection Error",
        description: `Unable to initialize bank connection: ${error.message}`,
        variant: "destructive",
      })
      throw error
    }
  }

  /**
   * Handle the Connect callback and exchange the code for access tokens
   */
  public async handleConnectCallback(code: string): Promise<boolean> {
    try {
      const response = await fetch("/api/mastercard/handle-connect-callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to handle Connect callback")
      }

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error("Error handling Connect callback:", error)
      toast({
        title: "Connection Error",
        description: "Unable to complete bank connection. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  /**
   * Get list of supported financial institutions
   */
  public async getFinancialInstitutions(): Promise<FinancialInstitution[]> {
    try {
      const response = await fetch("/api/mastercard/institutions")

      if (!response.ok) {
        throw new Error("Failed to fetch financial institutions")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching financial institutions:", error)
      toast({
        title: "Error",
        description: "Unable to retrieve financial institutions. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  }

  /**
   * Fetch user accounts
   */
  public async getAccounts(): Promise<MastercardAccount[]> {
    try {
      const response = await fetch("/api/mastercard/accounts")

      if (!response.ok) {
        throw new Error("Failed to fetch accounts")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching accounts:", error)
      toast({
        title: "Error fetching accounts",
        description: "Unable to retrieve your bank accounts. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  }

  /**
   * Fetch transactions for a user account
   */
  public async getTransactions(
    accountId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<MastercardTransaction[]> {
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (accountId) params.append("accountId", accountId)
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)

      const response = await fetch(`/api/mastercard/transactions?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error fetching transactions",
        description: "Unable to retrieve your transactions. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  }

  /**
   * Fetch cashback rewards for user transactions
   */
  public async getCashbackRewards(): Promise<{ [transactionId: string]: number }> {
    try {
      const response = await fetch("/api/mastercard/cashback-rewards")

      if (!response.ok) {
        throw new Error("Failed to fetch cashback rewards")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching cashback rewards:", error)
      toast({
        title: "Error fetching rewards",
        description: "Unable to retrieve your cashback rewards. Please try again later.",
        variant: "destructive",
      })
      return {}
    }
  }
}

// Export singleton instance
export const mastercardApi = new MastercardOpenBankingAPI()

