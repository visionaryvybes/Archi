
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';

const messages = [
  "Mapping site coordinates...",
  "Generating structural wireframes...",
  "Simulating global illumination...",
  "Analyzing material specularity...",
  "Rendering spatial dimensions...",
  "Optimizing architectural flow...",
  "Polishing floor plan details...",
  "Constructing virtual environment..."
];

const LoadingIndicator: React.FC<{isExtension?: boolean}> = ({ isExtension }) => {
  const [msgIdx, setMsgIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => setMsgIdx(p => (p + 1) % messages.length), 3000);
    const timeInterval = setInterval(() => setSeconds(p => p + 1), 1000);
    return () => {
      clearInterval(msgInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-16 bg-[#030303] rounded-[3rem] border border-white/5 shadow-2xl animate-in relative overflow-hidden group min-w-[400px]">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative w-32 h-32 mb-12">
        <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-xl transform rotate-45 animate-pulse"></div>
        <div className="absolute inset-0 border border-white/10 rounded-xl animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
        </div>
      </div>

      <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
        <span className="text-indigo-500 animate-pulse">●</span>
        {isExtension ? 'EXPANDING STRUCTURE' : 'VISUALIZING SPACE'}
      </h2>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 transition-all font-mono h-4">
          {messages[msgIdx]}
        </p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Elapsed Time</span>
            <span className="text-sm font-mono font-black text-indigo-400">{formatTime(seconds)}</span>
          </div>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Est. Remaining</span>
            <span className="text-sm font-mono font-black text-white">~{isExtension ? '0:15' : '0:45'}</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(128px); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default LoadingIndicator;
