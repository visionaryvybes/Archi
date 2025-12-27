'use client'

import { useState, useRef, useEffect } from 'react'
import { Settings, Camera, X, Layers, ChevronRight, ChevronDown, Upload, Maximize2 } from 'lucide-react'
import * as Select from '@radix-ui/react-select'
import { LoadingAnimation } from '@/components/studio/loading-animation'

type AppState = 'idle' | 'loading' | 'success' | 'error'
type Tab = 'workspace' | 'vault'

const RENDER_TYPES = ['Interior Design', '2D/3D Floor Plan', 'Exterior/Architectural', 'Technical Blueprint', 'Landscape/Garden']
const AESTHETICS = ['Modern Minimalist', 'Scandinavian', 'Industrial', 'Bauhaus', 'Brutalist', 'Classic European']
const ROOM_TYPES = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Office', 'Dining Room', 'Home Theater', 'Gym', 'Entryway', 'Outdoor/Patio']

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('workspace')
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

  // Show room type selector only for Interior Design and Floor Plan
  const showRoomType = renderType === 'Interior Design' || renderType === '2D/3D Floor Plan'

  // Timer logic
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
    setEstimatedTime(45)

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
    <div className="h-screen bg-black text-gray-200 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
              V
            </div>
            <span className="text-sm font-black uppercase tracking-[0.2em]">ARCHI-LAB</span>
          </a>

          <div className="flex items-center gap-4">
            {(['workspace', 'vault'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2 text-xs font-black uppercase tracking-[0.2em] transition-all ${
                  activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black uppercase tracking-[0.15em] rounded-lg hover:shadow-lg transition-all">
            Design Lab
          </button>
          <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.15em] rounded-lg hover:bg-white/10 transition-all">
            Simulate
          </button>
          <button className="p-2.5 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
            <Settings size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[340px] border-r border-white/5 bg-[#0a0a0a] flex flex-col overflow-y-auto shrink-0 scrollbar-hide">
          <form onSubmit={handleGenerate} className="flex flex-col h-full p-6 space-y-6">
            {/* Design Brief */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Design Brief</span>
              </div>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your vision..."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-gray-300 outline-none focus:border-emerald-500/50 focus:bg-black/60 transition-all resize-none placeholder:text-gray-700"
              />
            </div>

            {/* Render Config */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-gray-600">
                <Layers size={12} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Render Config</span>
              </div>
              <div className="space-y-3">
                <CustomSelect value={renderType} options={RENDER_TYPES} onChange={setRenderType} />
                {showRoomType && (
                  <CustomSelect value={roomType} options={ROOM_TYPES} onChange={setRoomType} />
                )}
                <CustomSelect value={aesthetic} options={AESTHETICS} onChange={setAesthetic} />
              </div>
            </div>

            {/* Aspect Ratio & Quality */}
            <div className="grid grid-cols-3 gap-2">
              {['16:9', '1:1', '9:16'].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-3 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                    aspectRatio === ratio
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-gray-600 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['1K SD', '2K HD', '4K UHD'].map((qual) => (
                <button
                  key={qual}
                  type="button"
                  onClick={() => setQuality(qual)}
                  className={`py-3 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                    quality === qual
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-gray-600 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {qual}
                </button>
              ))}
            </div>

            {/* Site Context */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-gray-600">
                <Layers size={12} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Site Context</span>
              </div>
              {sourceImage ? (
                <div className="relative group rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={sourceImage} className="w-full aspect-video object-cover" alt="Source" />
                  <button
                    type="button"
                    onClick={() => setSourceImage(null)}
                    className="absolute top-2 right-2 p-2 bg-black/80 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-12 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
                >
                  <Camera size={32} className="text-gray-700 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                    Input Source / Photo
                  </span>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </button>
              )}
            </div>

            {/* Generate Button */}
            <div className="mt-auto pt-6 border-t border-white/5">
              <button
                type="submit"
                disabled={state === 'loading' || (!prompt.trim() && !sourceImage)}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-black text-xs font-black uppercase tracking-[0.3em] rounded-xl hover:shadow-glow transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {state === 'loading' ? (
                  'Architectural Render In Progress...'
                ) : (
                  <>
                    Execute Render
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </aside>

        {/* Main Canvas */}
        <main className="flex-grow flex flex-col items-center justify-center p-12 relative overflow-hidden bg-black">
          {state === 'idle' && (
            <div className="text-center space-y-8">
              <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto">
                <Upload size={48} className="text-gray-800" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">OS Ready for Input</h2>
                <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-gray-700">
                  Configure parameters to begin
                </p>
              </div>
            </div>
          )}

          {state === 'loading' && (
            <LoadingAnimation elapsedTime={elapsedTime} estimatedRemaining={estimatedTime} />
          )}

          {state === 'success' && generatedImage && (
            <div className="w-full max-w-6xl space-y-6">
              <div className="relative group aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img src={generatedImage} className="w-full h-full object-contain" alt="Generated" />
                <button
                  onClick={() => setIsEnlarged(true)}
                  className="absolute top-6 right-6 p-4 bg-black/60 backdrop-blur-xl text-white rounded-xl hover:bg-white hover:text-black border border-white/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Maximize2 size={20} />
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setState('idle')}
                  className="px-12 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-full hover:shadow-glow transition-all"
                >
                  New Render
                </button>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="text-center space-y-6">
              <div className="text-red-500 text-5xl">⚠</div>
              <p className="text-xl font-black text-white uppercase">Generation Failed</p>
              <button
                onClick={() => setState('idle')}
                className="px-10 py-3 bg-white/10 border border-white/20 text-white font-bold uppercase rounded-full hover:bg-white/20 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Fullscreen View */}
          {isEnlarged && generatedImage && (
            <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-10">
              <button
                onClick={() => setIsEnlarged(false)}
                className="absolute top-10 right-10 p-6 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-red-600 transition-all"
              >
                <X size={28} />
              </button>
              <img src={generatedImage} className="max-w-full max-h-full object-contain" alt="Fullscreen" />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function CustomSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-sm font-bold uppercase tracking-wider text-amber-500 hover:bg-black/60 hover:border-emerald-500/30 transition-all"
      >
        {value}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-black border border-white/10 rounded-lg overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
              className={`w-full px-4 py-3 text-left text-xs font-black uppercase tracking-wider transition-all ${
                value === opt
                  ? 'bg-white text-black'
                  : 'text-gray-600 hover:bg-white/5 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
