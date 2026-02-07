'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'How does the AI interior design work?',
    a: 'Upload a room photo — the AI analyzes spatial layout, lighting, and architecture, then generates a photorealistic render in your chosen style. The entire process takes about 30 seconds.',
  },
  {
    q: 'Can I use this for commercial projects?',
    a: 'Yes. Pro and Enterprise plans include commercial usage rights for client presentations, marketing materials, and portfolio work.',
  },
  {
    q: 'What resolution are the outputs?',
    a: 'Free plan produces 1024×1024. Pro plan outputs up to 4096×4096 (4K), suitable for print and high-resolution displays.',
  },
  {
    q: 'Is my data private?',
    a: 'All uploads are encrypted in transit and at rest. Images are auto-deleted after 24 hours unless saved to your library. We are GDPR and CCPA compliant.',
  },
  {
    q: 'What happens when I hit my free limit?',
    a: 'You can upgrade to Pro for unlimited renders, or wait for the next billing cycle. Pro has no hidden caps or throttling.',
  },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="border-b border-zinc-800/50 last:border-0"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base font-medium text-zinc-200 group-hover:text-zinc-50 transition-colors pr-4">
          {q}
        </span>
        <svg
          className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-zinc-500 leading-relaxed max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  return (
    <section className="py-24 md:py-32 border-t border-zinc-800/50" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <p className="text-sm font-medium text-violet-400 mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50">
            Common questions
          </h2>
        </motion.div>

        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
