"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VerificationFormScreenProps {
  onVerificationSubmitted: () => void
}

export function VerificationFormScreen({ onVerificationSubmitted }: VerificationFormScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    ssn: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    employmentStatus: "",
    annualIncome: "",
    investmentExperience: "",
    termsAccepted: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, termsAccepted: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call for verification
    setTimeout(() => {
      setIsSubmitting(false)
      onVerificationSubmitted()
    }, 2000)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <div className="flex-1 flex flex-col p-6 overflow-auto">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-md mx-auto w-full">
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Verify Your Identity</h1>
          <p className="text-muted-foreground">
            Please provide the following information to verify your identity and set up your investment account.
          </p>
        </motion.div>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
          <Alert className="bg-primary/10 border-primary/20 mb-4">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-xs">
              Your information is encrypted and securely stored. We never share your data with unauthorized parties.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="bg-secondary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ssn">Last 4 of SSN</Label>
              <Input
                id="ssn"
                name="ssn"
                value={formData.ssn}
                onChange={handleChange}
                maxLength={4}
                pattern="[0-9]{4}"
                required
                className="bg-secondary/50"
                placeholder="1234"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="bg-secondary/50"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AL">Alabama</SelectItem>
                  <SelectItem value="AK">Alaska</SelectItem>
                  <SelectItem value="AZ">Arizona</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="CO">Colorado</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  {/* Add more states as needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="bg-secondary/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentStatus">Employment Status</Label>
            <Select
              value={formData.employmentStatus}
              onValueChange={(value) => handleSelectChange("employmentStatus", value)}
            >
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="self-employed">Self-Employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualIncome">Annual Income</Label>
            <Select value={formData.annualIncome} onValueChange={(value) => handleSelectChange("annualIncome", value)}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Select annual income range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-25000">$0 - $25,000</SelectItem>
                <SelectItem value="25001-50000">$25,001 - $50,000</SelectItem>
                <SelectItem value="50001-100000">$50,001 - $100,000</SelectItem>
                <SelectItem value="100001-250000">$100,001 - $250,000</SelectItem>
                <SelectItem value="250001+">$250,001+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentExperience">Investment Experience</Label>
            <Select
              value={formData.investmentExperience}
              onValueChange={(value) => handleSelectChange("investmentExperience", value)}
            >
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <Checkbox
              id="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={handleCheckboxChange}
              required
            />
            <label
              htmlFor="termsAccepted"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I confirm that the information provided is accurate and I agree to the{" "}
              <a href="#" className="text-primary underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}
