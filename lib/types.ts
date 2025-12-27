// App State Types
export type AppState = 'idle' | 'loading' | 'success' | 'error'

export type WorkspaceMode = 'image' | 'video' | '3d'

// Style Types
export type InteriorStyle =
  | 'modern'
  | 'minimalist'
  | 'industrial'
  | 'scandinavian'
  | 'japandi'
  | 'bohemian'
  | 'luxury'
  | 'coastal'
  | 'mid-century'
  | 'rustic'
  | 'contemporary'
  | 'art-deco'

export type AspectRatio = '16:9' | '1:1' | '9:16'

export type ImageQuality = 'draft' | 'standard' | 'high' | 'ultra'

export type ImageSize = '1K' | '2K' | '4K'

// Generation Types
export interface GenerationParams {
  prompt: string
  style: InteriorStyle
  imageBase64?: string
  aspectRatio?: AspectRatio
  quality?: ImageQuality
  count?: 1 | 2 | 4
  strength?: number
  seed?: number | 'random'
}

export interface GenerationResult {
  id: string
  success: boolean
  imageBase64?: string
  error?: string
  generationTime?: number
  params: GenerationParams
  timestamp: number
}

// Chat Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageBase64?: string
  timestamp: number
  generationResult?: GenerationResult
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
  thumbnail?: string
}

// Collection Types
export interface Collection {
  id: string
  name: string
  renderIds: string[]
  createdAt: number
  updatedAt: number
}

// Render Types
export interface Render {
  id: string
  imageBase64: string
  params: GenerationParams
  generationTime: number
  createdAt: number
  collectionId?: string
}

// Settings Types
export interface StudioSettings {
  defaultStyle: InteriorStyle
  defaultQuality: ImageQuality
  defaultAspectRatio: AspectRatio
  autoEnhancePrompt: boolean
  showKeyboardShortcuts: boolean
  reducedMotion: boolean
}

// User Types
export interface UserUsage {
  rendersThisMonth: number
  rendersLimit: number
  plan: 'free' | 'pro' | 'enterprise'
}

// Style Info
export interface StyleInfo {
  id: InteriorStyle
  name: string
  description: string
  thumbnail?: string
}

export const STYLES: StyleInfo[] = [
  { id: 'modern', name: 'Modern', description: 'Clean lines and minimalist furniture' },
  { id: 'minimalist', name: 'Minimalist', description: 'Essential elements only' },
  { id: 'industrial', name: 'Industrial', description: 'Exposed brick and metal accents' },
  { id: 'scandinavian', name: 'Scandinavian', description: 'Light wood and cozy textiles' },
  { id: 'japandi', name: 'Japandi', description: 'Japanese-Scandinavian fusion' },
  { id: 'bohemian', name: 'Bohemian', description: 'Eclectic patterns and colors' },
  { id: 'luxury', name: 'Luxury', description: 'High-end materials and finishes' },
  { id: 'coastal', name: 'Coastal', description: 'Beach-inspired and airy' },
  { id: 'mid-century', name: 'Mid-Century', description: '1950s-60s iconic design' },
  { id: 'rustic', name: 'Rustic', description: 'Natural materials and warmth' },
  { id: 'contemporary', name: 'Contemporary', description: 'Current design trends' },
  { id: 'art-deco', name: 'Art Deco', description: '1920s glamour and geometry' },
]
