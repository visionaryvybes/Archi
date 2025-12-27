'use client'

import { useEffect, useCallback } from 'react'

type KeyCombo = string // e.g., 'ctrl+k', 'meta+shift+p'
type KeyHandler = (event: KeyboardEvent) => void

interface ShortcutOptions {
  enabled?: boolean
  preventDefault?: boolean
}

const isMac =
  typeof window !== 'undefined' &&
  navigator.platform.toUpperCase().indexOf('MAC') >= 0

function parseKeyCombo(combo: string): {
  key: string
  ctrl: boolean
  meta: boolean
  shift: boolean
  alt: boolean
} {
  const parts = combo.toLowerCase().split('+')
  const key = parts[parts.length - 1]

  return {
    key,
    ctrl: parts.includes('ctrl'),
    meta: parts.includes('meta') || parts.includes('cmd'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
  }
}

function matchesKeyCombo(event: KeyboardEvent, combo: string): boolean {
  const { key, ctrl, meta, shift, alt } = parseKeyCombo(combo)

  // Handle 'mod' as a platform-agnostic modifier (cmd on mac, ctrl elsewhere)
  const modPressed = isMac ? event.metaKey : event.ctrlKey
  const expectsMod = combo.toLowerCase().includes('mod')

  if (expectsMod && !modPressed) return false
  if (!expectsMod && ctrl && !event.ctrlKey) return false
  if (!expectsMod && meta && !event.metaKey) return false
  if (shift && !event.shiftKey) return false
  if (alt && !event.altKey) return false

  return event.key.toLowerCase() === key
}

export function useKeyboardShortcut(
  keyCombo: KeyCombo | KeyCombo[],
  handler: KeyHandler,
  options: ShortcutOptions = {}
) {
  const { enabled = true, preventDefault = true } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Ignore if user is typing in an input
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow certain shortcuts even in inputs
        if (!event.metaKey && !event.ctrlKey) return
      }

      const combos = Array.isArray(keyCombo) ? keyCombo : [keyCombo]

      for (const combo of combos) {
        if (matchesKeyCombo(event, combo)) {
          if (preventDefault) {
            event.preventDefault()
          }
          handler(event)
          break
        }
      }
    },
    [keyCombo, handler, enabled, preventDefault]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Common shortcuts
export const SHORTCUTS = {
  newChat: 'mod+n',
  upload: 'mod+u',
  generate: 'mod+enter',
  download: 'mod+d',
  commandPalette: 'mod+k',
  escape: 'escape',
  toggleBeforeAfter: ' ', // space
} as const
