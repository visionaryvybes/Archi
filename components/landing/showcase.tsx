'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// CSS-generated room visuals for before/after
const transformations = [
  {
    name: 'Modern Minimalist',
    room: 'Living Room',
    before: { wall: '#292524', floor: '#1c1917', accent: '#44403c' },
    after: { wall: '#1a1a2e', floor: '#1c1917', accent: '#a78bfa', furniture: '#374151', rug: 'rgba(167,139,250,0.08)' },
  },
  {
    name: 'Scandinavian',
    room: 'Bedroom',
    before: { wall: '#292524', floor: '#1c1917', accent: '#44403c' },
    after: { wall: '#fafaf9', floor: '#d6d3d1', accent: '#92400e', furniture: '#f5f5f4', rug: 'rgba(146,64,14,0.08)' },
  },
  {
    name: 'Industrial Loft',
    room: 'Kitchen',
    before: { wall: '#292524', floor: '#1c1917', accent: '#44403c' },
    after: { wall: '#1c1917', floor: '#292524', accent: '#f59e0b', furniture: '#78716c', rug: 'rgba(245,158,11,0.08)' },
  },
  {
    name: 'Japandi',
    room: 'Study',
    before: { wall: '#292524', floor: '#1c1917', accent: '#44403c' },
    after: { wall: '#1a1a1a', floor: '#292524', accent: '#84cc16', furniture: '#44403c', rug: 'rgba(132,204,22,0.08)' },
  },
]

function RoomVisual({ colors, isAfter }: { colors: typeof transformations[0]['before'] | typeof transformations[0]['after']; isAfter: boolean }) {
  const after = isAfter ? (colors as typeof transformations[0]['after']) : null
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: colors.wall }}>
      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{ background: colors.floor }} />

      {/* Window */}
      <div
        className="absolute top-[15%] left-[30%] w-[40%] h-[35%] rounded-sm"
        style={{
          border: `2px solid ${colors.accent}`,
          background: isAfter ? 'linear-gradient(180deg, rgba(167,139,250,0.05) 0%, rgba(139,92,246,0.02) 100%)' : 'transparent',
        }}
      >
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] p-[2px]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-[1px]" style={{
              background: isAfter
                ? `linear-gradient(${135 + i * 45}deg, rgba(167,139,250,0.06), transparent)`
                : 'rgba(255,255,255,0.02)',
            }} />
          ))}
        </div>
      </div>

      {/* Furniture (only in after) */}
      {after && (
        <>
          {/* Sofa */}
          <div
            className="absolute bottom-[35%] left-[15%] w-[35%] h-[18%] rounded-lg"
            style={{ background: after.furniture, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          >
            <div
              className="absolute -top-[25%] left-1 right-1 h-[30%] rounded-t-lg"
              style={{ background: after.furniture, filter: 'brightness(1.2)' }}
            />
          </div>

          {/* Table */}
          <div
            className="absolute bottom-[35%] right-[15%] w-[18%] h-[12%] rounded-full"
            style={{ background: after.furniture, filter: 'brightness(0.8)', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
          />

          {/* Plant */}
          <div className="absolute bottom-[47%] right-[20%] w-4 h-4 rounded-full" style={{ background: '#059669' }} />
          <div className="absolute bottom-[35%] right-[21%] w-1 h-3" style={{ background: '#78716c' }} />

          {/* Rug */}
          <div
            className="absolute bottom-[10%] left-[12%] w-[40%] h-[15%] rounded-md"
            style={{ background: after.rug, border: `1px solid ${after.accent}20` }}
          />

          {/* Lamp */}
          <div className="absolute top-[20%] right-[25%]">
            <div className="w-3 h-3 rounded-full" style={{ background: after.accent, opacity: 0.6, boxShadow: `0 0 20px ${after.accent}40` }} />
            <div className="w-[1px] h-6 mx-auto" style={{ background: after.furniture }} />
          </div>
        </>
      )}

      {/* Empty room indicators (before only) */}
      {!isAfter && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center opacity-30">
            <svg className="w-8 h-8 mx-auto mb-2 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 16l5-5 4 4 4-6 5 5" />
            </svg>
            <p className="text-xs text-zinc-600">Empty room</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function Showcase() {
  const [active, setActive] = useState(0)
  const current = transformations[active]

  return (
    <section className="py-20 md:py-28" id="demo">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-50 mb-4">
            See the transformation
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Watch empty rooms become beautifully designed spaces. Every render is AI-generated
            from a single photo in under 30 seconds.
          </p>
        </motion.div>

        {/* Style selector tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {transformations.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className={`text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                active === i
                  ? 'bg-violet-500/10 text-violet-300 border border-violet-500/30'
                  : 'text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Before / After display */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Before */}
          <div className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-[4/3]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`before-${active}`}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RoomVisual colors={current.before} isAfter={false} />
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 text-xs text-zinc-400">
              Before
            </div>
            <div className="absolute bottom-3 left-3 text-xs text-zinc-600">
              {current.room} · Original photo
            </div>
          </div>

          {/* After */}
          <div className="relative rounded-xl overflow-hidden border border-violet-500/20 aspect-[4/3]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`after-${active}`}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RoomVisual colors={current.after} isAfter={true} />
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-3 right-3 px-3 py-1 rounded-md bg-violet-500/10 backdrop-blur-sm border border-violet-500/30 text-xs text-violet-300">
              After · AI Rendered
            </div>
            <div className="absolute bottom-3 left-3 text-xs text-zinc-500">
              {current.room} · {current.name} style · 28s render time
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { value: '55+', label: 'Design styles' },
            { value: '<30s', label: 'Avg render time' },
            { value: '4K', label: 'Max resolution' },
            { value: '8', label: 'AI modes' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center py-4 rounded-xl border border-zinc-800 bg-zinc-900/30"
            >
              <p className="text-2xl md:text-3xl font-semibold text-zinc-50 mb-1">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Showcase
