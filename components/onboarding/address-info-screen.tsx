"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { AlertCircle } from "lucide-react"

interface AddressInfoScreenProps {
  formData: any
  onUpdateForm: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function AddressInfoScreen({ formData, onUpdateForm, onNext, onBack }: AddressInfoScreenProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onUpdateForm({ [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    onUpdateForm({ [name]: value })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required"
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.postalCode)) {
      newErrors.postalCode = "Invalid postal code format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onNext()
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        when: "afterChildren",
      },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 10, opacity: 0 },
  }

  // US states for dropdown
  const states = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
    { value: "DC", label: "District of Columbia" },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <Card className="border-0 bg-secondary/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Address Information</h2>
              <p className="text-muted-foreground">Please provide your residential address</p>
            </div>

            <motion.div variants={itemVariants} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="streetAddress">
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  className={errors.streetAddress ? "border-red-500" : ""}
                />
                {errors.streetAddress && (
                  <p className="text-red-500 text-xs flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.streetAddress}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
                    <SelectTrigger id="state" className={errors.state ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-red-500 text-xs flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.state}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">
                    Postal Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="12345"
                    className={errors.postalCode ? "border-red-500" : ""}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-xs flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} disabled />
                <p className="text-xs text-muted-foreground">Currently, we only support U.S. residents.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">Continue</Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
