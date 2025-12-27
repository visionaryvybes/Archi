'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { GripVertical } from 'lucide-react'

interface ComparisonSliderProps {
  beforeImage?: string
  afterImage?: string
  beforeLabel?: string
  afterLabel?: string
  beforeAlt?: string
  afterAlt?: string
  className?: string
  autoPlayDuration?: number
}

export function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforeAlt = 'Before image',
  afterAlt = 'After image',
  className = '',
  autoPlayDuration = 3000,
}: ComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)

  // Motion values for smooth spring-based animation
  const x = useMotionValue(0)
  const springX = useSpring(x, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  })

  // Transform the x position to a percentage for the clip path
  const clipPercentage = useTransform(springX, (val) => {
    if (containerWidth === 0) return 50
    return ((val + containerWidth / 2) / containerWidth) * 100
  })

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Set initial position to center
  useEffect(() => {
    if (containerWidth > 0) {
      x.set(0) // Center position
    }
  }, [containerWidth, x])

  // Auto-play animation on mount
  useEffect(() => {
    if (containerWidth > 0 && !hasAutoPlayed) {
      const maxOffset = containerWidth / 2 - 20

      // Start from left
      x.set(-maxOffset)

      // Animate to right over the duration
      const timeout = setTimeout(() => {
        x.set(maxOffset)
      }, 100)

      // Then return to center
      const returnTimeout = setTimeout(() => {
        x.set(0)
        setHasAutoPlayed(true)
      }, autoPlayDuration + 100)

      return () => {
        clearTimeout(timeout)
        clearTimeout(returnTimeout)
      }
    }
  }, [containerWidth, hasAutoPlayed, autoPlayDuration, x])

  const handleDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const mouseX = event.clientX
      const offset = mouseX - centerX
      const maxOffset = containerWidth / 2 - 20

      // Clamp the value
      const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, offset))
      x.set(clampedOffset)
    },
    [isDragging, containerWidth, x]
  )

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
    ;(event.target as HTMLDivElement).setPointerCapture(event.pointerId)
  }, [])

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false)
    ;(event.target as HTMLDivElement).releasePointerCapture(event.pointerId)
  }, [])

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isDragging) {
        handleDrag(event)
      }
    },
    [isDragging, handleDrag]
  )

  // Click anywhere to move slider
  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || isDragging) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const mouseX = event.clientX
      const offset = mouseX - centerX
      const maxOffset = containerWidth / 2 - 20

      const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, offset))
      x.set(clampedOffset)
    },
    [containerWidth, isDragging, x]
  )

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-4-3 overflow-hidden rounded-2xl cursor-ew-resize select-none ${className}`}
      onClick={handleContainerClick}
    >
      {/* Before Image (Full width, visible on the right side) */}
      <div className="absolute inset-0">
        {beforeImage ? (
          <img
            src={beforeImage}
            alt={beforeAlt}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-xl bg-slate-800 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-dashed border-slate-600 rounded-lg" />
              </div>
              <span className="text-slate-500 font-mono text-sm">Before Image</span>
            </div>
          </div>
        )}
      </div>

      {/* After Image (Clipped) */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: useTransform(clipPercentage, (p) => `inset(0 ${100 - p}% 0 0)`),
        }}
      >
        {afterImage ? (
          <img
            src={afterImage}
            alt={afterAlt}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-950/50 via-cyan-950/50 to-blue-950/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-emerald-500/30">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-500/40 to-cyan-500/40" />
              </div>
              <span className="text-emerald-400 font-mono text-sm">After Image</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Slider Handle */}
      <motion.div
        className="absolute top-0 bottom-0 z-10"
        style={{ x: springX, left: '50%', marginLeft: '-2px' }}
      >
        <div className="relative w-1 h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]">
          {/* Handle Circle */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center cursor-ew-resize touch-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerCancel={handlePointerUp}
          >
            <GripVertical className="w-5 h-5 text-slate-800" />
          </div>
        </div>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-4 left-4 z-20">
        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/60 backdrop-blur-sm text-white border border-white/10">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-4 right-4 z-20">
        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 backdrop-blur-sm text-white">
          {afterLabel}
        </span>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  )
}

export default ComparisonSlider
