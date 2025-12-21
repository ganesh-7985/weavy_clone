'use client';

import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Type, X } from 'lucide-react';
import { TextNodeData } from '@/types';
import { useWorkflowStore } from '@/store/workflowStore';

function TextNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as TextNodeData;
  const { updateNodeData, deleteNode } = useWorkflowStore();

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { text: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleDelete = useCallback(() => {
    deleteNode(id);
  }, [id, deleteNode]);

  return (
    <div
      className={`bg-[#1a1a24] border rounded-xl shadow-xl min-w-[280px] max-w-[320px] transition-all duration-150 ${
        selected ? 'border-[#a855f7]' : 'border-[#2a2a35]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a35]">
        <span className="text-sm font-medium text-white">Prompt</span>
        <button
          onClick={handleDelete}
          className="p-1 hover:bg-[#333340] rounded transition-colors"
        >
          <X className="w-3.5 h-3.5 text-[#666666] hover:text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <textarea
          value={nodeData.text}
          onChange={handleTextChange}
          placeholder="Enter your prompt..."
          className="w-full h-24 px-3 py-2.5 bg-[#252530] border border-[#3a3a45] rounded-lg text-sm text-white placeholder-[#666666] resize-none focus:outline-none focus:border-[#a855f7] transition-colors"
        />
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

export const TextNode = memo(TextNodeComponent);
