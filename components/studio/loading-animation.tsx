'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingAnimationProps {
  elapsedTime: number
  estimatedRemaining: number
}

const colors = {
  gold: '#D4AF37',
  goldMedium: '#C1A746',
  parchment: '#FAF7F2',
}

const phases = [
  'Analyzing composition...',
  'Applying aesthetic principles...',
  'Rendering materials & textures...',
  'Finalizing craftsmanship...'
]

export function LoadingAnimation({ elapsedTime, estimatedRemaining }: LoadingAnimationProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (elapsedTime < 5) setPhase(0)
    else if (elapsedTime < 15) setPhase(1)
    else if (elapsedTime < 30) setPhase(2)
    else setPhase(3)
  }, [elapsedTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = Math.min((elapsedTime / (elapsedTime + estimatedRemaining)) * 100, 95)

  return (
    <div className="flex flex-col items-center justify-center space-y-12 p-12">
      {/* Circular Progress - Material Design 3 Style */}
      <div className="relative w-48 h-48">
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(250, 247, 242, 0.1)"
            strokeWidth="4"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={`url(#goldGradient)`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={264}
            initial={{ strokeDashoffset: 264 }}
            animate={{ strokeDashoffset: 264 - (264 * progress) / 100 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.gold} />
              <stop offset="100%" stopColor={colors.goldMedium} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-light"
            style={{ fontFamily: 'var(--font-playfair)', color: colors.parchment }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-4">
        <h2
          className="text-2xl tracking-wide"
          style={{ fontFamily: 'var(--font-playfair)', color: colors.parchment }}
        >
          Crafting Your Vision
        </h2>
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm"
          style={{ fontFamily: 'var(--font-crimson)', color: colors.gold }}
        >
          {phases[phase]}
        </motion.p>
      </div>

      {/* Time Display */}
      <div className="flex items-center gap-12">
        <div className="text-center">
          <div
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: 'rgba(250, 247, 242, 0.4)', fontFamily: 'var(--font-crimson)' }}
          >
            Elapsed
          </div>
          <div
            className="text-2xl font-light"
            style={{ fontFamily: 'var(--font-playfair)', color: colors.parchment }}
          >
            {formatTime(elapsedTime)}
          </div>
        </div>
        <div
          className="w-px h-12"
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
        />
        <div className="text-center">
          <div
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: 'rgba(250, 247, 242, 0.4)', fontFamily: 'var(--font-crimson)' }}
          >
            Remaining
          </div>
          <div
            className="text-2xl font-light"
            style={{ fontFamily: 'var(--font-playfair)', color: colors.gold }}
          >
            ~{formatTime(estimatedRemaining)}
          </div>
        </div>
      </div>

      {/* Phase Indicators */}
      <div className="flex items-center gap-3">
        {phases.map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: i <= phase ? colors.gold : 'rgba(250, 247, 242, 0.2)'
            }}
            animate={{
              scale: i === phase ? [1, 1.3, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: i === phase ? Infinity : 0
            }}
          />
        ))}
      </div>
    </div>
  )
}
