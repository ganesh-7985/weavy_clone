import { v4 as uuidv4 } from 'uuid';
import { Workflow, WorkflowNode, WorkflowEdge, GeminiModel } from '@/types';

export function createProductListingGeneratorWorkflow(): Workflow {
  // Input nodes
  const imageNodeId = uuidv4();
  const textNodeId = uuidv4();
  
  // Analyzer LLM
  const analyzerLLMId = uuidv4();
  
  // Output LLM nodes
  const amazonLLMId = uuidv4();
  const instagramLLMId = uuidv4();
  const seoLLMId = uuidv4();

  const nodes: WorkflowNode[] = [
    // Image Node - Product Photo
    {
      id: imageNodeId,
      type: 'image',
      position: { x: 50, y: 50 },
      data: {
        label: 'Product Photo',
        imageUrl: null,
        imageBase64: null,
        fileName: null,
      },
    },
    // Text Node - Product name & specs
    {
      id: textNodeId,
      type: 'text',
      position: { x: 50, y: 280 },
      data: {
        label: 'Product name & specs',
        text: 'Product: Wireless Bluetooth Headphones\nBrand: SoundMax Pro\nPrice: $79.99\nFeatures: Active Noise Cancellation, 30-hour battery life, Premium comfort cushions, Built-in microphone',
      },
    },
    // LLM Node - Analyze product
    {
      id: analyzerLLMId,
      type: 'llm',
      position: { x: 400, y: 120 },
      data: {
        label: 'Analyze product',
        model: 'gemini-2.0-flash' as GeminiModel,
        systemPrompt: 'You are a product analyst. Analyze products and extract key selling points, target audience, and unique value propositions.',
        userPrompt: 'Analyze this product and provide:\n1. Key selling points\n2. Target audience\n3. Unique value proposition\n4. Emotional benefits\n5. Competitive advantages',
        output: '',
        isLoading: false,
        error: null,
        temperature: 0,
        thinking: false,
      },
    },
    // LLM Node - Write Amazon listing
    {
      id: amazonLLMId,
      type: 'llm',
      position: { x: 200, y: 420 },
      data: {
        label: 'Write Amazon listing',
        model: 'gemini-2.0-flash' as GeminiModel,
        systemPrompt: 'You are an Amazon listing expert. Create compelling, keyword-rich product listings optimized for Amazon search.',
        userPrompt: 'Based on the product analysis, write an Amazon product listing with:\n- SEO-optimized title (under 200 chars)\n- 5 bullet points highlighting key features\n- Product description (HTML formatted)',
        output: '',
        isLoading: false,
        error: null,
        temperature: 0,
        thinking: false,
      },
    },
    // LLM Node - Write Instagram caption
    {
      id: instagramLLMId,
      type: 'llm',
      position: { x: 550, y: 420 },
      data: {
        label: 'Write Instagram caption',
        model: 'gemini-2.0-flash' as GeminiModel,
        systemPrompt: 'You are a social media expert specializing in Instagram marketing. Create engaging, viral-worthy captions.',
        userPrompt: 'Based on the product analysis, write an engaging Instagram caption with:\n- Hook in first line\n- Benefits and lifestyle appeal\n- Call-to-action\n- Relevant hashtags (10-15)',
        output: '',
        isLoading: false,
        error: null,
        temperature: 0,
        thinking: false,
      },
    },
    // LLM Node - Write SEO meta description
    {
      id: seoLLMId,
      type: 'llm',
      position: { x: 900, y: 420 },
      data: {
        label: 'Write SEO meta description',
        model: 'gemini-2.0-flash' as GeminiModel,
        systemPrompt: 'You are an SEO specialist. Create concise, compelling meta descriptions that drive clicks.',
        userPrompt: 'Based on the product analysis, write:\n- Meta title (under 60 chars)\n- Meta description (under 160 chars)\n- 5 focus keywords\n- Schema markup suggestion',
        output: '',
        isLoading: false,
        error: null,
        temperature: 0,
        thinking: false,
      },
    },
  ];

  const edges: WorkflowEdge[] = [
    // Image → Analyzer
    {
      id: uuidv4(),
      source: imageNodeId,
      target: analyzerLLMId,
      sourceHandle: 'output',
      targetHandle: 'input',
      animated: true,
      style: { stroke: '#c8e600', strokeWidth: 2 },
    },
    // Text → Analyzer
    {
      id: uuidv4(),
      source: textNodeId,
      target: analyzerLLMId,
      sourceHandle: 'output',
      targetHandle: 'input',
      animated: true,
      style: { stroke: '#c8e600', strokeWidth: 2 },
    },
    // Analyzer → Amazon
    {
      id: uuidv4(),
      source: analyzerLLMId,
      target: amazonLLMId,
      sourceHandle: 'output',
      targetHandle: 'input',
      animated: true,
      style: { stroke: '#c8e600', strokeWidth: 2 },
    },
    // Analyzer → Instagram
    {
      id: uuidv4(),
      source: analyzerLLMId,
      target: instagramLLMId,
      sourceHandle: 'output',
      targetHandle: 'input',
      animated: true,
      style: { stroke: '#c8e600', strokeWidth: 2 },
    },
    // Analyzer → SEO
    {
      id: uuidv4(),
      source: analyzerLLMId,
      target: seoLLMId,
      sourceHandle: 'output',
      targetHandle: 'input',
      animated: true,
      style: { stroke: '#c8e600', strokeWidth: 2 },
    },
  ];

  return {
    id: uuidv4(),
    name: 'Product Listing Generator',
    description: 'Generate e-commerce listings: Amazon, Instagram, and SEO from product details',
    nodes,
    edges,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
