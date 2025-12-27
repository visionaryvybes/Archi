'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { Image, Video, Box, Check, ArrowRight } from 'lucide-react';

interface Mode {
  id: string;
  label: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  cta: string;
  preview: React.ReactNode;
}

const modes: Mode[] = [
  {
    id: 'image',
    label: 'Image Generation',
    icon: <Image className="w-5 h-5" />,
    title: 'Stunning Room Renders',
    description:
      'Transform any room photo into a beautifully redesigned space. Upload your image and watch as AI reimagines it in your chosen style.',
    features: [
      '4K resolution output',
      '50+ design styles',
      'Preserve room structure',
      'Instant style preview',
      'Batch processing support',
    ],
    cta: 'Generate Images',
    preview: <ImageModePreview />,
  },
  {
    id: 'video',
    label: 'Video Walkthroughs',
    icon: <Video className="w-5 h-5" />,
    title: 'Immersive Video Tours',
    description:
      'Experience your redesigned space through cinematic video walkthroughs. Perfect for client presentations and portfolio showcases.',
    features: [
      'Smooth camera paths',
      '30-60 second tours',
      'Multiple angle options',
      'Background music',
      'HD export quality',
    ],
    cta: 'Create Video',
    preview: <VideoModePreview />,
  },
  {
    id: '3d',
    label: '3D Exploration',
    icon: <Box className="w-5 h-5" />,
    title: 'Interactive 3D Views',
    description:
      'Explore your design from every angle with interactive 3D models. Rotate, zoom, and navigate through your reimagined space.',
    features: [
      '360-degree rotation',
      'Zoom and pan controls',
      'Real-time lighting',
      'VR compatible',
      'Shareable 3D links',
    ],
    cta: 'Explore in 3D',
    preview: <ThreeDModePreview />,
  },
];

function ImageModePreview() {
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900/50">
      {/* Before/After mockup */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-slate-700/50 flex items-center justify-center">
              <Image className="w-8 h-8 text-slate-500" />
            </div>
            <span className="text-xs text-slate-500">Original</span>
          </div>
        </div>
        <div className="w-1/2 bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 flex items-center justify-center border-l border-emerald-500/30">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 mx-auto mb-2 rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Image className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <span className="text-xs text-emerald-400">Redesigned</span>
          </div>
        </div>
      </div>
      {/* Center divider */}
      <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gradient-to-b from-emerald-500 to-cyan-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center shadow-glow">
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}

function VideoModePreview() {
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900/50">
      {/* Video preview mockup */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Play button */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center shadow-glow-lg">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"
              style={{ borderLeftWidth: '14px' }} />
          </div>
          {/* Pulse rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full border border-emerald-500/30"
              animate={{
                scale: [1, 1.5 + ring * 0.3],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: ring * 0.4,
              }}
            />
          ))}
        </motion.div>
      </div>
      {/* Video timeline */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-500">
          <span>0:00</span>
          <span>0:45</span>
        </div>
      </div>
    </div>
  );
}

function ThreeDModePreview() {
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900/50">
      {/* 3D cube animation */}
      <div className="absolute inset-0 flex items-center justify-center perspective-1000">
        <motion.div
          className="relative w-24 h-24"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: 360, rotateX: 15 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {/* Cube faces */}
          {['front', 'back', 'top', 'bottom', 'left', 'right'].map((face, i) => {
            const transforms: Record<string, string> = {
              front: 'translateZ(48px)',
              back: 'translateZ(-48px) rotateY(180deg)',
              top: 'translateY(-48px) rotateX(90deg)',
              bottom: 'translateY(48px) rotateX(-90deg)',
              left: 'translateX(-48px) rotateY(-90deg)',
              right: 'translateX(48px) rotateY(90deg)',
            };
            return (
              <div
                key={face}
                className="absolute inset-0 border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm"
                style={{ transform: transforms[face] }}
              />
            );
          })}
        </motion.div>
      </div>
      {/* Control indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {['Rotate', 'Zoom', 'Pan'].map((control) => (
          <div
            key={control}
            className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-xs text-slate-400"
          >
            {control}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ModesShowcase() {
  const [activeMode, setActiveMode] = useState('image');

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Three Powerful{' '}
            <span className="gradient-text">Modes</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose the perfect way to visualize your design ideas, from static images
            to immersive 3D experiences.
          </p>
        </motion.div>

        {/* Vertical tabs layout */}
        <Tabs.Root
          value={activeMode}
          onValueChange={setActiveMode}
          orientation="vertical"
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Tab list (vertical on desktop, horizontal on mobile) */}
          <Tabs.List className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 lg:w-64 flex-shrink-0">
            {modes.map((mode, index) => (
              <Tabs.Trigger
                key={mode.id}
                value={mode.id}
                className="relative flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-300 hover:bg-slate-800/50 data-[state=active]:bg-slate-800/80 group whitespace-nowrap lg:whitespace-normal w-full"
              >
                {/* Icon */}
                <div
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    activeMode === mode.id
                      ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500 group-hover:text-slate-400'
                  }`}
                >
                  {mode.icon}
                </div>
                {/* Label */}
                <span
                  className={`font-medium transition-colors duration-300 ${
                    activeMode === mode.id ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {mode.label}
                </span>
                {/* Active indicator - gradient underline that slides */}
                <motion.div
                  className="absolute bottom-0 lg:bottom-auto lg:left-0 left-0 right-0 lg:right-auto h-0.5 lg:h-full lg:w-0.5 bg-gradient-to-r lg:bg-gradient-to-b from-emerald-500 via-cyan-500 to-blue-500 rounded-full"
                  initial={false}
                  animate={{
                    opacity: activeMode === mode.id ? 1 : 0,
                    scale: activeMode === mode.id ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Content area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {modes.map(
                (mode) =>
                  activeMode === mode.id && (
                    <Tabs.Content
                      key={mode.id}
                      value={mode.id}
                      forceMount
                      asChild
                    >
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="glass rounded-2xl p-6 lg:p-8"
                      >
                        <div className="grid lg:grid-cols-2 gap-8">
                          {/* Info */}
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-3">
                                {mode.title}
                              </h3>
                              <p className="text-slate-400 leading-relaxed">
                                {mode.description}
                              </p>
                            </div>

                            {/* Features list */}
                            <ul className="space-y-3">
                              {mode.features.map((feature, i) => (
                                <motion.li
                                  key={feature}
                                  className="flex items-center gap-3"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                >
                                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  </div>
                                  <span className="text-slate-300">{feature}</span>
                                </motion.li>
                              ))}
                            </ul>

                            {/* CTA */}
                            <motion.button
                              className="btn-gradient-border px-6 py-3 rounded-xl font-medium text-white flex items-center gap-2 group"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {mode.cta}
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                          </div>

                          {/* Preview */}
                          <div>{mode.preview}</div>
                        </div>
                      </motion.div>
                    </Tabs.Content>
                  )
              )}
            </AnimatePresence>
          </div>
        </Tabs.Root>
      </div>
    </section>
  );
}

export default ModesShowcase;
