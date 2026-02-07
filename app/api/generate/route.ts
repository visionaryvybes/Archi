import { NextRequest, NextResponse } from 'next/server'
import { generateImage, chatEdit, enhancePrompt } from '@/lib/gemini'
import type { GenerationMode } from '@/lib/types'

// ============================================================
// POST /api/generate - Main generation endpoint
// ============================================================
export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      prompt,
      renderType = 'Interior Design',
      aesthetic = 'modern',
      roomType = 'Living Room',
      imageBase64,
      maskBase64,
      referenceImageBase64,
      aspectRatio = '16:9',
      quality = '2K HD',
      mode,
      editInstruction,
      timeOfDay,
      season,
      weather,
      conversationHistory,
      // Chat-specific params
      chatMessage,
      currentImageBase64,
    } = body

    // Determine the generation mode
    let generationMode: GenerationMode | undefined = mode
    if (!generationMode) {
      if (chatMessage) {
        generationMode = 'edit'
      } else if (maskBase64) {
        generationMode = 'inpaint'
      } else if (imageBase64) {
        generationMode = 'image-to-image'
      } else {
        generationMode = 'text-to-image'
      }
    }

    // Chat editing mode - uses multi-turn conversation
    if (chatMessage || generationMode === 'edit') {
      const result = await chatEdit(
        chatMessage || editInstruction || prompt,
        currentImageBase64 || imageBase64,
        conversationHistory || []
      )

      return NextResponse.json({
        success: result.success,
        imageBase64: result.imageBase64,
        textResponse: result.textResponse,
        generationTime: result.generationTime,
        error: result.error,
      })
    }

    // All other generation modes
    const result = await generateImage({
      prompt: prompt || '',
      renderType,
      aesthetic,
      roomType,
      imageBase64,
      maskBase64,
      referenceImageBase64,
      aspectRatio,
      quality,
      mode: generationMode,
      editInstruction,
      timeOfDay,
      season,
      weather,
      conversationHistory,
    })

    return NextResponse.json({
      success: result.success,
      imageBase64: result.imageBase64,
      textResponse: result.textResponse,
      generationTime: result.generationTime,
      error: result.error,
    })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed',
      },
      { status: 500 }
    )
  }
}

// ============================================================
// POST /api/generate/enhance - Prompt enhancement endpoint
// ============================================================
// Note: This is in the same file for simplicity. In production,
// you might want a separate route at /api/enhance
