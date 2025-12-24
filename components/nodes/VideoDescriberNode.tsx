'use client';

import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Loader2, Plus } from 'lucide-react';
import { NodeMenu } from './NodeMenu';
import { useWorkflowStore } from '@/store/workflowStore';

interface VideoDescriberNodeData extends Record<string, unknown> {
  label: string;
  output: string;
  isLoading: boolean;
  error: string | null;
  videoInputCount: number;
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

function VideoDescriberNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as VideoDescriberNodeData;
  const { updateNodeData, deleteNode } = useWorkflowStore();
  const [videoInputCount, setVideoInputCount] = useState(nodeData.videoInputCount || 1);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddVideoInput = useCallback(() => {
    const newCount = videoInputCount + 1;
    setVideoInputCount(newCount);
    updateNodeData(id, { videoInputCount: newCount });
  }, [id, updateNodeData, videoInputCount]);

  const handleRun = useCallback(async () => {
    updateNodeData(id, { isLoading: true, error: null, output: '' });

    try {
      // For now, show a placeholder message since video processing requires more setup
      updateNodeData(id, { 
        output: 'Video description feature coming soon. Connect a video file to describe its contents.',
        isLoading: false 
      });
    } catch (error) {
      updateNodeData(id, {
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  }, [id, updateNodeData]);

  return (
    <div
      className="bg-[#212126] border border-[#2a2a35] rounded-xl shadow-xl w-[465px] transition-all duration-150"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Input Handles */}
      {Array.from({ length: videoInputCount }).map((_, index) => (
        <div
          key={`video-${index}`}
          className="group absolute"
          style={{ left: -12, top: 90 + index * 40 }}
        >
          <Handle
            type="target"
            position={Position.Left}
            id={`video-${index + 1}`}
            className="!w-4 !h-4 !bg-transparent !border-[3px] !border-[#6eddb3] !rounded-full"
            style={{ position: 'relative', left: 0, top: 0, transform: 'none' }}
          />
          <HandleLabel label={`Video ${index + 1}`} color="#6eddb3" position="left" required={index === 0} visible={isHovered} />
        </div>
      ))}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-white">Video Describer</span>
        <NodeMenu
          nodeId={id}
          nodeName="Video Describer"
          nodeDescription="Describe videos with AI"
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
          onClick={handleAddVideoInput}
          className="flex items-center gap-1.5 text-xs text-white hover:text-white/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add another video input
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
        style={{ right: -12, top: 90 }}
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

export const VideoDescriberNode = memo(VideoDescriberNodeComponent);
