'use client';

import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Loader2, Plus } from 'lucide-react';
import { NodeMenu } from './NodeMenu';
import { useWorkflowStore } from '@/store/workflowStore';

interface PromptEnhancerNodeData extends Record<string, unknown> {
  label: string;
  output: string;
  isLoading: boolean;
  error: string | null;
}

interface HandleLabelProps {
  label: string;
  color: string;
  position: 'left' | 'right';
  required?: boolean;
}

function HandleLabel({ label, color, position, required, visible }: HandleLabelProps & { visible?: boolean }) {
  if (!visible) return null;
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap z-10 ${
        position === 'left' ? 'right-full mr-2' : 'left-full ml-2'
      }`}
    >
      <span
        className="text-xs font-medium"
        style={{ color }}
      >
        {label}{required && <sup style={{ color }}>*</sup>}
      </span>
    </div>
  );
}

function PromptEnhancerNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as PromptEnhancerNodeData;
  const { updateNodeData, deleteNode, edges, nodes, setSelectedImageDescriberNode } = useWorkflowStore();
  const [isHovered, setIsHovered] = useState(false);
  const [imageInputCount, setImageInputCount] = useState(1);

  const handleAddImageInput = useCallback(() => {
    setImageInputCount((prev) => prev + 1);
  }, []);

  const getConnectedPrompts = useCallback(() => {
    const incomingEdges = edges.filter((edge) => edge.target === id);
    const prompts: string[] = [];

    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      if (!sourceNode) continue;

      if (sourceNode.type === 'text' || sourceNode.type === 'prompt') {
        const textData = sourceNode.data as { text?: string };
        if (textData.text) {
          prompts.push(textData.text);
        }
      }
    }

    return prompts;
  }, [edges, nodes, id]);

  const handleRun = useCallback(async () => {
    updateNodeData(id, { isLoading: true, error: null, output: '' });

    try {
      const prompts = getConnectedPrompts();
      
      if (prompts.length === 0) {
        updateNodeData(id, { 
          error: 'Please connect at least one prompt node', 
          isLoading: false 
        });
        return;
      }

      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-2.0-flash',
          systemPrompt: 'You are a prompt enhancement expert. Take the given prompt and enhance it to be more detailed, specific, and effective for AI image generation or text generation. Keep the core idea but make it more descriptive and creative.',
          userPrompt: `Please enhance this prompt:\n\n${prompts.join('\n\n')}`,
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
  }, [id, updateNodeData, getConnectedPrompts]);

  return (
    <div
      className="bg-[#212126] border border-[#2a2a35] rounded-xl shadow-xl w-[465px] transition-all duration-150"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedImageDescriberNode(id)}
    >
      {/* Prompt Input Handle */}
      <div
        className="group absolute"
        style={{ left: -12, top: 60 }}
      >
        <Handle
          type="target"
          position={Position.Left}
          id="prompt"
          className="!w-4 !h-4 !bg-transparent !border-[3px] !border-[#f1a0fa] !rounded-full"
          style={{ position: 'relative', left: 0, top: 0, transform: 'none' }}
        />
        <HandleLabel label="Prompt" color="#f1a0fa" position="left" required visible={isHovered} />
      </div>

      {/* Image Handles */}
      {Array.from({ length: imageInputCount }).map((_, index) => (
        <div
          key={`image-${index}`}
          className="group absolute"
          style={{ left: -12, top: 100 + index * 40 }}
        >
          <Handle
            type="target"
            position={Position.Left}
            id={`image-${index + 1}`}
            className="!w-4 !h-4 !bg-transparent !border-[3px] !border-[#6eddb3] !rounded-full"
            style={{ position: 'relative', left: 0, top: 0, transform: 'none' }}
          />
          <HandleLabel label={`Image ${index + 1}`} color="#6eddb3" position="left" visible={isHovered} />
        </div>
      ))}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-white">Prompt Enhancer</span>
        <NodeMenu
          nodeId={id}
          nodeName="Prompt Enhancer"
          nodeDescription="Enhance prompts with AI"
          onDuplicate={() => {}}
          onRename={() => {}}
          onDelete={() => deleteNode(id)}
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {/* Output Area */}
        <div
          className={`w-full h-[420px] px-3 py-3 rounded-lg text-sm overflow-y-auto ${
            nodeData.error
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'bg-[#353539] border border-[#3a3a45] text-[#555555]'
          }`}
        >
          {nodeData.isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </div>
          ) : nodeData.output ? (
            <pre className="whitespace-pre-wrap font-sans text-sm text-white">
              {nodeData.output}
            </pre>
          ) : nodeData.error ? (
            nodeData.error
          ) : (
            'The generated text will appear here'
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <button
          onClick={handleAddImageInput}
          className="flex items-center gap-1.5 text-xs text-white hover:text-white/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add another image input
        </button>
        <button
          onClick={handleRun}
          disabled={nodeData.isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#3a3a45] text-white rounded-lg text-xs font-medium hover:bg-[#2a2a35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>→</span>
          Run Model
        </button>
      </div>

      {/* Output Handle */}
      <div
        className="group absolute"
        style={{ right: -12, top: 60 }}
      >
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!w-4 !h-4 !bg-transparent !border-[3px] !border-[#f1a0fa] !rounded-full"
          style={{ position: 'relative', right: 0, top: 0, transform: 'none' }}
        />
        <HandleLabel label="Text" color="#f1a0fa" position="right" visible={isHovered} />
      </div>
    </div>
  );
}

export const PromptEnhancerNode = memo(PromptEnhancerNodeComponent);
