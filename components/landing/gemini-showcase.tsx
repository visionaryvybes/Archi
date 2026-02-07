'use client'

import { motion } from 'framer-motion'
import { Layers, MessageSquare, Palette, Zap, Shield, Maximize2 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Renders in under 30 seconds',
    description: 'Upload → style → render. No waiting in queues, no GPU setup, no complex software. Just fast, photorealistic results every time.',
    visual: (
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            initial={{ width: '0%' }}
            whileInView={{ width: '90%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-zinc-500 tabular-nums">~28s</span>
      </div>
    ),
  },
  {
    icon: Palette,
    title: '55+ curated design styles',
    description: 'Modern, Scandinavian, Industrial, Japandi, Art Deco, Bohemian, and dozens more. Each style trained on thousands of real interior photos.',
    visual: (
      <div className="mt-4 flex gap-1.5">
        {['#a78bfa', '#f59e0b', '#06b6d4', '#10b981', '#ef4444', '#ec4899'].map((c) => (
          <div key={c} className="w-6 h-6 rounded-md" style={{ background: c, opacity: 0.7 }} />
        ))}
        <div className="w-6 h-6 rounded-md border border-zinc-700 flex items-center justify-center text-[9px] text-zinc-500">
          +49
        </div>
      </div>
    ),
  },
  {
    icon: MessageSquare,
    title: 'Edit with natural language',
    description: '"Make it warmer." "Remove the rug." "Add a fireplace." Refine any render with plain English — no sliders or controls needed.',
    visual: (
      <div className="mt-4 space-y-2">
        <div className="inline-block px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-400">
          &ldquo;Make the sofa darker&rdquo;
        </div>
        <div className="inline-block px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">
          Updated — sofa color adjusted
        </div>
      </div>
    ),
  },
  {
    icon: Layers,
    title: '8 AI generation modes',
    description: 'Text-to-image, image-to-image, inpaint, outpaint, sketch-to-render, style transfer, upscale, and edit mode. One tool for everything.',
    visual: (
      <div className="mt-4 flex flex-wrap gap-1.5">
        {['Text→Image', 'Img→Img', 'Inpaint', 'Outpaint', 'Sketch', 'Style', 'Upscale', 'Edit'].map((m) => (
          <span key={m} className="px-2 py-1 rounded text-[10px] text-zinc-500 border border-zinc-800 bg-zinc-900/50">
            {m}
          </span>
        ))}
      </div>
    ),
  },
  {
    icon: Maximize2,
    title: 'Up to 4K resolution',
    description: 'Print-ready 4096×4096 output. Perfect for client presentations, portfolios, and marketing materials that need to look sharp at any size.',
    visual: (
      <div className="mt-4 flex items-center gap-3">
        {[
          { label: '1K', active: false },
          { label: '2K', active: false },
          { label: '4K', active: true },
        ].map((r) => (
          <div
            key={r.label}
            className={`px-3 py-1.5 rounded-md text-xs font-medium ${
              r.active
                ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30'
                : 'text-zinc-600 border border-zinc-800'
            }`}
          >
            {r.label}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Shield,
    title: 'Private and secure',
    description: 'All uploads encrypted in transit and at rest. Auto-deleted after 24 hours. GDPR and CCPA compliant. Your designs stay yours.',
    visual: (
      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-600">
        {['GDPR', 'CCPA', 'E2E Encrypted'].map((item) => (
          <span key={item} className="flex items-center gap-1">
            <svg className="w-3 h-3 text-violet-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </span>
        ))}
      </div>
    ),
  },
]

export function GeminiShowcase() {
  return (
    <section className="py-20 md:py-28 border-t border-zinc-800/50" id="features">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <p className="text-sm font-medium text-violet-400 mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-50 mb-4">
            Professional interior renders,<br className="hidden md:block" /> without the professional software
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Everything interior designers, architects, real estate agents, and homeowners
            need to visualize spaces — powered by AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all duration-200"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-base font-medium text-zinc-50 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                {feature.visual}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default GeminiShowcase
