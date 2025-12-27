'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Paperclip,
  X,
  Image as ImageIcon,
  Sparkles,
  Command,
  CornerDownLeft,
} from 'lucide-react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { cn } from '@/lib/utils'
import { useStudioStore, type ChatMessage, type Attachment } from '@/stores/studio-store'

interface ChatPanelProps {
  className?: string
}

export function ChatPanel({ className }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    sessions,
    currentSessionId,
    sendMessage,
    isTyping,
    generateRender,
    setCommandPaletteOpen,
  } = useStudioStore()

  const currentSession = sessions.find((s) => s.id === currentSessionId)
  const messages = currentSession?.messages || []

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [inputValue])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim() && attachments.length === 0) return

    sendMessage(inputValue, attachments)
    setInputValue('')
    setAttachments([])

    // Trigger render generation if there's an attached image
    if (attachments.length > 0 || inputValue.toLowerCase().includes('render')) {
      setTimeout(() => {
        generateRender(inputValue)
      }, 2000)
    }
  }, [inputValue, attachments, sendMessage, generateRender])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    },
    [handleSubmit, setCommandPaletteOpen]
  )

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setAttachments((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'image',
          url,
          name: file.name,
        },
      ])
    }
  }, [])

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const handleSuggestedAction = useCallback(
    (action: string) => {
      setInputValue(action)
      textareaRef.current?.focus()
    },
    []
  )

  return (
    <div className={cn('flex flex-col h-full bg-slate-950/60', className)}>
      {/* Messages Area */}
      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full">
          <div className="p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Start a conversation
                </h3>
                <p className="text-sm text-white/50 max-w-[240px]">
                  Describe the interior design you want to create, or upload a room photo to transform.
                </p>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onSuggestedAction={handleSuggestedAction}
                />
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-white/5">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-white/40"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-white/40"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-white/40"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-transparent transition-colors w-2"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-white/10 rounded-full relative hover:bg-white/20" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5">
        {/* Attachments Preview */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 flex flex-wrap gap-2"
            >
              {attachments.map((attachment) => (
                <motion.div
                  key={attachment.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={cn(
                    'relative group rounded-lg overflow-hidden',
                    'bg-slate-800 border border-white/10'
                  )}
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white/30" />
                  </div>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className={cn(
                      'absolute -top-1 -right-1 w-5 h-5 rounded-full',
                      'bg-red-500 flex items-center justify-center',
                      'opacity-0 group-hover:opacity-100 transition-opacity'
                    )}
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Container */}
        <div
          className={cn(
            'relative flex items-end gap-2 rounded-xl',
            'bg-white/5 border border-white/10',
            'focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20',
            'transition-all duration-200'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'p-3 text-white/40 hover:text-white/70 transition-colors',
              'flex-shrink-0'
            )}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your design vision..."
            rows={1}
            className={cn(
              'flex-1 py-3 bg-transparent resize-none',
              'text-white placeholder:text-white/30',
              'focus:outline-none',
              'max-h-[120px]'
            )}
          />

          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() && attachments.length === 0}
            className={cn(
              'p-3 flex-shrink-0 transition-colors',
              inputValue.trim() || attachments.length > 0
                ? 'text-emerald-400 hover:text-emerald-300'
                : 'text-white/20'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="flex items-center justify-between mt-3 text-xs text-white/30">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" />
              Send
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[10px]">Shift</span> + <CornerDownLeft className="w-3 h-3" />
              New line
            </span>
          </div>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-1 hover:text-white/50 transition-colors"
          >
            <Command className="w-3 h-3" />K
          </button>
        </div>
      </div>
    </div>
  )
}

interface MessageBubbleProps {
  message: ChatMessage
  onSuggestedAction: (action: string) => void
}

function MessageBubble({ message, onSuggestedAction }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      layout
      className={cn('flex items-start gap-3', isUser && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser
            ? 'bg-slate-700'
            : 'bg-gradient-to-br from-emerald-500 to-cyan-500'
        )}
      >
        {isUser ? (
          <span className="text-xs font-medium text-white">U</span>
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={cn('flex flex-col max-w-[80%]', isUser && 'items-end')}>
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="w-32 h-32 rounded-lg bg-slate-800 border border-white/10 overflow-hidden"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white/20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Text */}
        <div
          className={cn(
            'px-4 py-3 rounded-2xl',
            isUser
              ? 'bg-emerald-600 text-white rounded-br-md'
              : 'bg-white/5 text-white/90 rounded-bl-md'
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Suggested Actions */}
        {!isUser && message.suggestedActions && message.suggestedActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 flex flex-wrap gap-2"
          >
            {message.suggestedActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onSuggestedAction(action)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium',
                  'bg-white/5 text-white/70 border border-white/10',
                  'hover:bg-white/10 hover:text-white hover:border-white/20',
                  'transition-colors'
                )}
              >
                {action}
              </button>
            ))}
          </motion.div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-white/30 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </motion.div>
  )
}
