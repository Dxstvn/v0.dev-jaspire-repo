"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { AppShell } from "@/components/layout/app-shell"

export default function PersonalInfo() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-06-15",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "United States",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would save to a database
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your personal information has been updated successfully.",
    })
  }

  return (
    <AppShell>
      <div className="mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.push("/profile")} className="mr-2">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Personal Information</h1>
        </div>
      </div>

      <Card className="bg-secondary/50 border-0 mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="bg-background/50 border-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="bg-background/50 border-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="bg-background/50 border-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="bg-background/50 border-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="bg-background/50 border-muted"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="bg-background/50 border-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="bg-background/50 border-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="bg-background/50 border-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="bg-background/50 border-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  disabled={!isEditing}
                  value={formData.country}
                  onValueChange={(value) => handleSelectChange("country", value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700">
                  Edit Information
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  )
}
