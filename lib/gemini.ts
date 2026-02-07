import { GoogleGenAI } from '@google/genai'
import type { InteriorStyle, RenderType, GenerationMode } from './types'

// ============================================================
// Nano Banana Pro - Gemini Image Generation Engine
// ============================================================

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

// Model constants
const NANO_BANANA_PRO = 'gemini-3-pro-image-preview'  // Best for image generation
const GEMINI_FLASH = 'gemini-2.0-flash'                // Fast text/prompt enhancement

// ============================================================
// Style Prompt Library - 50+ detailed style descriptions
// ============================================================

export const STYLE_PROMPTS: Record<string, string> = {
  // Core Modern
  'modern': 'sleek contemporary design with clean lines, minimalist furniture, neutral palette with strategic accent colors, floor-to-ceiling windows, polished concrete or hardwood floors, hidden storage, seamless surfaces',
  'minimalist': 'ultra-minimal design, monochromatic color scheme, essential furniture only, negative space emphasis, hidden storage, seamless surfaces, gallery-like atmosphere, Japanese-inspired simplicity',
  'contemporary': 'current design trends, mix of textures, statement lighting, bold art, comfortable luxury, curated accessories, tech integration, warm neutral base with pops of color',
  'ultra-modern': 'cutting-edge futuristic interior, smart home technology visible, LED ambient lighting, innovative materials like carbon fiber and resin, floating furniture, glass walls, holographic elements',

  // Regional
  'scandinavian': 'light wood tones (birch, ash, pine), white or light gray walls, cozy textiles (chunky knit throws, sheepskin), hygge atmosphere, functional minimalist design, natural materials, subtle pastel accents, candles, abundant natural light',
  'japandi': 'Japanese-Scandinavian fusion, wabi-sabi elements, natural materials, muted earth tones, low furniture, zen garden influences, paper screens, bonsai, clean lines with organic touches',
  'mediterranean': 'warm terracotta tiles, whitewashed walls, arched doorways and windows, wrought iron details, olive and sage green tones, terra cotta pottery, exposed wooden beams, courtyard views, bougainvillea',
  'moroccan': 'ornate zellige tile work, jewel tones (deep blue, emerald, ruby), carved wood screens, brass lanterns, plush cushions and poufs, intricate geometric patterns, archways, spice-market warmth',
  'tropical': 'lush indoor plants (monstera, palms, bird of paradise), rattan and bamboo furniture, natural ventilation, ceiling fans, open-plan living, bright whites with tropical greens, resort-like atmosphere',
  'french-country': 'rustic elegance, soft florals, weathered wood, stone floors, copper cookware, lavender accents, toile de Jouy fabric, distressed furniture, provincial charm, exposed beams',
  'tuscan': 'Italian countryside warmth, terracotta and ochre tones, stone walls, wrought iron fixtures, olive wood, vineyard views, rustic pottery, warm sunlight, arched ceilings',
  'british-colonial': 'dark hardwood furniture (teak, mahogany), plantation shutters, ceiling fans, tropical plants, leather seating, brass fixtures, rich patterns, expedition artifacts, veranda views',
  'korean-modern': 'hanok-inspired elements, clean minimal lines, ondol heating, natural materials (hanji paper, wood), neutral palette, low dining tables, paper lanterns, subtle curves',
  'brazilian-modern': 'Oscar Niemeyer-inspired curves, tropical hardwood, vibrant accent colors, indoor-outdoor flow, concrete and glass, hanging gardens, bold geometric art, natural stone',

  // Historical
  'art-deco': '1920s glamour, geometric patterns, rich jewel colors, metallic accents (gold, chrome), lacquered surfaces, bold symmetry, velvet upholstery, sunburst motifs, mirrored surfaces, gatsby-era luxury',
  'art-nouveau': 'organic flowing curves, floral and botanical motifs, stained glass windows, whiplash lines, Tiffany lamps, nature-inspired ironwork, pastel colors with rich accents, mucha-style details',
  'mid-century': '1950s-60s iconic design, Eames and Saarinen furniture, organic shapes, wood paneling, bold accent colors (mustard, teal, orange), geometric patterns, sunburst clocks, kidney-shaped tables',
  'victorian': 'ornate carved furniture, rich damask and brocade fabrics, dark wood (mahogany, walnut), floral wallpaper, tufted upholstery, heavy drapery, ornamental fireplace, patterned rugs, gaslight-era charm',
  'georgian': 'symmetrical elegance, classical proportions, crown moldings, sash windows, marble fireplaces, Chippendale furniture, muted color palette, decorative plasterwork, refinement',
  'baroque': 'opulent grandeur, gilded details, dramatic ceiling frescoes, marble columns, ornate mirrors, crystal chandeliers, rich velvet and silk, carved furniture, dramatic contrast of light and shadow',
  'renaissance': 'classical revival, symmetrical layouts, rich tapestries, carved stone details, cofferred ceilings, oil paintings, warm candlelight, noble materials, humanist proportions',
  'gothic': 'pointed arches, ribbed vaults, stone walls, stained glass windows, dark atmosphere with dramatic light, wrought iron, heavy wooden furniture, medieval tapestries, cathedral-like spaces',
  'neoclassical': 'Greek and Roman revival, fluted columns, pediments, marble floors, symmetrical layout, urns and busts, pastel walls with white trim, formal elegance, Wedgwood blue accents',

  // Material-Forward
  'industrial': 'exposed brick walls, metal beams and ductwork, polished concrete floors, vintage factory elements, Edison bulbs and industrial lighting, raw materials (steel, iron, reclaimed wood), leather and metal furniture, high ceilings, large factory windows',
  'brutalist': 'exposed concrete surfaces (béton brut), bold geometric forms, monolithic structures, raw unfinished materials, dramatic shadows and light, minimal ornamentation, strong angular shapes, textural concrete',
  'rustic': 'reclaimed wood beams and flooring, stone fireplace, natural materials, warm earth tones, handcrafted elements, cozy textiles (wool, linen), farmhouse charm, antler accents, copper fixtures',
  'organic-modern': 'natural materials in contemporary forms, curved furniture, earth tones, live-edge wood, stone accents, flowing organic shapes, nature-inspired textures, warm and grounding',
  'raw-concrete': 'exposed poured concrete walls and floors, minimal intervention, museum-like gallery spaces, dramatic single-source lighting, brutalist beauty, stark minimalism, industrial skylights',
  'biophilic': 'living green walls, abundant indoor plants, natural daylight optimization, water features, natural wood and stone, moss panels, earth tones, nature sounds, healing environment',
  'wabi-sabi': 'beauty in imperfection, natural patina, asymmetry, rough textures, handmade ceramics, weathered wood, earth tones, simplicity, acceptance of transience, muted natural palette',

  // Aesthetic
  'bohemian': 'eclectic mix of patterns and textures, rich jewel tones, layered textiles, vintage and global finds, macrame, plants everywhere, floor cushions, tapestries, free-spirited expression',
  'luxury': 'high-end materials, marble surfaces, gold and brass accents, crystal chandeliers, velvet upholstery, custom millwork, statement art pieces, professional interior styling',
  'coastal': 'light and airy, ocean-inspired colors (navy, seafoam, sand), natural textures (rope, driftwood), weathered wood, linen fabrics, nautical elements, large windows with water views',
  'farmhouse': 'shiplap walls, barn doors, apron-front sink, reclaimed wood, white and neutral palette, rustic charm, mason jars, vintage accessories, comfortable and welcoming',
  'cottagecore': 'whimsical rural aesthetic, floral prints, vintage furniture, handmade quilts, botanical illustrations, dried flowers, pastel colors, lace curtains, romantic countryside charm',
  'grandmillennial': 'updated traditional style, chintz patterns, antique furniture mixed with modern, bold wallpaper, needlepoint pillows, grandmother-chic, skirted tables, formal yet playful',
  'maximalist': 'bold patterns everywhere, rich saturated colors, layered textures, eclectic art collection, statement furniture, more-is-more philosophy, curated chaos, conversation-starting pieces',
  'eclectic': 'curated mix of multiple styles, personal expression, travel souvenirs, mix of old and new, unexpected color combinations, storytelling through objects, collected-over-time aesthetic',
  'retro-futurism': 'space-age design, curved chrome furniture, bubble chairs, neon accent lighting, white and metallic palette, modular furniture, 1960s space-age optimism meets 2020s technology',

  // Architectural
  'bauhaus': 'form follows function, primary colors (red, blue, yellow) with black/white, tubular steel furniture (Breuer, Mies), geometric compositions, sans-serif aesthetic, modernist art pieces',
  'deconstructivist': 'fragmented forms, unexpected angles, asymmetric compositions, dynamic surfaces, controlled chaos, Gehry and Hadid inspired, bold structural expression',
  'parametric': 'algorithmically-derived organic forms, 3D-printed furniture, flowing continuous surfaces, mathematical beauty, biomorphic shapes, Zaha Hadid-inspired curves, futuristic materials',
  'high-tech': 'exposed structural elements as design features, steel and glass, visible mechanical systems, industrial aesthetic elevated, Rogers and Foster inspired, technical precision beauty',
  'sustainable': 'recycled and reclaimed materials, bamboo, cork, living walls, solar integration, rainwater features, natural ventilation, low-carbon materials, certification-worthy green design',

  // Designer
  'zen': 'peaceful minimalism, rock gardens, water elements, bamboo, natural light, meditation spaces, low furniture, neutral earth tones, bonsai, paper screens, ultimate serenity',
  'hollywood-regency': 'glamorous and bold, mirrored furniture, lacquered surfaces, bold jewel-toned walls, animal prints, brass and gold accents, plush velvet, dramatic wallpaper, old Hollywood glamour',
  'shabby-chic': 'distressed painted furniture, soft pastel palette, vintage floral fabrics, chippy paint effect, crystal chandeliers, romantic and feminine, whitewashed surfaces, rose accents',
  'urban-loft': 'open floor plan, soaring ceilings, exposed brick and ductwork, oversized windows with city views, polished concrete floors, industrial meets refined, art gallery walls',
  'penthouse': 'panoramic skyline views, floor-to-ceiling glass, luxury finishes (marble, onyx), designer furniture, open entertaining spaces, integrated smart home, rooftop terrace access',
  'ski-chalet': 'alpine warmth, exposed timber beams, stone fireplace centerpiece, fur throws, warm wood paneling, mountain views, snow outside, cozy layers, après-ski atmosphere',
  'desert-modern': 'arid landscape-inspired palette (sand, terracotta, sage), adobe textures, succulents and cacti, natural light flooding in, rammed earth walls, handwoven textiles',
  'pacific-northwest': 'cedar and Douglas fir, moss and forest green, large windows framing trees, cozy rain-day atmosphere, wool blankets, coffee station, bookshelf styling, cabin-modern fusion',

  // Classic
  'classic-european': 'ornate crown moldings, crystal chandeliers, rich wood paneling, marble surfaces, damask fabrics, antique furniture, Persian rugs, gold accents, oil paintings in gilded frames, luxurious drapery',
  'traditional': 'timeless elegance, symmetrical layouts, quality craftsmanship, refined materials, formal living spaces, matching furniture sets, classic patterns (stripes, florals), balanced proportions',
  'transitional': 'bridge between traditional and modern, clean lines with warm materials, neutral palette, minimal ornamentation, comfortable yet refined, updated classic furniture forms',
  'colonial': 'American colonial heritage, simple elegant furniture, natural wood tones, brass hardware, navy and cream palette, brick fireplace, four-poster beds, historical authenticity',
}

// ============================================================
// Room Detail Prompts
// ============================================================

export const ROOM_DETAILS: Record<string, string> = {
  'Living Room': 'soft textured throw pillows on a designer sofa, open coffee table books, warm morning sunlight through floor-to-ceiling windows, lush indoor plants like fiddle leaf figs, soft woven area rug, curated artwork on walls, ambient table lamps',
  'Kitchen': 'high-end marble or quartz countertops, steaming espresso machine, professional knives on magnetic strip, copper cookware hanging, wooden cutting boards, LED strips under cabinets, fresh herbs in ceramic pots, designer bar stools',
  'Bedroom': 'rumpled high-thread-count linen sheets, stack of design books on nightstand, warm bedside lighting, soft wool throw blanket, high-end drapes with realistic folds, plush pillows, modern headboard, reading chair',
  'Bathroom': 'steam on glass shower partition, plush rolled cotton towels, luxury soap dispensers, natural stone textures, rain shower head, freestanding tub, designer fixtures, ambient lighting, fresh flowers',
  'Office': 'modern adjustable desk lamp, high-resolution monitors, ergonomic chair, personal artifacts, clean cable management, bookshelf with design books, indoor plant, minimalist desk setup',
  'Dining Room': 'designer pendant lighting, place settings with high-end dinnerware, fresh floral centerpiece, elegant upholstered chairs, wine glasses, textured table runner, ambient candlelight',
  'Home Theater': 'plush deep-seated velvet chairs, subtle floor-level track lighting, high-end speaker system, dark wall panels, acoustic treatments, popcorn machine, movie posters',
  'Gym': 'professional equipment, textured rubber flooring, wall-sized mirrors, hydration station, yoga mats rolled neatly, kettlebells on rack, motivational artwork, natural light',
  'Entryway': 'designer console table, large statement mirror, fresh flowers in modern vase, key tray, gallery wall, coat hooks, bench with plush cushion, runner rug',
  'Outdoor/Patio': 'comfortable outdoor furniture with weather-resistant cushions, string lights, potted plants, outdoor rug, fire pit, dining table, lanterns, lush greenery',
  'Nursery': 'soft pastel tones, modern crib with organic cotton bedding, mobile, plush toys, growth chart wall art, rocking chair, soft rug, dreamy lighting',
  'Library': 'floor-to-ceiling bookshelves, rolling ladder, leather reading chair, brass desk lamp, thick rug, globe, antique desk, warm wood tones',
  'Wine Cellar': 'temperature-controlled racking, stone or brick walls, ambient low lighting, tasting table, barrel accents, glass door, vintage bottles',
  'Walk-in Closet': 'custom built-in shelving, island with glass top, velvet-lined drawers, LED-lit shoe display, full-length mirror, seating area, organized accessories',
  'Laundry Room': 'front-load washer and dryer, folding station, hanging rack, storage cabinets, utility sink, bright lighting, organized supplies',
  'Sunroom': 'floor-to-ceiling glass walls, wicker and rattan furniture, trailing plants, dappled sunlight, cozy reading nook, connection to garden',
  'Mudroom': 'built-in cubbies, hooks for coats, bench with storage, tile floor, boot tray, organized baskets, functional and welcoming',
  'Garage': 'epoxy floor, tool pegboard wall, workbench, organized storage, LED lighting, clean and organized, car enthusiast details',
  'Basement': 'comfortable lounge area, entertainment system, bar area, game table, carpet or vinyl plank flooring, acoustic panels, versatile space',
  'Attic': 'exposed roof beams, skylights, cozy reading nook, built-in storage under eaves, warm lighting, charming sloped ceilings',
}

// ============================================================
// Render Type Configurations
// ============================================================

export const RENDER_TYPE_CONFIGS: Record<string, { prefix: string; instructions: string }> = {
  'Interior Design': {
    prefix: 'PHOTOREALISTIC HIGH-END INTERIOR DESIGN',
    instructions: 'Architectural Digest quality photography. Magazine-worthy composition. Perfect lighting with natural volumetric sunlight and soft global illumination. Ultra-detailed fabric weaves, polished stone, wood grain. No empty spaces - lived-in and luxurious feel. Professional interior photography with proper depth of field.'
  },
  '2D/3D Floor Plan': {
    prefix: '3D ISOMETRIC ARCHITECTURAL FLOOR PLAN',
    instructions: 'Clean architectural top-down isometric view. Realistic furniture models with proper scale. Material callouts and labels. Soft ambient occlusion shadows. Professional architectural visualization. Color-coded zones. Measurements and dimensions visible.'
  },
  'Exterior/Architectural': {
    prefix: 'PHOTOREALISTIC EXTERIOR ARCHITECTURE',
    instructions: 'Golden hour lighting. Detailed landscaping with specific plants, gravel paths, and outdoor lighting. Sharp focus on textures like wood siding, concrete, glass, metal. Professional architectural photography. Dramatic sky with volumetric clouds.'
  },
  'Technical Blueprint': {
    prefix: 'TECHNICAL ARCHITECTURAL BLUEPRINT',
    instructions: 'CAD-style technical drafting on dark charcoal or blue background. Crisp white and cyan vector lines. Structural measurements and dimensions. Cross-sections and elevation views. Professional engineering aesthetic. Grid lines and scale indicators.'
  },
  'Landscape/Garden': {
    prefix: 'LANDSCAPE ARCHITECTURE DESIGN',
    instructions: 'Detailed botanical elements with realistic flora. Stone masonry and hardscaping. Water features with accurate reflections. Natural lighting conditions. Seasonal planting scheme. Pathways and circulation.'
  },
  'Facade Renovation': {
    prefix: 'ARCHITECTURAL FACADE RENOVATION',
    instructions: 'Before-and-after concept. Show architectural facade transformation with new materials, window treatments, cladding, and landscaping. Street-level perspective. Realistic neighborhood context.'
  },
  'Urban Design': {
    prefix: 'URBAN PLANNING AND DESIGN',
    instructions: 'Aerial or street-level view of urban space. Mixed-use buildings, pedestrian areas, green spaces, transit integration. Human scale elements. Vibrant street life. Sustainable urban design principles.'
  },
  'Furniture Design': {
    prefix: 'PRODUCT DESIGN - FURNITURE',
    instructions: 'Studio photography style on clean background. Multiple angles. Material and texture detail. Proportional accuracy. Design specification aesthetic. Showroom quality.'
  },
  'Lighting Design': {
    prefix: 'ARCHITECTURAL LIGHTING DESIGN',
    instructions: 'Focus on light and shadow interplay. Multiple lighting layers (ambient, task, accent, decorative). Show light fixtures and their effects. Evening/night atmosphere. Warm and cool light balance.'
  },
  'Color Palette': {
    prefix: 'INTERIOR COLOR PALETTE VISUALIZATION',
    instructions: 'Show a room rendered with the specific color palette. Include color swatches overlay. Material samples. Harmonious color relationships. Professional color consultation presentation.'
  },
}

// ============================================================
// Core Generation Functions
// ============================================================

export interface GenerateImageParams {
  prompt: string
  renderType?: string
  aesthetic?: string
  roomType?: string
  imageBase64?: string
  maskBase64?: string
  referenceImageBase64?: string
  aspectRatio?: string
  quality?: string
  mode?: GenerationMode
  editInstruction?: string
  timeOfDay?: string
  season?: string
  weather?: string
  // Multi-turn conversation history
  conversationHistory?: Array<{
    role: 'user' | 'model'
    parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>
  }>
}

export interface GenerateImageResult {
  success: boolean
  imageBase64?: string
  textResponse?: string
  error?: string
  generationTime: number
}

// Retry logic for server errors (no rate limiting - paid subscription)
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 5
): Promise<T> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error))
      const statusCode = (error as { status?: number })?.status
      // Retry on server errors (5xx) only
      if (statusCode && statusCode >= 500 && attempt < maxRetries) {
        console.log(`Retry attempt ${attempt + 1}/${maxRetries}...`)
        continue
      }
      throw error
    }
  }
  throw lastError
}

// Build the full prompt with all context
function buildPrompt(params: GenerateImageParams): string {
  const renderType = params.renderType || 'Interior Design'
  const aesthetic = params.aesthetic || 'modern'
  const roomType = params.roomType || 'Living Room'
  const mode = params.mode || (params.imageBase64 ? 'image-to-image' : 'text-to-image')

  const renderConfig = RENDER_TYPE_CONFIGS[renderType] || RENDER_TYPE_CONFIGS['Interior Design']
  const styleDescription = STYLE_PROMPTS[aesthetic] || STYLE_PROMPTS['modern']
  const showRoomDetails = renderType === 'Interior Design' || renderType === '2D/3D Floor Plan'
  const roomDetails = showRoomDetails ? (ROOM_DETAILS[roomType] || ROOM_DETAILS['Living Room']) : ''

  // Quality map
  const qualityMap: Record<string, string> = {
    '1K SD': 'Standard definition, 1024x576 resolution',
    '2K HD': 'High definition, 2048x1152 resolution, enhanced detail',
    '4K UHD': 'Ultra high definition, 4096x2304 resolution, maximum fidelity',
  }
  const qualityDesc = qualityMap[params.quality || '2K HD'] || qualityMap['2K HD']

  // Lighting/weather context
  const lightingContext = [
    params.timeOfDay ? `TIME OF DAY: ${params.timeOfDay} lighting atmosphere` : '',
    params.season ? `SEASON: ${params.season} seasonal elements and lighting` : '',
    params.weather ? `WEATHER: ${params.weather} weather conditions visible through windows` : '',
  ].filter(Boolean).join('\n')

  // Mode-specific prompt construction
  switch (mode) {
    case 'edit':
      return `
TASK: Edit the provided interior design image based on the user's instruction.
EDIT INSTRUCTION: ${params.editInstruction || params.prompt}
IMPORTANT: Make ONLY the requested changes. Preserve everything else in the image exactly as it is.
Maintain the same camera angle, lighting conditions, and overall composition.
${lightingContext}
      `.trim()

    case 'inpaint':
      return `
TASK: Edit the masked region of this interior design image.
EDIT INSTRUCTION: ${params.prompt}
IMPORTANT: Only modify the areas indicated by the mask. Keep all other areas identical.
Ensure seamless blending between edited and original regions.
Match lighting, perspective, and style of the surrounding areas.
${lightingContext}
      `.trim()

    case 'outpaint':
      return `
TASK: Extend this interior design image beyond its current borders.
EXTENSION INSTRUCTION: ${params.prompt}
STYLE: ${styleDescription}
IMPORTANT: Seamlessly continue the existing design, materials, lighting, and perspective.
The extended areas should feel like a natural continuation of the original image.
${lightingContext}
      `.trim()

    case 'sketch-to-render':
      return `
TASK: Convert this architectural sketch/blueprint into a photorealistic ${renderConfig.prefix}.
STYLE: ${aesthetic} - ${styleDescription}
${renderConfig.instructions}
${roomDetails ? `INTERIOR ELEMENTS: ${roomDetails}` : ''}
QUALITY: ${qualityDesc}
ASPECT RATIO: ${params.aspectRatio || '16:9'}
${params.prompt ? `ADDITIONAL REQUIREMENTS: ${params.prompt}` : ''}
${lightingContext}
CRITICAL: Interpret the hand-drawn sketch as an architectural plan. Convert all sketched elements into photorealistic materials and furnishings while maintaining the spatial layout shown in the sketch.
      `.trim()

    case 'style-transfer':
      return `
TASK: Apply the design style from the reference image to this room/space.
TARGET STYLE DESCRIPTION: ${styleDescription}
${params.prompt ? `ADDITIONAL REQUIREMENTS: ${params.prompt}` : ''}
IMPORTANT: Transfer the aesthetic, color palette, material choices, and design language from the reference to the target space while preserving the target's architectural structure.
${lightingContext}
      `.trim()

    case 'upscale':
      return `
TASK: Enhance and upscale this interior design image to ${qualityDesc}.
Add more fine detail to textures, materials, and lighting.
Sharpen edges while maintaining natural photorealistic quality.
${params.prompt ? `FOCUS ON: ${params.prompt}` : ''}
      `.trim()

    case 'image-to-image':
      return `
TASK: Analyze the uploaded architectural image and transform it into a ${renderConfig.prefix}.
TRANSFORMATION INSTRUCTIONS:
- PRESERVE the core architectural structure, layout, and spatial organization from the uploaded image
- MAINTAIN the building's footprint, room arrangement, and overall design language
- APPLY ${aesthetic} aesthetic principles while keeping the original architecture recognizable
- ${renderConfig.instructions}
AESTHETIC TRANSFORMATION: ${styleDescription}
${roomDetails ? `INTERIOR ELEMENTS TO ADD: ${roomDetails}` : ''}
QUALITY REQUIREMENTS: ${qualityDesc}
ASPECT RATIO: ${params.aspectRatio || '16:9'}
${params.prompt ? `ADDITIONAL USER REQUIREMENTS: ${params.prompt}` : ''}
${lightingContext}
CRITICAL: This is an architectural transformation, not a new design. The output must be a ${renderType.toLowerCase()} representation of THE UPLOADED BUILDING/SPACE, transformed with ${aesthetic} styling.
      `.trim()

    default: // text-to-image
      return `
${renderConfig.prefix} - ${aesthetic.toUpperCase()} STYLE
CRITICAL SPECIFICATIONS:
${renderConfig.instructions}
AESTHETIC DIRECTION: ${styleDescription}
${roomDetails ? `ROOM ELEMENTS TO INCLUDE: ${roomDetails}` : ''}
QUALITY REQUIREMENTS: ${qualityDesc}
ASPECT RATIO: ${params.aspectRatio || '16:9'}
USER DESIGN BRIEF: ${params.prompt}
${lightingContext}
EXECUTION MANDATE: Generate a stunning, photorealistic ${renderType.toLowerCase()} that showcases ${aesthetic} design principles. Every detail must feel intentional, luxurious, and professionally composed. Portfolio-worthy work for Architectural Digest, Dezeen, or ArchDaily.
      `.trim()
  }
}

// ============================================================
// Main Generation Function
// ============================================================

export async function generateImage(params: GenerateImageParams): Promise<GenerateImageResult> {
  const startTime = Date.now()

  try {
    const fullPrompt = buildPrompt(params)

    // Build content parts
    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = []

    // Add reference/source images
    if (params.imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: params.imageBase64,
        },
      })
    }

    // Add mask for inpainting
    if (params.maskBase64 && params.mode === 'inpaint') {
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: params.maskBase64,
        },
      })
    }

    // Add reference image for style transfer
    if (params.referenceImageBase64 && params.mode === 'style-transfer') {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: params.referenceImageBase64,
        },
      })
    }

    // Add text prompt
    parts.push({ text: fullPrompt })

    // Determine if we should use multi-turn conversation
    let response
    if (params.conversationHistory && params.conversationHistory.length > 0) {
      // Multi-turn conversation for iterative editing
      const contents = [
        ...params.conversationHistory,
        { role: 'user' as const, parts },
      ]

      response = await withRetry(() =>
        genAI.models.generateContent({
          model: NANO_BANANA_PRO,
          contents,
          config: {
            responseModalities: ['image', 'text'],
          },
        })
      )
    } else {
      // Single-turn generation
      response = await withRetry(() =>
        genAI.models.generateContent({
          model: NANO_BANANA_PRO,
          contents: [{ role: 'user' as const, parts }],
          config: {
            responseModalities: ['image', 'text'],
          },
        })
      )
    }

    const generationTime = (Date.now() - startTime) / 1000

    // Extract image from response
    const candidate = response.candidates?.[0]
    if (candidate?.content?.parts) {
      let imageBase64: string | undefined
      let textResponse: string | undefined

      for (const part of candidate.content.parts) {
        if (part.inlineData?.data && !imageBase64) {
          imageBase64 = part.inlineData.data
        }
        if (part.text) {
          textResponse = (textResponse || '') + part.text
        }
      }

      if (imageBase64) {
        return {
          success: true,
          imageBase64,
          textResponse,
          generationTime,
        }
      }
    }

    // No image generated
    const textFallback = candidate?.content?.parts?.find(p => p.text)?.text
    return {
      success: false,
      textResponse: textFallback,
      error: textFallback || 'No image generated. Please try a different prompt.',
      generationTime,
    }
  } catch (error: unknown) {
    const generationTime = (Date.now() - startTime) / 1000
    const errorMessage = error instanceof Error ? error.message : 'Generation failed'
    console.error('Gemini generation error:', errorMessage)
    return {
      success: false,
      error: errorMessage,
      generationTime,
    }
  }
}

// ============================================================
// Chat / Conversational Editing
// ============================================================

export async function chatEdit(
  message: string,
  currentImageBase64: string | undefined,
  conversationHistory: Array<{
    role: 'user' | 'model'
    parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>
  }>
): Promise<GenerateImageResult> {
  const startTime = Date.now()

  try {
    // Build the user's new message parts
    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = []

    // Include current image if this is an edit request and it's the first message with image
    if (currentImageBase64 && conversationHistory.length === 0) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: currentImageBase64,
        },
      })
    }

    parts.push({
      text: `You are Visionary Studio's AI design assistant powered by Nano Banana Pro (Gemini).
Help the user refine their interior design. When they ask for changes, generate an updated version of the image.
If they ask questions about design, respond helpfully.

USER REQUEST: ${message}`
    })

    const contents = [
      ...conversationHistory,
      { role: 'user' as const, parts },
    ]

    const response = await withRetry(() =>
      genAI.models.generateContent({
        model: NANO_BANANA_PRO,
        contents,
        config: {
          responseModalities: ['image', 'text'],
        },
      })
    )

    const generationTime = (Date.now() - startTime) / 1000

    const candidate = response.candidates?.[0]
    let imageBase64: string | undefined
    let textResponse: string | undefined

    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data && !imageBase64) {
          imageBase64 = part.inlineData.data
        }
        if (part.text) {
          textResponse = (textResponse || '') + part.text
        }
      }
    }

    return {
      success: true,
      imageBase64,
      textResponse: textResponse || (imageBase64 ? 'Here\'s your updated design.' : 'I can help you with that! Please provide more details about what you\'d like to change.'),
      generationTime,
    }
  } catch (error: unknown) {
    const generationTime = (Date.now() - startTime) / 1000
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Chat editing failed',
      generationTime,
    }
  }
}

// ============================================================
// Prompt Enhancement
// ============================================================

export async function enhancePrompt(prompt: string, style?: string): Promise<string> {
  try {
    const response = await genAI.models.generateContent({
      model: GEMINI_FLASH,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are an expert interior design and architectural prompt engineer for AI image generation.
Enhance this prompt to generate a stunning photorealistic interior/architectural render.
Add specific details about materials, lighting, atmosphere, camera angle, and composition.
${style ? `The design style is: ${style}` : ''}
Keep it concise but vivid. Return ONLY the enhanced prompt, no explanations.

Original prompt: "${prompt}"`,
            },
          ],
        },
      ],
    })

    return response.candidates?.[0]?.content?.parts?.[0]?.text || prompt
  } catch {
    return prompt
  }
}

// ============================================================
// Utility: Get style prompt for a given style ID
// ============================================================

export function getStylePrompt(styleId: string): string {
  return STYLE_PROMPTS[styleId] || STYLE_PROMPTS['modern']
}

export function getRoomDetails(roomType: string): string {
  return ROOM_DETAILS[roomType] || ROOM_DETAILS['Living Room']
}

export function getRenderTypeConfig(renderType: string) {
  return RENDER_TYPE_CONFIGS[renderType] || RENDER_TYPE_CONFIGS['Interior Design']
}
