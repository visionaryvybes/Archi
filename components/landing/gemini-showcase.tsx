'use client';

import { motion } from 'framer-motion';
import { Zap, Brain, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

// Speedometer component for Lightning Fast card
function Speedometer({ value }: { value: number }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 500);
    return () => clearTimeout(timer);
  }, [value]);

  const rotation = (animatedValue / 10) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="relative w-32 h-20 mx-auto mt-4">
      {/* Speedometer arc background */}
      <svg viewBox="0 0 100 60" className="w-full h-full">
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Filled arc based on value */}
        <motion.path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          stroke="url(#speedGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: animatedValue / 10 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      {/* Needle */}
      <motion.div
        className="absolute bottom-1 left-1/2 w-0.5 h-10 bg-gradient-to-t from-emerald-500 to-cyan-400 origin-bottom rounded-full"
        initial={{ rotate: -90 }}
        animate={{ rotate: rotation }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5, type: 'spring', stiffness: 60 }}
        style={{ marginLeft: '-1px' }}
      />
      {/* Center dot */}
      <div className="absolute bottom-0 left-1/2 w-3 h-3 -ml-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-glow" />
      {/* Value display */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-2xl font-bold gradient-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {animatedValue}s
      </motion.div>
    </div>
  );
}

// Chat bubble animation for Truly Intelligent card
function ChatBubbleAnimation() {
  return (
    <div className="relative h-24 mt-4">
      <motion.div
        className="absolute left-0 bg-slate-800/80 rounded-2xl rounded-bl-none px-4 py-2 text-sm text-slate-300 max-w-[70%]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        Make it more minimal
      </motion.div>
      <motion.div
        className="absolute right-0 top-10 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl rounded-br-none px-4 py-2 text-sm text-emerald-100 max-w-[75%]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Understood. Reducing clutter...
        </motion.span>
      </motion.div>
      {/* Typing indicator */}
      <motion.div
        className="absolute right-0 top-10 flex gap-1 px-4 py-3"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.2 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// Quality comparison for Professional Quality card
function QualityComparison() {
  return (
    <div className="mt-4 space-y-3">
      {['Resolution', 'Detail', 'Accuracy'].map((label, index) => (
        <div key={label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">{label}</span>
            <motion.span
              className="text-emerald-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.2 }}
            >
              {95 + index}%
            </motion.span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${95 + index}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

function FeatureCard({ icon, title, description, children, delay = 0, className = '' }: FeatureCardProps) {
  return (
    <motion.div
      className={`glass relative group rounded-2xl p-6 overflow-hidden card-hover ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10" />
        <div className="absolute -inset-px rounded-2xl border border-emerald-500/20" />
      </div>

      {/* Icon */}
      <div className="relative flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 group-hover:shadow-glow-sm transition-shadow duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      {/* Description */}
      <p className="relative text-sm text-slate-400 leading-relaxed">
        {description}
      </p>

      {/* Custom content */}
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
}

export function GeminiShowcase() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-slate-300">AI-Powered</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Powered by Google&apos;s{' '}
            <span className="gradient-text">Gemini 2.0</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience the next generation of AI-driven interior design with
            cutting-edge multimodal capabilities.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Lightning Fast */}
          <FeatureCard
            icon={<Zap className="w-5 h-5" />}
            title="Lightning Fast"
            description="Generate stunning room designs in just seconds, not minutes. Our optimized pipeline delivers results at unprecedented speed."
            delay={0.1}
          >
            <Speedometer value={8.2} />
          </FeatureCard>

          {/* Truly Intelligent */}
          <FeatureCard
            icon={<Brain className="w-5 h-5" />}
            title="Truly Intelligent"
            description="Natural language understanding that gets your vision. Describe your dream space and watch it come to life."
            delay={0.2}
          >
            <ChatBubbleAnimation />
          </FeatureCard>

          {/* Professional Quality */}
          <FeatureCard
            icon={<Sparkles className="w-5 h-5" />}
            title="Professional Quality"
            description="Output that rivals professional interior designers. Every detail is crafted with precision and style."
            delay={0.3}
          >
            <QualityComparison />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

export default GeminiShowcase;
