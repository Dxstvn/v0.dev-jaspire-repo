"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AlertCircle, ExternalLink } from "lucide-react"
import { PdfViewerModal } from "@/components/pdf-viewer-modal"

interface AgreementsScreenProps {
  formData: any
  onUpdateForm: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function AgreementsScreen({ formData, onUpdateForm, onNext, onBack }: AgreementsScreenProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showCustomerAgreement, setShowCustomerAgreement] = useState(false)
  const [showAccountAgreement, setShowAccountAgreement] = useState(false)
  const [showMarginAgreement, setShowMarginAgreement] = useState(false)

  // Initialize with all agreements checked for testing
  useState(() => {
    if (!formData.customerAgreement && !formData.accountAgreement && !formData.marginAgreement) {
      onUpdateForm({
        customerAgreement: true,
        accountAgreement: true,
        marginAgreement: true,
      })
    }
  })

  const handleCheckboxChange = (name: string, checked: boolean) => {
    onUpdateForm({ [name]: checked })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerAgreement) {
      newErrors.customerAgreement = "You must agree to the Customer Agreement"
    }

    if (!formData.accountAgreement) {
      newErrors.accountAgreement = "You must agree to the Account Agreement"
    }

    if (!formData.marginAgreement) {
      newErrors.marginAgreement = "You must agree to the Margin Agreement"
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
              <h2 className="text-2xl font-semibold">Agreements</h2>
              <p className="text-muted-foreground">Please review and agree to the following documents</p>
            </div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Customer Agreement</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCustomerAgreement(true)}
                      className="text-xs h-8"
                    >
                      View Agreement <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    This agreement outlines the terms and conditions of your brokerage account.
                  </p>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="customerAgreement"
                      checked={formData.customerAgreement}
                      onCheckedChange={(checked) => handleCheckboxChange("customerAgreement", checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="customerAgreement"
                        className={`text-sm font-normal ${errors.customerAgreement ? "text-red-500" : ""}`}
                      >
                        I have read and agree to the Customer Agreement
                      </Label>
                      {errors.customerAgreement && (
                        <p className="text-red-500 text-xs flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.customerAgreement}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Account Agreement</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAccountAgreement(true)}
                      className="text-xs h-8"
                    >
                      View Agreement <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    This agreement covers the specific terms of your investment account.
                  </p>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="accountAgreement"
                      checked={formData.accountAgreement}
                      onCheckedChange={(checked) => handleCheckboxChange("accountAgreement", checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="accountAgreement"
                        className={`text-sm font-normal ${errors.accountAgreement ? "text-red-500" : ""}`}
                      >
                        I have read and agree to the Account Agreement
                      </Label>
                      {errors.accountAgreement && (
                        <p className="text-red-500 text-xs flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.accountAgreement}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Margin Agreement</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMarginAgreement(true)}
                      className="text-xs h-8"
                    >
                      View Agreement <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    This agreement covers the terms of margin trading.
                  </p>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="marginAgreement"
                      checked={formData.marginAgreement}
                      onCheckedChange={(checked) => handleCheckboxChange("marginAgreement", checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="marginAgreement"
                        className={`text-sm font-normal ${errors.marginAgreement ? "text-red-500" : ""}`}
                      >
                        I have read and agree to the Margin Agreement
                      </Label>
                      {errors.marginAgreement && (
                        <p className="text-red-500 text-xs flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.marginAgreement}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm">
                  By checking the boxes above, you acknowledge that you have read and understand the agreements. These
                  are legally binding contracts.
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

      <PdfViewerModal
        isOpen={showCustomerAgreement}
        onClose={() => setShowCustomerAgreement(false)}
        pdfUrl="https://files.alpaca.markets/disclosures/library/alpaca_customer_agreement_v20200819.pdf"
        title="Customer Agreement"
      />

      <PdfViewerModal
        isOpen={showAccountAgreement}
        onClose={() => setShowAccountAgreement(false)}
        pdfUrl="https://files.alpaca.markets/disclosures/alpaca_customer_agreement_v20200403.pdf"
        title="Account Agreement"
      />

      <PdfViewerModal
        isOpen={showMarginAgreement}
        onClose={() => setShowMarginAgreement(false)}
        pdfUrl="https://files.alpaca.markets/disclosures/library/MarginDiscStmt.pdf"
        title="Margin Agreement"
      />
    </motion.div>
  )
}
