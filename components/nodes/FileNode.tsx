'use client';

import { memo, useCallback, useRef, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Upload, MoreHorizontal, Link } from 'lucide-react';
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

  const isImage = nodeData.fileType?.startsWith('image/');

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-[465px] bg-[#212126] rounded-xl border border-[#2a2a35] shadow-xl relative"
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
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {/* File Upload Area with checkered background */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="relative h-[380px] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden"
          style={{
            background: `
              repeating-conic-gradient(
                #1a1a22 0% 25%,
                #252530 0% 50%
              ) 50% / 32px 32px
            `,
          }}
        >
          {nodeData.fileUrl ? (
            <>
              {isImage ? (
                <img
                  src={nodeData.fileUrl}
                  alt={nodeData.fileName || 'Uploaded file'}
                  className="w-full max-h-[360px] object-contain"
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
          className="w-4! h-4! bg-transparent! border-[3px]! border-[#6eddb3]! rounded-full!"
          style={{ position: 'relative', right: 0, top: 0, transform: 'none', zIndex: 10 }}
        />
        {isHovered && (
          <div className="absolute top-1/2 -translate-y-1/2 left-full ml-2 pointer-events-none whitespace-nowrap z-20">
            <span className="text-xs font-medium" style={{ color: '#6eddb3' }}>File</span>
          </div>
        )}
      </div>
    </div>
  );
}

export const FileNode = memo(FileNodeComponent);
