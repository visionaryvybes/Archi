'use client'

import { useState, useRef } from 'react'
import { Settings, Camera, ChevronUp, ChevronDown, X, Layers, ChevronRight, Cpu, Upload, Loader2, Maximize2 } from 'lucide-react'

type AppState = 'idle' | 'loading' | 'success' | 'error'

const MACRO_ENGINE_OPTIONS = [
  'INTERIOR DESIGN',
  'EXTERIOR/ARCHITECTURAL',
  '2D/3D FLOOR PLAN',
  'TECHNICAL BLUEPRINT',
  'LANDSCAPE/GARDEN',
  'MATERIAL STUDY',
  'RE-RENDER SOURCE'
]

const SPATIAL_DOMAIN_OPTIONS = [
  'LIVING ROOM',
  'KITCHEN / CULINARY',
  'MASTER SUITE',
  'SPA / BATHROOM',
  'HOME OFFICE / STUDIO',
  'HOME CINEMA',
  'WELLNESS / GYM'
]

const AESTHETIC_MATRIX_OPTIONS = [
  'MODERN MINIMALIST',
  'SCANDINAVIAN',
  'INDUSTRIAL',
  'BAUHAUS',
  'BRUTALIST',
  'CLASSIC EUROPEAN',
  'BIOPHILIC/ORGANIC'
]

export default function StudioPage() {
  const [state, setState] = useState<AppState>('idle')
  const [prompt, setPrompt] = useState('')

  // Expandable sections
  const [macroEngineOpen, setMacroEngineOpen] = useState(true)
  const [spatialDomainOpen, setSpatialDomainOpen] = useState(true)
  const [aestheticMatrixOpen, setAestheticMatrixOpen] = useState(true)

  // Selections
  const [macroEngine, setMacroEngine] = useState('INTERIOR DESIGN')
  const [spatialDomain, setSpatialDomain] = useState('LIVING ROOM')
  const [aestheticMatrix, setAestheticMatrix] = useState('MODERN MINIMALIST')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [fidelity, setFidelity] = useState('1K SD')

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
          prompt: `${spatialDomain} in ${aestheticMatrix} style. ${macroEngine}. ${prompt}`,
          style: aestheticMatrix.toLowerCase(),
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
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black text-indigo-500/60 uppercase tracking-[0.2em]">CONNECTED v2.0</span>
              </div>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">TELEMETRY</span>
            <span className="text-[10px] font-mono text-green-500">READY</span>
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
            <div className="p-10 space-y-8 pb-40">
              {/* Header */}
              <div className="flex items-center gap-4 px-2 py-4 border-b border-white/5">
                <div className="p-3 bg-white/5 rounded-2xl"><Cpu size={18} className="text-indigo-400" /></div>
                <div>
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">CONSOLE v2.0</span>
                  <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest mt-1">CORE ACTIVE</p>
                </div>
              </div>

              {/* Prompt */}
              <section>
                <div className="flex items-center gap-3 text-gray-700 px-1 mb-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em]">Design Directive</span>
                </div>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Materiality, illumination, spatial flow..."
                  className="w-full h-40 bg-white/[0.01] border border-white/5 rounded-3xl p-8 text-[12px] font-light text-gray-300 outline-none focus:border-indigo-500/30 focus:bg-white/[0.03] transition-all resize-none leading-relaxed shadow-inner placeholder:text-gray-800"
                />
              </section>

              {/* Macro Engine */}
              <CollapsibleSection
                label="MACRO ENGINE"
                isOpen={macroEngineOpen}
                onToggle={() => setMacroEngineOpen(!macroEngineOpen)}
                selected={macroEngine}
              >
                {MACRO_ENGINE_OPTIONS.map((option) => (
                  <RadioOption
                    key={option}
                    label={option}
                    selected={macroEngine === option}
                    onClick={() => setMacroEngine(option)}
                  />
                ))}
              </CollapsibleSection>

              {/* Spatial Domain */}
              <CollapsibleSection
                label="SPATIAL DOMAIN"
                isOpen={spatialDomainOpen}
                onToggle={() => setSpatialDomainOpen(!spatialDomainOpen)}
                selected={spatialDomain}
              >
                {SPATIAL_DOMAIN_OPTIONS.map((option) => (
                  <RadioOption
                    key={option}
                    label={option}
                    selected={spatialDomain === option}
                    onClick={() => setSpatialDomain(option)}
                  />
                ))}
              </CollapsibleSection>

              {/* Aesthetic Matrix */}
              <CollapsibleSection
                label="AESTHETIC MATRIX"
                isOpen={aestheticMatrixOpen}
                onToggle={() => setAestheticMatrixOpen(!aestheticMatrixOpen)}
                selected={aestheticMatrix}
              >
                {AESTHETIC_MATRIX_OPTIONS.map((option) => (
                  <RadioOption
                    key={option}
                    label={option}
                    selected={aestheticMatrix === option}
                    onClick={() => setAestheticMatrix(option)}
                  />
                ))}
              </CollapsibleSection>

              {/* Viewport Proportion */}
              <div>
                <label className="block text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 mb-4 ml-1">Viewport Proportion</label>
                <div className="flex gap-4">
                  {['16:9', '1:1', '9:16'].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all ${aspectRatio === ratio ? 'bg-white text-black shadow-2xl' : 'bg-white/5 text-gray-600 hover:text-white hover:bg-white/10'}`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fidelity Level */}
              <div>
                <label className="block text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 mb-4 ml-1">Fidelity Level</label>
                <div className="flex gap-4">
                  {['1K SD', '2K HD', '4K ULTRA'].map((qual) => (
                    <button
                      key={qual}
                      type="button"
                      onClick={() => setFidelity(qual)}
                      className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all ${fidelity === qual ? 'bg-white text-black shadow-2xl' : 'bg-white/5 text-gray-600 hover:text-white hover:bg-white/10'}`}
                    >
                      {qual}
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Seeding */}
              <section>
                <div className="flex items-center gap-3 text-gray-700 px-1 mb-6">
                  <Layers size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em]">Context Seeding</span>
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
                    className="w-full py-16 bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem] flex flex-col items-center justify-center gap-6 hover:bg-white/[0.03] hover:border-indigo-500/40 transition-all group shadow-inner"
                  >
                    <div className="p-6 bg-white/5 rounded-[2rem] group-hover:scale-110 transition-transform shadow-2xl">
                      <Camera size={40} className="text-gray-700 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 block mb-2">Import context photo</span>
                      <span className="text-[7px] font-black text-gray-800 uppercase tracking-widest">DRAG AND DROP SUPPORTED</span>
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
                    <span>INITIALIZING...</span>
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
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">OS_READY_FOR_INPUT</h2>
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em] leading-loose max-w-sm mx-auto">
                  Define spatial vectors in the configuration console to begin architectural synthesis.
                </p>
              </div>
            </div>
          )}

          {state === 'loading' && (
            <div className="text-center space-y-8">
              <Loader2 size={64} className="animate-spin text-indigo-500 mx-auto" />
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

function CollapsibleSection({
  label,
  isOpen,
  onToggle,
  selected,
  children
}: {
  label: string
  isOpen: boolean
  onToggle: () => void
  selected: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="px-1 mb-4">
        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-700">{label}</span>
      </div>

      {/* Collapsed Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-8 py-6 bg-white/[0.02] border border-white/5 rounded-3xl text-left group hover:bg-white/5 transition-all mb-4"
      >
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400 group-hover:text-indigo-300 transition-colors">
          {selected}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-700 group-hover:text-white transition-colors" />
        ) : (
          <ChevronDown size={16} className="text-gray-700 group-hover:text-white transition-colors" />
        )}
      </button>

      {/* Expanded Options */}
      {isOpen && (
        <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-2 mb-4 shadow-inner">
          {children}
        </div>
      )}
    </div>
  )
}

function RadioOption({
  label,
  selected,
  onClick
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-8 py-5 text-left hover:bg-white/5 transition-colors rounded-2xl border-b border-white/5 last:border-none"
    >
      <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${selected ? 'text-white' : 'text-gray-600'}`}>
        {label}
      </span>
      {selected && (
        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
      )}
    </button>
  )
}
