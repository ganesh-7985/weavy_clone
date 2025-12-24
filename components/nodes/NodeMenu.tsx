'use client';

import { useState, useRef, useEffect } from 'react';
import { Copy, Edit3, Lock, Trash2, Download, X, Check } from 'lucide-react';

interface NodeMenuProps {
  nodeId: string;
  nodeName: string;
  nodeDescription?: string;
  onDuplicate: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onDownload?: () => void;
}

export function NodeMenu({
  nodeId,
  nodeName,
  nodeDescription = '',
  onDuplicate,
  onRename,
  onDelete,
  onDownload,
}: NodeMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 hover:bg-[#333340] rounded transition-colors"
      >
        <svg className="w-4 h-4 text-[#666666] hover:text-white" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 w-64 bg-[#212126] border border-[#353539] rounded-xl shadow-2xl z-50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#353539]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium text-sm">{nodeName}</span>
            </div>
            {nodeDescription && (
              <p className="text-[#888888] text-xs">{nodeDescription}</p>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => handleAction(onDuplicate)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-[#353539] transition-colors"
            >
              <span className="flex items-center gap-3">
                <Copy className="w-4 h-4 text-[#888888]" />
                Duplicate
              </span>
              <span className="text-[#666666] text-xs">cmd+d</span>
            </button>

            <button
              onClick={() => handleAction(() => {})}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-[#353539] transition-colors"
            >
              <Edit3 className="w-4 h-4 text-[#888888]" />
              Rename
            </button>

            <button
              onClick={() => handleAction(() => {})}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-[#353539] transition-colors"
            >
              <Lock className="w-4 h-4 text-[#888888]" />
              Lock
            </button>
          </div>

          {/* Delete Section */}
          <div className="py-2 border-t border-[#353539]">
            <button
              onClick={() => handleAction(onDelete)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-[#353539] transition-colors"
            >
              <span className="flex items-center gap-3">
                <Trash2 className="w-4 h-4 text-[#888888]" />
                Delete
              </span>
              <span className="text-[#666666] text-xs">delete / backspace</span>
            </button>
          </div>

          {/* Download Section */}
          {onDownload && (
            <div className="py-2 border-t border-[#353539]">
              <button
                onClick={() => handleAction(onDownload)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#666666] hover:bg-[#353539] hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Download current
              </button>
            </div>
          )}

          {/* View Section */}
          <div className="py-2 border-t border-[#353539]">
            <div className="px-4 py-1">
              <span className="text-xs text-[#666666]">View</span>
            </div>
            <button
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-[#353539] transition-colors"
            >
              <span>Single</span>
              <Check className="w-4 h-4 text-white" />
            </button>
            <button
              className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-[#353539] transition-colors"
            >
              All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
