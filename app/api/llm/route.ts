import { NextRequest, NextResponse } from 'next/server';
import { llmExecuteRequestSchema } from '@/lib/schemas';
import { executeGemini } from '@/lib/gemini';
import { LLMExecuteResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<LLMExecuteResponse>> {
  try {
    const body = await request.json();
    
    // Validate request with Zod
    const validationResult = llmExecuteRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${errorMessages}`,
        },
        { status: 400 }
      );
    }

    const { model, systemPrompt, userPrompt, images } = validationResult.data;

    // Check for API key
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google AI API key is not configured. Please set GOOGLE_AI_API_KEY environment variable.',
        },
        { status: 500 }
      );
    }

    // Execute Gemini API call
    const output = await executeGemini(model, userPrompt, systemPrompt, images);

    return NextResponse.json({
      success: true,
      output,
    });
  } catch (error) {
    console.error('LLM API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
