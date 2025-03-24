"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestConnectionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/mastercard/test-connection")
      const data = await response.json()

      setResults(data)
    } catch (error: any) {
      console.error("Error testing connection:", error)
      setError(error.message || "An error occurred while testing the connection")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Mastercard API Connection</CardTitle>
          <CardDescription>
            This page tests the connection to the Mastercard Open Banking API and displays the results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {results && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold mb-2">Credentials (masked):</h3>
                <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                  {JSON.stringify(results.credentials, null, 2)}
                </pre>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold mb-2">API Test Results:</h3>
                {results.results.map((result: any, index: number) => (
                  <div key={index} className="mb-4 p-2 bg-gray-100 rounded">
                    <p className="font-medium">Endpoint: {result.endpoint}</p>
                    {result.error ? (
                      <p className="text-red-600">Error: {result.error}</p>
                    ) : (
                      <>
                        <p>Status: {result.status}</p>
                        <details>
                          <summary className="cursor-pointer">Response Headers</summary>
                          <pre className="text-xs overflow-auto p-2 bg-gray-200 rounded mt-2">
                            {JSON.stringify(result.headers, null, 2)}
                          </pre>
                        </details>
                        <details>
                          <summary className="cursor-pointer">Response Data</summary>
                          <pre className="text-xs overflow-auto p-2 bg-gray-200 rounded mt-2">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

