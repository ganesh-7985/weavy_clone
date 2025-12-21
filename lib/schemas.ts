import { z } from 'zod';

// Gemini Models Schema
export const geminiModelSchema = z.enum([
  'gemini-3-pro-preview',
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
]);

// Image Schema for multimodal requests
export const imageSchema = z.object({
  base64: z.string().min(1, 'Image base64 data is required'),
  mimeType: z.string().regex(/^image\/(jpeg|png|gif|webp)$/, 'Invalid image MIME type'),
});

// LLM Execute Request Schema
export const llmExecuteRequestSchema = z.object({
  model: geminiModelSchema,
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, 'User prompt is required'),
  images: z.array(imageSchema).optional(),
});

// Workflow Schema for save/load
export const workflowNodeDataSchema = z.union([
  z.object({
    label: z.string(),
    text: z.string(),
  }),
  z.object({
    label: z.string(),
    imageUrl: z.string().nullable(),
    imageBase64: z.string().nullable(),
    fileName: z.string().nullable(),
  }),
  z.object({
    label: z.string(),
    model: geminiModelSchema,
    systemPrompt: z.string(),
    userPrompt: z.string(),
    output: z.string(),
    isLoading: z.boolean(),
    error: z.string().nullable(),
  }),
]);

export const workflowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'llm']),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: workflowNodeDataSchema,
});

export const workflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional().nullable(),
  targetHandle: z.string().optional().nullable(),
});

export const workflowSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().optional(),
  nodes: z.array(workflowNodeSchema),
  edges: z.array(workflowEdgeSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Type exports
export type LLMExecuteRequestInput = z.infer<typeof llmExecuteRequestSchema>;
export type WorkflowInput = z.infer<typeof workflowSchema>;
