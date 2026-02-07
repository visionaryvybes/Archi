import { NextRequest, NextResponse } from 'next/server'
import { chatEdit } from '@/lib/gemini'

// ============================================================
// POST /api/chat - Conversational AI editing endpoint
// ============================================================
export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      message,
      currentImageBase64,
      conversationHistory = [],
    } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    const result = await chatEdit(
      message,
      currentImageBase64,
      conversationHistory
    )

    return NextResponse.json({
      success: result.success,
      imageBase64: result.imageBase64,
      textResponse: result.textResponse,
      generationTime: result.generationTime,
      error: result.error,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Chat failed',
      },
      { status: 500 }
    )
  }
}
