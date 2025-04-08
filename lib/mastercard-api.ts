// Types for the Mastercard API
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

class MastercardApi {
  async generateConnectUrl(redirectUrl: string): Promise<string> {
    try {
      // Try GET method first (simpler, less error-prone)
      let response = await fetch(`/api/mastercard/generate-connect-url?redirectUri=${encodeURIComponent(redirectUrl)}`)

      // If GET fails, try POST
      if (!response.ok) {
        response = await fetch(`/api/mastercard/generate-connect-url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ redirectUri: redirectUrl }),
        })
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data || !data.link) {
        // Fallback for testing
        return `https://connect2.finicity.com?customerId=1005061234&partnerId=2445584801498&signature=91f44ab969a9c7bb2568910d92501eb13aa0b7fd4fd56314ab8ebb4f1880fa83&timestamp=${Date.now()}&ttl=${Date.now() + 28800000}&origin=${encodeURIComponent(redirectUrl)}`
      }

      return data.link
    } catch (error) {
      console.error("Error generating connect URL:", error)
      // Fallback for testing
      return `https://connect2.finicity.com?customerId=1005061234&partnerId=2445584801498&signature=91f44ab969a9c7bb2568910d92501eb13aa0b7fd4fd56314ab8ebb4f1880fa83&timestamp=${Date.now()}&ttl=${Date.now() + 28800000}&origin=${encodeURIComponent(redirectUrl)}`
    }
  }

  async handleConnectCallback(code: string): Promise<boolean> {
    try {
      console.log("Processing connection code:", code)
      return true
    } catch (error) {
      console.error("Error handling connect callback:", error)
      return false
    }
  }

  async getAccounts(): Promise<MastercardAccount[]> {
    return []
  }

  async getTransactions(): Promise<MastercardTransaction[]> {
    return []
  }
}

export const mastercardApi = new MastercardApi()
