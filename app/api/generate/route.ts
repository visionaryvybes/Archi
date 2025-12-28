import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

// Room-specific lifestyle details (inspired by veo-studio)
const ROOM_DETAILS: Record<string, string> = {
  'Living Room': 'soft textured throw pillows on a designer sofa, open coffee table books (architecture/design magazines), a high-fidelity record player or modern speaker, warm morning sunlight through floor-to-ceiling windows, lush indoor plants like fiddle leaf figs or monstera, soft woven area rug with subtle pattern, curated artwork on walls, ambient table lamps, designer furniture with rich textures',
  'Kitchen': 'high-end marble or quartz countertops, steaming espresso machine, professional chef knives on magnetic strip, copper or stainless cookware hanging, wooden cutting boards with organic textures, integrated ambient LED strips under cabinets, fresh herbs in ceramic pots on windowsill, fruit bowl with fresh produce, designer bar stools, high-end appliances',
  'Bedroom': 'rumpled high-thread-count linen sheets, stack of hardcover design books on nightstand, ambient warm bedside lighting, soft wool throw blanket, high-end drapes with realistic folds, plush pillows, modern headboard, subtle wall sconces, personal touches like framed photos, cozy reading chair',
  'Bathroom': 'steam on glass shower partition, plush rolled cotton towels, luxury soap dispensers and amenities, natural stone textures (marble/travertine), subtle water droplets in sink, rain shower head, modern freestanding tub, designer fixtures, ambient lighting, fresh flowers or plants, high-end mirrors',
  'Office': 'modern adjustable desk lamp, high-resolution monitors, designer ergonomic chair, personal artifacts like fountain pen and leather notebook, clean cable management, focused task lighting, bookshelf with design books, indoor plant, minimalist desk setup, abstract art on walls',
  'Dining Room': 'designer pendant lighting above table, place settings with high-end dinnerware, fresh floral centerpiece, elegant chairs with upholstered seats, wine glasses and decanter, textured table runner, ambient candlelight, sideboard with decorative objects, artwork on walls',
  'Home Theater': 'plush deep-seated velvet chairs or sectional, subtle floor-level track lighting, high-end speaker system, dark walnut or fabric wall panels, professional acoustic treatments, popcorn machine or bar area, movie posters in frames, thick curtains, cozy blankets',
  'Gym': 'professional Technogym-style equipment, textured rubber flooring, wall-sized mirrors with crisp reflections, hydration station with luxury water bottles, yoga mats rolled neatly, kettlebells on rack, motivational artwork, natural light from large windows, indoor plants, towel station',
  'Entryway': 'designer console table, large statement mirror, fresh flowers in modern vase, key tray or bowl, artwork or gallery wall, coat hooks with designer jackets, bench with plush cushion, ambient lighting, runner rug with pattern',
  'Outdoor/Patio': 'comfortable outdoor furniture with weather-resistant cushions, string lights or modern outdoor lighting, potted plants and planters, outdoor rug, fire pit or outdoor heater, dining table with place settings, lanterns or candles, lush greenery, natural wood or stone elements'
}

// Enhanced aesthetic descriptions
const AESTHETIC_DETAILS: Record<string, string> = {
  'Modern Minimalist': 'clean lines, monochromatic palette with strategic accent colors, minimalist furniture with perfect proportions, hidden storage solutions, seamless surfaces, negative space emphasis, high-quality materials (brushed steel, polished concrete, natural wood), floor-to-ceiling windows, indirect lighting, gallery-like atmosphere',
  'Scandinavian': 'light wood tones (birch, ash, pine), white or light gray walls, cozy textiles (chunky knit throws, sheepskin), hygge atmosphere, functional minimalist design, natural materials, subtle pastel accents (dusty pink, sage green), abundant natural light, simple ceramics, candles, plants',
  'Industrial': 'exposed brick walls, metal beams and ductwork, polished concrete floors, vintage factory elements, Edison bulbs and industrial lighting, raw materials (steel, iron, reclaimed wood), leather and metal furniture, urban loft aesthetic, high ceilings, large factory windows',
  'Bauhaus': 'geometric forms, primary colors with black/white/gray, functional furniture with tubular steel, asymmetric compositions, sans-serif typography in artwork, emphasis on geometric shapes, modernist art pieces, clean lines, form follows function philosophy',
  'Brutalist': 'exposed concrete surfaces, bold geometric forms, monolithic structures, raw unfinished materials, dramatic shadows and light, minimal ornamentation, strong angular shapes, textural concrete, monochromatic palette, architectural statement pieces',
  'Classic European': 'ornate moldings and trim, crystal chandeliers, rich wood paneling, marble surfaces, damask or toile fabrics, antique furniture pieces, Persian rugs, gold or brass accents, oil paintings in gilded frames, luxurious drapery, classical architectural details'
}

// Render type configurations
const RENDER_TYPE_CONFIGS: Record<string, { prefix: string; instructions: string }> = {
  'Interior Design': {
    prefix: 'PHOTOREALISTIC HIGH-END INTERIOR DESIGN',
    instructions: 'Architectural Digest quality photography. Magazine-worthy composition. Perfect lighting with natural volumetric sunlight and soft global illumination. Ultra-detailed fabric weaves, polished stone, wood grain. No empty spaces - lived-in and luxurious feel. Professional interior photography with proper depth of field.'
  },
  '2D/3D Floor Plan': {
    prefix: '3D ISOMETRIC ARCHITECTURAL FLOOR PLAN',
    instructions: 'Clean architectural top-down isometric view. Realistic furniture models with proper scale. Material callouts and labels. Soft ambient occlusion shadows. Professional architectural visualization style. Color-coded zones. Measurements and dimensions visible.'
  },
  'Exterior/Architectural': {
    prefix: 'PHOTOREALISTIC EXTERIOR ARCHITECTURE',
    instructions: 'Golden hour lighting (sunset or sunrise). Detailed landscaping with specific plants, gravel paths, and outdoor lighting. Sharp focus on textures like wood siding, concrete, glass, metal. Professional architectural photography. Dramatic sky with volumetric clouds. Realistic reflections in windows.'
  },
  'Technical Blueprint': {
    prefix: 'TECHNICAL ARCHITECTURAL BLUEPRINT',
    instructions: 'CAD-style technical drafting on dark charcoal or blue background. Crisp white and cyan vector lines. Structural measurements and dimensions. Cross-sections and elevation views. Professional engineering aesthetic. Grid lines and scale indicators. Annotation callouts.'
  },
  'Landscape/Garden': {
    prefix: 'LANDSCAPE ARCHITECTURE DESIGN',
    instructions: 'Detailed botanical elements with realistic flora. Stone masonry and hardscaping. Water features with accurate reflections. Natural lighting conditions. Seasonal planting scheme. Outdoor furniture and structures. Pathways and circulation. Mature trees and layered plantings.'
  }
}

// Map aspect ratios
const ASPECT_RATIO_MAP: Record<string, string> = {
  '16:9': '16:9',
  '1:1': '1:1',
  '9:16': '9:16'
}

// Map quality to image generation parameters
const QUALITY_MAP: Record<string, string> = {
  '1K SD': 'Standard definition, 1024x576 resolution',
  '2K HD': 'High definition, 2048x1152 resolution, enhanced detail',
  '4K UHD': 'Ultra high definition, 4096x2304 resolution, maximum fidelity, photorealistic detail'
}

// Map quality to Gemini imageSize parameter
const IMAGE_SIZE_MAP: Record<string, string> = {
  '1K SD': '1K',
  '2K HD': '2K',
  '4K UHD': '4K'
}

// Nano Banana Pro - THE BEST model for image generation
const NANO_BANANA_PRO = 'gemini-3-pro-image-preview'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      prompt,
      renderType = 'Interior Design',
      aesthetic = 'Modern Minimalist',
      roomType = 'Living Room',
      imageBase64,
      aspectRatio = '16:9',
      quality = '2K HD'
    } = body

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    // Get render type configuration
    const renderConfig = RENDER_TYPE_CONFIGS[renderType] || RENDER_TYPE_CONFIGS['Interior Design']

    // Get aesthetic details
    const aestheticDescription = AESTHETIC_DETAILS[aesthetic] || AESTHETIC_DETAILS['Modern Minimalist']

    // Get room-specific details (only for interior renders)
    const roomDetails = renderType === 'Interior Design' || renderType === '2D/3D Floor Plan'
      ? (ROOM_DETAILS[roomType] || ROOM_DETAILS['Living Room'])
      : ''

    // Get quality requirements
    const qualityDescription = QUALITY_MAP[quality] || QUALITY_MAP['2K HD']

    // Construct prompt based on whether we have an input image
    let fullPrompt: string

    if (imageBase64) {
      // IMAGE-TO-IMAGE TRANSFORMATION MODE
      fullPrompt = `
TASK: Analyze the uploaded architectural image and transform it into a ${renderConfig.prefix}.

TRANSFORMATION INSTRUCTIONS:
- PRESERVE the core architectural structure, layout, and spatial organization from the uploaded image
- MAINTAIN the building's footprint, room arrangement, and overall design language
- APPLY ${aesthetic} aesthetic principles while keeping the original architecture recognizable
- ${renderConfig.instructions}

AESTHETIC TRANSFORMATION: ${aestheticDescription}

${roomDetails ? `INTERIOR ELEMENTS TO ADD: ${roomDetails}` : ''}

QUALITY REQUIREMENTS: ${qualityDescription}
ASPECT RATIO: ${ASPECT_RATIO_MAP[aspectRatio] || '16:9'}

${prompt ? `ADDITIONAL USER REQUIREMENTS: ${prompt}` : ''}

CRITICAL: This is an architectural transformation, not a new design. The output must be a ${renderType.toLowerCase()} representation of THE UPLOADED BUILDING/SPACE, transformed with ${aesthetic} styling. Preserve proportions, layout, and key architectural features.
      `.trim()
    } else {
      // TEXT-TO-IMAGE GENERATION MODE
      fullPrompt = `
${renderConfig.prefix} - ${aesthetic} STYLE

CRITICAL SPECIFICATIONS:
${renderConfig.instructions}

AESTHETIC DIRECTION: ${aestheticDescription}

${roomDetails ? `ROOM ELEMENTS TO INCLUDE: ${roomDetails}` : ''}

QUALITY REQUIREMENTS: ${qualityDescription}
ASPECT RATIO: ${ASPECT_RATIO_MAP[aspectRatio] || '16:9'}

USER DESIGN BRIEF: ${prompt}

EXECUTION MANDATE: Generate a stunning, photorealistic ${renderType.toLowerCase()} that showcases ${aesthetic} design principles. Every detail must feel intentional, luxurious, and professionally composed. This should be portfolio-worthy work that could appear in Architectural Digest, Dezeen, or ArchDaily.
      `.trim()
    }

    const startTime = Date.now()

    const contents = imageBase64
      ? [
          {
            role: 'user' as const,
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64,
                },
              },
              { text: fullPrompt },
            ],
          },
        ]
      : [
          {
            role: 'user' as const,
            parts: [{ text: fullPrompt }],
          },
        ]

    // Use Nano Banana Pro - the best Gemini 3 image model
    const response = await genAI.models.generateContent({
      model: NANO_BANANA_PRO,
      contents,
      config: {
        responseModalities: ['image', 'text'],
      },
    })

    const generationTime = (Date.now() - startTime) / 1000

    // Extract image from response
    const candidate = response.candidates?.[0]
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          return NextResponse.json({
            success: true,
            imageBase64: part.inlineData.data,
            generationTime,
          })
        }
      }
    }

    // If no image, return text response
    const textResponse = candidate?.content?.parts?.find(p => p.text)?.text

    return NextResponse.json({
      success: false,
      error: textResponse || 'No image generated. Please try a different prompt.',
      generationTime,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed',
      },
      { status: 500 }
    )
  }
}
