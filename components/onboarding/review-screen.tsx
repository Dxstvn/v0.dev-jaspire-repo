"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit2 } from "lucide-react"

interface ReviewScreenProps {
  formData: any
  onNext: () => void
  onBack: () => void
  formatPhoneNumber: (phone: string) => string
}

export function ReviewScreen({ formData, onNext, onBack, formatPhoneNumber }: ReviewScreenProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
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

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <Card className="border-0 bg-secondary/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Review Information</h2>
              <p className="text-muted-foreground">Please review your information before submitting</p>
            </div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Personal Information</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onBack()}
                      className="text-xs h-8 text-muted-foreground"
                    >
                      <Edit2 className="mr-1 h-3 w-3" /> Edit
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p>
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p>{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p>{formatPhoneNumber(formData.phone)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date of Birth</p>
                      <p>{formatDate(formData.dateOfBirth)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">SSN</p>
                      <p>••••••{formData.ssn.slice(-4)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Address</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onBack()}
                      className="text-xs h-8 text-muted-foreground"
                    >
                      <Edit2 className="mr-1 h-3 w-3" /> Edit
                    </Button>
                  </div>
                  <div className="text-sm">
                    <p>{formData.streetAddress}</p>
                    <p>
                      {formData.city}, {formData.state} {formData.postalCode}
                    </p>
                    <p>{formData.country}</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Financial Disclosures</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onBack()}
                      className="text-xs h-8 text-muted-foreground"
                    >
                      <Edit2 className="mr-1 h-3 w-3" /> Edit
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Control Person</p>
                      <p>{formData.isControlPerson ? "Yes" : "No"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Affiliated with Exchange/FINRA</p>
                      <p>{formData.isAffiliatedExchangeOrFinra ? "Yes" : "No"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Politically Exposed Person</p>
                      <p>{formData.isPoliticallyExposed ? "Yes" : "No"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Family Member Politically Exposed</p>
                      <p>{formData.immediateFamilyExposed ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Agreements</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onBack()}
                      className="text-xs h-8 text-muted-foreground"
                    >
                      <Edit2 className="mr-1 h-3 w-3" /> Edit
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Customer Agreement</p>
                      <p>{formData.customerAgreement ? "Accepted" : "Not Accepted"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Account Agreement</p>
                      <p>{formData.accountAgreement ? "Accepted" : "Not Accepted"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm">
                  By clicking "Submit", you confirm that all the information provided is accurate and complete. This
                  information will be used to create your investment account.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">Submit</Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
