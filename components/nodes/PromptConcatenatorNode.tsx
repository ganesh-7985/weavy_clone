'use client';

import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Plus } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { NodeMenu } from './NodeMenu';

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
      <span
        className="text-xs font-medium"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

interface PromptConcatenatorNodeData extends Record<string, unknown> {
  label: string;
  texts: string[];
}

function PromptConcatenatorNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as PromptConcatenatorNodeData;
  const { updateNodeData, deleteNode } = useWorkflowStore();
  const [texts, setTexts] = useState<string[]>(nodeData.texts || ['', '']);
  const [isHovered, setIsHovered] = useState(false);

  const handleTextChange = useCallback(
    (index: number, value: string) => {
      const newTexts = [...texts];
      newTexts[index] = value;
      setTexts(newTexts);
      updateNodeData(id, { texts: newTexts });
    },
    [id, updateNodeData, texts]
  );

  const handleAddInput = useCallback(() => {
    const newTexts = [...texts, ''];
    setTexts(newTexts);
    updateNodeData(id, { texts: newTexts });
  }, [id, updateNodeData, texts]);

  return (
    <div
      className="bg-[#212126] border border-[#2a2a35] rounded-xl shadow-xl min-w-[380px] max-w-[420px] transition-all duration-150"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Input Handles */}
      {texts.map((_, index) => (
        <div
          key={`input-${index}`}
          className="group absolute"
          style={{ left: -12, top: `${100 + index * 100}px` }}
        >
          <Handle
            type="target"
            position={Position.Left}
            id={`prompt-${index + 1}`}
            className="!w-4 !h-4 !bg-[#a855f7] !border-4 !border-[#1a1a1f] !rounded-full"
            style={{ position: 'relative', left: 0, top: 0, transform: 'none' }}
          />
          {isHovered && <HandleLabel label={`Prompt ${index + 1}`} color="#a855f7" position="left" />}
        </div>
      ))}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-white">Prompt Concatenator</span>
        <NodeMenu
          nodeId={id}
          nodeName="Prompt Concatenator"
          nodeDescription="Combine multiple prompts"
          onDuplicate={() => {}}
          onRename={() => {}}
          onDelete={() => deleteNode(id)}
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-4 space-y-3">
        {/* First Input */}
        <div>
          <textarea
            value={texts[0] || ''}
            onChange={(e) => handleTextChange(0, e.target.value)}
            placeholder="Connect multiple prompts to one output prompt."
            className="w-full h-16 px-3 py-2.5 bg-[#353539] border border-[#3a3a45] rounded-lg text-sm text-white placeholder-[#555555] resize-none focus:outline-none focus:border-[#a855f7] transition-colors"
          />
        </div>

        {/* Additional Inputs */}
        {texts.slice(1).map((text, index) => (
          <div key={index + 1}>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(index + 1, e.target.value)}
              placeholder="Write additional text"
              className="w-full h-16 px-3 py-2.5 bg-[#353539] border border-[#3a3a45] rounded-lg text-sm text-white placeholder-[#555555] resize-none focus:outline-none focus:border-[#a855f7] transition-colors"
            />
          </div>
        ))}

        {/* Add Another Input Button */}
        <button
          onClick={handleAddInput}
          className="flex items-center gap-2 text-sm text-[#a855f7] hover:text-[#c084fc] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add another text input
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
          className="!w-4 !h-4 !bg-[#a855f7] !border-4 !border-[#1a1a1f] !rounded-full"
          style={{ position: 'relative', right: 0, top: 0, transform: 'none' }}
        />
        {isHovered && <HandleLabel label="Prompt" color="#a855f7" position="right" />}
      </div>
    </div>
  );
}

export const PromptConcatenatorNode = memo(PromptConcatenatorNodeComponent);
