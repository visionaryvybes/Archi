'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import { ComparisonSlider } from '@/components/ui/comparison-slider'

const headlineWords = ['Professional', 'Interior', 'Renders', 'in', '30', 'Seconds']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
}

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
    >
      {/* Animated Mesh Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-mesh-gradient opacity-60"
        style={{ y: backgroundY }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-emerald-500/10 blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 left-1/3 w-1/3 h-1/3 rounded-full bg-blue-500/10 blur-[100px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Grain texture overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Main Content */}
      <motion.div
        className="relative z-10 h-screen flex items-center"
        style={{ opacity: contentOpacity }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-8 items-center">
            {/* Left Content - 40% */}
            <div className="lg:col-span-4 space-y-8">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="shimmer-text text-sm font-medium font-mono">
                    Powered by Nano Banana Pro
                  </span>
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="font-display text-5xl md:text-6xl lg:text-[64px] font-bold leading-[1.1] tracking-tight"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {headlineWords.map((word, index) => (
                  <motion.span
                    key={index}
                    variants={wordVariants}
                    className={`inline-block mr-[0.25em] ${
                      index >= 4 ? 'gradient-text' : 'text-white'
                    }`}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg md:text-xl text-slate-400 max-w-md leading-relaxed"
                variants={fadeInUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              >
                Transform empty rooms into stunning, photorealistic interiors with AI.
                55+ styles, 8 AI modes, and conversational editing — powered by Nano Banana Pro.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-wrap items-center gap-4"
                variants={fadeInUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1 }}
              >
                <button className="btn-gradient-border group">
                  <span className="flex items-center gap-2">
                    Try Free Now
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>

                <button className="flex items-center gap-2 px-4 py-3 text-white/80 hover:text-white transition-colors group">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 group-hover:border-white/40 transition-colors">
                    <Play className="w-4 h-4 ml-0.5" />
                  </span>
                  <span className="font-medium">Watch Demo</span>
                </button>
              </motion.div>

              {/* Trust Line */}
              <motion.div
                className="flex items-center gap-3 text-sm text-slate-500"
                variants={fadeInUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.2 }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  10,000+ renders created
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>No credit card required</span>
              </motion.div>
            </div>

            {/* Right Visual - 60% */}
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              <div className="relative">
                {/* Glow effect behind slider */}
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-50" />

                {/* Comparison Slider */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <ComparisonSlider
                    beforeLabel="Empty Room"
                    afterLabel="AI Rendered"
                    autoPlayDuration={3000}
                  />
                </div>

                {/* Floating Stats Card */}
                <motion.div
                  className="absolute -bottom-6 -left-6 glass rounded-xl px-5 py-4 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-display text-white">30s</p>
                      <p className="text-xs text-slate-400">Average render time</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Quality Badge */}
                <motion.div
                  className="absolute -top-4 -right-4 glass rounded-xl px-4 py-3 border border-white/10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">4K Quality</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-white/60"
            animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
