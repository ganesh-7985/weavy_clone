'use client';

import { useState, useCallback } from 'react';
import {
  Type,
  Image as ImageIcon,
  Sparkles,
  Search,
  History,
  Briefcase,
  Box,
  FileText,
  HelpCircle,
  Download,
  Upload,
} from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

interface SidebarProps {
  onExport: () => void;
  onImport: () => void;
  onSave: () => void;
  onLoadTemplate: () => void;
  onBackToProjects?: () => void;
  workflowName?: string;
}

export function Sidebar({ onExport, onImport, onSave, onLoadTemplate, onBackToProjects, workflowName = 'untitled' }: SidebarProps) {
  const {
    addTextNode,
    addImageNode,
    addLLMNode,
    setWorkflowName,
  } = useWorkflowStore();

  const [activePanel, setActivePanel] = useState<'none' | 'search' | 'recent'>('none');
  const [activeTab, setActiveTab] = useState<'recent' | 'toolbox'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(workflowName);

  const handleDragStart = useCallback(
    (e: React.DragEvent, nodeType: string) => {
      e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
      e.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const handleAddNode = useCallback(
    (type: string) => {
      const position = {
        x: 300 + Math.random() * 100,
        y: 200 + Math.random() * 100,
      };

      switch (type) {
        case 'text':
          addTextNode(position);
          break;
        case 'image':
          addImageNode(position);
          break;
        case 'llm':
          addLLMNode(position);
          break;
      }
    },
    [addTextNode, addImageNode, addLLMNode]
  );

  const toggleSearchPanel = () => {
    setActivePanel(activePanel === 'search' ? 'none' : 'search');
  };

  const toggleRecentPanel = () => {
    setActivePanel(activePanel === 'recent' ? 'none' : 'recent');
  };

  const handleNameSave = () => {
    if (editedName.trim()) {
      setWorkflowName(editedName.trim());
    } else {
      setEditedName(workflowName);
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditedName(workflowName);
      setIsEditingName(false);
    }
  };

  // Quick access items - exactly 3 buttons
  const quickAccessItems = [
    { type: 'text', label: 'Text Node', icon: Type },
    { type: 'image', label: 'Image Node', icon: ImageIcon },
    { type: 'llm', label: 'Run Any LLM', icon: Sparkles },
  ];

  // Icon sidebar items - matching Weavy's toolbar
  const sidebarIcons = [
    { icon: Search, action: toggleSearchPanel, label: 'Search', isActive: activePanel === 'search' },
    { icon: History, action: toggleRecentPanel, label: 'Quick Access', isActive: activePanel === 'recent' },
  ];

  return (
    <div className="flex h-full">
      {/* Icon Sidebar - Always visible */}
      <div className="w-14 h-full bg-[#121212] border-r border-[rgba(255,255,255,0.12)] flex flex-col items-center py-3">
        {/* Logo - Click to go back to projects */}
        <button 
          onClick={onBackToProjects}
          className="mb-3 p-2 hover:bg-[rgba(255,255,255,0.08)] rounded-lg transition-colors"
          title="Back to Projects"
        >
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
              <rect x="2" y="4" width="4" height="16" rx="1" />
              <rect x="8" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="8" width="4" height="12" rx="1" />
              <rect x="20" y="12" width="2" height="8" rx="0.5" />
            </svg>
            <span className="text-[10px] text-[#666666]">▾</span>
          </div>
        </button>

        {/* Main Icons */}
        <div className="flex-1 flex flex-col gap-1 mt-2">
          {sidebarIcons.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                item.isActive
                  ? 'bg-[#f6ffa8] text-black'
                  : 'text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.08)]'
              }`}
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Bottom Icons */}
        <div className="flex flex-col gap-1 mt-auto">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all"
            title="Documentation"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all"
            title="Discord"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Panel  */}
      {activePanel === 'search' && (
        <div className="w-60 h-full bg-[#121212] border-l border-[rgba(255,255,255,0.12)] flex flex-col overflow-hidden">
          {/* Workflow Name Header /}
          <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.12)]">
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyDown}
                autoFocus
                className="w-full bg-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 text-sm text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#f6ffa8]"
              />
            ) : (
              <div 
                onClick={() => {
                  setEditedName(workflowName);
                  setIsEditingName(true);
                }}
                className="bg-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors"
              >
                <span className="text-sm text-white font-medium">{workflowName}</span>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                autoFocus
                className="w-full pl-9 pr-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg text-xs text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors"
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="px-4 flex-1 overflow-y-auto">
            <p className="text-xs text-[rgba(255,255,255,0.4)]">Type to search nodes...</p>
          </div>
        </div>
      )}

      {/* Expanded Panel - Quick Access / Toolbox */}
      {activePanel === 'recent' && (
        <div className="w-60 h-full bg-[#121212] border-l border-[rgba(255,255,255,0.12)] flex flex-col overflow-hidden">
          {/* Workflow Name Header - Editable */}
          <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.12)]">
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyDown}
                autoFocus
                className="w-full bg-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 text-sm text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#f6ffa8]"
              />
            ) : (
              <div 
                onClick={() => {
                  setEditedName(workflowName);
                  setIsEditingName(true);
                }}
                className="bg-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors"
              >
                <span className="text-sm text-white font-medium">{workflowName}</span>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-9 pr-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg text-xs text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors"
              />
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="px-4 flex-1 overflow-y-auto">
            <h4 className="text-sm font-medium text-white mb-3">Quick access</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickAccessItems.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  onClick={() => handleAddNode(item.type)}
                  className="flex flex-col items-center gap-2 p-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.08)] cursor-grab active:cursor-grabbing transition-all group"
                >
                  <item.icon className="w-5 h-5 text-[rgba(255,255,255,0.6)] group-hover:text-white" />
                  <span className="text-[11px] text-[rgba(255,255,255,0.6)] group-hover:text-white text-center leading-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
