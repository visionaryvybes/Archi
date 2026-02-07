'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Upload, Maximize2, Sparkles, Image as ImageIcon,
  MessageSquare, Send, Loader2, X, Download, RotateCcw,
  Wand2, PenTool, Eraser, Expand, Palette, ArrowLeftRight,
  Type, Sun, Layers, Clock, ChevronRight, Zap, Search
} from 'lucide-react'
import { LoadingAnimation } from '@/components/studio/loading-animation'
import {
  STYLES, RENDER_TYPES, ROOM_TYPES, GENERATION_MODES,
  TIME_OF_DAY_OPTIONS, SEASON_OPTIONS,
  type GenerationMode, STYLE_CATEGORIES
} from '@/lib/types'

type AppState = 'idle' | 'loading' | 'success' | 'error'

// Mode icon mapping
const MODE_ICONS: Record<string, React.ElementType> = {
  'type': Type, 'image': ImageIcon, 'message-square': MessageSquare,
  'eraser': Eraser, 'expand': Expand, 'pen-tool': PenTool,
  'palette': Palette, 'maximize': Maximize2,
}

export default function StudioPage() {
  // Core state
  const [state, setState] = useState<AppState>('idle')
  const [prompt, setPrompt] = useState('')
  const [renderType, setRenderType] = useState('Interior Design')
  const [aesthetic, setAesthetic] = useState('modern')
  const [roomType, setRoomType] = useState('Living Room')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [generationMode, setGenerationMode] = useState<GenerationMode>('text-to-image')
  const [timeOfDay, setTimeOfDay] = useState('')
  const [season, setSeason] = useState('')
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isEnlarged, setIsEnlarged] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [generationTime, setGenerationTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(30)

  // UI state
  const [styleFilter, setStyleFilter] = useState('All')
  const [styleSearch, setStyleSearch] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{
    role: 'user' | 'assistant'; content: string; imageBase64?: string
  }>>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: 'user' | 'model'
    parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>
  }>>([])

  // History
  const [history, setHistory] = useState<Array<{ image: string; style: string; time: number }>>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const showRoomType = renderType === 'Interior Design' || renderType === '2D/3D Floor Plan'
  const aestheticName = STYLES.find(s => s.id === aesthetic)?.name || aesthetic

  const filteredStyles = STYLES.filter(s => {
    const matchesCategory = styleFilter === 'All' || s.category === styleFilter
    const matchesSearch = !styleSearch || s.name.toLowerCase().includes(styleSearch.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
        if (generationMode === 'text-to-image') setGenerationMode('image-to-image')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() && !sourceImage) return

    setState('loading')
    setErrorMessage('')
    setEstimatedTime(30)

    try {
      const imageBase64 = sourceImage?.split(',')[1] || ''
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt, renderType, aesthetic, roomType,
          imageBase64: imageBase64 || undefined,
          aspectRatio, quality: '2K HD',
          mode: generationMode,
          timeOfDay: timeOfDay || undefined,
          season: season || undefined,
        })
      })
      const data = await response.json()
      if (data.success && data.imageBase64) {
        const img = `data:image/png;base64,${data.imageBase64}`
        setGeneratedImage(img)
        setGenerationTime(data.generationTime || 0)
        setHistory(prev => [{ image: img, style: aestheticName, time: data.generationTime || 0 }, ...prev].slice(0, 20))
        setState('success')
      } else {
        setErrorMessage(data.error || 'Generation failed')
        setState('error')
      }
    } catch {
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
        body: JSON.stringify({ message: userMsg, currentImageBase64: currentImgBase64, conversationHistory })
      })
      const data = await response.json()
      setConversationHistory(prev => [
        ...prev,
        { role: 'user' as const, parts: [{ text: userMsg }] },
        { role: 'model' as const, parts: [
          ...(data.imageBase64 ? [{ inlineData: { mimeType: 'image/png', data: data.imageBase64 } }] : []),
          ...(data.textResponse ? [{ text: data.textResponse }] : []),
        ]},
      ])
      setChatMessages(prev => [...prev, {
        role: 'assistant', content: data.textResponse || 'Design updated.',
        imageBase64: data.imageBase64,
      }])
      if (data.imageBase64) {
        const img = `data:image/png;base64,${data.imageBase64}`
        setGeneratedImage(img)
        setHistory(prev => [{ image: img, style: 'Chat Edit', time: 0 }, ...prev].slice(0, 20))
        setState('success')
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error processing request. Please try again.' }])
    } finally {
      setChatLoading(false)
    }
  }

  const handleDownload = useCallback(() => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `visionary-${aesthetic}-${Date.now()}.png`
    link.click()
  }, [generatedImage, aesthetic])

  return (
    <div className="h-screen flex overflow-hidden bg-[#0a0a0a]">
      {/* ── Left Sidebar: Controls ── */}
      <aside className={`${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-[300px]'} border-r border-zinc-800/60 flex flex-col shrink-0 transition-all duration-300`}>
        <form onSubmit={handleGenerate} className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-14 flex items-center justify-between px-5 border-b border-zinc-800/60 shrink-0">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Sparkles size={14} className="text-emerald-400" />
              </div>
              <span className="text-[13px] font-semibold text-zinc-100 tracking-tight">Visionary Studio</span>
            </a>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-hide">
            {/* Prompt */}
            <Section label="Prompt" icon={<Type size={13} />}>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={
                  generationMode === 'edit' ? 'Describe what to change...'
                  : generationMode === 'inpaint' ? 'Describe replacement...'
                  : generationMode === 'sketch-to-render' ? 'Describe the render output...'
                  : 'Describe your interior design vision...'
                }
                className="w-full h-20 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2.5 text-[13px] text-zinc-200 placeholder:text-zinc-600 resize-none outline-none focus:border-emerald-500/40 transition-colors"
              />
            </Section>

            {/* Generation Mode */}
            <Section label="Mode" icon={<Wand2 size={13} />}>
              <div className="grid grid-cols-2 gap-1.5">
                {GENERATION_MODES.slice(0, 6).map((mode) => {
                  const Icon = MODE_ICONS[mode.icon] || Sparkles
                  const active = generationMode === mode.id
                  return (
                    <button key={mode.id} type="button" onClick={() => setGenerationMode(mode.id)}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-[11px] font-medium transition-all ${
                        active ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                      }`} title={mode.description}>
                      <Icon size={12} />
                      {mode.name}
                    </button>
                  )
                })}
              </div>
            </Section>

            {/* Style */}
            <Section label={`Style · ${filteredStyles.length}`} icon={<Palette size={13} />}>
              {/* Category pills */}
              <div className="flex flex-wrap gap-1 mb-2.5">
                {['All', ...STYLE_CATEGORIES].map(cat => (
                  <button key={cat} type="button" onClick={() => setStyleFilter(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                      styleFilter === cat ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-900/50 text-zinc-600 hover:text-zinc-400'
                    }`}>{cat}</button>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-2">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="text" value={styleSearch} onChange={e => setStyleSearch(e.target.value)}
                  placeholder="Search styles..."
                  className="w-full pl-7 pr-3 py-1.5 rounded-md bg-zinc-900/50 border border-zinc-800/50 text-[11px] text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-emerald-500/30 transition-colors"
                />
              </div>

              {/* Style grid */}
              <div className="max-h-32 overflow-y-auto rounded-lg border border-zinc-800/40 scrollbar-hide">
                <div className="grid grid-cols-2 gap-0.5 p-1">
                  {filteredStyles.map((style) => {
                    const active = aesthetic === style.id
                    return (
                      <button key={style.id} type="button" onClick={() => setAesthetic(style.id)}
                        className={`px-2.5 py-1.5 rounded text-[11px] text-left transition-all ${
                          active ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                        }`} title={style.description}>
                        {style.name}
                      </button>
                    )
                  })}
                </div>
              </div>
              <p className="text-[10px] text-zinc-700 mt-1.5">{aestheticName}</p>
            </Section>

            {/* Render Type & Room */}
            <Section label="Render" icon={<Layers size={13} />}>
              <Select value={renderType} options={RENDER_TYPES as unknown as string[]} onChange={setRenderType} />
              {showRoomType && (
                <div className="mt-2">
                  <Select value={roomType} options={ROOM_TYPES as unknown as string[]} onChange={setRoomType} />
                </div>
              )}
            </Section>

            {/* Aspect Ratio */}
            <Section label="Aspect Ratio" icon={<Maximize2 size={13} />}>
              <div className="grid grid-cols-4 gap-1.5">
                {['16:9', '4:3', '1:1', '9:16'].map((r) => (
                  <button key={r} type="button" onClick={() => setAspectRatio(r)}
                    className={`py-1.5 text-[11px] font-medium rounded-md transition-all ${
                      aspectRatio === r ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-zinc-900/50 text-zinc-500 hover:text-zinc-300'
                    }`}>{r}</button>
                ))}
              </div>
            </Section>

            {/* Advanced: Lighting & Season */}
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors w-full">
              <ChevronRight size={12} className={`transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
              Advanced Settings
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                  <Section label="Lighting" icon={<Sun size={13} />}>
                    <Select value={timeOfDay || 'Auto'} options={['Auto', ...TIME_OF_DAY_OPTIONS.map(t => t.name)]} onChange={(v) => setTimeOfDay(v === 'Auto' ? '' : v.toLowerCase())} />
                  </Section>
                  <Section label="Season" icon={<Clock size={13} />}>
                    <Select value={season || 'Auto'} options={['Auto', ...SEASON_OPTIONS.map(s => s.name)]} onChange={(v) => setSeason(v === 'Auto' ? '' : v.toLowerCase())} />
                  </Section>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Source Image */}
            <Section label="Reference Image" icon={<ImageIcon size={13} />}>
              {sourceImage ? (
                <div className="relative group rounded-lg overflow-hidden border border-zinc-800">
                  <img src={sourceImage} className="w-full aspect-video object-cover" alt="Source" />
                  <button type="button" onClick={() => { setSourceImage(null); if (generationMode !== 'text-to-image') setGenerationMode('text-to-image') }}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-black/70 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 border border-dashed border-zinc-800 rounded-lg flex flex-col items-center gap-2 hover:border-zinc-600 hover:bg-zinc-900/30 transition-all group">
                  <Upload size={18} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  <span className="text-[11px] text-zinc-600 group-hover:text-zinc-400">Upload image</span>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </button>
              )}
            </Section>
          </div>

          {/* Generate Button */}
          <div className="p-4 border-t border-zinc-800/60">
            <button type="submit" disabled={state === 'loading' || (!prompt.trim() && !sourceImage)}
              className="w-full py-3 rounded-lg text-[13px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20">
              {state === 'loading' ? (
                <><Loader2 size={15} className="animate-spin" />Generating...</>
              ) : (
                <><Zap size={15} />Generate</>
              )}
            </button>
          </div>
        </form>
      </aside>

      {/* ── Center: Canvas ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-zinc-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-md hover:bg-zinc-800/50 text-zinc-500 transition-colors">
              <Layers size={15} />
            </button>
            <div className="h-4 w-px bg-zinc-800" />
            {state === 'success' && (
              <span className="text-[11px] text-zinc-500">
                {aestheticName} · {renderType} · {generationTime.toFixed(1)}s
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {state === 'success' && (
              <>
                <button onClick={handleDownload}
                  className="p-2 rounded-md hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 transition-colors" title="Download">
                  <Download size={15} />
                </button>
                <button onClick={() => setIsEnlarged(true)}
                  className="p-2 rounded-md hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 transition-colors" title="Fullscreen">
                  <Maximize2 size={15} />
                </button>
                <button onClick={() => setState('idle')}
                  className="p-2 rounded-md hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 transition-colors" title="New render">
                  <RotateCcw size={15} />
                </button>
                <div className="h-4 w-px bg-zinc-800" />
              </>
            )}
            <button onClick={() => setChatOpen(!chatOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                chatOpen ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}>
              <MessageSquare size={13} />
              Chat
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-6 relative bg-[#0d0d0d]">
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }} />

            <div className="relative w-full max-w-4xl">
              <AnimatePresence mode="wait">
                {state === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="aspect-video rounded-xl border border-zinc-800/60 bg-zinc-900/30 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-zinc-800/50 flex items-center justify-center mx-auto">
                        <Sparkles size={24} className="text-zinc-600" />
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-zinc-400">Ready to generate</p>
                        <p className="text-[12px] text-zinc-600 mt-1">
                          {STYLES.length} styles · {RENDER_TYPES.length} render types · {GENERATION_MODES.length} modes
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {state === 'loading' && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="aspect-video rounded-xl border border-zinc-800/60 bg-zinc-900/50 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-zinc-700 border-t-emerald-500 animate-spin" />
                      </div>
                      <div>
                        <p className="text-[13px] text-zinc-300">Generating...</p>
                        <p className="text-[11px] text-zinc-600 mt-1">{elapsedTime}s elapsed</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {state === 'success' && generatedImage && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="aspect-video rounded-xl overflow-hidden border border-zinc-800/60 bg-black relative group">
                    <img src={generatedImage} className="w-full h-full object-contain" alt="Generated" />
                  </motion.div>
                )}

                {state === 'error' && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="aspect-video rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
                    <div className="text-center space-y-3 max-w-sm px-6">
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto">
                        <X size={20} className="text-red-400" />
                      </div>
                      <p className="text-[13px] text-zinc-300">Generation failed</p>
                      <p className="text-[12px] text-zinc-500">{errorMessage}</p>
                      <button onClick={() => setState('idle')}
                        className="text-[12px] text-emerald-400 hover:text-emerald-300 transition-colors">
                        Try again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* History strip at bottom */}
            {history.length > 0 && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {history.map((item, i) => (
                    <button key={i} onClick={() => { setGeneratedImage(item.image); setState('success') }}
                      className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors relative group">
                      <img src={item.image} className="w-full h-full object-cover" alt={`History ${i + 1}`} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[9px] text-zinc-300 font-medium">{item.style}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Panel: Chat ── */}
          <AnimatePresence>
            {chatOpen && (
              <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 340, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                className="border-l border-zinc-800/60 flex flex-col overflow-hidden shrink-0 bg-[#0a0a0a]">
                {/* Chat Header */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800/60 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                      <MessageSquare size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-[13px] font-medium text-zinc-300">AI Editor</span>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="p-1.5 rounded-md hover:bg-zinc-800/50 text-zinc-600 transition-colors">
                    <X size={14} />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                  {chatMessages.length === 0 && (
                    <div className="py-8">
                      <p className="text-[12px] text-zinc-600 text-center mb-4">Refine your design with natural language</p>
                      <div className="space-y-1.5">
                        {['Make the ceiling higher', 'Change the sofa to leather', 'Add more natural light', 'Switch to warmer tones'].map((s) => (
                          <button key={s} onClick={() => setChatInput(s)}
                            className="block w-full text-left px-3 py-2 rounded-md text-[11px] text-zinc-500 bg-zinc-900/30 border border-zinc-800/40 hover:bg-zinc-800/40 hover:text-zinc-300 transition-all">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        msg.role === 'user' ? 'bg-emerald-500/10 text-zinc-200' : 'bg-zinc-800/40 text-zinc-300'
                      }`}>
                        <p className="text-[12px] leading-relaxed">{msg.content}</p>
                        {msg.imageBase64 && (
                          <img src={`data:image/png;base64,${msg.imageBase64}`} alt="AI result" className="mt-2 rounded-md w-full cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => { setGeneratedImage(`data:image/png;base64,${msg.imageBase64}`); setState('success') }} />
                        )}
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg px-3 py-2 bg-zinc-800/40 flex items-center gap-2">
                        <Loader2 size={12} className="animate-spin text-emerald-400" />
                        <span className="text-[11px] text-zinc-500">Generating...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t border-zinc-800/60">
                  <div className="flex items-end gap-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50 p-2 focus-within:border-emerald-500/30 transition-colors">
                    <textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend() } }}
                      placeholder="Describe changes..." rows={1}
                      className="flex-1 bg-transparent text-[12px] text-zinc-200 placeholder:text-zinc-700 resize-none outline-none py-1 px-1 max-h-20" />
                    <button onClick={handleChatSend} disabled={!chatInput.trim() || chatLoading}
                      className="p-1.5 rounded-md text-emerald-500 hover:bg-emerald-500/10 disabled:opacity-30 transition-all">
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isEnlarged && generatedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/95 backdrop-blur-sm"
            onClick={() => setIsEnlarged(false)}>
            <button onClick={() => setIsEnlarged(false)} className="absolute top-6 right-6 p-3 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <img src={generatedImage} className="max-w-full max-h-full object-contain rounded-xl" alt="Fullscreen" onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Utility Components ──

function Section({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-zinc-600">{icon}</span>
        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">{label}</span>
      </div>
      {children}
    </div>
  )
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-[12px] text-zinc-300 hover:border-zinc-700 transition-colors">
        {value}
        <ChevronDown size={13} className={`text-zinc-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 w-full mt-1 rounded-md border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/30 max-h-48 overflow-y-auto scrollbar-hide">
            {options.map((opt) => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false) }}
                className={`w-full px-3 py-2 text-left text-[12px] transition-colors ${
                  value === opt ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}>
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
