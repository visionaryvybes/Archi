'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Sliders,
  Sparkles,
  Zap,
  Crown,
  Gem,
  RefreshCw,
} from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import * as Slider from '@radix-ui/react-slider'
import * as Select from '@radix-ui/react-select'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { cn } from '@/lib/utils'
import { useStudioStore, DESIGN_STYLES, type DesignStyle } from '@/stores/studio-store'

interface SettingsPanelProps {
  className?: string
}

const QUALITY_OPTIONS = [
  { value: 'draft', label: 'Draft', icon: Zap, description: 'Fast, lower quality' },
  { value: 'standard', label: 'Standard', icon: Sparkles, description: 'Balanced' },
  { value: 'high', label: 'High', icon: Crown, description: 'Detailed' },
  { value: 'ultra', label: 'Ultra', icon: Gem, description: 'Maximum quality' },
] as const

const COUNT_OPTIONS = [1, 2, 4] as const
const ASPECT_RATIO_OPTIONS = ['1:1', '4:3', '16:9', '3:4', '9:16'] as const

export function SettingsPanel({ className }: SettingsPanelProps) {
  const { settings, updateSettings, setStyle } = useStudioStore()
  const [openAccordion, setOpenAccordion] = useState<string>('advanced')

  return (
    <ScrollArea.Root className={cn('h-full', className)}>
      <ScrollArea.Viewport className="h-full w-full">
        <div className="p-4 space-y-6">
          {/* Style Selector */}
          <section>
            <h3 className="text-sm font-medium text-white/70 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Design Style
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {DESIGN_STYLES.map((style) => (
                <StyleCard
                  key={style.id}
                  style={style}
                  isSelected={settings.style.id === style.id}
                  onSelect={() => setStyle(style)}
                />
              ))}
            </div>
          </section>

          {/* Advanced Settings */}
          <Accordion.Root
            type="single"
            collapsible
            value={openAccordion}
            onValueChange={setOpenAccordion}
            className="space-y-2"
          >
            <Accordion.Item value="advanced" className="border border-white/5 rounded-xl overflow-hidden">
              <Accordion.Header>
                <Accordion.Trigger
                  className={cn(
                    'flex items-center justify-between w-full px-4 py-3',
                    'text-sm font-medium text-white/80 hover:text-white',
                    'bg-white/5 hover:bg-white/8 transition-colors',
                    'group'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Advanced Settings
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-white/40 transition-transform duration-200',
                      'group-data-[state=open]:rotate-180'
                    )}
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                <div className="px-4 py-4 space-y-5 bg-slate-900/50">
                  {/* Quality Slider */}
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">Quality</label>
                    <div className="flex items-center gap-1">
                      {QUALITY_OPTIONS.map((option) => {
                        const Icon = option.icon
                        const isSelected = settings.quality === option.value
                        return (
                          <button
                            key={option.value}
                            onClick={() => updateSettings({ quality: option.value })}
                            className={cn(
                              'flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg',
                              'border transition-all duration-200',
                              isSelected
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70 hover:border-white/20'
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[10px] font-medium">{option.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Render Count */}
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">Number of Renders</label>
                    <div className="flex items-center gap-2">
                      {COUNT_OPTIONS.map((count) => (
                        <button
                          key={count}
                          onClick={() => updateSettings({ count })}
                          className={cn(
                            'flex-1 py-2 rounded-lg text-sm font-medium',
                            'border transition-all duration-200',
                            settings.count === count
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                              : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70 hover:border-white/20'
                          )}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">Aspect Ratio</label>
                    <div className="flex items-center gap-1.5">
                      {ASPECT_RATIO_OPTIONS.map((ratio) => (
                        <button
                          key={ratio}
                          onClick={() => updateSettings({ aspectRatio: ratio })}
                          className={cn(
                            'flex-1 py-1.5 rounded-md text-xs font-medium',
                            'border transition-all duration-200',
                            settings.aspectRatio === ratio
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                              : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60 hover:border-white/20'
                          )}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Strength Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-white/50">Transformation Strength</label>
                      <span className="text-xs font-mono text-white/70">{settings.strength}%</span>
                    </div>
                    <Slider.Root
                      value={[settings.strength]}
                      onValueChange={([value]) => updateSettings({ strength: value })}
                      max={100}
                      min={0}
                      step={5}
                      className="relative flex items-center select-none touch-none w-full h-5"
                    >
                      <Slider.Track className="relative grow rounded-full h-1.5 bg-white/10">
                        <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
                      </Slider.Track>
                      <Slider.Thumb
                        className={cn(
                          'block w-4 h-4 rounded-full',
                          'bg-white shadow-lg shadow-black/25',
                          'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                          'transition-transform hover:scale-110'
                        )}
                      />
                    </Slider.Root>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-white/30">Subtle</span>
                      <span className="text-[10px] text-white/30">Dramatic</span>
                    </div>
                  </div>

                  {/* Model Selector */}
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">Model</label>
                    <Select.Root
                      value={settings.model}
                      onValueChange={(value) =>
                        updateSettings({ model: value as 'gemini-pro' | 'gemini-nano' })
                      }
                    >
                      <Select.Trigger
                        className={cn(
                          'flex items-center justify-between w-full px-3 py-2 rounded-lg',
                          'bg-white/5 border border-white/10 text-sm text-white/80',
                          'hover:border-white/20 transition-colors',
                          'focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
                        )}
                      >
                        <Select.Value />
                        <Select.Icon>
                          <ChevronDown className="w-4 h-4 text-white/40" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          className={cn(
                            'overflow-hidden bg-slate-800 rounded-lg',
                            'border border-white/10 shadow-xl'
                          )}
                        >
                          <Select.Viewport className="p-1">
                            <Select.Item
                              value="gemini-pro"
                              className={cn(
                                'flex items-center px-3 py-2 rounded-md text-sm text-white/80',
                                'hover:bg-white/10 cursor-pointer outline-none',
                                'data-[highlighted]:bg-white/10'
                              )}
                            >
                              <Select.ItemText>Gemini Pro</Select.ItemText>
                            </Select.Item>
                            <Select.Item
                              value="gemini-nano"
                              className={cn(
                                'flex items-center px-3 py-2 rounded-md text-sm text-white/80',
                                'hover:bg-white/10 cursor-pointer outline-none',
                                'data-[highlighted]:bg-white/10'
                              )}
                            >
                              <Select.ItemText>Gemini Nano (Fast)</Select.ItemText>
                            </Select.Item>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  {/* Seed Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-white/50">Seed (optional)</label>
                      <button
                        onClick={() => updateSettings({ seed: Math.floor(Math.random() * 999999999) })}
                        className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Random
                      </button>
                    </div>
                    <input
                      type="number"
                      value={settings.seed || ''}
                      onChange={(e) =>
                        updateSettings({
                          seed: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="Enter seed for reproducibility"
                      className={cn(
                        'w-full px-3 py-2 rounded-lg',
                        'bg-white/5 border border-white/10 text-sm text-white/80',
                        'placeholder:text-white/30',
                        'hover:border-white/20 transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50'
                      )}
                    />
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>

          {/* Generate Button */}
          <motion.button
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3',
              'bg-gradient-primary hover:bg-gradient-primary-hover',
              'text-white font-medium rounded-xl',
              'transition-all duration-200 shadow-glow-sm hover:shadow-glow'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-4 h-4" />
            Generate Render
          </motion.button>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-transparent transition-colors w-2"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-white/10 rounded-full relative hover:bg-white/20" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}

interface StyleCardProps {
  style: DesignStyle
  isSelected: boolean
  onSelect: () => void
}

function StyleCard({ style, isSelected, onSelect }: StyleCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        'relative aspect-square rounded-lg overflow-hidden',
        'border-2 transition-all duration-200',
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
          : 'border-transparent hover:border-white/20'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Thumbnail Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 to-slate-800/50" />

      {/* Selection Indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"
          >
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Label */}
      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-[10px] font-medium text-white text-center truncate">
          {style.name}
        </p>
      </div>
    </motion.button>
  )
}
