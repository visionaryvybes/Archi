import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

export interface GenerationParams {
  prompt: string
  style: string
  imageBase64?: string
  model?: 'gemini-2.0-flash' | 'gemini-pro'
  aspectRatio?: '16:9' | '1:1' | '9:16'
  quality?: 'draft' | 'standard' | 'high' | 'ultra'
}

export interface GenerationResult {
  success: boolean
  imageBase64?: string
  error?: string
  generationTime?: number
}

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

export async function generateInteriorRender(
  params: GenerationParams
): Promise<GenerationResult> {
  const startTime = Date.now()

  try {
    const styleDescription = STYLE_PROMPTS[params.style] || STYLE_PROMPTS.modern

    const fullPrompt = `
Create a photorealistic interior design render with the following specifications:

STYLE: ${styleDescription}

USER REQUEST: ${params.prompt}

REQUIREMENTS:
- Professional architectural photography quality
- Perfect lighting with natural and artificial sources
- 8K resolution quality
- ${LIFE_PROPS}
- Realistic materials and textures
- Proper scale and proportions
- Magazine-worthy composition

Generate a stunning, photorealistic interior that would impress professional designers.
    `.trim()

    const model = genAI.models.generateContent

    const contents = params.imageBase64
      ? [
          {
            role: 'user' as const,
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: params.imageBase64,
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
      model: params.model === 'gemini-pro' ? 'gemini-2.0-flash' : 'gemini-2.0-flash',
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
          return {
            success: true,
            imageBase64: part.inlineData.data,
            generationTime,
          }
        }
      }
    }

    return {
      success: false,
      error: 'No image generated',
      generationTime,
    }
  } catch (error) {
    const generationTime = (Date.now() - startTime) / 1000
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      generationTime,
    }
  }
}

export async function enhancePrompt(prompt: string): Promise<string> {
  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are an expert interior design prompt engineer. Enhance this prompt for generating a photorealistic interior render. Keep it concise but add specific details about materials, lighting, and atmosphere.

Original prompt: "${prompt}"

Return only the enhanced prompt, no explanations.`,
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
