'use client'

import { motion } from 'framer-motion'

const useCaseBadges = [
  'Interior Designers',
  'Architects',
  'Real Estate Agents',
  'Home Stagers',
  'Property Developers',
]

export function TrustBar() {
  return (
    <section className="relative py-16 overflow-hidden border-t border-b border-white/5">
      <div className="relative z-10">
        {/* Heading */}
        <motion.p
          className="text-center text-sm text-slate-400 uppercase tracking-widest mb-10 font-medium"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Built for professionals who design spaces
        </motion.p>

        {/* Use case badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {useCaseBadges.map((badge) => (
            <div
              key={badge}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-slate-300 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-300"
            >
              {badge}
            </div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-white/5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold font-display gradient-text">1,200+</p>
            <p className="text-sm text-slate-500 mt-1">Renders Created</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold font-display gradient-text">500+</p>
            <p className="text-sm text-slate-500 mt-1">Active Designers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold font-display gradient-text">4.9</p>
            <p className="text-sm text-slate-500 mt-1">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold font-display gradient-text">30s</p>
            <p className="text-sm text-slate-500 mt-1">Avg. Render Time</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TrustBar
