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
    // File Node - Product Photo
    {
      id: imageNodeId,
      type: 'file',
      position: { x: 50, y: 50 },
      data: {
        label: 'Product Photo',
        fileUrl: null,
        fileBase64: null,
        fileName: null,
        fileType: null,
        linkUrl: null,
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
        model: 'gemini-3-flash-preview' as GeminiModel,
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
        model: 'gemini-3-flash-preview' as GeminiModel,
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
        model: 'gemini-3-flash-preview' as GeminiModel,
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
        model: 'gemini-3-flash-preview' as GeminiModel,
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
      targetHandle: 'image-1',
      animated: false,
      style: { stroke: '#6eddb3', strokeWidth: 2 },
    },
    // Text → Analyzer
    {
      id: uuidv4(),
      source: textNodeId,
      target: analyzerLLMId,
      sourceHandle: 'output',
      targetHandle: 'prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
    },
    // Analyzer → Amazon
    {
      id: uuidv4(),
      source: analyzerLLMId,
      target: amazonLLMId,
      sourceHandle: 'output',
      targetHandle: 'prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
    },
    // Analyzer → Instagram
    {
      id: uuidv4(),
      source: analyzerLLMId,
      target: instagramLLMId,
      sourceHandle: 'output',
      targetHandle: 'prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
    },
    // Analyzer → SEO
    {
      id: uuidv4(),
      source: analyzerLLMId,
      target: seoLLMId,
      sourceHandle: 'output',
      targetHandle: 'prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
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

export function createProductContentPipelineWorkflow(): Workflow {
  // Inputs
  const image1Id = uuidv4();
  const image2Id = uuidv4();
  const image3Id = uuidv4();
  const systemPromptId = uuidv4();
  const productSpecsId = uuidv4();

  // LLMs
  const analyzerLLMId = uuidv4();
  const amazonLLMId = uuidv4();
  const instagramLLMId = uuidv4();
  const seoLLMId = uuidv4();

  // Intermediate prompt nodes
  const amazonPromptId = uuidv4();
  const instagramPromptId = uuidv4();
  const seoPromptId = uuidv4();

  const nodes: WorkflowNode[] = [
    // Text nodes (top left)
    {
      id: productSpecsId,
      type: 'text',
      position: { x: 40, y: 40 },
      data: {
        label: 'Product name & specs',
        text: 'Product: [Name]\nBrand: [Brand]\nPrice: [Price]\nSpecs: [Key specs]\nTarget audience: [Audience]\nNotes: [Any constraints]',
      },
    },
    {
      id: systemPromptId,
      type: 'text',
      position: { x: 40, y: 300 },
      data: {
        label: 'System prompt',
        text: 'You are a product analyst and copywriter. Be accurate, specific, and conversion-focused.',
      },
    },

    // File Nodes (below text nodes)
    {
      id: image1Id,
      type: 'file',
      position: { x: 40, y: 560 },
      data: { label: 'Product Photo 1', fileUrl: null, fileBase64: null, fileName: null, fileType: null, linkUrl: null },
    },
    {
      id: image2Id,
      type: 'file',
      position: { x: 40, y: 960 },
      data: { label: 'Product Photo 2', fileUrl: null, fileBase64: null, fileName: null, fileType: null, linkUrl: null },
    },
    {
      id: image3Id,
      type: 'file',
      position: { x: 40, y: 1360 },
      data: { label: 'Product Photo 3', fileUrl: null, fileBase64: null, fileName: null, fileType: null, linkUrl: null },
    },

    // Analyzer (center)
    {
      id: analyzerLLMId,
      type: 'llm',
      position: { x: 560, y: 720 },
      data: {
        label: 'Analyze product',
        model: 'gemini-3-flash-preview' as GeminiModel,
        systemPrompt: 'You are a product analyst. Extract key facts, value props, and positioning from the provided images + specs.',
        userPrompt:
          'Analyze the product and output a structured brief with:\n- Product summary\n- Key benefits (bullet list)\n- Feature highlights\n- Target audience\n- Brand voice suggestions\n- Objections & rebuttals\n- Keywords (SEO)',
        output: '',
        isLoading: false,
        error: null,
        temperature: 0,
        thinking: false,
        imageInputCount: 3,
      },
    },

    // Intermediate prompt nodes (center-right, between analyzer and writers)
    {
      id: amazonPromptId,
      type: 'text',
      position: { x: 560, y: 120 },
      data: { label: 'Amazon Prompt', text: 'Write the Amazon listing' },
    },
    {
      id: instagramPromptId,
      type: 'text',
      position: { x: 560, y: 400 },
      data: { label: 'Instagram Prompt', text: 'Write Instagram Caption' },
    },
    {
      id: seoPromptId,
      type: 'text',
      position: { x: 560, y: 1200 },
      data: { label: 'SEO Prompt', text: 'Write SEO meta description' },
    },

    // Writers (right side, stacked vertically)
    {
      id: amazonLLMId,
      type: 'llm',
      position: { x: 1020, y: 40 },
      data: {
        label: 'Write Amazon listing',
        model: 'gemini-3-flash-preview' as GeminiModel,
        systemPrompt: 'You are an Amazon listing expert. Write keyword-rich copy that converts.',
        userPrompt:
          'Using the product brief, write:\n- SEO title (<=200 chars)\n- 5 benefit-focused bullets\n- Description (plain text)\n- Backend keywords (comma-separated)',
        output: '',
        isLoading: false,
        error: null,
        temperature: 0,
        thinking: false,
      },
    },
    {
      id: instagramLLMId,
      type: 'llm',
      position: { x: 1020, y: 560 },
      data: {
        label: 'Write Instagram caption',
        model: 'gemini-3-flash-preview' as GeminiModel,
        systemPrompt: 'You are a social media copywriter. Write concise, punchy, engaging captions.',
        userPrompt:
          'Using the product brief, write:\n- A 1-line hook\n- Caption body (2-4 short paragraphs)\n- CTA\n- 10-15 relevant hashtags',
        output: '',
        isLoading: false,
        error: null,
        temperature: 0,
        thinking: false,
      },
    },
    {
      id: seoLLMId,
      type: 'llm',
      position: { x: 1020, y: 1120 },
      data: {
        label: 'Write SEO meta description',
        model: 'gemini-3-flash-preview' as GeminiModel,
        systemPrompt: 'You are an SEO specialist. Write human, click-worthy metadata.',
        userPrompt:
          'Using the product brief, provide:\n- Meta title (<=60 chars)\n- Meta description (<=160 chars)\n- 10 focus keywords',
        output: '',
        isLoading: false,
        error: null,
        temperature: 0,
        thinking: false,
      },
    },
  ];

  const edges: WorkflowEdge[] = [
    // Images → Analyzer
    {
      id: uuidv4(),
      source: image1Id,
      target: analyzerLLMId,
      sourceHandle: 'output',
      targetHandle: 'image-1',
      animated: false,
      style: { stroke: '#6eddb3', strokeWidth: 2 },
    },
    {
      id: uuidv4(),
      source: image2Id,
      target: analyzerLLMId,
      sourceHandle: 'output',
      targetHandle: 'image-2',
      animated: false,
      style: { stroke: '#6eddb3', strokeWidth: 2 },
    },
    {
      id: uuidv4(),
      source: image3Id,
      target: analyzerLLMId,
      sourceHandle: 'output',
      targetHandle: 'image-3',
      animated: false,
      style: { stroke: '#6eddb3', strokeWidth: 2 },
    },

    // Text → Analyzer
    {
      id: uuidv4(),
      source: systemPromptId,
      target: analyzerLLMId,
      sourceHandle: 'output',
      targetHandle: 'system-prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
    },
    {
      id: uuidv4(),
      source: productSpecsId,
      target: analyzerLLMId,
      sourceHandle: 'output',
      targetHandle: 'prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
    },

    // Analyzer → Writers (to system-prompt)
    {
      id: uuidv4(),
      source: analyzerLLMId,
      target: amazonLLMId,
      sourceHandle: 'output',
      targetHandle: 'system-prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
    },
    {
      id: uuidv4(),
      source: analyzerLLMId,
      target: instagramLLMId,
      sourceHandle: 'output',
      targetHandle: 'system-prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
    },
    {
      id: uuidv4(),
      source: analyzerLLMId,
      target: seoLLMId,
      sourceHandle: 'output',
      targetHandle: 'system-prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
    },

    // Prompt nodes → Writers (to prompt)
    {
      id: uuidv4(),
      source: amazonPromptId,
      target: amazonLLMId,
      sourceHandle: 'output',
      targetHandle: 'prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
    },
    {
      id: uuidv4(),
      source: instagramPromptId,
      target: instagramLLMId,
      sourceHandle: 'output',
      targetHandle: 'prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
    },
    {
      id: uuidv4(),
      source: seoPromptId,
      target: seoLLMId,
      sourceHandle: 'output',
      targetHandle: 'prompt',
      animated: false,
      style: { stroke: '#f1a0fa', strokeWidth: 2 },
    },
  ];

  return {
    id: uuidv4(),
    name: 'Product Content Pipeline',
    description: 'Analyze product images + specs, then generate Amazon listing, Instagram caption, and SEO metadata',
    nodes,
    edges,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
