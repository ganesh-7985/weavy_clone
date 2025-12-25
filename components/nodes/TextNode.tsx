'use client';

import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useWorkflowStore } from '@/store/workflowStore';
import { NodeMenu } from './NodeMenu';
import { TextNodeData } from '@/types';

interface HandleLabelProps {
  label: string;
  color: string;
  position: 'left' | 'right';
}

function HandleLabel({ label, color, position }: HandleLabelProps) {
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap z-10 ${
        position === 'left' ? 'right-full mr-2' : 'left-full ml-2'
      }`}
    >
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

function TextNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as TextNodeData;
  const { updateNodeData, deleteNode } = useWorkflowStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { text: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <div
      className="bg-[#212126] border border-[#2a2a35] rounded-xl shadow-xl w-[465px] h-[137px] transition-all duration-150"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-white">Prompt</span>
        <NodeMenu
          nodeId={id}
          nodeName="Prompt"
          nodeDescription="Text prompt input"
          onDuplicate={() => {}}
          onRename={() => {}}
          onDelete={() => deleteNode(id)}
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <textarea
          value={nodeData.text}
          onChange={handleTextChange}
          placeholder="Enter your prompt..."
          className="w-full h-[60px] px-3 py-2.5 bg-[#353539] border border-[#3a3a45] rounded-lg text-sm text-white placeholder-[#555555] resize-none focus:outline-none focus:border-[#a855f7] transition-colors"
        />
      </div>

      {/* Output Handle */}
      <div className="group absolute" style={{ right: -12, top: '50%', transform: 'translateY(-50%)' }}>
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="w-4! h-4! bg-transparent! border-[3px]! border-[#f1a0fa]! rounded-full!"
          style={{ position: 'relative', right: 0, top: 0, transform: 'none' }}
        />
        {isHovered && <HandleLabel label="Prompt" color="#f1a0fa" position="right" />}
      </div>
    </div>
  );
}

export const TextNode = memo(TextNodeComponent);
