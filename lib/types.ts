// App State Types
export type AppState = 'idle' | 'loading' | 'success' | 'error'

export type WorkspaceMode = 'image' | 'video' | '3d'

// Generation Mode Types
export type GenerationMode =
  | 'text-to-image'      // Generate from text prompt
  | 'image-to-image'     // Transform uploaded image
  | 'edit'               // Conversational iterative editing
  | 'inpaint'            // Selective region editing
  | 'outpaint'           // Extend image beyond borders
  | 'sketch-to-render'   // Convert sketch/blueprint to photorealistic
  | 'style-transfer'     // Apply style from one image to another
  | 'upscale'            // AI upscaling

// Render Type
export type RenderType =
  | 'Interior Design'
  | '2D/3D Floor Plan'
  | 'Exterior/Architectural'
  | 'Technical Blueprint'
  | 'Landscape/Garden'
  | 'Facade Renovation'
  | 'Urban Design'
  | 'Furniture Design'
  | 'Lighting Design'
  | 'Color Palette'

// Style Types - 50+ styles covering all major design movements
export type InteriorStyle =
  // Core Modern Styles
  | 'modern'
  | 'minimalist'
  | 'contemporary'
  | 'ultra-modern'
  // Regional Styles
  | 'scandinavian'
  | 'japandi'
  | 'mediterranean'
  | 'moroccan'
  | 'tropical'
  | 'french-country'
  | 'tuscan'
  | 'british-colonial'
  | 'korean-modern'
  | 'brazilian-modern'
  // Historical Styles
  | 'art-deco'
  | 'art-nouveau'
  | 'mid-century'
  | 'victorian'
  | 'georgian'
  | 'baroque'
  | 'renaissance'
  | 'gothic'
  | 'neoclassical'
  // Material-Forward Styles
  | 'industrial'
  | 'brutalist'
  | 'rustic'
  | 'organic-modern'
  | 'raw-concrete'
  | 'biophilic'
  | 'wabi-sabi'
  // Aesthetic Styles
  | 'bohemian'
  | 'luxury'
  | 'coastal'
  | 'farmhouse'
  | 'cottagecore'
  | 'grandmillennial'
  | 'maximalist'
  | 'eclectic'
  | 'retro-futurism'
  // Architectural Styles
  | 'bauhaus'
  | 'deconstructivist'
  | 'parametric'
  | 'high-tech'
  | 'sustainable'
  // Designer Styles
  | 'zen'
  | 'hollywood-regency'
  | 'shabby-chic'
  | 'urban-loft'
  | 'penthouse'
  | 'ski-chalet'
  | 'desert-modern'
  | 'pacific-northwest'
  // Classic Styles
  | 'classic-european'
  | 'traditional'
  | 'transitional'
  | 'colonial'

export type AspectRatio = '16:9' | '1:1' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3'

export type ImageQuality = 'draft' | 'standard' | 'high' | 'ultra'

export type ImageSize = '1K' | '2K' | '4K'

// Generation Types
export interface GenerationParams {
  prompt: string
  style: InteriorStyle
  renderType?: RenderType
  generationMode?: GenerationMode
  imageBase64?: string
  maskBase64?: string  // For inpainting
  referenceImageBase64?: string  // For style transfer
  aspectRatio?: AspectRatio
  quality?: ImageQuality
  count?: 1 | 2 | 4
  strength?: number
  seed?: number | 'random'
  roomType?: string
  // Editing params
  editInstruction?: string
  // Weather/lighting controls
  timeOfDay?: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'golden-hour' | 'dusk' | 'night'
  season?: 'spring' | 'summer' | 'autumn' | 'winter'
  weather?: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'foggy'
}

export interface GenerationResult {
  id: string
  success: boolean
  imageBase64?: string
  textResponse?: string
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
  category: string
  thumbnail?: string
}

// Style categories for organized display
export const STYLE_CATEGORIES = [
  'Core Modern',
  'Regional',
  'Historical',
  'Material-Forward',
  'Aesthetic',
  'Architectural',
  'Designer',
  'Classic',
] as const

export type StyleCategory = typeof STYLE_CATEGORIES[number]

export const STYLES: StyleInfo[] = [
  // Core Modern (4)
  { id: 'modern', name: 'Modern', description: 'Clean lines and minimalist furniture', category: 'Core Modern' },
  { id: 'minimalist', name: 'Minimalist', description: 'Essential elements only, negative space', category: 'Core Modern' },
  { id: 'contemporary', name: 'Contemporary', description: 'Current design trends, curated mix', category: 'Core Modern' },
  { id: 'ultra-modern', name: 'Ultra Modern', description: 'Cutting-edge materials and technology', category: 'Core Modern' },

  // Regional (10)
  { id: 'scandinavian', name: 'Scandinavian', description: 'Light wood and cozy hygge textiles', category: 'Regional' },
  { id: 'japandi', name: 'Japandi', description: 'Japanese-Scandinavian zen fusion', category: 'Regional' },
  { id: 'mediterranean', name: 'Mediterranean', description: 'Warm terracotta, arched doorways, olive tones', category: 'Regional' },
  { id: 'moroccan', name: 'Moroccan', description: 'Ornate tiles, jewel tones, lanterns', category: 'Regional' },
  { id: 'tropical', name: 'Tropical', description: 'Lush greenery, rattan, natural ventilation', category: 'Regional' },
  { id: 'french-country', name: 'French Country', description: 'Rustic elegance, lavender, toile', category: 'Regional' },
  { id: 'tuscan', name: 'Tuscan', description: 'Italian countryside warmth, stone and wood', category: 'Regional' },
  { id: 'british-colonial', name: 'British Colonial', description: 'Plantation style, dark wood, tropical plants', category: 'Regional' },
  { id: 'korean-modern', name: 'Korean Modern', description: 'Hanok-inspired, clean lines, ondol warmth', category: 'Regional' },
  { id: 'brazilian-modern', name: 'Brazilian Modern', description: 'Tropical modernism, organic curves, vibrant color', category: 'Regional' },

  // Historical (9)
  { id: 'art-deco', name: 'Art Deco', description: '1920s glamour, geometric patterns', category: 'Historical' },
  { id: 'art-nouveau', name: 'Art Nouveau', description: 'Organic curves, floral motifs, stained glass', category: 'Historical' },
  { id: 'mid-century', name: 'Mid-Century Modern', description: '1950s-60s iconic design pieces', category: 'Historical' },
  { id: 'victorian', name: 'Victorian', description: 'Ornate details, rich fabrics, dark wood', category: 'Historical' },
  { id: 'georgian', name: 'Georgian', description: 'Symmetrical elegance, classical proportions', category: 'Historical' },
  { id: 'baroque', name: 'Baroque', description: 'Opulent grandeur, gilding, dramatic lighting', category: 'Historical' },
  { id: 'renaissance', name: 'Renaissance', description: 'Classical revival, symmetry, rich materials', category: 'Historical' },
  { id: 'gothic', name: 'Gothic', description: 'Pointed arches, stone, dramatic atmosphere', category: 'Historical' },
  { id: 'neoclassical', name: 'Neoclassical', description: 'Greek/Roman revival, columns, marble', category: 'Historical' },

  // Material-Forward (7)
  { id: 'industrial', name: 'Industrial', description: 'Exposed brick, metal beams, raw materials', category: 'Material-Forward' },
  { id: 'brutalist', name: 'Brutalist', description: 'Raw concrete, bold geometric forms', category: 'Material-Forward' },
  { id: 'rustic', name: 'Rustic', description: 'Reclaimed wood, stone, natural warmth', category: 'Material-Forward' },
  { id: 'organic-modern', name: 'Organic Modern', description: 'Natural materials, flowing forms, earth tones', category: 'Material-Forward' },
  { id: 'raw-concrete', name: 'Raw Concrete', description: 'Exposed concrete, minimalist, museum-like', category: 'Material-Forward' },
  { id: 'biophilic', name: 'Biophilic', description: 'Living walls, natural light, plant-integrated', category: 'Material-Forward' },
  { id: 'wabi-sabi', name: 'Wabi-Sabi', description: 'Imperfection beauty, patina, asymmetry', category: 'Material-Forward' },

  // Aesthetic (8)
  { id: 'bohemian', name: 'Bohemian', description: 'Eclectic patterns, jewel tones, layered', category: 'Aesthetic' },
  { id: 'luxury', name: 'Luxury', description: 'High-end materials, marble, gold accents', category: 'Aesthetic' },
  { id: 'coastal', name: 'Coastal', description: 'Beach-inspired, light and airy', category: 'Aesthetic' },
  { id: 'farmhouse', name: 'Farmhouse', description: 'Shiplap, barn doors, rustic charm', category: 'Aesthetic' },
  { id: 'cottagecore', name: 'Cottagecore', description: 'Whimsical rural, florals, vintage charm', category: 'Aesthetic' },
  { id: 'grandmillennial', name: 'Grandmillennial', description: 'Updated traditional, chintz, antiques', category: 'Aesthetic' },
  { id: 'maximalist', name: 'Maximalist', description: 'Bold patterns, rich colors, more is more', category: 'Aesthetic' },
  { id: 'eclectic', name: 'Eclectic', description: 'Curated mix of styles, personal expression', category: 'Aesthetic' },
  { id: 'retro-futurism', name: 'Retro Futurism', description: 'Space-age curves, chrome, neon accents', category: 'Aesthetic' },

  // Architectural (5)
  { id: 'bauhaus', name: 'Bauhaus', description: 'Form follows function, primary colors', category: 'Architectural' },
  { id: 'deconstructivist', name: 'Deconstructivist', description: 'Fragmented forms, unexpected angles', category: 'Architectural' },
  { id: 'parametric', name: 'Parametric', description: 'Algorithm-driven organic forms', category: 'Architectural' },
  { id: 'high-tech', name: 'High-Tech', description: 'Exposed structure, steel and glass', category: 'Architectural' },
  { id: 'sustainable', name: 'Sustainable', description: 'Eco-friendly materials, green design', category: 'Architectural' },

  // Designer (8)
  { id: 'zen', name: 'Zen', description: 'Peaceful minimalism, water elements, rock gardens', category: 'Designer' },
  { id: 'hollywood-regency', name: 'Hollywood Regency', description: 'Glamorous, mirrored surfaces, bold color', category: 'Designer' },
  { id: 'shabby-chic', name: 'Shabby Chic', description: 'Distressed elegance, pastel palette', category: 'Designer' },
  { id: 'urban-loft', name: 'Urban Loft', description: 'Open plan, high ceilings, city views', category: 'Designer' },
  { id: 'penthouse', name: 'Penthouse', description: 'Skyline views, luxury finishes, open living', category: 'Designer' },
  { id: 'ski-chalet', name: 'Ski Chalet', description: 'Alpine warmth, timber, stone fireplace', category: 'Designer' },
  { id: 'desert-modern', name: 'Desert Modern', description: 'Arid landscape palette, adobe, succulents', category: 'Designer' },
  { id: 'pacific-northwest', name: 'Pacific Northwest', description: 'Cedar, moss green, cozy rain-day vibes', category: 'Designer' },

  // Classic (4)
  { id: 'classic-european', name: 'Classic European', description: 'Ornate moldings, chandeliers, rich wood', category: 'Classic' },
  { id: 'traditional', name: 'Traditional', description: 'Timeless elegance, symmetry, quality craftsmanship', category: 'Classic' },
  { id: 'transitional', name: 'Transitional', description: 'Bridge between traditional and modern', category: 'Classic' },
  { id: 'colonial', name: 'Colonial', description: 'American colonial heritage, simple elegance', category: 'Classic' },
]

// Render types available
export const RENDER_TYPES: RenderType[] = [
  'Interior Design',
  '2D/3D Floor Plan',
  'Exterior/Architectural',
  'Technical Blueprint',
  'Landscape/Garden',
  'Facade Renovation',
  'Urban Design',
  'Furniture Design',
  'Lighting Design',
  'Color Palette',
]

// Room types
export const ROOM_TYPES = [
  'Living Room',
  'Kitchen',
  'Bedroom',
  'Bathroom',
  'Office',
  'Dining Room',
  'Home Theater',
  'Gym',
  'Entryway',
  'Outdoor/Patio',
  'Nursery',
  'Library',
  'Wine Cellar',
  'Walk-in Closet',
  'Laundry Room',
  'Sunroom',
  'Mudroom',
  'Garage',
  'Basement',
  'Attic',
] as const

// Generation modes available
export const GENERATION_MODES: { id: GenerationMode; name: string; description: string; icon: string }[] = [
  { id: 'text-to-image', name: 'Text to Image', description: 'Generate from a text description', icon: 'type' },
  { id: 'image-to-image', name: 'Image Transform', description: 'Transform an uploaded photo', icon: 'image' },
  { id: 'edit', name: 'AI Edit', description: 'Iteratively refine with conversation', icon: 'message-square' },
  { id: 'inpaint', name: 'Inpaint', description: 'Edit specific regions of an image', icon: 'eraser' },
  { id: 'outpaint', name: 'Outpaint', description: 'Extend image beyond its borders', icon: 'expand' },
  { id: 'sketch-to-render', name: 'Sketch to Render', description: 'Convert sketches to photorealistic renders', icon: 'pen-tool' },
  { id: 'style-transfer', name: 'Style Transfer', description: 'Apply one style to another image', icon: 'palette' },
  { id: 'upscale', name: 'AI Upscale', description: 'Enhance resolution with AI', icon: 'maximize' },
]

// Time of day options
export const TIME_OF_DAY_OPTIONS = [
  { id: 'dawn', name: 'Dawn', description: 'Soft pink and purple pre-sunrise light' },
  { id: 'morning', name: 'Morning', description: 'Fresh natural daylight' },
  { id: 'noon', name: 'Noon', description: 'Bright overhead sunlight' },
  { id: 'afternoon', name: 'Afternoon', description: 'Warm angled sunlight' },
  { id: 'golden-hour', name: 'Golden Hour', description: 'Rich warm sunset tones' },
  { id: 'dusk', name: 'Dusk', description: 'Blue hour twilight ambiance' },
  { id: 'night', name: 'Night', description: 'Artificial lighting, cozy atmosphere' },
] as const

// Season options
export const SEASON_OPTIONS = [
  { id: 'spring', name: 'Spring', description: 'Fresh greens, blooming flowers' },
  { id: 'summer', name: 'Summer', description: 'Bright, lush, warm' },
  { id: 'autumn', name: 'Autumn', description: 'Warm oranges, falling leaves' },
  { id: 'winter', name: 'Winter', description: 'Snow, frost, cozy warmth' },
] as const
