'use client';

import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Loader2, Plus } from 'lucide-react';
import { NodeMenu } from './NodeMenu';
import { useWorkflowStore } from '@/store/workflowStore';
import { ImageNodeData, WorkflowNode } from '@/types';

interface ImageDescriberNodeData extends Record<string, unknown> {
  label: string;
  output: string;
  isLoading: boolean;
  error: string | null;
  imageInputCount: number;
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
      <span className="text-xs font-medium" style={{ color }}>
        {label}{required && <sup style={{ color }}>*</sup>}
      </span>
    </div>
  );
}


function ImageDescriberNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as ImageDescriberNodeData;
  const { updateNodeData, deleteNode, edges, nodes, setSelectedImageDescriberNode } = useWorkflowStore();
  const [imageInputCount, setImageInputCount] = useState(nodeData.imageInputCount || 1);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddImageInput = useCallback(() => {
    const newCount = imageInputCount + 1;
    setImageInputCount(newCount);
    updateNodeData(id, { imageInputCount: newCount });
  }, [id, updateNodeData, imageInputCount]);

  const getConnectedImages = useCallback(() => {
    const incomingEdges = edges.filter((edge) => edge.target === id);
    const imageInputs: { base64: string; mimeType: string }[] = [];

    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((node) => node.id === edge.source) as WorkflowNode | undefined;
      if (!sourceNode) continue;

      if (sourceNode.type === 'image') {
        const imageData = sourceNode.data as ImageNodeData;
        if (imageData.imageBase64) {
          imageInputs.push({
            base64: imageData.imageBase64,
            mimeType: 'image/jpeg',
          });
        }
      }
    }

    return imageInputs;
  }, [edges, nodes, id]);

  const handleRun = useCallback(async () => {
    updateNodeData(id, { isLoading: true, error: null, output: '' });

    try {
      const images = getConnectedImages();
      
      if (images.length === 0) {
        updateNodeData(id, { 
          error: 'Please connect at least one image node', 
          isLoading: false 
        });
        return;
      }

      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          systemPrompt: 'You are an image description expert. Describe the image(s) in detail.',
          userPrompt: 'Please describe this image in detail. Include information about objects, colors, composition, and any notable elements.',
          images,
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
  }, [id, updateNodeData, getConnectedImages]);

  return (
    <div
      className="bg-[#212126] border border-[#2a2a35] rounded-xl shadow-xl w-[465px] transition-all duration-150 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedImageDescriberNode(id)}
    >
      {/* Image Input Handles with curved background */}
      {Array.from({ length: imageInputCount }).map((_, index) => (
        <div key={`image-${index}`} className="group absolute" style={{ left: -8, top: 96 + index * 48 }}>
          <div 
            className="absolute"
            style={{
              width: '24px',
              height: '40px',
              background: '#212126',
              right: '4px',
              top: '50%',
              transform: 'translateY(-50%)',
              borderTopLeftRadius: '20px',
              borderBottomLeftRadius: '20px',
            }}
          />
          <Handle
            type="target"
            position={Position.Left}
            id={`image-${index + 1}`}
            className="w-4! h-4! bg-transparent! border-[3px]! border-[#6eddb3]! rounded-full!"
            style={{ position: 'relative', left: 0, top: 0, transform: 'none', zIndex: 10 }}
          />
          <HandleLabel label={`Image ${index + 1}`} color="#6eddb3" position="left" required={index === 0} visible={isHovered} />
        </div>
      ))}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-white">Image Describer</span>
        <NodeMenu
          nodeId={id}
          nodeName="Image Describer"
          nodeDescription="Describes an image"
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

      {/* Output Handle with curved background */}
      <div className="group absolute" style={{ right: -8, top: 90 }}>
        <div 
          className="absolute"
          style={{
            width: '24px',
            height: '40px',
            background: '#212126',
            left: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="w-4! h-4! bg-transparent! border-[3px]! border-[#f1a0fa]! rounded-full!"
          style={{ position: 'relative', right: 0, top: 0, transform: 'none', zIndex: 10 }}
        />
        <HandleLabel label="Text" color="#f1a0fa" position="right" visible={isHovered} />
      </div>
    </div>
  );
}

export const ImageDescriberNode = memo(ImageDescriberNodeComponent);
