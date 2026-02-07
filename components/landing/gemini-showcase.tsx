'use client'

import { motion } from 'framer-motion'
import { Layers, MessageSquare, Palette, Zap, Shield, Maximize2 } from 'lucide-react'

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const features = [
  {
    icon: Zap,
    title: 'Renders in seconds',
    description: 'Upload a room photo and get a photorealistic result in under 30 seconds. No waiting, no queues.',
  },
  {
    icon: Palette,
    title: '55+ design styles',
    description: 'Modern, Scandinavian, Industrial, Japandi, Art Deco — every style you need for any project.',
  },
  {
    icon: MessageSquare,
    title: 'Conversational editing',
    description: 'Refine your renders with natural language. Say "make it warmer" or "remove the rug" and watch it update.',
  },
  {
    icon: Layers,
    title: '8 generation modes',
    description: 'Text-to-image, image-to-image, inpaint, outpaint, sketch-to-render, style transfer, and more.',
  },
  {
    icon: Maximize2,
    title: 'Up to 4K output',
    description: 'High-resolution renders suitable for client presentations, print materials, and portfolios.',
  },
  {
    icon: Shield,
    title: 'Private by default',
    description: 'Your images are encrypted and auto-deleted after 24 hours. GDPR and CCPA compliant.',
  },
]

export function GeminiShowcase() {
  return (
    <section className="py-24 md:py-32" id="features">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="mb-16"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <p className="text-sm font-medium text-violet-400 mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50">
            Everything you need to design spaces
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-800">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="bg-[#09090b] p-8 hover:bg-zinc-900/50 transition-colors duration-200"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
              >
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="text-base font-medium text-zinc-50 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default GeminiShowcase
