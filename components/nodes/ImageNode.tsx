'use client';

import { memo, useCallback, useRef } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { ImageNodeData } from '@/types';
import { useWorkflowStore } from '@/store/workflowStore';

function ImageNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as ImageNodeData;
  const { updateNodeData, deleteNode } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        updateNodeData(id, {
          imageBase64: base64,
          imageUrl: reader.result as string,
          fileName: file.name,
        });
      };
      reader.readAsDataURL(file);
    },
    [id, updateNodeData]
  );

  const handleRemoveImage = useCallback(() => {
    updateNodeData(id, {
      imageBase64: null,
      imageUrl: null,
      fileName: null,
    });
  }, [id, updateNodeData]);

  const handleDelete = useCallback(() => {
    deleteNode(id);
  }, [id, deleteNode]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div
      className={`bg-[#212126] border rounded-xl shadow-xl min-w-[280px] max-w-[320px] transition-all duration-150 ${
        selected ? 'border-[#a855f7]' : 'border-[#343438]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#343438]">
        <span className="text-sm font-medium text-white">{nodeData.label}</span>
        <button
          onClick={handleDelete}
          className="p-1 hover:bg-[#333340] rounded transition-colors"
        >
          <X className="w-3.5 h-3.5 text-[#666666] hover:text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {nodeData.imageUrl ? (
          <div className="relative">
            <img
              src={nodeData.imageUrl}
              alt={nodeData.fileName || 'Uploaded image'}
              className="w-full h-32 object-cover rounded-lg border border-[#343438]"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-red-500 rounded transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
            <p className="mt-2 text-xs text-[#888888] truncate">{nodeData.fileName}</p>
          </div>
        ) : (
          <button
            onClick={handleUploadClick}
            className="w-full h-32 flex flex-col items-center justify-center gap-2 border border-dashed border-[#343438] rounded-lg hover:border-[#a855f7] hover:bg-[#a855f7]/5 transition-colors"
          >
            <Upload className="w-6 h-6 text-[#666666]" />
            <span className="text-xs text-[#666666]">Click to upload</span>
          </button>
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

export const ImageNode = memo(ImageNodeComponent);
