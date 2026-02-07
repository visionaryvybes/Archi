'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Upload your room',
    description: 'Take a photo of any room — empty or furnished. Our AI understands spatial layout, lighting, and architectural features.',
  },
  {
    number: '02',
    title: 'Choose a style',
    description: 'Pick from 55+ curated design styles. Or describe exactly what you want and let the AI interpret your vision.',
  },
  {
    number: '03',
    title: 'Get your render',
    description: 'In under 30 seconds, receive a photorealistic render. Refine it with conversational editing or download in 4K.',
  },
]

export function ModesShowcase() {
  return (
    <section className="py-24 md:py-32 border-t border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <p className="text-sm font-medium text-violet-400 mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50">
            Three steps to a new room
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
            >
              <span className="text-6xl md:text-7xl font-bold text-zinc-800/80 leading-none mb-4 block">
                {step.number}
              </span>
              <h3 className="text-lg font-medium text-zinc-50 mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ModesShowcase
