
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useRef, useState, useEffect} from 'react';
import {
  AspectRatio,
  GenerateVideoParams,
  GenerationMode,
  ImageFile,
  Resolution,
  VeoModel,
  WorkspaceMode,
  ImagePreset,
  ImageSize,
  ImageGenerationParams,
  DesignStyle,
  RoomType
} from '../types';
import { enhancePrompt } from '../services/geminiService';
import { Camera, Terminal, Sparkles, X, Layers, ChevronDown, Check, Dna, ChevronRight, Activity, Cpu } from 'lucide-react';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const SegmentedControl: React.FC<{
  options: { label: string; value: any }[];
  value: any;
  onChange: (val: any) => void;
  label?: string;
}> = ({ options, value, onChange, label }) => (
  <div className="mb-8">
    {label && <label className="block text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 mb-4 ml-1">{label}</label>}
    <div className="flex p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl shadow-inner">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(opt.value); }}
          className={`flex-1 py-4 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${value === opt.value ? 'bg-white text-black shadow-2xl scale-[1.02]' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const CustomSelect: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (val: any) => void;
  color?: 'amber' | 'indigo' | 'white';
}> = ({ label, value, options, onChange, color = 'white' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colorMap = {
    amber: 'text-amber-500',
    indigo: 'text-indigo-400',
    white: 'text-gray-300'
  };

  return (
    <div className="relative mb-8" ref={containerRef}>
      <label className="block text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 mb-4 ml-1">{label}</label>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className="w-full flex items-center justify-between px-8 py-6 bg-white/[0.02] border border-white/5 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-white/5 text-left group"
      >
        <span className={`${colorMap[color]} group-hover:text-white transition-colors`}>{value}</span>
        <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''} text-gray-700 group-hover:text-white`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-[60] w-full mt-4 bg-[#0c0c0e] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)] animate-in backdrop-blur-3xl">
          <div className="max-h-72 overflow-y-auto scrollbar-hide">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(opt); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-none ${value === opt ? 'text-white bg-white/5' : 'text-gray-600'}`}
              >
                {opt}
                {value === opt && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PromptForm: React.FC<{
  mode: WorkspaceMode;
  onGenerateVideo: (params: GenerateVideoParams) => void;
  onGenerateImage: (params: ImageGenerationParams) => void;
  initialValues?: any | null;
  isLoading?: boolean;
}> = ({ mode, onGenerateVideo, onGenerateImage, initialValues, isLoading }) => {
  const [prompt, setPrompt] = useState(initialValues?.prompt ?? '');
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // Image Config
  const [imgPreset, setImgPreset] = useState<ImagePreset>(initialValues?.preset ?? ImagePreset.INTERIOR);
  const [imgRoom, setImgRoom] = useState<RoomType>(initialValues?.roomType ?? RoomType.LIVING_ROOM);
  const [imgStyle, setImgStyle] = useState<DesignStyle>(initialValues?.style ?? DesignStyle.MODERN);
  const [imgAspectRatio, setImgAspectRatio] = useState<AspectRatio>(initialValues?.aspectRatio ?? AspectRatio.LANDSCAPE);
  const [imgSize, setImgSize] = useState<ImageSize>(initialValues?.size ?? ImageSize.K1);
  const [sourceImg, setSourceImg] = useState<ImageFile | null>(initialValues?.sourceImage ?? null);

  // Video Config
  const [videoAspectRatio, setVideoAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE);
  const [resolution, setResolution] = useState<Resolution>(Resolution.P720);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValues) {
      if (initialValues.prompt) setPrompt(initialValues.prompt);
      if (initialValues.startFrame) setSourceImg(initialValues.startFrame);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (mode === WorkspaceMode.IMAGE) {
      onGenerateImage({
        prompt, preset: imgPreset, roomType: imgRoom, style: imgStyle, aspectRatio: imgAspectRatio, size: imgSize, sourceImage: sourceImg
      });
    } else {
      onGenerateVideo({
        prompt, model: VeoModel.VEO_FAST, aspectRatio: videoAspectRatio, resolution, mode: GenerationMode.TEXT_TO_VIDEO
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setSourceImg({ base64, name: file.name, file });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-[#080808] overflow-y-auto scrollbar-hide">
      <div className="p-10 space-y-16 pb-40">
        {/* Module Header */}
        <div className="flex items-center gap-4 px-2 py-4 border-b border-white/5 mb-8">
           <div className="p-3 bg-white/5 rounded-2xl"><Cpu size={18} className="text-indigo-400" /></div>
           <div>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">CONSOLE_LINK_3.2</span>
              <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest mt-1">CORE_DIRECTIVE_ACTIVE</p>
           </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-6 px-1">
             <div className="flex items-center gap-3 text-gray-700">
                <Terminal size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Design directive</span>
             </div>
             <button 
               type="button" 
               onClick={(e) => { e.preventDefault(); setIsEnhancing(true); enhancePrompt(prompt).then(res => { setPrompt(res); setIsEnhancing(false); }); }} 
               disabled={!prompt.trim() || isLoading || isEnhancing} 
               className="flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] hover:bg-white/10 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500 transition-all disabled:opacity-20"
             >
               <Sparkles size={11} className={isEnhancing ? "animate-spin text-amber-500" : "text-amber-500"} />
               Enhance brief
             </button>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Materiality, illumination, spatial flow..."
            className="w-full h-56 bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 text-[12px] font-light text-gray-300 outline-none focus:border-indigo-500/30 focus:bg-white/[0.03] transition-all resize-none leading-relaxed shadow-inner placeholder:text-gray-800"
          />
        </section>

        <section className="space-y-10">
          <div className="flex items-center gap-3 text-gray-700 px-1 mb-6">
             <Dna size={14} />
             <span className="text-[9px] font-black uppercase tracking-[0.4em]">Synthesis Vectors</span>
          </div>

          {mode === WorkspaceMode.IMAGE ? (
            <div className="space-y-4">
              <CustomSelect label="Macro Engine" value={imgPreset} options={Object.values(ImagePreset)} onChange={setImgPreset} color="amber" />
              {(imgPreset === ImagePreset.INTERIOR || imgPreset === ImagePreset.FLOOR_PLAN) && (
                <CustomSelect label="Spatial Domain" value={imgRoom} options={Object.values(RoomType)} onChange={setImgRoom} color="indigo" />
              )}
              <CustomSelect label="Aesthetic Matrix" value={imgStyle} options={Object.values(DesignStyle)} onChange={setImgStyle} />
              
              <div className="pt-6 space-y-6">
                <SegmentedControl 
                  label="Viewport Proportion" 
                  value={imgAspectRatio} 
                  onChange={setImgAspectRatio} 
                  options={[
                    { label: '16 : 9', value: AspectRatio.LANDSCAPE },
                    { label: '1 : 1', value: AspectRatio.SQUARE },
                    { label: '9 : 16', value: AspectRatio.PORTRAIT }
                  ]} 
                />
                <SegmentedControl 
                  label="Fidelity Level" 
                  value={imgSize} 
                  onChange={setImgSize} 
                  options={[
                    { label: '1K SD', value: ImageSize.K1 },
                    { label: '2K HD', value: ImageSize.K2 },
                    { label: '4K ULTRA', value: ImageSize.K4 }
                  ]} 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <SegmentedControl 
                label="Temporal Projection" 
                value={videoAspectRatio} 
                onChange={setVideoAspectRatio} 
                options={[
                  { label: '16 : 9', value: AspectRatio.LANDSCAPE },
                  { label: '9 : 16', value: AspectRatio.PORTRAIT }
                ]} 
              />
              <SegmentedControl 
                label="Master Resolution" 
                value={resolution} 
                onChange={setResolution} 
                options={[
                  { label: '720P', value: Resolution.P720 },
                  { label: '1080P', value: Resolution.P1080 }
                ]} 
              />
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 text-gray-700 px-1 mb-8">
             <Layers size={14} />
             <span className="text-[9px] font-black uppercase tracking-[0.4em]">Context seeding</span>
          </div>
          <div className="relative">
            {sourceImg ? (
              <div className="relative group aspect-video rounded-[3rem] overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                <img 
                  src={sourceImg.base64.startsWith('data') ? sourceImg.base64 : `data:image/png;base64,${sourceImg.base64}`} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                  alt="Seed Image" 
                />
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); setSourceImg(null); }} 
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
                <div className="p-6 bg-white/5 rounded-[2rem] group-hover:scale-110 transition-transform shadow-2xl"><Camera size={40} className="text-gray-700 group-hover:text-indigo-500 transition-colors" /></div>
                <div className="text-center">
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 block mb-2">Import context photo</span>
                   <span className="text-[7px] font-black text-gray-800 uppercase tracking-widest">DRAG AND DROP SUPPORTED</span>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </button>
            )}
          </div>
        </section>
      </div>

      <div className="mt-auto p-10 bg-[#080808]/90 backdrop-blur-3xl border-t border-white/5 fixed bottom-0 w-[420px] z-30">
        <button 
          type="submit" 
          disabled={isLoading || (!prompt.trim() && !sourceImg)} 
          className="group relative w-full py-10 rounded-[2.5rem] font-black uppercase tracking-[0.8em] text-[12px] transition-all overflow-hidden flex items-center justify-center gap-6 bg-white text-black shadow-[0_0_100px_rgba(255,255,255,0.08)] active:scale-95 disabled:opacity-20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {isLoading ? (
            <div className="flex items-center gap-5"><div className="w-6 h-6 border-[4px] border-t-transparent border-black rounded-full animate-spin"></div><span>INITIALIZING...</span></div>
          ) : (
            <>
              <span className="relative z-10">{mode === WorkspaceMode.IMAGE ? 'EXECUTE RENDER' : 'SYNTH_MOTION'}</span>
              <ChevronRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PromptForm;
