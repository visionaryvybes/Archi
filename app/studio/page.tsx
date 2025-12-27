'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PanelRightClose,
  PanelRightOpen,
  MessageSquare,
  Settings,
} from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'
import { useStudioStore } from '@/stores/studio-store'
import { Sidebar } from '@/components/studio/sidebar'
import { Canvas } from '@/components/studio/canvas'
import { ChatPanel } from '@/components/studio/chat-panel'
import { SettingsPanel } from '@/components/studio/settings-panel'
import { CommandPalette } from '@/components/studio/command-palette'

export default function StudioPage() {
  const {
    rightPanelOpen,
    setRightPanelOpen,
    rightPanelTab,
    setRightPanelTab,
    commandPaletteOpen,
    setCommandPaletteOpen,
  } = useStudioStore()

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K - Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }

      // Cmd+\ - Toggle Right Panel
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault()
        setRightPanelOpen(!rightPanelOpen)
      }

      // Escape - Close panels
      if (e.key === 'Escape') {
        if (commandPaletteOpen) {
          setCommandPaletteOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [rightPanelOpen, commandPaletteOpen, setRightPanelOpen, setCommandPaletteOpen])

  return (
    <div className="flex h-full bg-black">
      {/* Left Sidebar */}
      <Sidebar className="flex-shrink-0" />

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col min-w-0">
        <Canvas className="flex-1" />
      </main>

      {/* Right Panel */}
      <AnimatePresence mode="wait">
        {rightPanelOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="flex-shrink-0 h-full border-l border-white/5 bg-slate-950/80 backdrop-blur-xl overflow-hidden"
          >
            <div className="w-[320px] h-full flex flex-col">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <Tabs.Root
                  value={rightPanelTab}
                  onValueChange={(v) => setRightPanelTab(v as 'chat' | 'settings')}
                >
                  <Tabs.List className="flex items-center gap-1">
                    {[
                      { value: 'chat', icon: MessageSquare, label: 'Chat' },
                      { value: 'settings', icon: Settings, label: 'Settings' },
                    ].map(({ value, icon: Icon, label }) => (
                      <Tabs.Trigger
                        key={value}
                        value={value}
                        className={cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                          'transition-all duration-200',
                          rightPanelTab === value
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

                <button
                  onClick={() => setRightPanelOpen(false)}
                  className={cn(
                    'p-2 rounded-lg',
                    'text-white/40 hover:text-white hover:bg-white/5',
                    'transition-colors'
                  )}
                >
                  <PanelRightClose className="w-4 h-4" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {rightPanelTab === 'chat' ? (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <ChatPanel />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <SettingsPanel />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Panel Toggle Button (when closed) */}
      <AnimatePresence>
        {!rightPanelOpen && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => setRightPanelOpen(true)}
            className={cn(
              'fixed right-4 top-1/2 -translate-y-1/2 z-40',
              'p-3 rounded-xl',
              'bg-slate-800/80 backdrop-blur-xl border border-white/10',
              'text-white/50 hover:text-white hover:bg-slate-700/80',
              'transition-colors shadow-xl'
            )}
          >
            <PanelRightOpen className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      {/* Keyboard Shortcuts Hint (bottom right) */}
      <div className="fixed bottom-4 right-4 z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg',
            'bg-slate-800/60 backdrop-blur-sm border border-white/5',
            'text-xs text-white/40'
          )}
        >
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white/50">Cmd</kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white/50">K</kbd>
          <span className="text-white/30">for commands</span>
        </motion.div>
      </div>
    </div>
  )
}
