'use client';

import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Type, X, MoreHorizontal } from 'lucide-react';
import { PromptNodeData } from '@/types';
import { useWorkflowStore } from '@/store/workflowStore';

function PromptNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as PromptNodeData;
  const { updateNodeData, deleteNode } = useWorkflowStore();

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { text: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <div
      className={`min-w-[280px] max-w-[350px] bg-[#1a1a24] rounded-xl border ${
        selected ? 'border-[#a855f7]' : 'border-[#2a2a35]'
      } shadow-xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">Prompt</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded hover:bg-[#2a2a35] text-[#888888] hover:text-white transition-colors"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteNode(id)}
            className="p-1 rounded hover:bg-red-500/20 text-[#888888] hover:text-red-400 transition-colors"
            title="Delete node"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <textarea
          value={nodeData.text || ''}
          onChange={handleTextChange}
          placeholder="Enter your prompt here..."
          className="w-full min-h-[100px] bg-[#252530] border border-[#3a3a45] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555555] resize-none focus:outline-none focus:border-[#a855f7] transition-colors"
        />
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 bg-[#a855f7] border-2 border-[#0d0d12]"
        style={{ right: -6, top: '50%' }}
      />
      
      {/* Handle Label */}
      <div className="absolute right-[-50px] top-1/2 -translate-y-1/2 text-xs text-[#a855f7] font-medium">
        Prompt
      </div>
    </div>
  );
}

export const PromptNode = memo(PromptNodeComponent);
