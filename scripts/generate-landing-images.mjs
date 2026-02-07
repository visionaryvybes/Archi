#!/usr/bin/env node
/**
 * Generate landing page images using Gemini (Nano Banana Pro)
 * Run: node scripts/generate-landing-images.mjs
 */

import { GoogleGenAI } from '@google/genai'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBSqguO7KAYNIT-iwaG5KLZM_3pVL-ztN4'
const genAI = new GoogleGenAI({ apiKey: API_KEY })
const MODEL = 'gemini-2.0-flash-exp'

const OUT_DIR = join(process.cwd(), 'public', 'images', 'landing')
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

async function generateImage(prompt, filename) {
  console.log(`\n🎨 Generating: ${filename}...`)
  console.log(`   Prompt: ${prompt.slice(0, 100)}...`)

  try {
    const response = await genAI.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseModalities: ['image', 'text'],
      },
    })

    const candidate = response.candidates?.[0]
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          const buffer = Buffer.from(part.inlineData.data, 'base64')
          const outPath = join(OUT_DIR, filename)
          writeFileSync(outPath, buffer)
          console.log(`   ✅ Saved: ${outPath} (${(buffer.length / 1024).toFixed(0)}KB)`)
          return true
        }
      }
    }

    // Check for text response (safety block or no image)
    const textResp = candidate?.content?.parts?.find(p => p.text)?.text
    if (textResp) {
      console.log(`   ⚠️  Text response: ${textResp.slice(0, 150)}`)
    }
    console.log(`   ❌ No image generated for ${filename}`)
    return false
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`)
    return false
  }
}

// Delay between requests to avoid rate limiting
function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

// ===== IMAGE DEFINITIONS =====
const images = [
  // HERO SECTION - Main showcase image
  {
    filename: 'hero-showcase.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN PHOTOGRAPHY. A stunning modern living room transformation.
Left half shows an empty unfurnished room with bare white walls, concrete floor, and large windows letting in natural light.
Right half shows the SAME ROOM fully designed in modern minimalist style: sleek low-profile sofa in warm gray, walnut coffee table,
statement floor lamp, abstract art on walls, lush fiddle leaf fig plant, plush cream area rug, warm afternoon golden hour sunlight streaming through windows.
Ultra high quality, Architectural Digest magazine cover quality. Shot with Canon 5D Mark IV, 24mm wide angle lens, f/2.8.
16:9 aspect ratio landscape orientation.`
  },

  // BEFORE/AFTER SHOWCASE - 4 style transformations
  {
    filename: 'before-empty-living.jpg',
    prompt: `PHOTOREALISTIC PHOTOGRAPHY of a completely empty, unfurnished living room. Bare white/cream walls, light hardwood flooring,
two large windows with natural daylight, no furniture or decor at all. Clean empty space waiting to be designed.
Realistic real estate photography style, slightly warm lighting. 16:9 landscape. Shot on Canon 5D, 24mm lens.`
  },
  {
    filename: 'after-modern.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN PHOTOGRAPHY. A beautifully designed modern minimalist living room.
Sleek low-profile charcoal gray sectional sofa, walnut mid-century coffee table, statement arc floor lamp in brushed brass,
large abstract art piece on wall, fiddle leaf fig plant in ceramic pot, cream wool area rug, floating oak shelves with curated objects,
warm afternoon golden hour sunlight through large windows, light hardwood floors.
Ultra luxury, Architectural Digest quality. 16:9 landscape. Canon 5D, 24mm, f/2.8.`
  },
  {
    filename: 'after-scandinavian.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN PHOTOGRAPHY. A beautifully designed Scandinavian bedroom.
Light birch wood bed frame with white linen bedding, sheepskin throw, knitted cushions in muted pastels,
bedside table with ceramic lamp and small succulent, light pine flooring, white walls with one accent wall in soft sage green,
pendant light in natural rattan, cozy reading nook by window with daylight, minimalist framed botanical prints.
Hygge atmosphere, warm and inviting. 16:9 landscape. Professional interior photography.`
  },
  {
    filename: 'after-industrial.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN PHOTOGRAPHY. A stunning industrial loft kitchen.
Exposed red brick walls, black steel framed windows, polished concrete floor, dark wood and steel island with marble top,
hanging Edison bulb pendant lights, open steel shelving with cookware, professional stainless steel appliances,
copper accents, reclaimed wood bar stools, potted herbs, warm moody lighting with afternoon sun.
Urban luxury loft style. 16:9 landscape. Architectural photography.`
  },
  {
    filename: 'after-japandi.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN PHOTOGRAPHY. A serene Japandi-style study/home office.
Low walnut desk with clean lines, ergonomic chair in natural leather, paper shoji-inspired room divider,
bonsai tree on floating shelf, ceramic tea set, minimal bookshelf with carefully arranged books,
natural linen curtains, tatami-inspired rug, warm wood tones with muted sage and cream palette,
soft diffused natural light, zen atmosphere. 16:9 landscape. Dezeen magazine quality.`
  },

  // STYLE GALLERY - Different style thumbnails (square format for grid)
  {
    filename: 'style-coastal.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN. A bright coastal living room. White shiplap walls, natural rope and driftwood accents,
light blue and sand color palette, comfortable linen sofa, rattan coffee table, seashell decor, ocean view through windows,
breezy curtains, nautical elements. Magazine quality photography. Square 1:1 format.`
  },
  {
    filename: 'style-artdeco.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN. A glamorous Art Deco lounge room. Rich jewel tones (emerald, gold, navy),
geometric patterns on walls and floor, velvet tufted sofa in deep green, gold and chrome accents, sunburst mirror,
lacquered surfaces, crystal chandelier, marble side tables. 1920s glamour. Square 1:1 format.`
  },
  {
    filename: 'style-midcentury.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN. A mid-century modern living room. Iconic Eames lounge chair,
teak credenza, sunburst clock on wall, organic curved furniture, wood paneling accent wall,
mustard yellow and teal accents, Nelson bubble lamp, geometric rug, 1960s inspired. Square 1:1 format.`
  },
  {
    filename: 'style-bohemian.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN. A vibrant bohemian living room. Layered textiles in rich jewel tones,
macrame wall hanging, floor cushions, vintage Moroccan rug, rattan peacock chair, trailing pothos plants,
eclectic gallery wall, warm fairy lights, global-inspired decor. Square 1:1 format.`
  },
  {
    filename: 'style-luxury.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN. An ultra-luxury penthouse living room. Floor-to-ceiling windows with city skyline view,
white marble floors, custom Italian leather sectional, gold and brass accents, crystal chandelier,
statement art, champagne color palette, premium materials throughout. Square 1:1 format.`
  },
  {
    filename: 'style-rustic.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN. A warm rustic cabin living room. Exposed wooden beams on ceiling,
stone fireplace with crackling fire, reclaimed wood walls, cozy leather armchair, wool throw blankets,
antler chandelier, handwoven rug, warm amber lighting, mountain lodge atmosphere. Square 1:1 format.`
  },

  // FEATURES SECTION - Visual for key features
  {
    filename: 'feature-speed.jpg',
    prompt: `PHOTOREALISTIC split-screen comparison. Left side: a simple phone photo of an empty room. Right side: the same room
transformed into a stunning modern interior with furniture, lighting, and decor. A digital timer overlay showing "28 seconds"
in clean sans-serif font. Clean dark background. Tech product marketing style. 16:9 landscape.`
  },
  {
    filename: 'feature-chat.jpg',
    prompt: `PHOTOREALISTIC INTERIOR DESIGN showing iterative design refinement. Three versions of the same living room side by side:
first with blue sofa, second with the sofa changed to green, third with green sofa and added plants.
Showing AI chat-based editing of interior design. Clean, modern UI aesthetic. 16:9 landscape.`
  },
]

async function main() {
  console.log('🚀 Generating landing page images with Gemini (Nano Banana Pro)')
  console.log(`📁 Output directory: ${OUT_DIR}`)
  console.log(`📝 Total images to generate: ${images.length}\n`)

  let success = 0
  let failed = 0

  for (let i = 0; i < images.length; i++) {
    const img = images[i]
    console.log(`\n[${i + 1}/${images.length}] ────────────────────────`)
    const ok = await generateImage(img.prompt, img.filename)
    if (ok) success++
    else failed++

    // Rate limit delay (2s between requests)
    if (i < images.length - 1) {
      console.log('   ⏳ Waiting 2s for rate limit...')
      await delay(2000)
    }
  }

  console.log(`\n\n════════════════════════════════`)
  console.log(`✅ Generated: ${success}/${images.length}`)
  if (failed > 0) console.log(`❌ Failed: ${failed}/${images.length}`)
  console.log(`📁 Images saved to: ${OUT_DIR}`)
  console.log(`════════════════════════════════\n`)
}

main().catch(console.error)
