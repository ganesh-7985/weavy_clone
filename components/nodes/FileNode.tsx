'use client';

import { memo, useCallback, useRef, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Upload, X, MoreHorizontal, Link } from 'lucide-react';
import { FileNodeData } from '@/types';
import { useWorkflowStore } from '@/store/workflowStore';

function FileNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as FileNodeData;
  const { updateNodeData, deleteNode } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState(nodeData.linkUrl || '');

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        updateNodeData(id, {
          fileBase64: base64,
          fileUrl: reader.result as string,
          fileName: file.name,
          fileType: file.type,
        });
      };
      reader.readAsDataURL(file);
    },
    [id, updateNodeData]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        updateNodeData(id, {
          fileBase64: base64,
          fileUrl: reader.result as string,
          fileName: file.name,
          fileType: file.type,
        });
      };
      reader.readAsDataURL(file);
    },
    [id, updateNodeData]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleLinkChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLinkUrl(e.target.value);
      updateNodeData(id, { linkUrl: e.target.value });
    },
    [id, updateNodeData]
  );

  const clearFile = useCallback(() => {
    updateNodeData(id, {
      fileBase64: null,
      fileUrl: null,
      fileName: null,
      fileType: null,
    });
  }, [id, updateNodeData]);

  const isImage = nodeData.fileType?.startsWith('image/');

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`w-[465px] h-[285px] bg-[#212126] rounded-xl border ${
        selected ? 'border-[#a855f7]' : 'border-[#2a2a35]'
      } shadow-xl relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">File</span>
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
        {/* File Upload Area with checkered background */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="relative h-[180px] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden"
          style={{
            background: `
              repeating-conic-gradient(
                #1a1a22 0% 25%,
                #252530 0% 50%
              ) 50% / 20px 20px
            `,
          }}
        >
          {nodeData.fileUrl ? (
            <>
              {isImage ? (
                <img
                  src={nodeData.fileUrl}
                  alt={nodeData.fileName || 'Uploaded file'}
                  className="w-full max-h-[280px] object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 p-4">
                  <div className="text-sm text-white truncate max-w-full">
                    {nodeData.fileName}
                  </div>
                  <div className="text-xs text-[#888888]">
                    {nodeData.fileType}
                  </div>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="absolute top-2 right-2 p-1 bg-[#1a1a24] rounded-full hover:bg-red-500/20 text-[#888888] hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-white mb-2" />
              <span className="text-sm text-white">
                Drag & drop or click to upload
              </span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.txt,.json,.csv"
          />
        </div>

        {/* Link Input */}
        <div className="mt-3">
          <div className="relative">
            <input
              type="text"
              value={linkUrl}
              onChange={handleLinkChange}
              placeholder="Paste a file link"
              className="w-full bg-[#252530] border border-[#3a3a45] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#a855f7] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <div className="group absolute" style={{ right: -12, top: 60 }}>
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="w-4! h-4! bg-transparent! border-[3px]! border-[#6eddb3]! rounded-full!"
          style={{ position: 'relative', right: 0, top: 0, transform: 'none' }}
        />
        {isHovered && (
          <div className="absolute top-1/2 -translate-y-1/2 left-full ml-2 pointer-events-none whitespace-nowrap">
            <span className="text-xs font-medium" style={{ color: '#6eddb3' }}>File</span>
          </div>
        )}
      </div>
    </div>
  );
}

export const FileNode = memo(FileNodeComponent);
