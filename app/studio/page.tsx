'use client'

import { useState, useRef } from 'react'
import { Settings, Camera, Terminal, Sparkles, X, Layers, ChevronDown, Check, ChevronRight, Cpu, Upload, Loader2, Maximize2 } from 'lucide-react'

type AppState = 'idle' | 'loading' | 'success' | 'error'
type AspectRatio = '16:9' | '1:1' | '9:16'
type Quality = '1K' | '2K' | '4K'

const ROOM_TYPES = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining Room', 'Office', 'Exterior']
const DESIGN_STYLES = ['Modern', 'Minimalist', 'Industrial', 'Scandinavian', 'Bohemian', 'Mid-Century', 'Coastal', 'Rustic', 'Contemporary', 'Luxury']

export default function StudioPage() {
  const [state, setState] = useState<AppState>('idle')
  const [prompt, setPrompt] = useState('')
  const [roomType, setRoomType] = useState('Living Room')
  const [designStyle, setDesignStyle] = useState('Modern')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')
  const [quality, setQuality] = useState<Quality>('2K')
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isEnlarged, setIsEnlarged] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    try {
      const imageBase64 = sourceImage?.split(',')[1] || ''
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${roomType} in ${designStyle} style. ${prompt}`,
          style: designStyle.toLowerCase(),
          imageBase64,
          aspectRatio
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
      {/* Header */}
      <header className="h-20 flex justify-between items-center px-10 border-b border-white/5 bg-black/80 backdrop-blur-2xl z-40 shrink-0">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-4 group">
            <div className="w-11 h-11 bg-white text-black rounded-2xl flex items-center justify-center font-black transition-all group-hover:rotate-6 shadow-xl shadow-white/10">V</div>
            <div>
              <h1 className="text-xs font-black tracking-[0.3em] text-white uppercase">Visionary Studio</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black text-emerald-500/60 uppercase tracking-[0.2em]">CONNECTED v2.0</span>
              </div>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">TELEMETRY</span>
            <span className="text-[10px] font-mono text-emerald-500">READY</span>
          </div>
          <button className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
            <Settings size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Left Sidebar - Controls */}
        <aside className="w-[420px] border-r border-white/5 bg-[#080808] flex flex-col overflow-y-auto shrink-0 z-20 shadow-2xl scrollbar-hide">
          <form onSubmit={handleGenerate} className="flex flex-col h-full">
            <div className="p-10 space-y-10 pb-40">
              {/* Header */}
              <div className="flex items-center gap-4 px-2 py-4 border-b border-white/5">
                <div className="p-3 bg-white/5 rounded-2xl"><Cpu size={18} className="text-emerald-400" /></div>
                <div>
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">CONSOLE v2.0</span>
                  <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest mt-1">CORE ACTIVE</p>
                </div>
              </div>

              {/* Prompt */}
              <section>
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Terminal size={14} />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Design Brief</span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/10 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500 transition-all"
                  >
                    <Sparkles size={11} className="text-amber-500" />
                    Enhance
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe the interior design you want to create..."
                  className="w-full h-40 bg-white/[0.01] border border-white/5 rounded-3xl p-8 text-[12px] font-light text-gray-300 outline-none focus:border-emerald-500/30 focus:bg-white/[0.03] transition-all resize-none leading-relaxed shadow-inner placeholder:text-gray-800"
                />
              </section>

              {/* Room Type */}
              <Select label="Room Type" value={roomType} options={ROOM_TYPES} onChange={setRoomType} />

              {/* Design Style */}
              <Select label="Design Style" value={designStyle} options={DESIGN_STYLES} onChange={setDesignStyle} />

              {/* Aspect Ratio */}
              <div>
                <label className="block text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 mb-4 ml-1">Aspect Ratio</label>
                <div className="flex p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl shadow-inner">
                  {(['16:9', '1:1', '9:16'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 py-4 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${aspectRatio === ratio ? 'bg-white text-black shadow-2xl scale-[1.02]' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 mb-4 ml-1">Quality</label>
                <div className="flex p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl shadow-inner">
                  {(['1K', '2K', '4K'] as Quality[]).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuality(q)}
                      className={`flex-1 py-4 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${quality === q ? 'bg-white text-black shadow-2xl scale-[1.02]' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <section>
                <div className="flex items-center gap-3 text-gray-700 px-1 mb-6">
                  <Layers size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em]">Source Image</span>
                </div>
                {sourceImage ? (
                  <div className="relative group aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                    <img src={sourceImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Source" />
                    <button
                      type="button"
                      onClick={() => setSourceImage(null)}
                      className="absolute top-6 right-6 p-3 bg-black/80 text-white rounded-2xl hover:bg-red-600 transition-all border border-white/10 shadow-2xl"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-16 bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem] flex flex-col items-center justify-center gap-6 hover:bg-white/[0.03] hover:border-emerald-500/40 transition-all group shadow-inner"
                  >
                    <div className="p-6 bg-white/5 rounded-[2rem] group-hover:scale-110 transition-transform shadow-2xl">
                      <Camera size={40} className="text-gray-700 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 block mb-2">Upload Image</span>
                      <span className="text-[7px] font-black text-gray-800 uppercase tracking-widest">DRAG & DROP SUPPORTED</span>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </button>
                )}
              </section>
            </div>

            {/* Submit Button */}
            <div className="mt-auto p-10 bg-[#080808]/90 backdrop-blur-3xl border-t border-white/5 fixed bottom-0 w-[420px] z-30">
              <button
                type="submit"
                disabled={state === 'loading' || (!prompt.trim() && !sourceImage)}
                className="group relative w-full py-10 rounded-[2.5rem] font-black uppercase tracking-[0.8em] text-[12px] transition-all overflow-hidden flex items-center justify-center gap-6 bg-white text-black shadow-[0_0_100px_rgba(255,255,255,0.08)] active:scale-95 disabled:opacity-20"
              >
                {state === 'loading' ? (
                  <div className="flex items-center gap-5">
                    <Loader2 size={24} className="animate-spin" />
                    <span>GENERATING...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">EXECUTE RENDER</span>
                    <ChevronRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </aside>

        {/* Main Canvas */}
        <main className="flex-grow flex flex-col items-center justify-center p-12 relative overflow-hidden bg-[#020202]">
          {state === 'idle' && (
            <div className="text-center max-w-xl space-y-12">
              <div className="w-40 h-40 bg-white/[0.03] border border-white/5 rounded-[4rem] flex items-center justify-center mx-auto shadow-2xl">
                <Upload size={64} className="text-gray-800" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Ready for Input</h2>
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em] leading-loose max-w-sm mx-auto">
                  Configure parameters and execute render to begin
                </p>
              </div>
            </div>
          )}

          {state === 'loading' && (
            <div className="text-center space-y-8">
              <Loader2 size={64} className="animate-spin text-emerald-500 mx-auto" />
              <p className="text-xl font-black text-white uppercase tracking-widest">Generating...</p>
            </div>
          )}

          {state === 'success' && generatedImage && (
            <div className="w-full max-w-6xl space-y-8">
              <div className="relative group aspect-video rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                <img src={generatedImage} className="w-full h-full object-contain" alt="Generated" />
                <button
                  onClick={() => setIsEnlarged(true)}
                  className="absolute top-8 right-8 p-6 bg-black/60 backdrop-blur-3xl text-white rounded-[1.5rem] hover:bg-white hover:text-black border border-white/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Maximize2 size={24} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={() => setState('idle')}
                  className="px-16 py-6 bg-white text-black font-black text-[11px] uppercase tracking-[0.8em] rounded-full hover:bg-gray-200 transition-all shadow-2xl active:scale-95"
                >
                  New Render
                </button>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="text-center space-y-6">
              <div className="text-red-500 text-6xl">⚠</div>
              <p className="text-xl font-black text-white uppercase">Generation Failed</p>
              <button
                onClick={() => setState('idle')}
                className="px-12 py-4 bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest rounded-full hover:bg-white/20 transition-all"
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
                className="absolute top-12 right-12 p-8 bg-white/5 border border-white/10 text-white rounded-[2rem] hover:bg-red-600 hover:border-red-500 transition-all"
              >
                <X size={32} />
              </button>
              <img src={generatedImage} className="max-w-full max-h-full object-contain" alt="Fullscreen" />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <label className="block text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 mb-4 ml-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-8 py-6 bg-white/[0.02] border border-white/5 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-white/5 text-left group"
      >
        <span className="text-gray-300 group-hover:text-white transition-colors">{value}</span>
        <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''} text-gray-700 group-hover:text-white`} />
      </button>

      {isOpen && (
        <div className="absolute z-[60] w-full mt-4 bg-[#0c0c0e] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl max-h-64 overflow-y-auto scrollbar-hide">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full flex items-center justify-between px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-none ${value === opt ? 'text-white bg-white/5' : 'text-gray-600'}`}
            >
              {opt}
              {value === opt && <Check size={14} className="text-emerald-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
