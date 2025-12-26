
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video, GoogleGenAI} from '@google/genai';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import ApiKeyDialog from './components/ApiKeyDialog';
import LoadingIndicator from './components/LoadingIndicator';
import PromptForm from './components/PromptForm';
import VideoResult from './components/VideoResult';
import {generateVideo, generateImage} from './services/geminiService';
import {
  AppState,
  GenerateVideoParams,
  GenerationMode,
  Resolution,
  HistoryItem,
  TimelineSegment,
  AspectRatio,
  WorkspaceMode,
  ImageGenerationParams,
  ChatMessage
} from './types';
import { 
  Settings,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  MessageSquare,
  Send,
  Zap,
  TrendingUp,
  Building2,
  ChevronRight,
  Compass,
  LayoutGrid,
  Monitor,
  MousePointer2,
  Sparkles,
  Activity,
  X,
  Play,
  Layers,
  CheckCircle2,
  Cpu,
  Globe
} from 'lucide-react';

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="relative w-full bg-black overflow-y-auto scroll-smooth">
    {/* Section 1: Hero */}
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2400" 
          className="w-full h-full object-cover opacity-60 animate-[pulse_25s_infinite_alternate]" 
          alt="Modern Architecture"
        />
        <div className="blueprint-grid absolute inset-0 opacity-10 z-0"></div>
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-7xl animate-in">
        <div className="inline-flex items-center gap-3 mb-10 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-3xl shadow-2xl">
          <Sparkles size={14} className="text-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">ARCHITECT OS v3.2_PRODUCTION_BUILD</span>
        </div>

        <h1 className="text-7xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.8] mb-12">
          SPATIAL <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">INTELLIGENCE</span>
        </h1>

        <p className="text-gray-400 text-xl md:text-2xl font-light max-w-3xl mb-16 leading-relaxed">
          The autonomous design engine for high-stakes real estate. 
          <span className="text-white font-medium"> Cinematic renders, technical logic, and market-ready ROI analysis </span> 
          synthesized in milliseconds.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          <button 
            onClick={onStart}
            className="group relative px-16 py-8 bg-white text-black font-black text-sm uppercase tracking-[0.6em] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_100px_rgba(255,255,255,0.15)]"
          >
            <span className="relative z-10 flex items-center gap-4">
              Enter the Studio <ArrowUpRight size={22} />
            </span>
          </button>
          <a 
            href="#showcase"
            className="px-16 py-8 bg-transparent text-white border border-white/10 font-black text-sm uppercase tracking-[0.6em] rounded-full hover:bg-white/5 transition-all flex items-center gap-4 group"
          >
            Showcase <Play size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-12 md:gap-32 text-gray-500">
        {[
          { label: '4K FIDELITY', icon: <Monitor size={14} /> },
          { label: 'VEO 3.1 CORE', icon: <Cpu size={14} /> },
          { label: 'ROI TELEMETRY', icon: <TrendingUp size={14} /> }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-4">
            <div className="p-3 border border-white/5 rounded-full bg-white/5">{item.icon}</div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Section 2: Capabilities Grid */}
    <section className="py-32 px-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            title: "Cinematic Rendering",
            desc: "Ultra-photorealistic interior and exterior visualization using Gemini 3 Pro reasoning.",
            keywords: ["PBR Materials", "Global Illumination", "8K Textures"]
          },
          {
            title: "Temporal Synthesis",
            desc: "Convert static concepts into cinematic 720p/1080p walkthroughs with Veo 3.1.",
            keywords: ["Fluid Motion", "Dynamic Lighting", "Seamless Extension"]
          },
          {
            title: "Investment Logic",
            desc: "Integrated Archi-Advisor analyzes spatial flow and provides structural market intelligence.",
            keywords: ["ROI Estimates", "Structural Viability", "Cost Analysis"]
          }
        ].map((card, i) => (
          <div key={i} className="group p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.04] hover:border-white/10 transition-all">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">{card.title}</h3>
            <p className="text-gray-400 font-light mb-10 leading-relaxed">{card.desc}</p>
            <div className="flex flex-wrap gap-2">
              {card.keywords.map((k, j) => (
                <span key={j} className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/5 rounded-full text-gray-500">{k}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Section 3: The Mission */}
    <section className="py-40 bg-white/[0.01] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="relative group">
          <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600" 
            className="relative z-10 rounded-[4rem] shadow-2xl border border-white/10" 
            alt="AI Architecture"
          />
        </div>
        <div className="space-y-12">
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
            ENGINEERED <br /> FOR THE <span className="text-indigo-500 italic">ELITE.</span>
          </h2>
          <p className="text-gray-400 text-xl font-light leading-relaxed">
            Our mission is to eliminate the friction between concept and reality. Architect OS doesn't just draw pixels; it understands spatial logic, structural requirements, and aesthetic prestige.
          </p>
          <ul className="space-y-6">
            {[
              "Autonomous material selection",
              "Biophilic design integration",
              "Real-time lighting simulation",
              "Direct CAD blueprint synthesis"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-4 text-gray-300 font-bold uppercase tracking-widest text-xs">
                <CheckCircle2 size={20} className="text-indigo-500" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* Section 4: Call to Action */}
    <section className="py-40 text-center px-6">
      <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-16">
        READY TO INITIALIZE?
      </h2>
      <button 
        onClick={onStart}
        className="px-20 py-10 bg-indigo-600 text-white font-black text-sm uppercase tracking-[1em] rounded-full hover:bg-indigo-500 transition-all shadow-[0_0_120px_rgba(79,70,229,0.3)] active:scale-95"
      >
        Launch Studio Console
      </button>
    </section>

    {/* Footer */}
    <footer className="py-20 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black">A</div>
          <span className="text-sm font-black tracking-[0.4em]">ARCHITECT OS</span>
        </div>
        <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Showcase</a>
          <a href="#" className="hover:text-white transition-colors">Status</a>
        </div>
        <div className="text-gray-700 text-[10px] font-mono">
          © 2025 SPATIAL INTEL. ALPHA_v3.2
        </div>
      </div>
    </footer>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>(WorkspaceMode.IMAGE);
  
  const [timeline, setTimeline] = useState<TimelineSegment[]>([]);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
  
  // Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: "Studio connected. System telemetry at 100%. I am Archi-Advisor—available for structural audit, ROI analysis, or material feasibility." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const [lastConfig, setLastConfig] = useState<any | null>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<any | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === 'workspace') {
      const checkApiKey = async () => {
        if (window.aistudio) {
          try {
            if (!(await window.aistudio.hasSelectedApiKey())) setShowApiKeyDialog(true);
          } catch (error) { setShowApiKeyDialog(true); }
        }
      };
      checkApiKey();
    }
  }, [view]);

  const handleChat = async (presetMessage?: string) => {
    const message = presetMessage || chatInput;
    if (!message.trim() || isChatLoading) return;
    
    setChatInput('');
    if (!presetMessage) setChatHistory(prev => [...prev, { role: 'user', text: message }]);
    setIsChatOpen(true);
    setIsChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Architectural Consultation. Context: "${lastConfig?.prompt || 'System Idle'}". Request: ${message}`,
        config: { 
          systemInstruction: "You are a senior architectural strategist. Focus on materials, costs, ROI, and spatial intelligence. Use professional, terse language." 
        }
      });
      setChatHistory(prev => [...prev, { role: 'model', text: response.text || "No response generated." }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Link error. Please retry." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGenerateVideo = useCallback(async (params: GenerateVideoParams) => {
    setAppState(AppState.LOADING);
    setLastConfig(params);
    try {
      const {objectUrl, video} = await generateVideo(params);
      setTimeline(prev => [...prev, { id: crypto.randomUUID(), url: objectUrl, videoObject: video, prompt: params.prompt }]);
      setAppState(AppState.SUCCESS);
    } catch (error) { setAppState(AppState.ERROR); }
  }, []);

  const handleGenerateImage = useCallback(async (params: ImageGenerationParams) => {
    setAppState(AppState.LOADING);
    setLastConfig(params);
    try {
      const imageUrl = await generateImage(params);
      setGeneratedImg(imageUrl);
      setAppState(AppState.SUCCESS);
    } catch (error) { setAppState(AppState.ERROR); }
  }, []);

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('workspace')} />;
  }

  return (
    <div className="h-screen bg-[#050505] text-gray-200 flex flex-col font-sans overflow-hidden">
      {showApiKeyDialog && <ApiKeyDialog onContinue={() => { window.aistudio.openSelectKey(); setShowApiKeyDialog(false); }} />}
      
      {/* Refined Studio Header */}
      <header className="h-20 flex justify-between items-center px-10 border-b border-white/5 bg-black/80 backdrop-blur-2xl z-40 shrink-0">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('landing')}>
             <div className="w-11 h-11 bg-white text-black rounded-2xl flex items-center justify-center font-black transition-all group-hover:rotate-6 shadow-xl shadow-white/10">A</div>
             <div>
               <h1 className="text-xs font-black tracking-[0.3em] text-white uppercase">ARCHITECT STUDIO</h1>
               <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-[8px] font-black text-indigo-500/60 uppercase tracking-[0.2em]">CONNECTED_SESSION_3.2.0</span>
               </div>
             </div>
          </div>
          
          <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
              <button 
                onClick={() => setWorkspaceMode(WorkspaceMode.IMAGE)} 
                className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all ${workspaceMode === WorkspaceMode.IMAGE ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                <LayoutGrid size={12} /> Design Lab
              </button>
              <button 
                onClick={() => setWorkspaceMode(WorkspaceMode.VIDEO)} 
                className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all ${workspaceMode === WorkspaceMode.VIDEO ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                <Monitor size={12} /> Motion Synth
              </button>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="flex flex-col items-end">
              <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">TELEMETRY</span>
              <span className="text-[10px] font-mono text-green-500">14.2 MS LATENCY</span>
           </div>
           <button onClick={() => window.aistudio.openSelectKey()} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
              <Settings size={18} />
           </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden relative blueprint-grid">
        <aside className="w-[420px] border-r border-white/5 bg-[#080808] flex flex-col overflow-y-auto shrink-0 z-20 shadow-2xl scrollbar-hide">
           <PromptForm mode={workspaceMode} onGenerateVideo={handleGenerateVideo} onGenerateImage={handleGenerateImage} initialValues={initialFormValues} isLoading={appState === AppState.LOADING} />
        </aside>

        <main className="flex-grow flex flex-col items-center justify-center p-12 relative overflow-hidden bg-[#020202]">
          {appState === AppState.IDLE && (
            <div className="text-center animate-in max-w-xl space-y-12">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
                <div className="w-40 h-40 bg-white/[0.03] border border-white/5 rounded-[4rem] flex items-center justify-center relative z-10 mx-auto shadow-2xl animate-[spin_20s_linear_infinite]">
                   <Compass size={64} className="text-gray-800" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">OS_READY_FOR_INPUT</h2>
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em] leading-loose max-w-sm mx-auto">Define spatial vectors in the configuration console to begin architectural synthesis.</p>
              </div>
            </div>
          )}

          {appState === AppState.LOADING && <LoadingIndicator />}

          {appState === AppState.SUCCESS && (
            workspaceMode === WorkspaceMode.VIDEO ? (
              <VideoResult videoUrl={timeline[timeline.length-1].url} timeline={timeline} onNewVideo={() => setAppState(AppState.IDLE)} onExtend={() => {}} />
            ) : (
              generatedImg && (
                <div className="flex flex-col items-center gap-12 animate-in w-full max-w-[90rem]">
                   <div className="relative group w-full aspect-video rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.9)] bg-black/40 backdrop-blur-3xl transition-all">
                      <img src={generatedImg} className="w-full h-full object-contain" alt="render" />
                      
                      {/* Interactive Workspace HUD */}
                      <div className="absolute top-12 right-12 flex flex-col gap-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-10 group-hover:translate-x-0">
                         <button 
                           onClick={() => setIsEnlarged(true)} 
                           className="p-6 bg-black/60 backdrop-blur-3xl text-white rounded-[1.5rem] hover:bg-white hover:text-black border border-white/10 transition-all shadow-2xl flex items-center justify-center group/btn"
                         >
                            <Maximize2 size={24} className="group-hover/btn:scale-110 transition-transform" />
                         </button>
                         <button 
                           onClick={() => { setWorkspaceMode(WorkspaceMode.VIDEO); setInitialFormValues({ startFrame: { base64: generatedImg.split(',')[1], name: 'ref.png' } }); }} 
                           className="p-6 bg-black/60 backdrop-blur-3xl text-indigo-400 rounded-[1.5rem] hover:bg-indigo-600 hover:text-white border border-indigo-500/20 transition-all shadow-2xl flex items-center justify-center group/btn"
                         >
                            <Zap size={24} className="group-hover/btn:scale-110 transition-transform" />
                         </button>
                      </div>

                      <div className="absolute bottom-12 left-12 opacity-0 group-hover:opacity-100 transition-all delay-200 translate-y-10 group-hover:translate-y-0">
                         <button 
                           onClick={() => handleChat("Run high-level ROI and market analysis for this architectural render.")}
                           className="px-10 py-5 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all shadow-2xl"
                         >
                            <TrendingUp size={18} className="text-amber-500 group-hover:text-black transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white group-hover:text-black transition-colors">Market Telemetry Ready</span>
                         </button>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-16">
                      <button 
                        onClick={() => { setWorkspaceMode(WorkspaceMode.VIDEO); setInitialFormValues({ startFrame: { base64: generatedImg.split(',')[1], name: 'ref.png' } }); }}
                        className="px-20 py-8 bg-white text-black font-black text-[11px] uppercase tracking-[0.8em] rounded-full hover:bg-gray-200 transition-all flex items-center gap-6 shadow-2xl group active:scale-95"
                      >
                        <ArrowUpRight size={22} className="group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform" />
                        Execute Motion Synth
                      </button>
                      <button onClick={() => setAppState(AppState.IDLE)} className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] hover:text-white transition-colors border-b border-white/5 hover:border-white pb-1">Reset Synthesis</button>
                   </div>
                </div>
              )
            )
          )}

          {/* Full Screen High-Res Portal */}
          {isEnlarged && generatedImg && (
            <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-10 animate-in">
               <div className="absolute top-12 right-12 flex gap-6 z-20">
                  <button onClick={() => setIsEnlarged(false)} className="p-8 bg-white/5 border border-white/10 text-white rounded-[2rem] hover:bg-red-600 hover:border-red-500 transition-all group">
                     <X size={32} className="group-hover:scale-110 transition-transform" />
                  </button>
               </div>
               <img src={generatedImg} className="max-w-full max-h-full object-contain animate-in transition-all duration-1000" alt="high-fidelity-render" />
            </div>
          )}

          {/* Archi-Advisor Console */}
          <div className="fixed bottom-12 right-12 z-50 flex flex-col items-end gap-8">
             {isChatOpen && (
               <div className="w-[480px] h-[640px] bg-[#0c0c0e]/95 backdrop-blur-3xl border border-white/10 rounded-[4rem] shadow-2xl flex flex-col overflow-hidden animate-in">
                  <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-3xl flex items-center justify-center shadow-inner"><Zap size={28} /></div>
                        <div>
                          <h3 className="text-[13px] font-black uppercase tracking-[0.4em] text-white">ADVISOR CORE</h3>
                          <span className="text-[8px] font-black text-indigo-500/50 uppercase tracking-[0.3em]">SYNTHETIC_STRATEGY_v4</span>
                        </div>
                     </div>
                     <button onClick={() => setIsChatOpen(false)} className="p-4 text-gray-600 hover:text-white transition-colors bg-white/5 rounded-2xl"><X size={20} /></button>
                  </div>
                  
                  <div className="flex-grow p-10 overflow-y-auto flex flex-col gap-10 text-[12px] font-light leading-[2] text-gray-400 scrollbar-hide">
                     {chatHistory.map((m, i) => (
                       <div key={i} className={`p-8 rounded-[2.5rem] shadow-xl ${m.role === 'user' ? 'bg-indigo-500/10 ml-16 text-indigo-50 border border-indigo-500/10' : 'bg-white/[0.02] mr-16 border border-white/5'}`}>
                         {m.text}
                       </div>
                     ))}
                     {isChatLoading && (
                       <div className="flex items-center gap-4 px-4 text-indigo-400 font-black text-[9px] uppercase tracking-widest animate-pulse">
                         <Activity size={12} /> Synthesizing telemetry...
                       </div>
                     )}
                     <div ref={chatEndRef} />
                  </div>

                  <div className="p-10 border-t border-white/5 bg-white/[0.01] flex gap-5">
                     <input 
                       value={chatInput} 
                       onChange={e => setChatInput(e.target.value)} 
                       onKeyDown={e => e.key === 'Enter' && handleChat()} 
                       placeholder="Inquiry (ROI, Structural, Costs)..." 
                       className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-[12px] outline-none text-white focus:border-indigo-500/30 transition-all placeholder:text-gray-800" 
                     />
                     <button onClick={() => handleChat()} className="w-20 h-20 bg-white text-black rounded-3xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center shadow-2xl active:scale-90"><Send size={28} /></button>
                  </div>
               </div>
             )}
             <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-28 h-28 rounded-full shadow-2xl transition-all flex items-center justify-center group ${isChatOpen ? 'bg-white text-black' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-110 active:scale-90 shadow-[0_0_100px_rgba(79,70,229,0.3)]'}`}>
                <MessageSquare size={36} className="group-hover:rotate-6 transition-transform" />
             </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
