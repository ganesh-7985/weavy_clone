import { Node, Edge } from '@xyflow/react';

// Node Data Types - Input Nodes
export interface PromptNodeData extends Record<string, unknown> {
  label: string;
  text: string;
}

export interface FileNodeData extends Record<string, unknown> {
  label: string;
  fileUrl: string | null;
  fileBase64: string | null;
  fileName: string | null;
  fileType: string | null;
  linkUrl: string | null;
}

// Node Data Types - Output/Model Nodes (Text only - Google AI API)
export interface TextModelNodeData extends Record<string, unknown> {
  label: string;
  model: GeminiModel;
  systemPrompt: string;
  userPrompt: string;
  output: string;
  isLoading: boolean;
  error: string | null;
}

// Legacy types (keeping for backwards compatibility)
export interface TextNodeData extends Record<string, unknown> {
  label: string;
  text: string;
}

export interface ImageNodeData extends Record<string, unknown> {
  label: string;
  imageUrl: string | null;
  imageBase64: string | null;
  fileName: string | null;
}

export interface LLMNodeData extends Record<string, unknown> {
  label: string;
  model: GeminiModel;
  systemPrompt: string;
  userPrompt: string;
  output: string;
  isLoading: boolean;
  error: string | null;
}

// Node Types
export type PromptNode = Node<PromptNodeData, 'prompt'>;
export type FileNode = Node<FileNodeData, 'file'>;
export type TextModelNode = Node<TextModelNodeData, 'textModel'>;

// Legacy node types
export type TextNode = Node<TextNodeData, 'text'>;
export type ImageNode = Node<ImageNodeData, 'image'>;
export type LLMNode = Node<LLMNodeData, 'llm'>;

export type WorkflowNode = PromptNode | FileNode | TextModelNode | TextNode | ImageNode | LLMNode;
export type WorkflowEdge = Edge;

// Gemini Models (Text)
export type GeminiModel = 
  | 'gemini-3-pro-preview'
  | 'gemini-3-flash-preview'
  | 'gemini-2.5-flash'
  | 'gemini-2.5-flash-lite'
  | 'gemini-2.5-pro'
  | 'gemini-2.0-flash'
  | 'gemini-2.0-flash-lite';

export const GEMINI_MODELS: { value: GeminiModel; label: string; description: string }[] = [
  { value: 'gemini-3-pro-preview', label: 'Gemini 3 Pro', description: 'Most intelligent multimodal model' },
  { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash', description: 'Intelligent with superior speed' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Best price-performance' },
  { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite', description: 'Ultra fast, cost-efficient' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'Advanced thinking & reasoning' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', description: '1M context, native tools' },
  { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash-Lite', description: 'Fast & cost efficient' },
];

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

// API Types
export interface LLMExecuteRequest {
  model: GeminiModel;
  systemPrompt?: string;
  userPrompt: string;
  images?: { base64: string; mimeType: string }[];
}

export interface LLMExecuteResponse {
  success: boolean;
  output?: string;
  error?: string;
}

// History for Undo/Redo
export interface HistoryState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
