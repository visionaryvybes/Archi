'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Download,
  Share2,
  Folder,
  Trash2,
  Sparkles,
  Keyboard,
  Moon,
  HelpCircle,
  LogOut,
  Command,
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'
import { useStudioStore } from '@/stores/studio-store'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  shortcut?: string
  category: 'actions' | 'navigation' | 'settings' | 'help'
  action: () => void
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const {
    createNewSession,
    setRightPanelTab,
    setRightPanelOpen,
    generateRender,
  } = useStudioStore()

  const commands: CommandItem[] = useMemo(
    () => [
      // Actions
      {
        id: 'new-chat',
        label: 'New Chat',
        description: 'Start a new conversation',
        icon: Plus,
        shortcut: 'N',
        category: 'actions',
        action: () => {
          createNewSession()
          onOpenChange(false)
        },
      },
      {
        id: 'generate',
        label: 'Generate Render',
        description: 'Create a new AI render',
        icon: Sparkles,
        shortcut: 'G',
        category: 'actions',
        action: () => {
          generateRender('Generate from current context')
          onOpenChange(false)
        },
      },
      {
        id: 'upload-image',
        label: 'Upload Image',
        description: 'Upload a room photo',
        icon: ImageIcon,
        shortcut: 'U',
        category: 'actions',
        action: () => {
          onOpenChange(false)
          // Trigger file input
        },
      },
      {
        id: 'download',
        label: 'Download Render',
        description: 'Save the current render',
        icon: Download,
        shortcut: 'D',
        category: 'actions',
        action: () => {
          onOpenChange(false)
        },
      },
      {
        id: 'share',
        label: 'Share',
        description: 'Share your design',
        icon: Share2,
        shortcut: 'S',
        category: 'actions',
        action: () => {
          onOpenChange(false)
        },
      },
      {
        id: 'save-collection',
        label: 'Save to Collection',
        description: 'Add to a collection',
        icon: Folder,
        category: 'actions',
        action: () => {
          onOpenChange(false)
        },
      },
      // Navigation
      {
        id: 'open-chat',
        label: 'Open Chat Panel',
        description: 'Show the chat interface',
        icon: MessageSquare,
        shortcut: 'C',
        category: 'navigation',
        action: () => {
          setRightPanelOpen(true)
          setRightPanelTab('chat')
          onOpenChange(false)
        },
      },
      {
        id: 'open-settings',
        label: 'Open Settings Panel',
        description: 'Show generation settings',
        icon: Settings,
        shortcut: ',',
        category: 'navigation',
        action: () => {
          setRightPanelOpen(true)
          setRightPanelTab('settings')
          onOpenChange(false)
        },
      },
      // Settings
      {
        id: 'theme',
        label: 'Toggle Theme',
        description: 'Switch between dark and light mode',
        icon: Moon,
        category: 'settings',
        action: () => {
          onOpenChange(false)
        },
      },
      {
        id: 'shortcuts',
        label: 'Keyboard Shortcuts',
        description: 'View all shortcuts',
        icon: Keyboard,
        shortcut: '?',
        category: 'settings',
        action: () => {
          onOpenChange(false)
        },
      },
      // Help
      {
        id: 'help',
        label: 'Help & Support',
        description: 'Get help with Visionary Studio',
        icon: HelpCircle,
        category: 'help',
        action: () => {
          onOpenChange(false)
        },
      },
      {
        id: 'logout',
        label: 'Sign Out',
        description: 'Sign out of your account',
        icon: LogOut,
        category: 'help',
        action: () => {
          onOpenChange(false)
        },
      },
    ],
    [createNewSession, generateRender, onOpenChange, setRightPanelOpen, setRightPanelTab]
  )

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return commands

    const query = searchQuery.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.description?.toLowerCase().includes(query)
    )
  }, [commands, searchQuery])

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = []
      }
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  const categoryLabels: Record<string, string> = {
    actions: 'Actions',
    navigation: 'Navigation',
    settings: 'Settings',
    help: 'Help',
  }

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action()
          }
          break
        case 'Escape':
          onOpenChange(false)
          break
      }
    },
    [filteredCommands, selectedIndex, onOpenChange]
  )

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [open, onOpenChange])

  let globalIndex = 0

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
            className={cn(
              'fixed left-1/2 top-[20%] -translate-x-1/2 z-50',
              'w-full max-w-xl',
              'bg-slate-900 border border-white/10 rounded-2xl',
              'shadow-2xl shadow-black/50 overflow-hidden'
            )}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-white/40 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commands..."
                autoFocus
                className={cn(
                  'flex-1 bg-transparent text-white text-lg',
                  'placeholder:text-white/30',
                  'focus:outline-none'
                )}
              />
              <kbd
                className={cn(
                  'hidden sm:flex items-center gap-1 px-2 py-1 rounded',
                  'bg-white/10 text-xs text-white/40 font-mono'
                )}
              >
                <Command className="w-3 h-3" />K
              </kbd>
            </div>

            {/* Command List */}
            <div className="max-h-[400px] overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-white/40">No commands found</p>
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-4 py-2 bg-slate-900/50 sticky top-0">
                      <span className="text-xs font-medium text-white/30 uppercase tracking-wider">
                        {categoryLabels[category]}
                      </span>
                    </div>
                    <div className="p-1">
                      {items.map((command) => {
                        const currentIndex = globalIndex++
                        const Icon = command.icon
                        const isSelected = currentIndex === selectedIndex

                        return (
                          <button
                            key={command.id}
                            onClick={command.action}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            className={cn(
                              'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg',
                              'text-left transition-colors',
                              isSelected
                                ? 'bg-white/10 text-white'
                                : 'text-white/70 hover:bg-white/5'
                            )}
                          >
                            <div
                              className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                                isSelected
                                  ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20'
                                  : 'bg-white/5'
                              )}
                            >
                              <Icon
                                className={cn(
                                  'w-4 h-4',
                                  isSelected ? 'text-emerald-400' : 'text-white/50'
                                )}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{command.label}</p>
                              {command.description && (
                                <p className="text-xs text-white/40 truncate">
                                  {command.description}
                                </p>
                              )}
                            </div>
                            {command.shortcut && (
                              <kbd
                                className={cn(
                                  'px-2 py-0.5 rounded text-xs font-mono',
                                  isSelected
                                    ? 'bg-white/10 text-white/60'
                                    : 'bg-white/5 text-white/30'
                                )}
                              >
                                {command.shortcut}
                              </kbd>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-slate-900/50">
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">Up</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">Down</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">Enter</kbd>
                  to select
                </span>
              </div>
              <span className="text-xs text-white/30">
                {filteredCommands.length} commands
              </span>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
