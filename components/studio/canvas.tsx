'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Image as ImageIcon,
  Video,
  Box,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Share2,
  Maximize2,
  Sparkles,
  Loader2,
} from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'
import * as Slider from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'
import { useStudioStore, type ViewMode } from '@/stores/studio-store'

interface CanvasProps {
  className?: string
}

export function Canvas({ className }: CanvasProps) {
  const [comparePosition, setComparePosition] = useState(50)
  const [isDraggingCompare, setIsDraggingCompare] = useState(false)
  const [isDraggingUpload, setIsDraggingUpload] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    viewMode,
    setViewMode,
    currentRender,
    originalImage,
    setOriginalImage,
    variations,
    isGenerating,
    generationPhase,
    generationProgress,
    currentSessionId,
    sessions,
  } = useStudioStore()

  const currentSession = sessions.find((s) => s.id === currentSessionId)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingUpload(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDraggingUpload(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingUpload(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setOriginalImage(url)
    }
  }, [setOriginalImage])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setOriginalImage(url)
    }
  }, [setOriginalImage])

  const handleCompareMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingCompare || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setComparePosition(percentage)
  }, [isDraggingCompare])

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-slate-950',
        className
      )}
    >
      {/* Header Toolbar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/40">Studio</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/20" />
          <span className="text-white/70">
            {currentSession?.title || 'Untitled'}
          </span>
        </div>

        {/* Mode Switcher */}
        <Tabs.Root value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <Tabs.List className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
            {[
              { value: 'image', icon: ImageIcon, label: 'Image' },
              { value: 'video', icon: Video, label: 'Video' },
              { value: '3d', icon: Box, label: '3D' },
            ].map(({ value, icon: Icon, label }) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium',
                  'transition-all duration-200',
                  viewMode === value
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/70'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        {/* Canvas Actions */}
        <div className="flex items-center gap-2">
          <button
            className={cn(
              'p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5',
              'transition-colors'
            )}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/40 font-mono w-12 text-center">100%</span>
          <button
            className={cn(
              'p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5',
              'transition-colors'
            )}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            className={cn(
              'p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5',
              'transition-colors'
            )}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            className={cn(
              'p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5',
              'transition-colors'
            )}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            className={cn(
              'p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5',
              'transition-colors'
            )}
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            className={cn(
              'p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5',
              'transition-colors'
            )}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseMove={handleCompareMouseMove}
        onMouseUp={() => setIsDraggingCompare(false)}
        onMouseLeave={() => setIsDraggingCompare(false)}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Drag Overlay */}
        <AnimatePresence>
          {isDraggingUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'absolute inset-4 z-50 rounded-2xl',
                'border-2 border-dashed border-emerald-500',
                'bg-emerald-500/10 backdrop-blur-sm',
                'flex items-center justify-center'
              )}
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-lg font-medium text-white">Drop your image here</p>
                <p className="text-sm text-white/50">JPG, PNG, or WebP up to 10MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generation Progress */}
        <AnimatePresence>
          {isGenerating && generationPhase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center max-w-md">
                <motion.div
                  className="relative w-24 h-24 mx-auto mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 blur-xl" />
                  <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-emerald-400" />
                  </div>
                </motion.div>

                <motion.p
                  key={generationPhase.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-medium text-white mb-2"
                >
                  {generationPhase.description}
                </motion.p>

                <div className="w-64 mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${generationProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <p className="text-sm text-white/40 mt-2 font-mono">
                  {generationProgress}%
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!originalImage && !currentRender && !isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-white/30" />
              </div>
              <h2 className="text-xl font-display font-semibold text-white mb-2">
                Upload an image or describe your vision
              </h2>
              <p className="text-white/50 mb-6">
                Start by uploading a room photo or describing the interior you want to create
              </p>
              <div className="flex items-center justify-center gap-3">
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-lg',
                    'bg-gradient-primary hover:bg-gradient-primary-hover',
                    'text-white font-medium text-sm',
                    'transition-all duration-200 shadow-glow-sm hover:shadow-glow'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </motion.button>
                <span className="text-white/30">or</span>
                <span className="text-white/50 text-sm">describe in chat</span>
              </div>
              <p className="text-xs text-white/30 mt-4">
                Drag and drop or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">Cmd+V</kbd> to paste
              </p>
            </motion.div>
          </div>
        )}

        {/* Before/After Comparison */}
        {originalImage && currentRender && !isGenerating && (
          <div className="absolute inset-0">
            {/* After (Full) */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="relative w-full h-full max-w-4xl">
                <div className="absolute inset-0 bg-slate-800 rounded-2xl overflow-hidden">
                  <img
                    src={currentRender.imageUrl}
                    alt="Generated render"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Before (Clipped) */}
            <div
              className="absolute inset-0 flex items-center justify-center p-8"
              style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
            >
              <div className="relative w-full h-full max-w-4xl">
                <div className="absolute inset-0 bg-slate-700 rounded-2xl overflow-hidden">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Comparison Slider */}
            <div
              className="absolute top-8 bottom-8 w-1 cursor-ew-resize z-10"
              style={{ left: `calc(${comparePosition}% - 2px)` }}
              onMouseDown={() => setIsDraggingCompare(true)}
            >
              <div className="absolute inset-0 bg-white/80 rounded-full" />
              <div
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                  'w-8 h-8 rounded-full bg-white shadow-lg',
                  'flex items-center justify-center cursor-ew-resize'
                )}
              >
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-3 bg-slate-400 rounded-full" />
                  <div className="w-0.5 h-3 bg-slate-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-12 left-12 px-2 py-1 rounded bg-black/50 text-xs text-white/70 backdrop-blur-sm">
              Original
            </div>
            <div className="absolute top-12 right-12 px-2 py-1 rounded bg-black/50 text-xs text-white/70 backdrop-blur-sm">
              Generated
            </div>
          </div>
        )}

        {/* Only Original Image */}
        {originalImage && !currentRender && !isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-full h-full max-w-4xl">
              <div className="absolute inset-0 bg-slate-800 rounded-2xl overflow-hidden">
                <img
                  src={originalImage}
                  alt="Uploaded room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 left-4 px-2 py-1 rounded bg-black/50 text-xs text-white/70 backdrop-blur-sm">
                Original - Ready for rendering
              </div>
            </div>
          </div>
        )}

        {/* Generated Image Only (no original) */}
        {!originalImage && currentRender && !isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-full h-full max-w-4xl">
              <div className="absolute inset-0 bg-slate-800 rounded-2xl overflow-hidden">
                <img
                  src={currentRender.imageUrl}
                  alt="Generated render"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 left-4 px-2 py-1 rounded bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 text-xs text-white backdrop-blur-sm">
                AI Generated - {currentRender.style}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Variations Thumbnail Strip */}
      {variations.length > 0 && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 px-4 py-4 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl"
        >
          <span className="text-xs text-white/40 mr-2">Variations</span>
          {variations.map((variation, index) => (
            <motion.button
              key={variation.id}
              className={cn(
                'w-16 h-16 rounded-lg overflow-hidden',
                'bg-slate-800 border-2 border-transparent',
                'hover:border-emerald-500/50 transition-colors'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-full h-full bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
                <span className="text-xs text-white/30">V{index + 1}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
