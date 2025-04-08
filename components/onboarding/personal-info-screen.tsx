"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AlertCircle } from "lucide-react"

interface PersonalInfoScreenProps {
  formData: any
  onUpdateForm: (data: any) => void
  onNext: () => void
  onBack: () => void
  formatPhoneNumber: (phone: string) => string
}

export function PersonalInfoScreen({
  formData,
  onUpdateForm,
  onNext,
  onBack,
  formatPhoneNumber,
}: PersonalInfoScreenProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format phone number as user types
    if (name === "phone") {
      const formattedPhone = formatPhoneForInput(value)
      onUpdateForm({ [name]: formattedPhone })
    } else {
      onUpdateForm({ [name]: value })
    }
  }

  // Format phone for display in input
  const formatPhoneForInput = (phone: string) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "")

    // Limit to 10 digits
    const trimmed = cleaned.substring(0, 10)

    // Format as user types
    if (trimmed.length <= 3) {
      return trimmed
    } else if (trimmed.length <= 6) {
      return `(${trimmed.slice(0, 3)}) ${trimmed.slice(3)}`
    } else {
      return `(${trimmed.slice(0, 3)}) ${trimmed.slice(3, 6)}-${trimmed.slice(6)}`
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (formData.phone.replace(/\D/g, "").length !== 10) {
      newErrors.phone = "Phone number must be 10 digits"
    }

    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of birth is required"
    } else {
      // Check if date is valid and user is at least 18 years old
      const dob = new Date(formData.dateOfBirth)
      const today = new Date()
      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())

      if (isNaN(dob.getTime())) {
        newErrors.dateOfBirth = "Invalid date format"
      } else if (dob > eighteenYearsAgo) {
        newErrors.dateOfBirth = "You must be at least 18 years old"
      }
    }

    if (!formData.ssn.trim()) {
      newErrors.ssn = "Social Security Number is required"
    } else if (!/^\d{9}$/.test(formData.ssn.replace(/\D/g, ""))) {
      newErrors.ssn = "SSN must be 9 digits"
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <Card className="border-0 bg-secondary/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Personal Information</h2>
              <p className="text-muted-foreground">Please provide your personal details</p>
            </div>

            <motion.div variants={itemVariants} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-xs flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ssn">
                  Social Security Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ssn"
                  name="ssn"
                  type="password"
                  value={formData.ssn}
                  onChange={handleChange}
                  placeholder="123-45-6789"
                  className={errors.ssn ? "border-red-500" : ""}
                />
                {errors.ssn && (
                  <p className="text-red-500 text-xs flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.ssn}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Your SSN is required for tax reporting purposes and to verify your identity. It is securely encrypted
                  and stored.
                </p>
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
