'use client';

import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Sparkles, X, Play, Loader2, ChevronDown } from 'lucide-react';
import { LLMNodeData, GEMINI_MODELS, GeminiModel, TextNodeData, ImageNodeData, WorkflowNode } from '@/types';
import { useWorkflowStore } from '@/store/workflowStore';

function LLMNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as LLMNodeData;
  const { updateNodeData, deleteNode, edges, nodes } = useWorkflowStore();
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const handleModelChange = useCallback(
    (model: GeminiModel) => {
      updateNodeData(id, { model });
      setIsModelDropdownOpen(false);
    },
    [id, updateNodeData]
  );

  const handleSystemPromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { systemPrompt: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleUserPromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { userPrompt: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleDelete = useCallback(() => {
    deleteNode(id);
  }, [id, deleteNode]);

  const getConnectedInputs = useCallback(() => {
    const incomingEdges = edges.filter((edge) => edge.target === id);
    const textInputs: string[] = [];
    const imageInputs: { base64: string; mimeType: string }[] = [];

    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((node) => node.id === edge.source) as WorkflowNode | undefined;
      if (!sourceNode) continue;

      if (sourceNode.type === 'text') {
        const textData = sourceNode.data as TextNodeData;
        if (textData.text) {
          textInputs.push(textData.text);
        }
      } else if (sourceNode.type === 'image') {
        const imageData = sourceNode.data as ImageNodeData;
        if (imageData.imageBase64) {
          imageInputs.push({
            base64: imageData.imageBase64,
            mimeType: 'image/jpeg',
          });
        }
      }
    }

    return { textInputs, imageInputs };
  }, [edges, nodes, id]);

  const handleRun = useCallback(async () => {
    updateNodeData(id, { isLoading: true, error: null, output: '' });

    try {
      const { textInputs, imageInputs } = getConnectedInputs();
      
      let fullPrompt = nodeData.userPrompt;
      if (textInputs.length > 0) {
        fullPrompt = `Context from connected nodes:\n${textInputs.join('\n\n')}\n\n${fullPrompt}`;
      }

      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: nodeData.model,
          systemPrompt: nodeData.systemPrompt || undefined,
          userPrompt: fullPrompt,
          images: imageInputs.length > 0 ? imageInputs : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        updateNodeData(id, { output: result.output, isLoading: false });
      } else {
        updateNodeData(id, { error: result.error, isLoading: false });
      }
    } catch (error) {
      updateNodeData(id, {
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  }, [id, nodeData, updateNodeData, getConnectedInputs]);

  const selectedModel = GEMINI_MODELS.find((m) => m.value === nodeData.model);

  return (
    <div
      className={`bg-[#1a1a24] border rounded-xl shadow-xl min-w-[320px] max-w-[360px] transition-all duration-150 ${
        selected ? 'border-[#a855f7]' : 'border-[#2a2a35]'
      }`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-[#a855f7] !border-2 !border-[#0d0d12]"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a35]">
        <span className="text-sm font-medium text-white">{nodeData.label}</span>
        <button
          onClick={handleDelete}
          className="p-1 hover:bg-[#333340] rounded transition-colors"
        >
          <X className="w-3.5 h-3.5 text-[#666666] hover:text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Model Selector */}
        <div className="relative">
          <label className="block text-xs text-[#888888] mb-1.5">Model</label>
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#252530] border border-[#3a3a45] rounded-lg text-sm text-white hover:border-[#a855f7] transition-colors"
          >
            <span>{selectedModel?.label || 'Select model'}</span>
            <ChevronDown className={`w-4 h-4 text-[#666666] transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isModelDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-[#1a1a24] border border-[#3a3a45] rounded-lg shadow-xl overflow-hidden">
              {GEMINI_MODELS.map((model) => (
                <button
                  key={model.value}
                  onClick={() => handleModelChange(model.value)}
                  className={`w-full px-3 py-2 text-left hover:bg-[#a855f7]/10 transition-colors ${
                    nodeData.model === model.value ? 'bg-[#a855f7]/10' : ''
                  }`}
                >
                  <div className="text-sm text-white">{model.label}</div>
                  <div className="text-xs text-[#666666]">{model.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-xs text-[#888888] mb-1.5">System Prompt</label>
          <textarea
            value={nodeData.systemPrompt}
            onChange={handleSystemPromptChange}
            placeholder="System instructions..."
            className="w-full h-16 px-3 py-2 bg-[#252530] border border-[#3a3a45] rounded-lg text-sm text-white placeholder-[#666666] resize-none focus:outline-none focus:border-[#a855f7] transition-colors"
          />
        </div>

        {/* User Prompt */}
        <div>
          <label className="block text-xs text-[#888888] mb-1.5">User Prompt</label>
          <textarea
            value={nodeData.userPrompt}
            onChange={handleUserPromptChange}
            placeholder="Enter your prompt..."
            className="w-full h-20 px-3 py-2 bg-[#252530] border border-[#3a3a45] rounded-lg text-sm text-white placeholder-[#666666] resize-none focus:outline-none focus:border-[#a855f7] transition-colors"
          />
        </div>

        {/* Run Button */}
        <button
          onClick={handleRun}
          disabled={nodeData.isLoading || !nodeData.userPrompt.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#252530] border border-[#3a3a45] hover:border-[#a855f7] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition-colors"
        >
          {nodeData.isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <span>→</span>
              Run Model
            </>
          )}
        </button>

        {/* Output */}
        {(nodeData.output || nodeData.error) && (
          <div>
            <label className="block text-xs text-[#888888] mb-1.5">Output</label>
            <div
              className={`w-full max-h-36 overflow-y-auto px-3 py-2 rounded-lg text-sm ${
                nodeData.error
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                  : 'bg-[#252530] border border-[#3a3a45] text-white'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {nodeData.error || nodeData.output}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-[#22d3ee] !border-2 !border-[#0d0d12]"
      />
    </div>
  );
}

export const LLMNode = memo(LLMNodeComponent);
