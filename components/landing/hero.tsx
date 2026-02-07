'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const HeroPlayer = dynamic(
  () => import('@/components/remotion/HeroPlayer').then((mod) => mod.HeroPlayer),
  { ssr: false, loading: () => <div className="w-full aspect-[16/9] md:aspect-[2.2/1] rounded-xl bg-zinc-900 border border-zinc-800" /> }
)

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="max-w-5xl mx-auto px-6">
        {/* Content */}
        <div className="max-w-3xl">
          <motion.p
            className="text-sm font-medium text-violet-400 mb-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            AI-powered interior design
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.08] text-zinc-50 mb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Transform any room
            <br />
            <span className="text-zinc-500">in seconds.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-zinc-400 max-w-xl mb-8 leading-relaxed"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Upload a photo, pick a style, and get a photorealistic render.
            55+ design styles, conversational editing, and instant results.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-950 bg-zinc-50 hover:bg-white px-5 py-2.5 rounded-lg transition-colors duration-150"
            >
              Open Studio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="text-sm text-zinc-400 hover:text-zinc-50 px-4 py-2.5 transition-colors duration-150"
            >
              Learn more
            </Link>
          </motion.div>
        </div>

        {/* Product Preview */}
        <motion.div
          className="mt-16 md:mt-24"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
        >
          <HeroPlayer />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
