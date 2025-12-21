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

  return (
    <div
      className={`min-w-[280px] max-w-[350px] bg-[#1a1a24] rounded-xl border ${
        selected ? 'border-[#a855f7]' : 'border-[#2a2a35]'
      } shadow-xl`}
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
        {/* File Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="relative min-h-[180px] bg-[#252530] border border-dashed border-[#3a3a45] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#a855f7] transition-colors overflow-hidden"
        >
          {nodeData.fileUrl ? (
            <>
              {isImage ? (
                <img
                  src={nodeData.fileUrl}
                  alt={nodeData.fileName || 'Uploaded file'}
                  className="w-full h-full object-contain"
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
              <Upload className="w-6 h-6 text-[#555555] mb-2" />
              <span className="text-sm text-[#888888]">
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
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 bg-[#a855f7] border-2 border-[#0d0d12]"
        style={{ right: -6, top: '50%' }}
      />
      
      {/* Handle Label */}
      <div className="absolute right-[-35px] top-1/2 -translate-y-1/2 text-xs text-[#a855f7] font-medium">
        File
      </div>
    </div>
  );
}

export const FileNode = memo(FileNodeComponent);
