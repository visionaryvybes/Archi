'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Camera, X, Layers, ChevronRight, ChevronDown,
  Upload, Maximize2, Home, FolderOpen, Sparkles, Image as ImageIcon,
  Grid3X3, Palette, Ruler
} from 'lucide-react'
import { LoadingAnimation } from '@/components/studio/loading-animation'

type AppState = 'idle' | 'loading' | 'success' | 'error'

const RENDER_TYPES = ['Interior Design', '2D/3D Floor Plan', 'Exterior/Architectural', 'Technical Blueprint', 'Landscape/Garden']
const AESTHETICS = ['Modern Minimalist', 'Scandinavian', 'Industrial', 'Bauhaus', 'Brutalist', 'Classic European']
const ROOM_TYPES = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Office', 'Dining Room', 'Home Theater', 'Gym', 'Entryway', 'Outdoor/Patio']

// Digital Craftsman Color Palette
const colors = {
  navy: '#0B1120',
  navyLight: '#111827',
  gold: '#D4AF37',
  goldMedium: '#C1A746',
  goldDark: '#9A7B64',
  parchment: '#FAF7F2',
  parchmentDark: '#F5F0E8',
}

export default function StudioPage() {
  const [activeNav, setActiveNav] = useState('workspace')
  const [state, setState] = useState<AppState>('idle')
  const [prompt, setPrompt] = useState('')
  const [renderType, setRenderType] = useState('Interior Design')
  const [aesthetic, setAesthetic] = useState('Modern Minimalist')
  const [roomType, setRoomType] = useState('Living Room')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [quality, setQuality] = useState('2K HD')
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isEnlarged, setIsEnlarged] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(45)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showRoomType = renderType === 'Interior Design' || renderType === '2D/3D Floor Plan'

  useEffect(() => {
    if (state === 'loading') {
      setElapsedTime(0)
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
        setEstimatedTime(prev => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [state])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setSourceImage(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() && !sourceImage) return

    setState('loading')
    setEstimatedTime(quality === '4K UHD' ? 60 : quality === '2K HD' ? 45 : 30)

    try {
      const imageBase64 = sourceImage?.split(',')[1] || ''
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          renderType,
          aesthetic,
          roomType,
          imageBase64,
          aspectRatio,
          quality
        })
      })

      const data = await response.json()

      if (data.success && data.imageBase64) {
        setGeneratedImage(`data:image/png;base64,${data.imageBase64}`)
        setState('success')
      } else {
        setState('error')
      }
    } catch (error) {
      console.error('Generation error:', error)
      setState('error')
    }
  }

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: colors.navy }}>
      {/* Paper Grain Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation Rail - Material Design 3 (80dp) */}
      <nav
        className="w-20 flex flex-col items-center py-6 border-r shrink-0"
        style={{
          backgroundColor: colors.navy,
          borderColor: 'rgba(212, 175, 55, 0.1)'
        }}
      >
        {/* Logo */}
        <a href="/" className="mb-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldMedium})`,
            }}
          >
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: colors.navy }}>
              V
            </span>
          </div>
        </a>

        {/* Nav Items */}
        <div className="flex flex-col items-center gap-2 flex-grow">
          {[
            { id: 'workspace', icon: Home, label: 'Workspace' },
            { id: 'projects', icon: FolderOpen, label: 'Projects' },
            { id: 'styles', icon: Palette, label: 'Styles' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 group"
              style={{
                backgroundColor: activeNav === item.id ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              }}
            >
              {activeNav === item.id && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute left-0 w-1 h-8 rounded-r-full"
                  style={{ backgroundColor: colors.gold }}
                />
              )}
              <item.icon
                size={22}
                style={{
                  color: activeNav === item.id ? colors.gold : 'rgba(250, 247, 242, 0.4)'
                }}
                className="group-hover:scale-110 transition-transform"
              />
            </button>
          ))}
        </div>

        {/* Settings */}
        <button
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:bg-white/5"
          style={{ color: 'rgba(250, 247, 242, 0.4)' }}
        >
          <Settings size={20} />
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Top App Bar - Material Design 3 (64dp) */}
        <header
          className="h-16 flex items-center justify-between px-8 border-b shrink-0"
          style={{
            backgroundColor: colors.navy,
            borderColor: 'rgba(212, 175, 55, 0.1)'
          }}
        >
          <div className="flex items-center gap-6">
            <h1
              className="text-lg tracking-wide"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: colors.parchment
              }}
            >
              Design Studio
            </h1>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                color: colors.gold,
                fontFamily: 'var(--font-crimson)'
              }}
            >
              Digital Craftsman
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldMedium})`,
                color: colors.navy,
                fontFamily: 'var(--font-crimson)'
              }}
            >
              Design Lab
            </button>
            <button
              className="px-5 py-2.5 rounded-full text-sm font-medium border transition-all hover:bg-white/5"
              style={{
                borderColor: 'rgba(212, 175, 55, 0.3)',
                color: colors.parchment,
                fontFamily: 'var(--font-crimson)'
              }}
            >
              Simulate
            </button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex flex-grow overflow-hidden">
          {/* Left Properties Panel (320px) */}
          <aside
            className="w-80 border-r flex flex-col overflow-y-auto shrink-0"
            style={{
              backgroundColor: colors.navyLight,
              borderColor: 'rgba(212, 175, 55, 0.1)'
            }}
          >
            <form onSubmit={handleGenerate} className="flex flex-col h-full p-6 space-y-6">
              {/* Design Brief */}
              <div>
                <label
                  className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest"
                  style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}
                >
                  <Sparkles size={14} />
                  Design Brief
                </label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe your vision with care..."
                  className="w-full h-28 rounded-xl p-4 text-sm outline-none transition-all resize-none"
                  style={{
                    backgroundColor: 'rgba(250, 247, 242, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    color: colors.parchment,
                    fontFamily: 'var(--font-crimson)'
                  }}
                />
              </div>

              {/* Render Config */}
              <div>
                <label
                  className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest"
                  style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}
                >
                  <Layers size={14} />
                  Render Configuration
                </label>
                <div className="space-y-3">
                  <CraftsmanSelect value={renderType} options={RENDER_TYPES} onChange={setRenderType} />
                  {showRoomType && (
                    <CraftsmanSelect value={roomType} options={ROOM_TYPES} onChange={setRoomType} />
                  )}
                  <CraftsmanSelect value={aesthetic} options={AESTHETICS} onChange={setAesthetic} />
                </div>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label
                  className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest"
                  style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}
                >
                  <Grid3X3 size={14} />
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['16:9', '1:1', '9:16'].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className="py-3 text-xs font-medium rounded-xl transition-all"
                      style={{
                        backgroundColor: aspectRatio === ratio ? colors.gold : 'rgba(250, 247, 242, 0.05)',
                        color: aspectRatio === ratio ? colors.navy : colors.parchment,
                        border: `1px solid ${aspectRatio === ratio ? colors.gold : 'rgba(212, 175, 55, 0.2)'}`,
                        fontFamily: 'var(--font-crimson)'
                      }}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div>
                <label
                  className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest"
                  style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}
                >
                  <Ruler size={14} />
                  Quality
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['1K SD', '2K HD', '4K UHD'].map((qual) => (
                    <button
                      key={qual}
                      type="button"
                      onClick={() => setQuality(qual)}
                      className="py-3 text-xs font-medium rounded-xl transition-all"
                      style={{
                        backgroundColor: quality === qual ? colors.gold : 'rgba(250, 247, 242, 0.05)',
                        color: quality === qual ? colors.navy : colors.parchment,
                        border: `1px solid ${quality === qual ? colors.gold : 'rgba(212, 175, 55, 0.2)'}`,
                        fontFamily: 'var(--font-crimson)'
                      }}
                    >
                      {qual}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Image */}
              <div>
                <label
                  className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest"
                  style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}
                >
                  <ImageIcon size={14} />
                  Source Image
                </label>
                {sourceImage ? (
                  <div className="relative group rounded-xl overflow-hidden" style={{ border: `1px solid rgba(212, 175, 55, 0.3)` }}>
                    <img src={sourceImage} className="w-full aspect-video object-cover" alt="Source" />
                    <button
                      type="button"
                      onClick={() => setSourceImage(null)}
                      className="absolute top-2 right-2 p-2 rounded-lg transition-all"
                      style={{ backgroundColor: 'rgba(11, 17, 32, 0.8)', color: colors.parchment }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all group"
                    style={{
                      borderColor: 'rgba(212, 175, 55, 0.2)',
                      backgroundColor: 'rgba(250, 247, 242, 0.02)'
                    }}
                  >
                    <Camera size={28} style={{ color: 'rgba(212, 175, 55, 0.5)' }} className="group-hover:scale-110 transition-transform" />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: 'rgba(250, 247, 242, 0.5)', fontFamily: 'var(--font-crimson)' }}
                    >
                      Upload Reference
                    </span>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </button>
                )}
              </div>

              {/* Generate FAB - Material Design 3 */}
              <div className="mt-auto pt-6">
                <button
                  type="submit"
                  disabled={state === 'loading' || (!prompt.trim() && !sourceImage)}
                  className="w-full py-4 rounded-full text-sm font-semibold uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldMedium})`,
                    color: colors.navy,
                    fontFamily: 'var(--font-playfair)'
                  }}
                >
                  {state === 'loading' ? (
                    'Crafting Your Vision...'
                  ) : (
                    <>
                      Generate Render
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </aside>

          {/* Canvas - Parchment Workspace */}
          <main
            className="flex-grow flex items-center justify-center p-8 relative overflow-hidden"
            style={{ backgroundColor: colors.parchmentDark }}
          >
            {/* Subtle watercolor wash */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                             radial-gradient(ellipse at 70% 80%, rgba(154, 123, 100, 0.1) 0%, transparent 50%)`
              }}
            />

            {/* White Canvas with MD3 Elevation */}
            <div
              className="relative w-full max-w-5xl aspect-video rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(11, 17, 32, 0.08), 0 1px 4px rgba(11, 17, 32, 0.04)'
              }}
            >
              <AnimatePresence mode="wait">
                {state === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center space-y-6 p-12"
                  >
                    <div
                      className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto"
                      style={{ backgroundColor: colors.parchmentDark }}
                    >
                      <Upload size={40} style={{ color: colors.goldDark }} />
                    </div>
                    <div>
                      <h2
                        className="text-3xl mb-2"
                        style={{ fontFamily: 'var(--font-playfair)', color: colors.navy }}
                      >
                        Ready to Create
                      </h2>
                      <p
                        className="text-sm"
                        style={{ fontFamily: 'var(--font-crimson)', color: colors.goldDark }}
                      >
                        Configure your vision and let the craft begin
                      </p>
                    </div>
                  </motion.div>
                )}

                {state === 'loading' && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: colors.navy }}
                  >
                    <LoadingAnimation elapsedTime={elapsedTime} estimatedRemaining={estimatedTime} />
                  </motion.div>
                )}

                {state === 'success' && generatedImage && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative group"
                  >
                    <img src={generatedImage} className="w-full h-full object-contain rounded-2xl" alt="Generated" />
                    <button
                      onClick={() => setIsEnlarged(true)}
                      className="absolute top-4 right-4 p-3 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      style={{
                        backgroundColor: 'rgba(11, 17, 32, 0.8)',
                        color: colors.parchment
                      }}
                    >
                      <Maximize2 size={18} />
                    </button>
                  </motion.div>
                )}

                {state === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6 p-12"
                  >
                    <div className="text-5xl">⚠</div>
                    <h3
                      className="text-2xl"
                      style={{ fontFamily: 'var(--font-playfair)', color: colors.navy }}
                    >
                      Generation Failed
                    </h3>
                    <button
                      onClick={() => setState('idle')}
                      className="px-8 py-3 rounded-full text-sm font-medium transition-all"
                      style={{
                        backgroundColor: colors.navy,
                        color: colors.parchment,
                        fontFamily: 'var(--font-crimson)'
                      }}
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* New Render Button (shown on success) */}
            {state === 'success' && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setState('idle')}
                className="absolute bottom-8 px-8 py-3 rounded-full text-sm font-medium shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldMedium})`,
                  color: colors.navy,
                  fontFamily: 'var(--font-playfair)'
                }}
              >
                Create New Render
              </motion.button>
            )}
          </main>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isEnlarged && generatedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8"
            style={{ backgroundColor: 'rgba(11, 17, 32, 0.98)' }}
          >
            <button
              onClick={() => setIsEnlarged(false)}
              className="absolute top-8 right-8 p-4 rounded-2xl transition-all"
              style={{
                backgroundColor: 'rgba(250, 247, 242, 0.1)',
                color: colors.parchment
              }}
            >
              <X size={24} />
            </button>
            <img src={generatedImage} className="max-w-full max-h-full object-contain rounded-2xl" alt="Fullscreen" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Craftsman Select Component
function CraftsmanSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
        style={{
          backgroundColor: 'rgba(250, 247, 242, 0.05)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          color: colors.gold,
          fontFamily: 'var(--font-crimson)'
        }}
      >
        {value}
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: colors.goldDark }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden max-h-60 overflow-y-auto"
            style={{
              backgroundColor: colors.navyLight,
              border: '1px solid rgba(212, 175, 55, 0.2)',
              boxShadow: '0 8px 24px rgba(11, 17, 32, 0.4)'
            }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className="w-full px-4 py-3 text-left text-sm transition-all"
                style={{
                  backgroundColor: value === opt ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  color: value === opt ? colors.gold : colors.parchment,
                  fontFamily: 'var(--font-crimson)'
                }}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
