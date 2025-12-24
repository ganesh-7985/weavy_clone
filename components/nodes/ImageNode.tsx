'use client';

import { memo, useCallback, useRef, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Upload, X } from 'lucide-react';
import { ImageNodeData } from '@/types';
import { useWorkflowStore } from '@/store/workflowStore';
import { NodeMenu } from './NodeMenu';

function ImageNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as ImageNodeData;
  const { updateNodeData, deleteNode } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState('');
  const [isHovered, setIsHovered] = useState(false);

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

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;

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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleUrlSubmit = useCallback(() => {
    if (fileUrl.trim()) {
      updateNodeData(id, {
        imageUrl: fileUrl.trim(),
        fileName: 'External image',
      });
    }
  }, [id, updateNodeData, fileUrl]);

  // Handle label component
  const HandleLabel = ({ label, color, position }: { label: string; color: string; position: 'left' | 'right' }) => (
    <div
      className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${
        position === 'left' ? 'right-full mr-2' : 'left-full ml-2'
      }`}
    >
      <span
        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div
      className="bg-[#212126] border border-[#2a2a35] rounded-xl shadow-xl w-[238px] transition-all duration-150"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Output Handle */}
      <div
        className="group absolute"
        style={{ right: -12, top: 60 }}
      >
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!w-4 !h-4 !bg-transparent !border-[3px] !border-[#6eddb3] !rounded-full"
        />
        {isHovered && <HandleLabel label="File" color="#ffffff" position="right" />}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-white">File</span>
        <NodeMenu
          nodeId={id}
          nodeName="File"
          nodeDescription="Upload or link files"
          onDuplicate={() => {}}
          onRename={() => {}}
          onDelete={() => deleteNode(id)}
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
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
              className="w-full h-[200px] object-cover rounded-lg border border-[#343438]"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-red-500 rounded transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ) : (
          <div
            onClick={handleUploadClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full h-[200px] flex flex-col items-center justify-center gap-3 rounded-lg cursor-pointer transition-colors relative overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle, transparent 3px, transparent 3px),
                radial-gradient(circle, #3a3a45 1px, transparent 1px)
              `,
              backgroundSize: '16px 16px',
              backgroundColor: '#5a7a9a'
            }}
          >
            <Upload className="w-6 h-6 text-white" />
            <span className="text-sm text-white">Drag & drop or click to upload</span>
          </div>
        )}

        {/* File URL Input */}
        <div className="mt-3">
          <input
            type="text"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            placeholder="Paste a file link"
            className="w-full px-3 py-2 bg-[#353539] border border-[#3a3a45] rounded-lg text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#f6ffa8] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

export const ImageNode = memo(ImageNodeComponent);
