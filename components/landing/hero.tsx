'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

export function Hero() {
  return (
    <section className="relative pt-28 pb-8 md:pt-36 md:pb-16 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-8"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-sm">
            <div className="flex -space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-zinc-400">Trusted by 500+ interior designers</span>
          </div>
        </motion.div>

        {/* Headline — centered */}
        <motion.h1
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08] text-zinc-50 mb-6 max-w-4xl mx-auto"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Turn any room into a{' '}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            stunning design
          </span>
          {' '}in 30 seconds
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-center text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Upload a photo of any room. Choose from 55+ design styles. Get a photorealistic
          render instantly — no design skills needed.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 text-base font-medium text-zinc-950 bg-zinc-50 hover:bg-white px-7 py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)]"
          >
            Try it free — no signup
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#demo"
            className="inline-flex items-center gap-2 text-base text-zinc-400 hover:text-zinc-50 px-5 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors duration-200"
          >
            See before &amp; after examples
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="text-center text-sm text-zinc-600 mb-14"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          No credit card required · Works in any browser · Results in &lt;30s
        </motion.p>

        {/* Hero visual — Image showcase */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* Glow behind the image */}
          <div className="absolute -inset-4 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50 aspect-[16/10]">
            <Image
              src="/images/landing/hero-showcase.jpg"
              alt="Room design transformation - before and after"
              fill
              objectFit="cover"
              priority
            />

            {/* Gradient overlay at bottom for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

            {/* Labels overlay */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 text-xs text-zinc-400">
              Before — Empty room
            </div>
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-violet-500/20 backdrop-blur-sm border border-violet-500/30 text-xs text-violet-300">
              After — AI rendered
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
