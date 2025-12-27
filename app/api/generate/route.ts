import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

const STYLE_PROMPTS: Record<string, string> = {
  modern: 'sleek contemporary design with clean lines, minimalist furniture, neutral palette with accent colors, floor-to-ceiling windows, polished concrete or hardwood floors',
  minimalist: 'ultra-minimal design, monochromatic color scheme, essential furniture only, negative space emphasis, hidden storage, seamless surfaces',
  industrial: 'exposed brick walls, metal beams, concrete floors, vintage factory elements, Edison bulbs, raw materials, leather and metal furniture',
  scandinavian: 'light wood tones, white walls, cozy textiles, hygge atmosphere, functional design, natural materials, subtle pastel accents',
  japandi: 'Japanese-Scandinavian fusion, wabi-sabi elements, natural materials, muted earth tones, low furniture, zen garden influences, paper screens',
  bohemian: 'eclectic mix of patterns, rich jewel tones, layered textiles, vintage furniture, plants everywhere, macrame, global influences',
  luxury: 'high-end materials, marble surfaces, gold accents, crystal chandeliers, velvet upholstery, custom millwork, statement art pieces',
  coastal: 'light and airy, beach-inspired colors, natural textures, weathered wood, blue and white palette, nautical elements, linen fabrics',
  'mid-century': '1950s-60s inspired, iconic furniture pieces, organic shapes, wood paneling, bold accent colors, geometric patterns, sunburst motifs',
  rustic: 'reclaimed wood, stone fireplace, natural materials, warm earth tones, handcrafted elements, cozy textiles, farmhouse charm',
  contemporary: 'current design trends, mix of textures, statement lighting, bold art, comfortable luxury, curated accessories, tech integration',
  'art-deco': '1920s glamour, geometric patterns, rich colors, metallic accents, lacquered surfaces, bold symmetry, velvet and mirror details',
}

const LIFE_PROPS = `
Include realistic lifestyle elements: styled coffee table books, fresh flowers in a vase,
a casually draped throw blanket, ambient lighting from multiple sources, subtle artwork on walls,
potted plants adding greenery, personal touches like candles or decorative objects,
natural light casting soft shadows, professional interior photography quality.
`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, style, imageBase64, aspectRatio = '16:9' } = body

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const styleDescription = STYLE_PROMPTS[style] || STYLE_PROMPTS.modern

    const fullPrompt = `
Create a photorealistic interior design render with the following specifications:

STYLE: ${styleDescription}

USER REQUEST: ${prompt}

REQUIREMENTS:
- Professional architectural photography quality
- Perfect lighting with natural and artificial sources
- 8K resolution quality
- ${LIFE_PROPS}
- Realistic materials and textures
- Proper scale and proportions
- Magazine-worthy composition
- Aspect ratio: ${aspectRatio}

Generate a stunning, photorealistic interior that would impress professional designers.
    `.trim()

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
              { text: `Transform this room with the following style: ${fullPrompt}` },
            ],
          },
        ]
      : [
          {
            role: 'user' as const,
            parts: [{ text: fullPrompt }],
          },
        ]

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
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
