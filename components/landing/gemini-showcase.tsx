'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Layers, MessageSquare, Palette, Zap, Shield, Maximize2 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Renders in under 30 seconds',
    description: 'Upload → style → render. No waiting in queues, no GPU setup, no complex software. Just fast, photorealistic results every time.',
    image: '/images/landing/feature-speed.jpg',
    imageAlt: 'Before and after room transformation',
  },
  {
    icon: Palette,
    title: '55+ curated design styles',
    description: 'Modern, Scandinavian, Industrial, Japandi, Art Deco, Bohemian, and dozens more. Each style trained on thousands of real interior photos.',
    image: '/images/landing/feature-styles.jpg',
    imageAlt: 'Grid of different interior design styles',
  },
  {
    icon: MessageSquare,
    title: 'Edit with natural language',
    description: '"Make it warmer." "Remove the rug." "Add a fireplace." Refine any render with plain English — no sliders or controls needed.',
    image: '/images/landing/feature-chat.jpg',
    imageAlt: 'AI-refined interior design',
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
    image: '/images/landing/feature-4k.jpg',
    imageAlt: 'Ultra-detailed material close-up showing 4K quality',
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
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden hover:border-zinc-700 hover:bg-zinc-900/50 transition-all duration-200"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
              >
                {/* Feature image */}
                {feature.image && (
                  <div className="relative aspect-[2/1] overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt || feature.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/80" />
                  </div>
                )}

                <div className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-base font-medium text-zinc-50 mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                  {feature.visual}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default GeminiShowcase
