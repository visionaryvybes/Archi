'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 border-t border-zinc-800/50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-50 mb-5">
            Ready to transform your first room?
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of interior designers, architects, and homeowners who use
            Visionary Studio to bring their vision to life — in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 text-base font-medium text-zinc-950 bg-zinc-50 hover:bg-white px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)]"
            >
              Start designing for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 text-base text-zinc-400 hover:text-zinc-50 px-5 py-3.5 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors duration-200"
            >
              View pricing
            </Link>
          </div>

          <p className="text-sm text-zinc-600">
            No credit card required · 5 free renders included · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCTA
