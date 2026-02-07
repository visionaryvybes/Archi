'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Camera, X, Layers, ChevronRight, ChevronDown,
  Upload, Maximize2, Home, FolderOpen, Sparkles, Image as ImageIcon,
  Grid3X3, Palette, Ruler, MessageSquare, Eraser, Expand,
  PenTool, Sun, Cloud, Snowflake, Leaf, Clock, Wand2,
  Type, ArrowLeftRight, Send, Loader2
} from 'lucide-react'
import { LoadingAnimation } from '@/components/studio/loading-animation'
import {
  STYLES, RENDER_TYPES, ROOM_TYPES, GENERATION_MODES,
  TIME_OF_DAY_OPTIONS, SEASON_OPTIONS,
  type GenerationMode, STYLE_CATEGORIES
} from '@/lib/types'

type AppState = 'idle' | 'loading' | 'success' | 'error'

// All aesthetics from our expanded styles list
const ALL_AESTHETICS = STYLES.map(s => ({ id: s.id, name: s.name, category: s.category }))

// Color Palette
const colors = {
  navy: '#0B1120',
  navyLight: '#111827',
  gold: '#D4AF37',
  goldMedium: '#C1A746',
  goldDark: '#9A7B64',
  parchment: '#FAF7F2',
  parchmentDark: '#F5F0E8',
  emerald: '#10B981',
}

// Mode icons mapping
const MODE_ICONS: Record<string, React.ElementType> = {
  'type': Type,
  'image': ImageIcon,
  'message-square': MessageSquare,
  'eraser': Eraser,
  'expand': Expand,
  'pen-tool': PenTool,
  'palette': Palette,
  'maximize': Maximize2,
}

export default function StudioPage() {
  const [activeNav, setActiveNav] = useState('workspace')
  const [state, setState] = useState<AppState>('idle')
  const [prompt, setPrompt] = useState('')
  const [renderType, setRenderType] = useState('Interior Design')
  const [aesthetic, setAesthetic] = useState('modern')
  const [roomType, setRoomType] = useState('Living Room')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [quality, setQuality] = useState('2K HD')
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isEnlarged, setIsEnlarged] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(45)
  const [generationMode, setGenerationMode] = useState<GenerationMode>('text-to-image')
  const [timeOfDay, setTimeOfDay] = useState<string>('')
  const [season, setSeason] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [generationTime, setGenerationTime] = useState<number>(0)
  const [styleFilter, setStyleFilter] = useState<string>('All')

  // Chat state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{
    role: 'user' | 'assistant'
    content: string
    imageBase64?: string
  }>>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: 'user' | 'model'
    parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>
  }>>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const showRoomType = renderType === 'Interior Design' || renderType === '2D/3D Floor Plan'
  const aestheticName = STYLES.find(s => s.id === aesthetic)?.name || aesthetic

  const filteredStyles = styleFilter === 'All'
    ? ALL_AESTHETICS
    : ALL_AESTHETICS.filter(s => s.category === styleFilter)

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, chatLoading])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSourceImage(event.target?.result as string)
        if (generationMode === 'text-to-image') {
          setGenerationMode('image-to-image')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() && !sourceImage) return

    setState('loading')
    setErrorMessage('')
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
          imageBase64: imageBase64 || undefined,
          aspectRatio,
          quality,
          mode: generationMode,
          timeOfDay: timeOfDay || undefined,
          season: season || undefined,
        })
      })

      const data = await response.json()

      if (data.success && data.imageBase64) {
        setGeneratedImage(`data:image/png;base64,${data.imageBase64}`)
        setGenerationTime(data.generationTime || 0)
        setState('success')
      } else {
        setErrorMessage(data.error || 'Generation failed')
        setState('error')
      }
    } catch (error) {
      console.error('Generation error:', error)
      setErrorMessage('Network error. Please check your connection.')
      setState('error')
    }
  }

  const handleChatSend = async () => {
    if (!chatInput.trim()) return

    const userMsg = chatInput
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setChatLoading(true)

    try {
      const currentImgBase64 = generatedImage?.split(',')[1] || sourceImage?.split(',')[1]

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          currentImageBase64: currentImgBase64,
          conversationHistory,
        })
      })

      const data = await response.json()

      setConversationHistory(prev => [
        ...prev,
        { role: 'user' as const, parts: [{ text: userMsg }] },
        {
          role: 'model' as const,
          parts: [
            ...(data.imageBase64 ? [{ inlineData: { mimeType: 'image/png', data: data.imageBase64 } }] : []),
            ...(data.textResponse ? [{ text: data.textResponse }] : []),
          ]
        },
      ])

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: data.textResponse || 'Here\'s your updated design.',
        imageBase64: data.imageBase64,
      }])

      if (data.imageBase64) {
        setGeneratedImage(`data:image/png;base64,${data.imageBase64}`)
        setState('success')
      }
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
      }])
    } finally {
      setChatLoading(false)
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

      {/* Navigation Rail */}
      <nav
        className="w-20 flex flex-col items-center py-6 border-r shrink-0"
        style={{ backgroundColor: colors.navy, borderColor: 'rgba(212, 175, 55, 0.1)' }}
      >
        <a href="/" className="mb-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldMedium})` }}
          >
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: colors.navy }}>V</span>
          </div>
        </a>

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
              style={{ backgroundColor: activeNav === item.id ? 'rgba(212, 175, 55, 0.15)' : 'transparent' }}
            >
              {activeNav === item.id && (
                <motion.div layoutId="navIndicator" className="absolute left-0 w-1 h-8 rounded-r-full" style={{ backgroundColor: colors.gold }} />
              )}
              <item.icon size={22} style={{ color: activeNav === item.id ? colors.gold : 'rgba(250, 247, 242, 0.4)' }} className="group-hover:scale-110 transition-transform" />
            </button>
          ))}
        </div>

        <button className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:bg-white/5" style={{ color: 'rgba(250, 247, 242, 0.4)' }}>
          <Settings size={20} />
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Top App Bar */}
        <header className="h-16 flex items-center justify-between px-8 border-b shrink-0" style={{ backgroundColor: colors.navy, borderColor: 'rgba(212, 175, 55, 0.1)' }}>
          <div className="flex items-center gap-6">
            <h1 className="text-lg tracking-wide" style={{ fontFamily: 'var(--font-playfair)', color: colors.parchment }}>Design Studio</h1>
            <span className="text-xs px-3 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: colors.emerald, fontFamily: 'var(--font-crimson)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Nano Banana Pro
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
              style={{
                backgroundColor: chatOpen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(250, 247, 242, 0.05)',
                color: chatOpen ? colors.emerald : colors.parchment,
                border: `1px solid ${chatOpen ? 'rgba(16, 185, 129, 0.3)' : 'rgba(212, 175, 55, 0.2)'}`,
                fontFamily: 'var(--font-crimson)'
              }}
            >
              <MessageSquare size={16} />
              AI Chat
            </button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex flex-grow overflow-hidden">
          {/* Left Properties Panel */}
          <aside className="w-80 border-r flex flex-col overflow-y-auto shrink-0" style={{ backgroundColor: colors.navyLight, borderColor: 'rgba(212, 175, 55, 0.1)' }}>
            <form onSubmit={handleGenerate} className="flex flex-col h-full p-6 space-y-5">

              {/* Generation Mode Selector */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest" style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}>
                  <Wand2 size={14} />
                  Generation Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GENERATION_MODES.slice(0, 6).map((mode) => {
                    const Icon = MODE_ICONS[mode.icon] || Sparkles
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setGenerationMode(mode.id)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all"
                        style={{
                          backgroundColor: generationMode === mode.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(250, 247, 242, 0.03)',
                          border: `1px solid ${generationMode === mode.id ? 'rgba(16, 185, 129, 0.4)' : 'rgba(212, 175, 55, 0.15)'}`,
                          color: generationMode === mode.id ? colors.emerald : 'rgba(250, 247, 242, 0.6)',
                          fontFamily: 'var(--font-crimson)'
                        }}
                        title={mode.description}
                      >
                        <Icon size={14} />
                        {mode.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Design Brief */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest" style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}>
                  <Sparkles size={14} />
                  Design Brief
                </label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder={
                    generationMode === 'sketch-to-render' ? 'Upload a sketch and describe the output...'
                    : generationMode === 'edit' ? 'Describe what to change...'
                    : generationMode === 'inpaint' ? 'Describe what to replace in the selected area...'
                    : 'Describe your vision with care...'
                  }
                  className="w-full h-24 rounded-xl p-4 text-sm outline-none transition-all resize-none"
                  style={{ backgroundColor: 'rgba(250, 247, 242, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', color: colors.parchment, fontFamily: 'var(--font-crimson)' }}
                />
              </div>

              {/* Render Config */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest" style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}>
                  <Layers size={14} />
                  Render Type
                </label>
                <div className="space-y-3">
                  <CraftsmanSelect value={renderType} options={RENDER_TYPES as unknown as string[]} onChange={setRenderType} />
                  {showRoomType && <CraftsmanSelect value={roomType} options={ROOM_TYPES as unknown as string[]} onChange={setRoomType} />}
                </div>
              </div>

              {/* Style Selector with Categories */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest" style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}>
                  <Palette size={14} />
                  Style ({STYLES.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['All', ...STYLE_CATEGORIES].map(cat => (
                    <button key={cat} type="button" onClick={() => setStyleFilter(cat)}
                      className="px-2.5 py-1 rounded-lg text-[10px] transition-all"
                      style={{
                        backgroundColor: styleFilter === cat ? colors.gold : 'rgba(250, 247, 242, 0.05)',
                        color: styleFilter === cat ? colors.navy : 'rgba(250, 247, 242, 0.5)',
                        fontFamily: 'var(--font-crimson)'
                      }}
                    >{cat}</button>
                  ))}
                </div>
                <div className="max-h-36 overflow-y-auto rounded-xl" style={{ border: '1px solid rgba(212, 175, 55, 0.15)' }}>
                  <div className="grid grid-cols-2 gap-1 p-1.5">
                    {filteredStyles.map((style) => (
                      <button key={style.id} type="button" onClick={() => setAesthetic(style.id)}
                        className="px-2.5 py-2 rounded-lg text-xs text-left transition-all"
                        style={{
                          backgroundColor: aesthetic === style.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(250, 247, 242, 0.02)',
                          border: `1px solid ${aesthetic === style.id ? 'rgba(16, 185, 129, 0.4)' : 'transparent'}`,
                          color: aesthetic === style.id ? colors.emerald : 'rgba(250, 247, 242, 0.6)',
                          fontFamily: 'var(--font-crimson)'
                        }}
                      >{style.name}</button>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] mt-1.5" style={{ color: 'rgba(250, 247, 242, 0.3)' }}>Selected: {aestheticName}</p>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest" style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}>
                  <Grid3X3 size={14} />
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['16:9', '4:3', '1:1', '9:16'].map((ratio) => (
                    <button key={ratio} type="button" onClick={() => setAspectRatio(ratio)}
                      className="py-2.5 text-xs font-medium rounded-xl transition-all"
                      style={{
                        backgroundColor: aspectRatio === ratio ? colors.gold : 'rgba(250, 247, 242, 0.05)',
                        color: aspectRatio === ratio ? colors.navy : colors.parchment,
                        border: `1px solid ${aspectRatio === ratio ? colors.gold : 'rgba(212, 175, 55, 0.2)'}`,
                        fontFamily: 'var(--font-crimson)'
                      }}
                    >{ratio}</button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest" style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}>
                  <Ruler size={14} />
                  Quality
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['1K SD', '2K HD', '4K UHD'].map((qual) => (
                    <button key={qual} type="button" onClick={() => setQuality(qual)}
                      className="py-2.5 text-xs font-medium rounded-xl transition-all"
                      style={{
                        backgroundColor: quality === qual ? colors.gold : 'rgba(250, 247, 242, 0.05)',
                        color: quality === qual ? colors.navy : colors.parchment,
                        border: `1px solid ${quality === qual ? colors.gold : 'rgba(212, 175, 55, 0.2)'}`,
                        fontFamily: 'var(--font-crimson)'
                      }}
                    >{qual}</button>
                  ))}
                </div>
              </div>

              {/* Lighting & Environment */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest" style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}>
                  <Sun size={14} />
                  Lighting & Season
                </label>
                <div className="space-y-3">
                  <CraftsmanSelect value={timeOfDay || 'Auto'} options={['Auto', ...TIME_OF_DAY_OPTIONS.map(t => t.name)]} onChange={(v) => setTimeOfDay(v === 'Auto' ? '' : v.toLowerCase())} />
                  <CraftsmanSelect value={season || 'Auto'} options={['Auto', ...SEASON_OPTIONS.map(s => s.name)]} onChange={(v) => setSeason(v === 'Auto' ? '' : v.toLowerCase())} />
                </div>
              </div>

              {/* Source Image */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest" style={{ color: colors.gold, fontFamily: 'var(--font-crimson)' }}>
                  <ImageIcon size={14} />
                  Source Image
                </label>
                {sourceImage ? (
                  <div className="relative group rounded-xl overflow-hidden" style={{ border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                    <img src={sourceImage} className="w-full aspect-video object-cover" alt="Source" />
                    <button type="button" onClick={() => { setSourceImage(null); if (generationMode !== 'text-to-image') setGenerationMode('text-to-image') }}
                      className="absolute top-2 right-2 p-2 rounded-lg transition-all" style={{ backgroundColor: 'rgba(11, 17, 32, 0.8)', color: colors.parchment }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all group"
                    style={{ borderColor: 'rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(250, 247, 242, 0.02)' }}>
                    <Camera size={24} style={{ color: 'rgba(212, 175, 55, 0.5)' }} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(250, 247, 242, 0.5)', fontFamily: 'var(--font-crimson)' }}>
                      {generationMode === 'sketch-to-render' ? 'Upload Sketch' : 'Upload Reference'}
                    </span>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </button>
                )}
              </div>

              {/* Generate Button */}
              <div className="mt-auto pt-4">
                <button type="submit" disabled={state === 'loading' || (!prompt.trim() && !sourceImage)}
                  className="w-full py-4 rounded-full text-sm font-semibold uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${colors.emerald}, #059669)`, color: '#FFFFFF', fontFamily: 'var(--font-playfair)' }}>
                  {state === 'loading' ? 'Crafting Your Vision...' : (<><Sparkles size={18} />Generate with Nano Banana<ChevronRight size={18} /></>)}
                </button>
              </div>
            </form>
          </aside>

          {/* Canvas */}
          <main className="flex-grow flex items-center justify-center p-8 relative overflow-hidden" style={{ backgroundColor: colors.parchmentDark }}>
            <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at 30% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(154, 123, 100, 0.1) 0%, transparent 50%)` }} />

            <div className="relative w-full max-w-5xl aspect-video rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(11, 17, 32, 0.08), 0 1px 4px rgba(11, 17, 32, 0.04)' }}>
              <AnimatePresence mode="wait">
                {state === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-6 p-12">
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
                      <Sparkles size={40} style={{ color: colors.emerald }} />
                    </div>
                    <div>
                      <h2 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-playfair)', color: colors.navy }}>Powered by Nano Banana Pro</h2>
                      <p className="text-sm" style={{ fontFamily: 'var(--font-crimson)', color: colors.goldDark }}>{STYLES.length} styles &middot; {RENDER_TYPES.length} render types &middot; {GENERATION_MODES.length} AI modes</p>
                    </div>
                  </motion.div>
                )}

                {state === 'loading' && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.navy }}>
                    <LoadingAnimation elapsedTime={elapsedTime} estimatedRemaining={estimatedTime} />
                  </motion.div>
                )}

                {state === 'success' && generatedImage && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full relative group">
                    <img src={generatedImage} className="w-full h-full object-contain rounded-2xl" alt="Generated" />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setIsEnlarged(true)} className="p-3 rounded-xl transition-all" style={{ backgroundColor: 'rgba(11, 17, 32, 0.8)', color: colors.parchment }}>
                        <Maximize2 size={18} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2" style={{ backgroundColor: 'rgba(11, 17, 32, 0.8)', color: colors.parchment }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {aestheticName} &middot; {renderType} &middot; {generationTime.toFixed(1)}s
                    </div>
                  </motion.div>
                )}

                {state === 'error' && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4 p-12">
                    <div className="text-5xl">⚠</div>
                    <h3 className="text-2xl" style={{ fontFamily: 'var(--font-playfair)', color: colors.navy }}>Generation Failed</h3>
                    <p className="text-sm max-w-md" style={{ color: colors.goldDark }}>{errorMessage}</p>
                    <button onClick={() => setState('idle')} className="px-8 py-3 rounded-full text-sm font-medium transition-all" style={{ backgroundColor: colors.navy, color: colors.parchment, fontFamily: 'var(--font-crimson)' }}>Try Again</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {state === 'success' && (
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => setState('idle')}
                className="absolute bottom-8 px-8 py-3 rounded-full text-sm font-medium shadow-lg"
                style={{ background: `linear-gradient(135deg, ${colors.emerald}, #059669)`, color: '#FFFFFF', fontFamily: 'var(--font-playfair)' }}>
                Create New Render
              </motion.button>
            )}
          </main>

          {/* Chat Panel */}
          <AnimatePresence>
            {chatOpen && (
              <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 380, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                className="border-l flex flex-col overflow-hidden shrink-0" style={{ backgroundColor: colors.navyLight, borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                <div className="h-14 flex items-center justify-between px-4 border-b shrink-0" style={{ borderColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
                      <Sparkles size={14} style={{ color: colors.emerald }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: colors.parchment }}>AI Design Chat</span>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="p-1.5 rounded-lg transition-all hover:bg-white/5" style={{ color: 'rgba(250, 247, 242, 0.4)' }}>
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                        <MessageSquare size={24} style={{ color: colors.emerald }} />
                      </div>
                      <p className="text-sm mb-1" style={{ color: colors.parchment }}>Conversational AI Editing</p>
                      <p className="text-xs" style={{ color: 'rgba(250, 247, 242, 0.4)' }}>Refine your designs with natural language:</p>
                      <div className="mt-3 space-y-1.5">
                        {['Make the ceiling higher', 'Change the sofa to leather', 'Add more natural light', 'Switch to a warmer palette'].map((s) => (
                          <button key={s} onClick={() => setChatInput(s)} className="block w-full text-left px-3 py-2 rounded-lg text-xs transition-all hover:bg-white/5"
                            style={{ backgroundColor: 'rgba(250, 247, 242, 0.03)', color: 'rgba(250, 247, 242, 0.5)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                            &ldquo;{s}&rdquo;
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[85%] rounded-2xl px-4 py-3"
                        style={{
                          backgroundColor: msg.role === 'user' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(250, 247, 242, 0.05)',
                          borderBottomRightRadius: msg.role === 'user' ? 4 : undefined,
                          borderBottomLeftRadius: msg.role === 'assistant' ? 4 : undefined,
                        }}>
                        <p className="text-sm" style={{ color: colors.parchment }}>{msg.content}</p>
                        {msg.imageBase64 && (
                          <img src={`data:image/png;base64,${msg.imageBase64}`} alt="AI generated" className="mt-2 rounded-lg w-full cursor-pointer"
                            onClick={() => { setGeneratedImage(`data:image/png;base64,${msg.imageBase64}`); setState('success') }} />
                        )}
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl px-4 py-3 flex items-center gap-2" style={{ backgroundColor: 'rgba(250, 247, 242, 0.05)' }}>
                        <Loader2 size={14} className="animate-spin" style={{ color: colors.emerald }} />
                        <span className="text-xs" style={{ color: 'rgba(250, 247, 242, 0.5)' }}>Generating...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t" style={{ borderColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <div className="flex items-end gap-2 rounded-xl p-2" style={{ backgroundColor: 'rgba(250, 247, 242, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend() } }}
                      placeholder="Describe changes..." rows={1}
                      className="flex-1 bg-transparent text-sm resize-none outline-none py-1.5 px-2 max-h-20" style={{ color: colors.parchment }} />
                    <button onClick={handleChatSend} disabled={!chatInput.trim() || chatLoading}
                      className="p-2 rounded-lg transition-all disabled:opacity-30"
                      style={{ backgroundColor: chatInput.trim() ? 'rgba(16, 185, 129, 0.2)' : 'transparent', color: colors.emerald }}>
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isEnlarged && generatedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8" style={{ backgroundColor: 'rgba(11, 17, 32, 0.98)' }}>
            <button onClick={() => setIsEnlarged(false)} className="absolute top-8 right-8 p-4 rounded-2xl transition-all"
              style={{ backgroundColor: 'rgba(250, 247, 242, 0.1)', color: colors.parchment }}>
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
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
        style={{ backgroundColor: 'rgba(250, 247, 242, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', color: '#D4AF37', fontFamily: 'var(--font-crimson)' }}>
        {value}
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: '#9A7B64' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden max-h-60 overflow-y-auto"
            style={{ backgroundColor: '#111827', border: '1px solid rgba(212, 175, 55, 0.2)', boxShadow: '0 8px 24px rgba(11, 17, 32, 0.4)' }}>
            {options.map((opt) => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false) }}
                className="w-full px-4 py-3 text-left text-sm transition-all hover:bg-white/5"
                style={{
                  backgroundColor: value === opt ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: value === opt ? '#10B981' : '#FAF7F2',
                  fontFamily: 'var(--font-crimson)'
                }}>
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
