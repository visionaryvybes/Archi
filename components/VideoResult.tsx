
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import { Download, Zap, ArrowRight, Play, Layers } from 'lucide-react';
import { TimelineSegment } from '../types';

interface VideoResultProps {
  videoUrl: string;
  onNewVideo: () => void;
  onExtend: (action: string) => void;
  canExtend?: boolean;
  timeline: TimelineSegment[];
}

const VideoResult: React.FC<VideoResultProps> = ({
  videoUrl,
  onNewVideo,
  onExtend,
  canExtend = true,
  timeline
}) => {
  const [nextAction, setNextAction] = useState('');

  const handleExtendClick = () => {
    onExtend(nextAction);
    setNextAction('');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-in gap-12">
      {/* Cinematic Viewport */}
      <div className="w-full max-w-6xl relative group rounded-[3.5rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.8)] border border-white/10 bg-black/40 backdrop-blur-3xl">
        <video
          key={videoUrl}
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-full object-contain aspect-video"
        />
        
        <div className="absolute top-8 left-8 px-6 py-2.5 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-full flex items-center gap-3">
           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
           <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">SYNTHESIS SEQ-{timeline.length.toString().padStart(2, '0')}</span>
        </div>

        <div className="absolute top-8 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
          <a href={videoUrl} download className="p-4 bg-black/60 backdrop-blur-3xl text-white rounded-2xl hover:bg-white hover:text-black border border-white/10 transition-all shadow-2xl">
            <Download size={20} />
          </a>
        </div>
      </div>

      {/* Sequence Timeline Strip */}
      <div className="w-full max-w-4xl flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-[2.5rem] overflow-x-auto scrollbar-hide">
         <div className="flex items-center gap-3 px-4 shrink-0 border-r border-white/10">
            <Layers size={14} className="text-gray-600" />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">TIMELINE</span>
         </div>
         {timeline.map((seg, idx) => (
           <div key={seg.id} className={`shrink-0 w-32 aspect-video rounded-xl border-2 overflow-hidden bg-black/40 transition-all cursor-pointer hover:scale-105 ${idx === timeline.length - 1 ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 scale-110' : 'border-white/5 opacity-40 hover:opacity-100'}`}>
              <div className="w-full h-full flex items-center justify-center">
                 <Play size={16} className="text-white/20" />
              </div>
         </div>
         ))}
      </div>

      {/* Sequence Control Deck */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-6">
        <div className="w-full flex items-center gap-4 p-2.5 bg-white/[0.03] border border-white/10 rounded-[2.5rem] shadow-2xl focus-within:border-indigo-500/30 transition-all">
           <div className="pl-6 text-gray-700"><Zap size={18} /></div>
           <input 
             value={nextAction}
             onChange={e => setNextAction(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handleExtendClick()}
             placeholder="VECTOR COMMAND (e.g. tracking shot towards balcony)"
             className="flex-grow bg-transparent border-none outline-none text-[12px] font-black text-gray-300 placeholder:text-gray-800 uppercase tracking-[0.3em] px-2"
           />
           <button 
             onClick={handleExtendClick}
             disabled={!canExtend}
             className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white flex items-center gap-3.5 rounded-[1.8rem] transition-all text-[10px] font-black uppercase tracking-[0.3em] shadow-xl active:scale-95"
           >
             {nextAction ? 'APPEND SEQUENCE' : 'AUTO-SYNTH'}
             <ArrowRight size={16} />
           </button>
        </div>
        
        <div className="flex items-center gap-10">
           <button onClick={onNewVideo} className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1">Reset Synthesis Cycle</button>
           <div className="w-px h-4 bg-white/10"></div>
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">{canExtend ? "Temporal Memory Active" : "Memory Limit Exceeded"}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VideoResult;
