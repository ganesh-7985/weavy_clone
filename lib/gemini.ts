import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { GeminiModel } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function executeGemini(
  model: GeminiModel,
  userPrompt: string,
  systemPrompt?: string,
  images?: { base64: string; mimeType: string }[]
): Promise<string> {
  const geminiModel = genAI.getGenerativeModel({ 
    model,
    systemInstruction: systemPrompt || undefined,
  });

  const parts: Part[] = [];

  // Add images if present (for multimodal)
  if (images && images.length > 0) {
    for (const image of images) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.base64,
        },
      });
    }
  }

  // Add text prompt
  parts.push({ text: userPrompt });

  const result = await geminiModel.generateContent(parts);
  const response = await result.response;
  const text = response.text();

  return text;
}
