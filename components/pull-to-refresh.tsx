"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  pullDistance?: number
  loadingColor?: string
}

export function PullToRefresh({
  onRefresh,
  children,
  pullDistance = 80,
  loadingColor = "#10b981",
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullY, setPullY] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      // Only enable pull to refresh when at the top of the page
      if (window.scrollY <= 0) {
        startY.current = e.touches[0].clientY
        setIsPulling(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return

      const currentY = e.touches[0].clientY
      const diff = currentY - startY.current

      // Only allow pulling down, not up
      if (diff > 0 && window.scrollY <= 0) {
        // Apply resistance to make it harder to pull
        const newPullY = Math.min(diff * 0.4, pullDistance)
        setPullY(newPullY)

        // Prevent default scrolling behavior when pulling
        if (newPullY > 0) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling) return

      // If pulled enough, trigger refresh
      if (pullY >= pullDistance * 0.8) {
        setIsRefreshing(true)
        setPullY(0)
        setIsPulling(false)

        try {
          await onRefresh()
        } catch (error) {
          console.error("Refresh failed:", error)
        } finally {
          if (isMounted.current) {
            setIsRefreshing(false)
          }
        }
      } else {
        // Reset without refreshing
        setPullY(0)
        setIsPulling(false)
      }
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isPulling, pullY, pullDistance, onRefresh])

  return (
    <div ref={containerRef} className="relative min-h-full">
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-center overflow-hidden z-10 pointer-events-none"
        style={{ height: `${Math.max(pullY, isRefreshing ? 60 : 0)}px` }}
      >
        <div className="flex items-center justify-center h-full">
          {isRefreshing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <RefreshCw size={24} color={loadingColor} />
            </motion.div>
          ) : (
            <RefreshCw
              size={24}
              color={loadingColor}
              style={{
                opacity: pullY / pullDistance,
                transform: `rotate(${(pullY / pullDistance) * 180}deg)`,
              }}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ transform: `translateY(${pullY}px)` }}>{children}</div>
    </div>
  )
}
