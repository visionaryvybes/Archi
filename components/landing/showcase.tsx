'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

// Real AI-generated room visuals for before/after
const transformations = [
  {
    name: 'Modern Minimalist',
    room: 'Living Room',
    beforeImage: '/images/landing/before-empty.jpg',
    afterImage: '/images/landing/after-modern.jpg',
  },
  {
    name: 'Scandinavian',
    room: 'Bedroom',
    beforeImage: '/images/landing/before-empty.jpg',
    afterImage: '/images/landing/after-scandinavian.jpg',
  },
  {
    name: 'Industrial Loft',
    room: 'Kitchen',
    beforeImage: '/images/landing/before-empty.jpg',
    afterImage: '/images/landing/after-industrial.jpg',
  },
  {
    name: 'Japandi',
    room: 'Study',
    beforeImage: '/images/landing/before-empty.jpg',
    afterImage: '/images/landing/after-japandi.jpg',
  },
]

export function Showcase() {
  const [active, setActive] = useState(0)
  const current = transformations[active]

  return (
    <section className="py-20 md:py-28" id="demo">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-50 mb-4">
            See the transformation
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Watch empty rooms become beautifully designed spaces. Every render is AI-generated
            from a single photo in under 30 seconds.
          </p>
        </motion.div>

        {/* Style selector tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {transformations.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className={`text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                active === i
                  ? 'bg-violet-500/10 text-violet-300 border border-violet-500/30'
                  : 'text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Before / After display */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Before */}
          <div className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-[4/3] bg-zinc-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={`before-${active}`}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={current.beforeImage}
                  alt={`Before - ${current.room}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 text-xs text-zinc-400">
              Before
            </div>
            <div className="absolute bottom-3 left-3 text-xs text-zinc-600">
              {current.room} · Original photo
            </div>
          </div>

          {/* After */}
          <div className="relative rounded-xl overflow-hidden border border-violet-500/20 aspect-[4/3] bg-zinc-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={`after-${active}`}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={current.afterImage}
                  alt={`After - ${current.name} - ${current.room}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-3 right-3 px-3 py-1 rounded-md bg-violet-500/10 backdrop-blur-sm border border-violet-500/30 text-xs text-violet-300">
              After · AI Rendered
            </div>
            <div className="absolute bottom-3 left-3 text-xs text-zinc-500">
              {current.room} · {current.name} style · 28s render time
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { value: '55+', label: 'Design styles' },
            { value: '<30s', label: 'Avg render time' },
            { value: '4K', label: 'Max resolution' },
            { value: '8', label: 'AI modes' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center py-4 rounded-xl border border-zinc-800 bg-zinc-900/30"
            >
              <p className="text-2xl md:text-3xl font-semibold text-zinc-50 mb-1">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Showcase
