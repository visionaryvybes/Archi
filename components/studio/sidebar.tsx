'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  MessageSquare,
  Image as ImageIcon,
  Folder,
  Heart,
  Lightbulb,
  Settings,
  HelpCircle,
  ChevronRight,
  Trash2,
  MoreHorizontal,
} from 'lucide-react'
import * as Progress from '@radix-ui/react-progress'
import * as Tooltip from '@radix-ui/react-tooltip'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'
import { useStudioStore, type ChatSession } from '@/stores/studio-store'

const iconMap: Record<string, React.ElementType> = {
  heart: Heart,
  folder: Folder,
  lightbulb: Lightbulb,
}

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [hoveredSession, setHoveredSession] = useState<string | null>(null)

  const {
    sessions,
    currentSessionId,
    selectSession,
    createNewSession,
    deleteSession,
    collections,
    recentRenders,
    rendersUsedThisMonth,
    renderLimit,
  } = useStudioStore()

  const usagePercentage = (rendersUsedThisMonth / renderLimit) * 100

  return (
    <Tooltip.Provider delayDuration={300}>
      <aside
        className={cn(
          'flex flex-col h-full w-[280px] bg-slate-950/80 border-r border-white/5',
          'backdrop-blur-xl',
          className
        )}
      >
        {/* Logo + Wordmark */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-primary rounded-lg" />
            <div className="absolute inset-[2px] bg-slate-950 rounded-md flex items-center justify-center">
              <span className="text-xs font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                VS
              </span>
            </div>
          </div>
          <span className="font-display font-semibold text-white/90">Visionary Studio</span>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-4">
          <motion.button
            onClick={() => createNewSession()}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-2.5',
              'bg-gradient-primary hover:bg-gradient-primary-hover',
              'text-white font-medium text-sm rounded-lg',
              'transition-all duration-200 shadow-glow-sm hover:shadow-glow'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </motion.button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10">
          {/* Chat History */}
          <div className="px-3 mb-4">
            <div className="flex items-center gap-2 px-2 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Chat History
              </span>
            </div>
            <div className="space-y-0.5">
              <AnimatePresence mode="popLayout">
                {sessions.slice(0, 10).map((session) => (
                  <ChatHistoryItem
                    key={session.id}
                    session={session}
                    isActive={session.id === currentSessionId}
                    isHovered={session.id === hoveredSession}
                    onSelect={() => selectSession(session.id)}
                    onDelete={() => deleteSession(session.id)}
                    onHover={() => setHoveredSession(session.id)}
                    onLeave={() => setHoveredSession(null)}
                  />
                ))}
              </AnimatePresence>
              {sessions.length === 0 && (
                <p className="text-xs text-white/30 px-2 py-4 text-center">
                  No chats yet. Start a new conversation!
                </p>
              )}
            </div>
          </div>

          {/* Recent Renders */}
          <div className="px-3 mb-4">
            <div className="flex items-center gap-2 px-2 mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Recent Renders
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {recentRenders.slice(0, 6).map((render, index) => (
                <motion.button
                  key={render.id}
                  className={cn(
                    'aspect-square rounded-lg overflow-hidden',
                    'bg-slate-800/50 border border-white/5',
                    'hover:border-emerald-500/50 transition-colors'
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-white/20" />
                  </div>
                </motion.button>
              ))}
              {recentRenders.length === 0 &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'aspect-square rounded-lg',
                      'bg-slate-800/30 border border-white/5'
                    )}
                  />
                ))}
            </div>
          </div>

          {/* Collections */}
          <div className="px-3 mb-4">
            <div className="flex items-center gap-2 px-2 mb-2">
              <Folder className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Collections
              </span>
            </div>
            <div className="space-y-0.5">
              {collections.map((collection) => {
                const Icon = iconMap[collection.icon] || Folder
                return (
                  <motion.button
                    key={collection.id}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                      'text-white/70 hover:text-white hover:bg-white/5',
                      'transition-colors text-sm text-left'
                    )}
                    whileHover={{ x: 2 }}
                  >
                    <Icon className="w-4 h-4 text-white/40" />
                    <span className="flex-1 truncate">{collection.name}</span>
                    <span className="text-xs text-white/30">{collection.renderIds.length}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Usage Meter */}
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">Renders this month</span>
            <span className="text-xs font-mono text-white/70">
              {rendersUsedThisMonth.toLocaleString()}/{renderLimit.toLocaleString()}
            </span>
          </div>
          <Progress.Root
            className="h-1.5 bg-white/10 rounded-full overflow-hidden"
            value={usagePercentage}
          >
            <Progress.Indicator
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            />
          </Progress.Root>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-1 px-3 py-3 border-t border-white/5">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg',
                  'text-white/50 hover:text-white hover:bg-white/5',
                  'transition-colors text-sm'
                )}
              >
                <Settings className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only">Settings</span>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              className="bg-slate-800 text-white text-xs px-2 py-1 rounded"
              sideOffset={5}
            >
              Settings
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg',
                  'text-white/50 hover:text-white hover:bg-white/5',
                  'transition-colors text-sm'
                )}
              >
                <HelpCircle className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only">Help</span>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              className="bg-slate-800 text-white text-xs px-2 py-1 rounded"
              sideOffset={5}
            >
              Help & Support
            </Tooltip.Content>
          </Tooltip.Root>
        </div>
      </aside>
    </Tooltip.Provider>
  )
}

interface ChatHistoryItemProps {
  session: ChatSession
  isActive: boolean
  isHovered: boolean
  onSelect: () => void
  onDelete: () => void
  onHover: () => void
  onLeave: () => void
}

function ChatHistoryItem({
  session,
  isActive,
  isHovered,
  onSelect,
  onDelete,
  onHover,
  onLeave,
}: ChatHistoryItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <button
        onClick={onSelect}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left',
          'transition-colors text-sm',
          isActive
            ? 'bg-white/10 text-white'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        )}
      >
        {session.thumbnail ? (
          <div className="w-8 h-8 rounded bg-slate-700 flex-shrink-0" />
        ) : (
          <MessageSquare className="w-4 h-4 text-white/40 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium">{session.title}</p>
          <p className="text-xs text-white/40 truncate">
            {session.messages.length} messages
          </p>
        </div>
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className={cn(
                    'p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700',
                    'text-white/50 hover:text-white transition-colors'
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={cn(
                    'min-w-[140px] bg-slate-800 rounded-lg p-1',
                    'border border-white/10 shadow-xl'
                  )}
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md',
                      'text-sm text-red-400 hover:bg-red-500/10',
                      'cursor-pointer outline-none'
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete()
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
