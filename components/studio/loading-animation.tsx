'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingAnimationProps {
  elapsedTime: number
  estimatedRemaining: number
}

export function LoadingAnimation({ elapsedTime, estimatedRemaining }: LoadingAnimationProps) {
  const [phase, setPhase] = useState('INITIALIZING RENDER ENGINE')

  useEffect(() => {
    if (elapsedTime < 3) setPhase('INITIALIZING RENDER ENGINE')
    else if (elapsedTime < 10) setPhase('SIMULATING GLOBAL ILLUMINATION')
    else if (elapsedTime < 20) setPhase('GENERATING TEXTURES')
    else setPhase('FINALIZING OUTPUT')
  }, [elapsedTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      {/* Wireframe Cube */}
      <div className="relative w-64 h-64" style={{ perspective: '1000px' }}>
        <motion.div
          className="absolute inset-0"
          animate={{ rotateY: 360, rotateX: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Diamond/Cube wireframe */}
            <motion.g stroke="url(#cubeGradient)" strokeWidth="2" fill="none" opacity="0.6">
              {/* Front diamond */}
              <path d="M 100 50 L 150 100 L 100 150 L 50 100 Z" />
              {/* Back diamond */}
              <path d="M 100 30 L 170 100 L 100 170 L 30 100 Z" opacity="0.3" />
              {/* Connecting lines */}
              <line x1="100" y1="50" x2="100" y2="30" />
              <line x1="150" y1="100" x2="170" y2="100" />
              <line x1="100" y1="150" x2="100" y2="170" />
              <line x1="50" y1="100" x2="30" y2="100" />
            </motion.g>
            {/* Center dot */}
            <motion.circle
              cx="100"
              cy="100"
              r="4"
              fill="#06b6d4"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-2xl font-black uppercase tracking-wider text-white">
            VISUALIZING SPACE
          </h2>
          <motion.div
            className="w-2 h-2 rounded-full bg-cyan-500"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <p className="text-sm font-mono uppercase tracking-[0.3em] text-gray-500 shimmer-text">
          {phase}...
        </p>
      </div>

      {/* Timers */}
      <div className="flex items-center gap-16">
        <div className="text-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">
            ELAPSED TIME
          </div>
          <div className="text-3xl font-mono font-bold text-cyan-400">
            {formatTime(elapsedTime)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">
            EST. REMAINING
          </div>
          <div className="text-3xl font-mono font-bold text-emerald-400">
            ~{formatTime(estimatedRemaining)}
          </div>
        </div>
      </div>
    </div>
  )
}
