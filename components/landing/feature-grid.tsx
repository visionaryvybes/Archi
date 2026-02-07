'use client';

import { motion } from 'framer-motion';
import {
  Code,
  Layers,
  Image,
  Palette,
  Zap,
  Shield,
  Globe,
  Clock,
  Cpu,
} from 'lucide-react';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  size: 'small' | 'medium' | 'large';
  highlight?: boolean;
}

const features: Feature[] = [
  {
    id: 'api',
    icon: <Code className="w-6 h-6" />,
    title: 'API Access',
    description: 'Full REST API with comprehensive documentation. Integrate Visionary Studio into your apps.',
    size: 'medium',
    highlight: true,
  },
  {
    id: 'batch',
    icon: <Layers className="w-6 h-6" />,
    title: 'Batch Processing',
    description: 'Process hundreds of images at once with our parallel processing engine.',
    size: 'small',
  },
  {
    id: '4k',
    icon: <Image className="w-6 h-6" />,
    title: '4K Quality',
    description: 'Ultra-high resolution outputs up to 4096x4096 pixels for print-ready results.',
    size: 'large',
    highlight: true,
  },
  {
    id: 'styles',
    icon: <Palette className="w-6 h-6" />,
    title: '55+ Styles',
    description: 'From Modern to Victorian, Japandi to Art Deco — find the perfect style for any project.',
    size: 'small',
  },
  {
    id: 'fast',
    icon: <Zap className="w-6 h-6" />,
    title: 'Instant Preview',
    description: 'See low-res previews in under 2 seconds before committing to full generation.',
    size: 'medium',
  },
  {
    id: 'privacy',
    icon: <Shield className="w-6 h-6" />,
    title: 'Privacy First',
    description: 'Your images are encrypted and auto-deleted after 24 hours. GDPR compliant.',
    size: 'small',
  },
  {
    id: 'global',
    icon: <Globe className="w-6 h-6" />,
    title: 'Global CDN',
    description: 'Lightning-fast delivery from edge servers worldwide for optimal performance.',
    size: 'small',
  },
  {
    id: 'history',
    icon: <Clock className="w-6 h-6" />,
    title: 'Version History',
    description: 'Keep track of all your generations with unlimited history and one-click restore.',
    size: 'medium',
  },
  {
    id: 'gpu',
    icon: <Cpu className="w-6 h-6" />,
    title: 'AI Render Engine',
    description: 'Enterprise-grade AI for unmatched rendering quality.',
    size: 'small',
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  // Determine grid span based on size
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 lg:col-span-2 row-span-1',
    large: 'col-span-1 lg:col-span-2 row-span-1 lg:row-span-2',
  };

  return (
    <motion.div
      className={`glass relative group rounded-2xl p-6 overflow-hidden card-hover ${sizeClasses[feature.size]}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
    >
      {/* Gradient background on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={false}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-blue-500/5" />
      </motion.div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-px rounded-2xl border border-emerald-500/20" />
      </div>

      {/* Highlight glow for featured cards */}
      {feature.highlight && (
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500" />
      )}

      {/* Content */}
      <div className={`relative h-full flex flex-col ${feature.size === 'large' ? 'justify-between' : ''}`}>
        {/* Icon */}
        <motion.div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
            feature.highlight
              ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400'
              : 'bg-slate-800/50 text-slate-400 group-hover:text-emerald-400'
          } transition-colors duration-300`}
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
        >
          {feature.icon}
        </motion.div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-50 transition-colors">
          {feature.title}
        </h3>

        {/* Description */}
        <p className={`text-slate-400 leading-relaxed ${feature.size === 'large' ? 'text-base' : 'text-sm'}`}>
          {feature.description}
        </p>

        {/* Large card extra content */}
        {feature.size === 'large' && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-4">
              {['1K', '2K', '4K'].map((res, i) => (
                <motion.div
                  key={res}
                  className={`px-4 py-2 rounded-lg ${
                    res === '4K'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800/50 text-slate-500'
                  } text-sm font-medium`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {res}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Micro-interaction: animated line on hover */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Corner decoration for highlighted cards */}
      {feature.highlight && (
        <div className="absolute top-4 right-4">
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )}
    </motion.div>
  );
}

export function FeatureGrid() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 blueprint-grid opacity-30" />

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
            <span className="text-sm text-slate-300">Features</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">Everything You Need</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A complete toolkit for AI-powered interior visualization.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-fr">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeatureGrid;
