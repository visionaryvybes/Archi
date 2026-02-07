'use client'

import { motion } from 'framer-motion'
import { Upload, Palette, Sparkles } from 'lucide-react'
import Image from 'next/image'

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload your room',
    description: 'Take a photo of any room — empty or furnished. Our AI understands spatial layout, lighting, and architectural features automatically.',
    visual: (
      <div className="mt-5 aspect-[4/3] rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 relative overflow-hidden">
        <Image
          src="/images/landing/before-empty.jpg"
          alt="Empty room upload preview"
          fill
          className="object-cover"
          quality={85}
          priority={false}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    ),
  },
  {
    number: '02',
    icon: Palette,
    title: 'Choose a style',
    description: 'Pick from 55+ curated design styles or describe exactly what you want. Mix styles, set the mood, adjust every detail.',
    visual: (
      <div className="mt-5 grid grid-cols-3 gap-1.5">
        {[
          { name: 'Coastal', src: '/images/landing/style-coastal.jpg' },
          { name: 'Art Deco', src: '/images/landing/style-artdeco.jpg' },
          { name: 'Mid-Century', src: '/images/landing/style-midcentury.jpg' },
          { name: 'Bohemian', src: '/images/landing/style-bohemian.jpg' },
          { name: 'Luxury', src: '/images/landing/style-luxury.jpg' },
          { name: 'Rustic', src: '/images/landing/style-rustic.jpg' },
        ].map((s) => (
          <div key={s.name} className="relative aspect-square rounded-md overflow-hidden border border-zinc-700 hover:border-violet-500/50 transition-colors">
            <Image
              src={s.src}
              alt={`${s.name} style thumbnail`}
              fill
              className="object-cover"
              quality={75}
              sizes="(max-width: 768px) 100px, 120px"
            />
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Get your render',
    description: 'In under 30 seconds, receive a photorealistic render. Download in 4K, refine with chat, or try another style instantly.',
    visual: (
      <div className="mt-5 aspect-[4/3] rounded-lg overflow-hidden border border-violet-500/20 relative">
        <Image
          src="/images/landing/after-modern.jpg"
          alt="Rendered room result"
          fill
          className="object-cover"
          quality={85}
          priority={false}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-2 right-2 px-2 py-1 rounded text-[9px] bg-violet-500/20 text-violet-300 border border-violet-500/30">
          4K Ready
        </div>
        <div className="absolute bottom-2 left-2 text-[9px] text-zinc-200 drop-shadow-lg">
          Modern Minimalist · 28s
        </div>
      </div>
    ),
  },
]

export function ModesShowcase() {
  return (
    <section className="py-20 md:py-28 border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <p className="text-sm font-medium text-violet-400 mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-50 mb-4">
            Three steps. One stunning room.
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            No design degree required. No complex software to learn. Just upload, pick a style, and let AI do the rest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-mono text-violet-400/60">{step.number}</span>
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-violet-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-zinc-50 mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                {step.visual}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ModesShowcase
