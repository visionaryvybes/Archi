'use client'

import { motion } from 'framer-motion'
import { Building2, Home, Layers, Palette, Sofa, Landmark, Castle, Warehouse, Store, Building, Sparkles, PenTool } from 'lucide-react'

const companies = [
  { name: 'ArchStudio', icon: Building2 },
  { name: 'HomeCraft', icon: Home },
  { name: 'LayerSpace', icon: Layers },
  { name: 'Colorhive', icon: Palette },
  { name: 'Furnish+', icon: Sofa },
  { name: 'Heritage Design', icon: Landmark },
  { name: 'LuxLiving', icon: Castle },
  { name: 'SpaceWorks', icon: Warehouse },
  { name: 'StudioRetail', icon: Store },
  { name: 'MetroDesign', icon: Building },
  { name: 'Visualize', icon: Sparkles },
  { name: 'DesignPen', icon: PenTool },
]

// Duplicate for seamless loop
const allCompanies = [...companies, ...companies]

export function TrustBar() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Glassmorphic background */}
      <div className="absolute inset-0 glass-strong" />

      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10">
        {/* Heading */}
        <motion.p
          className="text-center text-sm text-slate-400 uppercase tracking-widest mb-10 font-medium"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Trusted by designers at
        </motion.p>

        {/* Infinite scroll container */}
        <div className="relative">
          {/* Left fade gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />

          {/* Right fade gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling content */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-16 items-center"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                x: {
                  duration: 40,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            >
              {allCompanies.map((company, index) => {
                const Icon = company.icon
                return (
                  <div
                    key={`${company.name}-${index}`}
                    className="flex-shrink-0 group cursor-default"
                  >
                    <div className="flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-300 hover:bg-white/5">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 transition-all duration-300">
                        <Icon className="w-4 h-4 text-white/50 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <span className="text-white/50 font-medium text-sm whitespace-nowrap group-hover:text-white transition-colors">
                        {company.name}
                      </span>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 pt-8 border-t border-white/5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold font-display gradient-text">10K+</p>
            <p className="text-sm text-slate-500 mt-1">Renders Created</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold font-display gradient-text">2.5K+</p>
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
