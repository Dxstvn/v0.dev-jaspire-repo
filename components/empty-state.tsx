"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  ctaText?: string
  ctaLink?: string
  secondaryAction?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  ctaText,
  ctaLink,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
      >
        {icon}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl font-bold mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-muted-foreground text-base mb-6 max-w-xs mx-auto prevent-overflow text-adjust-mobile"
      >
        {description}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {action}
        </motion.div>
      )}

      {ctaText && ctaLink && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href={ctaLink}>
            <Button className="bg-primary hover:bg-primary/90">{ctaText}</Button>
          </Link>
        </motion.div>
      )}

      {secondaryAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4"
        >
          {secondaryAction}
        </motion.div>
      )}
    </motion.div>
  )
}
