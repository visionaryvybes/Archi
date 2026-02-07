'use client'

import { motion } from 'framer-motion'
import { Upload, Palette, Sparkles } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload your room',
    description: 'Take a photo of any room — empty or furnished. Our AI understands spatial layout, lighting, and architectural features automatically.',
    visual: (
      <div className="mt-5 aspect-[4/3] rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-2">
          <Upload className="w-5 h-5 text-zinc-500" />
        </div>
        <p className="text-xs text-zinc-600">Drop room photo here</p>
        <p className="text-[10px] text-zinc-700 mt-1">JPG, PNG up to 10MB</p>
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
          { name: 'Modern', color: 'from-zinc-600 to-zinc-800' },
          { name: 'Scandi', color: 'from-stone-300 to-stone-500' },
          { name: 'Industrial', color: 'from-amber-700 to-stone-800' },
          { name: 'Japandi', color: 'from-stone-400 to-neutral-600' },
          { name: 'Art Deco', color: 'from-yellow-600 to-amber-800' },
          { name: 'Coastal', color: 'from-sky-400 to-blue-600' },
        ].map((s) => (
          <div key={s.name} className={`aspect-[3/2] rounded-md bg-gradient-to-br ${s.color} flex items-end p-1.5`}>
            <span className="text-[9px] text-white/80 font-medium">{s.name}</span>
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
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
        {/* Mini rendered room */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-[#1c1917]" />
        <div className="absolute top-[15%] left-[25%] w-[50%] h-[35%] border border-violet-500/20 rounded-sm bg-violet-500/5" />
        <div className="absolute bottom-[40%] left-[20%] w-[30%] h-[15%] rounded bg-zinc-700" />
        <div className="absolute bottom-[40%] right-[18%] w-[15%] h-[10%] rounded-full bg-zinc-700/80" />
        <div className="absolute top-2 right-2 px-2 py-1 rounded text-[9px] bg-violet-500/20 text-violet-300 border border-violet-500/30">
          4K Ready
        </div>
        <div className="absolute bottom-2 left-2 text-[9px] text-zinc-500">
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
