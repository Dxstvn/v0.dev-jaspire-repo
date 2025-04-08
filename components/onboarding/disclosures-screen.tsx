"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DisclosuresScreenProps {
  formData: any
  onUpdateForm: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function DisclosuresScreen({ formData, onUpdateForm, onNext, onBack }: DisclosuresScreenProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleToggle = (name: string, checked: boolean) => {
    onUpdateForm({ [name]: checked })
  }

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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <Card className="border-0 bg-secondary/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Financial Disclosures</h2>
              <p className="text-muted-foreground">Please answer the following regulatory questions</p>
            </div>

            <motion.div variants={itemVariants} className="space-y-6">
              <TooltipProvider>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Label htmlFor="isControlPerson" className="text-base">
                        Are you a control person?
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            A control person is a director, officer, or someone who holds 10% or more of voting stock in
                            a publicly traded company.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Director, officer, or 10%+ shareholder of a public company
                    </p>
                  </div>
                  <Switch
                    id="isControlPerson"
                    checked={formData.isControlPerson}
                    onCheckedChange={(checked) => handleToggle("isControlPerson", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Label htmlFor="isAffiliatedExchangeOrFinra" className="text-base">
                        Are you affiliated with an exchange or FINRA?
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            This includes employees of broker-dealers, stock exchanges, or the Financial Industry
                            Regulatory Authority (FINRA).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Employee of a broker-dealer or self-regulatory organization
                    </p>
                  </div>
                  <Switch
                    id="isAffiliatedExchangeOrFinra"
                    checked={formData.isAffiliatedExchangeOrFinra}
                    onCheckedChange={(checked) => handleToggle("isAffiliatedExchangeOrFinra", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Label htmlFor="isPoliticallyExposed" className="text-base">
                        Are you a politically exposed person?
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            A politically exposed person is someone who holds a high-ranking public office, or a family
                            member or close associate of such a person.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">Current or former senior political figure</p>
                  </div>
                  <Switch
                    id="isPoliticallyExposed"
                    checked={formData.isPoliticallyExposed}
                    onCheckedChange={(checked) => handleToggle("isPoliticallyExposed", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Label htmlFor="immediateFamilyExposed" className="text-base">
                        Is an immediate family member politically exposed?
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Immediate family members include parents, siblings, spouse, children, and in-laws.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">Family member of a politically exposed person</p>
                  </div>
                  <Switch
                    id="immediateFamilyExposed"
                    checked={formData.immediateFamilyExposed}
                    onCheckedChange={(checked) => handleToggle("immediateFamilyExposed", checked)}
                  />
                </div>
              </TooltipProvider>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Answering "Yes" to any of these questions does not disqualify you from opening
                  an account. It may require additional documentation or review.
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
