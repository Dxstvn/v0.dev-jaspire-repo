"use client"

import { useState, useEffect, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

interface OnboardingLayoutProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  onSkip?: () => void
  nextLabel?: string
  showSkip?: boolean
  isFinalStep?: boolean
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  nextLabel = "Continue",
  showSkip = true,
  isFinalStep = false,
}: OnboardingLayoutProps) {
  const [direction, setDirection] = useState(0)
  const router = useRouter()

  // Set direction for animations
  useEffect(() => {
    setDirection(0)
  }, [currentStep])

  // Animation variants with improved transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const handleNext = () => {
    setDirection(1)
    onNext()
  }

  const handlePrevious = () => {
    setDirection(-1)
    onPrevious()
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-30 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Progress indicator */}
        <div className="px-4 pt-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
        </div>

        {/* Main content with improved animations */}
        <div className="flex-1 flex flex-col relative overflow-auto min-h-[500px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              className="absolute inset-0 flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation bar */}
        <div className="p-3 mt-auto bg-transparent border-t border-border/10">
          <div className="flex justify-between items-center mb-2">
            {currentStep > 1 ? (
              <Button
                variant="ghost"
                onClick={handlePrevious}
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {showSkip && onSkip && currentStep < totalSteps && (
              <Button
                variant="ghost"
                onClick={onSkip}
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Skip
              </Button>
            )}
          </div>

          <Button onClick={handleNext} className="w-full bg-white text-black hover:bg-white/90">
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
