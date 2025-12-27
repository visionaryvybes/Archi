'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, X, Clock, Zap, DollarSign, Sparkles, RefreshCw, Image } from 'lucide-react'

interface ComparisonItemProps {
  icon: React.ReactNode
  text: string
  isPositive: boolean
  delay: number
}

function ComparisonItem({ icon, text, isPositive, delay }: ComparisonItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
        isPositive
          ? 'bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40'
          : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
      }`}
      initial={{ opacity: 0, x: isPositive ? 30 : -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
          isPositive
            ? 'bg-gradient-to-br from-emerald-500 to-cyan-500'
            : 'bg-slate-800'
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-sm md:text-base ${
          isPositive ? 'text-white' : 'text-slate-400'
        }`}
      >
        {text}
      </span>
      <div className="ml-auto flex-shrink-0">
        {isPositive ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: delay + 0.3, type: 'spring', stiffness: 500 }}
          >
            <Check className="w-5 h-5 text-emerald-400" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: delay + 0.3, type: 'spring', stiffness: 500 }}
          >
            <X className="w-5 h-5 text-slate-600" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

const traditionalWay = [
  { icon: <Clock className="w-5 h-5 text-slate-400" />, text: 'Hours to days for a single render' },
  { icon: <DollarSign className="w-5 h-5 text-slate-400" />, text: 'Expensive professional software' },
  { icon: <RefreshCw className="w-5 h-5 text-slate-400" />, text: 'Complex revisions and iterations' },
  { icon: <Image className="w-5 h-5 text-slate-400" />, text: 'Limited style variations' },
]

const visionaryWay = [
  { icon: <Zap className="w-5 h-5 text-white" />, text: 'Photorealistic results in 30 seconds' },
  { icon: <Sparkles className="w-5 h-5 text-white" />, text: 'No design experience required' },
  { icon: <RefreshCw className="w-5 h-5 text-white" />, text: 'Unlimited instant variations' },
  { icon: <Image className="w-5 h-5 text-white" />, text: '50+ curated design styles' },
]

export function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950/50 to-black" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            className="inline-block text-sm font-mono text-emerald-400 mb-4 tracking-wider uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            The Problem We Solve
          </motion.span>

          <motion.h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Stop waiting for renders.{' '}
            <span className="gradient-text">Start designing.</span>
          </motion.h2>

          <motion.p
            className="text-slate-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Traditional rendering is slow, expensive, and frustrating.
            We built something better.
          </motion.p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Traditional Way */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Desaturated overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-950/50 rounded-2xl" />

            <div className="relative p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-slate-600" />
                <h3 className="text-lg font-semibold text-slate-400 font-display">
                  Traditional Way
                </h3>
              </div>

              <div className="space-y-4">
                {traditionalWay.map((item, index) => (
                  <ComparisonItem
                    key={index}
                    icon={item.icon}
                    text={item.text}
                    isPositive={false}
                    delay={0.4 + index * 0.1}
                  />
                ))}
              </div>

              {/* Pain point callout */}
              <motion.div
                className="mt-6 p-4 rounded-lg bg-red-500/5 border border-red-500/10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9 }}
              >
                <p className="text-sm text-red-400/80">
                  Average project delay:{' '}
                  <span className="font-semibold text-red-400">2-3 weeks</span>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Visionary Studio Way */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Gradient glow effect */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-blue-500/20 blur-sm" />

            <div className="relative p-6 md:p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.03] to-cyan-500/[0.03]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                <h3 className="text-lg font-semibold text-white font-display">
                  Visionary Studio
                </h3>
                <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI-Powered
                </span>
              </div>

              <div className="space-y-4">
                {visionaryWay.map((item, index) => (
                  <ComparisonItem
                    key={index}
                    icon={item.icon}
                    text={item.text}
                    isPositive={true}
                    delay={0.4 + index * 0.1}
                  />
                ))}
              </div>

              {/* Success callout */}
              <motion.div
                className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9 }}
              >
                <p className="text-sm text-emerald-400/80">
                  Average time saved per project:{' '}
                  <span className="font-semibold text-emerald-400">40+ hours</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <p className="text-slate-400 mb-4">
            Ready to transform your workflow?
          </p>
          <button className="btn-gradient-border group">
            <span className="flex items-center gap-2">
              Start Creating for Free
              <Zap className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default ProblemSolution
