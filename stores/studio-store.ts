'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/utils'

// Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  attachments?: Attachment[]
  suggestedActions?: string[]
}

export interface Attachment {
  id: string
  type: 'image' | 'file'
  url: string
  name: string
  thumbnail?: string
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  thumbnail?: string
}

export interface Render {
  id: string
  imageUrl: string
  prompt: string
  style: string
  createdAt: Date
  sessionId: string
  settings: RenderSettings
}

export interface RenderVariation {
  id: string
  imageUrl: string
  parentRenderId: string
}

export interface Collection {
  id: string
  name: string
  icon: string
  renderIds: string[]
  createdAt: Date
}

export interface RenderSettings {
  style: DesignStyle
  quality: 'draft' | 'standard' | 'high' | 'ultra'
  count: 1 | 2 | 4
  aspectRatio: '1:1' | '4:3' | '16:9' | '3:4' | '9:16'
  strength: number
  model: 'gemini-pro' | 'gemini-nano'
  seed?: number
}

export interface DesignStyle {
  id: string
  name: string
  thumbnail: string
  description: string
}

export interface GenerationPhase {
  name: string
  description: string
  progress: number
}

export type ViewMode = 'image' | 'video' | '3d'

// Design styles
export const DESIGN_STYLES: DesignStyle[] = [
  { id: 'modern', name: 'Modern', thumbnail: '/styles/modern.jpg', description: 'Clean lines, minimal' },
  { id: 'minimalist', name: 'Minimalist', thumbnail: '/styles/minimalist.jpg', description: 'Less is more' },
  { id: 'scandinavian', name: 'Scandinavian', thumbnail: '/styles/scandinavian.jpg', description: 'Cozy, functional' },
  { id: 'industrial', name: 'Industrial', thumbnail: '/styles/industrial.jpg', description: 'Raw, urban' },
  { id: 'bohemian', name: 'Bohemian', thumbnail: '/styles/bohemian.jpg', description: 'Eclectic, colorful' },
  { id: 'mid-century', name: 'Mid-Century', thumbnail: '/styles/mid-century.jpg', description: 'Retro elegance' },
  { id: 'contemporary', name: 'Contemporary', thumbnail: '/styles/contemporary.jpg', description: 'Current trends' },
  { id: 'traditional', name: 'Traditional', thumbnail: '/styles/traditional.jpg', description: 'Classic, timeless' },
  { id: 'coastal', name: 'Coastal', thumbnail: '/styles/coastal.jpg', description: 'Beach vibes' },
  { id: 'farmhouse', name: 'Farmhouse', thumbnail: '/styles/farmhouse.jpg', description: 'Rustic charm' },
  { id: 'art-deco', name: 'Art Deco', thumbnail: '/styles/art-deco.jpg', description: 'Glamorous, bold' },
  { id: 'japandi', name: 'Japandi', thumbnail: '/styles/japandi.jpg', description: 'Japanese + Nordic' },
]

export const GENERATION_PHASES: GenerationPhase[] = [
  { name: 'analyzing', description: 'Analyzing your image...', progress: 10 },
  { name: 'understanding', description: 'Understanding your prompt...', progress: 20 },
  { name: 'generating', description: 'Generating design...', progress: 60 },
  { name: 'refining', description: 'Refining details...', progress: 90 },
]

interface StudioState {
  // UI State
  rightPanelOpen: boolean
  rightPanelTab: 'chat' | 'settings'
  commandPaletteOpen: boolean
  viewMode: ViewMode

  // Chat State
  currentSessionId: string | null
  sessions: ChatSession[]
  isTyping: boolean

  // Render State
  currentRender: Render | null
  originalImage: string | null
  variations: RenderVariation[]
  isGenerating: boolean
  generationPhase: GenerationPhase | null
  generationProgress: number

  // Settings State
  settings: RenderSettings

  // Collections State
  collections: Collection[]
  recentRenders: Render[]

  // Usage State
  rendersUsedThisMonth: number
  renderLimit: number

  // Actions
  setRightPanelOpen: (open: boolean) => void
  setRightPanelTab: (tab: 'chat' | 'settings') => void
  setCommandPaletteOpen: (open: boolean) => void
  setViewMode: (mode: ViewMode) => void

  // Chat Actions
  createNewSession: () => string
  selectSession: (sessionId: string) => void
  sendMessage: (content: string, attachments?: Attachment[]) => void
  deleteSession: (sessionId: string) => void

  // Render Actions
  setOriginalImage: (url: string | null) => void
  generateRender: (prompt: string) => Promise<void>
  selectVariation: (variationId: string) => void

  // Settings Actions
  updateSettings: (settings: Partial<RenderSettings>) => void
  setStyle: (style: DesignStyle) => void

  // Collection Actions
  createCollection: (name: string) => void
  addToCollection: (collectionId: string, renderId: string) => void
  removeFromCollection: (collectionId: string, renderId: string) => void
  deleteCollection: (collectionId: string) => void
}

const DEFAULT_SETTINGS: RenderSettings = {
  style: DESIGN_STYLES[0],
  quality: 'standard',
  count: 1,
  aspectRatio: '4:3',
  strength: 75,
  model: 'gemini-pro',
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      // Initial UI State
      rightPanelOpen: true,
      rightPanelTab: 'chat',
      commandPaletteOpen: false,
      viewMode: 'image',

      // Initial Chat State
      currentSessionId: null,
      sessions: [],
      isTyping: false,

      // Initial Render State
      currentRender: null,
      originalImage: null,
      variations: [],
      isGenerating: false,
      generationPhase: null,
      generationProgress: 0,

      // Initial Settings State
      settings: DEFAULT_SETTINGS,

      // Initial Collections State
      collections: [
        { id: 'favorites', name: 'Favorites', icon: 'heart', renderIds: [], createdAt: new Date() },
        { id: 'client-a', name: 'Client A Project', icon: 'folder', renderIds: [], createdAt: new Date() },
        { id: 'inspiration', name: 'Inspiration', icon: 'lightbulb', renderIds: [], createdAt: new Date() },
      ],
      recentRenders: [],

      // Initial Usage State
      rendersUsedThisMonth: 47,
      renderLimit: 1000,

      // UI Actions
      setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setViewMode: (mode) => set({ viewMode: mode }),

      // Chat Actions
      createNewSession: () => {
        const id = generateId()
        const newSession: ChatSession = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: id,
          currentRender: null,
          originalImage: null,
          variations: [],
        }))
        return id
      },

      selectSession: (sessionId) => {
        set({ currentSessionId: sessionId })
      },

      sendMessage: (content, attachments) => {
        const state = get()
        let sessionId = state.currentSessionId

        if (!sessionId) {
          sessionId = get().createNewSession()
        }

        const userMessage: ChatMessage = {
          id: generateId(),
          role: 'user',
          content,
          timestamp: new Date(),
          attachments,
        }

        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, userMessage],
                  updatedAt: new Date(),
                  title: session.messages.length === 0 ? content.slice(0, 30) + '...' : session.title,
                }
              : session
          ),
          isTyping: true,
        }))

        // Simulate AI response
        setTimeout(() => {
          const aiMessage: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: `I'll help you create that design. Based on your request "${content.slice(0, 50)}...", I'll generate a ${state.settings.style.name.toLowerCase()} style interior with attention to lighting and composition.`,
            timestamp: new Date(),
            suggestedActions: [
              'Make it brighter',
              'Add more plants',
              'Try a different style',
              'Show variations',
            ],
          }

          set((state) => ({
            sessions: state.sessions.map((session) =>
              session.id === sessionId
                ? {
                    ...session,
                    messages: [...session.messages, aiMessage],
                    updatedAt: new Date(),
                  }
                : session
            ),
            isTyping: false,
          }))
        }, 1500)
      },

      deleteSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
          currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
        }))
      },

      // Render Actions
      setOriginalImage: (url) => set({ originalImage: url }),

      generateRender: async (prompt) => {
        const state = get()

        set({ isGenerating: true, generationProgress: 0 })

        // Start progress animation
        const progressInterval = setInterval(() => {
          set((s) => {
            const currentProgress = s.generationProgress
            if (currentProgress < 90) {
              const newProgress = currentProgress + 5
              const phaseIndex = Math.floor(newProgress / 25)
              return {
                generationProgress: newProgress,
                generationPhase: GENERATION_PHASES[Math.min(phaseIndex, GENERATION_PHASES.length - 1)],
              }
            }
            return s
          })
        }, 500)

        try {
          // Get base64 from original image if available
          let imageBase64: string | undefined
          if (state.originalImage && state.originalImage.startsWith('blob:')) {
            try {
              const response = await fetch(state.originalImage)
              const blob = await response.blob()
              const reader = new FileReader()
              imageBase64 = await new Promise<string>((resolve) => {
                reader.onloadend = () => {
                  const base64 = (reader.result as string).split(',')[1]
                  resolve(base64)
                }
                reader.readAsDataURL(blob)
              })
            } catch (e) {
              console.error('Failed to convert image to base64:', e)
            }
          }

          // Call the actual API
          const apiResponse = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt,
              style: state.settings.style.id,
              imageBase64,
              aspectRatio: state.settings.aspectRatio,
            }),
          })

          const data = await apiResponse.json()
          clearInterval(progressInterval)

          if (data.success && data.imageBase64) {
            // Create object URL from base64
            const imageUrl = `data:image/png;base64,${data.imageBase64}`

            const newRender: Render = {
              id: generateId(),
              imageUrl,
              prompt,
              style: state.settings.style.name,
              createdAt: new Date(),
              sessionId: state.currentSessionId || '',
              settings: state.settings,
            }

            set((s) => ({
              isGenerating: false,
              generationPhase: null,
              generationProgress: 100,
              currentRender: newRender,
              variations: [],
              recentRenders: [newRender, ...s.recentRenders].slice(0, 12),
              rendersUsedThisMonth: s.rendersUsedThisMonth + 1,
            }))
          } else {
            // Fallback to demo mode if API fails
            console.warn('API generation failed, using fallback:', data.error)

            const newRender: Render = {
              id: generateId(),
              imageUrl: state.originalImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop&q=80',
              prompt,
              style: state.settings.style.name,
              createdAt: new Date(),
              sessionId: state.currentSessionId || '',
              settings: state.settings,
            }

            set((s) => ({
              isGenerating: false,
              generationPhase: null,
              generationProgress: 100,
              currentRender: newRender,
              variations: [],
              recentRenders: [newRender, ...s.recentRenders].slice(0, 12),
              rendersUsedThisMonth: s.rendersUsedThisMonth + 1,
            }))
          }
        } catch (error) {
          clearInterval(progressInterval)
          console.error('Generation error:', error)

          // Fallback on error
          const newRender: Render = {
            id: generateId(),
            imageUrl: state.originalImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop&q=80',
            prompt,
            style: state.settings.style.name,
            createdAt: new Date(),
            sessionId: state.currentSessionId || '',
            settings: state.settings,
          }

          set((s) => ({
            isGenerating: false,
            generationPhase: null,
            generationProgress: 100,
            currentRender: newRender,
            variations: [],
            recentRenders: [newRender, ...s.recentRenders].slice(0, 12),
            rendersUsedThisMonth: s.rendersUsedThisMonth + 1,
          }))
        }
      },

      selectVariation: (variationId) => {
        const variation = get().variations.find((v) => v.id === variationId)
        if (variation && get().currentRender) {
          set((state) => ({
            currentRender: state.currentRender
              ? { ...state.currentRender, imageUrl: variation.imageUrl }
              : null,
          }))
        }
      },

      // Settings Actions
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },

      setStyle: (style) => {
        set((state) => ({
          settings: { ...state.settings, style },
        }))
      },

      // Collection Actions
      createCollection: (name) => {
        const newCollection: Collection = {
          id: generateId(),
          name,
          icon: 'folder',
          renderIds: [],
          createdAt: new Date(),
        }
        set((state) => ({
          collections: [...state.collections, newCollection],
        }))
      },

      addToCollection: (collectionId, renderId) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === collectionId
              ? { ...collection, renderIds: [...collection.renderIds, renderId] }
              : collection
          ),
        }))
      },

      removeFromCollection: (collectionId, renderId) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === collectionId
              ? { ...collection, renderIds: collection.renderIds.filter((id) => id !== renderId) }
              : collection
          ),
        }))
      },

      deleteCollection: (collectionId) => {
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== collectionId),
        }))
      },
    }),
    {
      name: 'visionary-studio-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        collections: state.collections,
        recentRenders: state.recentRenders,
        settings: state.settings,
        rendersUsedThisMonth: state.rendersUsedThisMonth,
      }),
    }
  )
)
