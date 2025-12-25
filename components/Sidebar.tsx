'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Type,
  Sparkles,
  Search,
  History,
  Briefcase,
  FileText,
  HelpCircle,
  ChevronsRight,
  FileImage,
  Video,
  Wand2,
  ChevronRight,
  Copy,
  Share2,
  Settings,
  ArrowLeft,
  Plus,
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
    addPromptConcatenatorNode,
    addImageDescriberNode,
    setWorkflowName,
    nodes,
  } = useWorkflowStore();

  const [activePanel, setActivePanel] = useState<'none' | 'search' | 'recent' | 'tools'>('none');
  const [activeTab, setActiveTab] = useState<'recent' | 'toolbox'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(workflowName);
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);
  const logoMenuRef = useRef<HTMLDivElement>(null);

  // Close logo menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoMenuRef.current && !logoMenuRef.current.contains(event.target as Node)) {
        setIsLogoMenuOpen(false);
      }
    };
    if (isLogoMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLogoMenuOpen]);

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
        case 'promptConcatenator':
          addPromptConcatenatorNode(position);
          break;
        case 'imageDescriber':
          addImageDescriberNode(position);
          break;
      }
    },
    [addTextNode, addImageNode, addLLMNode, addPromptConcatenatorNode, addImageDescriberNode]
  );

  const toggleSearchPanel = () => {
    setActivePanel(activePanel === 'search' ? 'none' : 'search');
  };

  const toggleRecentPanel = () => {
    setActivePanel(activePanel === 'recent' ? 'none' : 'recent');
  };

  const toggleToolsPanel = () => {
    setActivePanel(activePanel === 'tools' ? 'none' : 'tools');
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

  // Quick access items - 4 buttons including image
  const quickAccessItems = [
    { type: 'text', label: 'Prompt', icon: Type },
    { type: 'promptConcatenator', label: 'Prompt Concatenator', icon: ChevronsRight },
    { type: 'llm', label: 'Run Any LLM', icon: Sparkles },
    { type: 'image', label: 'File', icon: FileImage },
  ];

  // Icon sidebar items - matching Weavy's toolbar
  const sidebarIcons = [
    { icon: Search, action: toggleSearchPanel, label: 'Search', isActive: activePanel === 'search' },
    { icon: History, action: toggleRecentPanel, label: 'Quick Access', isActive: activePanel === 'recent' },
    { icon: Briefcase, action: toggleToolsPanel, label: 'Tools', isActive: activePanel === 'tools' },
  ];

  // Tools list for the Tools panel - matching reference image
  const toolsList = [
    { type: 'text', label: 'Prompt', icon: Type, description: 'Text prompt input' },
    { type: 'promptConcatenator', label: 'Prompt Concatenator', icon: ChevronsRight, description: 'Combine multiple prompts' },
    { type: 'promptEnhancer', label: 'Prompt Enhancer', icon: Wand2, description: 'Enhance prompts with AI' },
    { type: 'llm', label: 'Run Any LLM', icon: Sparkles, description: 'Run AI models' },
    { type: 'imageDescriber', label: 'Image Describer', icon: FileImage, description: 'Describe images with AI' }
  ];

  // Filter tools based on search
  const filteredTools = toolsList.filter(tool =>
    tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter nodes based on search
  const filteredNodes = nodes.filter(node => {
    const label = (node.data as { label?: string }).label || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-full">
      {/* Icon Sidebar - Always visible */}
      <div className="w-14 h-full bg-[#212126] border-r border-[rgba(255,255,255,0.12)] flex flex-col items-center py-3">

      {/* Fixed Project Title - Always visible next to icon sidebar */}
      {activePanel === 'none' && (
        <div className="absolute left-14 top-0 h-14 flex items-center px-4 z-10">
          <div 
            onClick={() => {
              setEditedName(workflowName);
              setIsEditingName(true);
            }}
            className="bg-[#212126] border border-[rgba(255,255,255,0.12)] rounded-lg px-4 py-2 cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors min-w-[200px]"
          >
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyDown}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-transparent text-sm text-white font-medium focus:outline-none"
              />
            ) : (
              <span className="text-sm text-white font-medium">{workflowName}</span>
            )}
          </div>
        </div>
      )}

        {/* Logo - Click to show menu */}
        <div className="relative" ref={logoMenuRef}>
          <button 
            onClick={() => setIsLogoMenuOpen(!isLogoMenuOpen)}
            className="mb-3 p-2 hover:bg-[rgba(255,255,255,0.08)] rounded-lg transition-colors"
            title="Menu"
          >
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 30 25" fill="none" className="w-6 h-5">
                <g clipPath="url(#clip0_1_15019)">
                  <path d="M7.89437 0H0.5V16.3638H7.89437V0Z" fill="white"/>
                  <path d="M13.2733 16.2319H5.87891V25.0002H13.2733V16.2319Z" fill="white"/>
                  <path d="M24.0291 16.2319H16.6348V25.0002H24.0291V16.2319Z" fill="white"/>
                  <path d="M18.6493 0H11.2549V16.3638H18.6493V0Z" fill="white"/>
                  <path d="M29.408 0H22.0137V16.3638H29.408V0Z" fill="white"/>
                </g>
                <defs>
                  <clipPath id="clip0_1_15019">
                    <rect width="28.9078" height="25" fill="white" transform="translate(0.5)"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-[10px] text-[#666666]">▾</span>
            </div>
          </button>

          {/* Logo Dropdown Menu */}
          {isLogoMenuOpen && (
            <div className="absolute left-0 top-full mt-1 w-[240px] bg-[#212126] border border-[#353539] rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="py-2">
                <button
                  onClick={() => { onBackToProjects?.(); setIsLogoMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#353539] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-[#888888]" />
                  Back to files
                </button>
              </div>
              <div className="border-t border-[#353539] py-2">
                <button
                  onClick={() => { setIsLogoMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#353539] transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#888888]" />
                  Create new file
                </button>
                <button
                  onClick={() => { setIsLogoMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#353539] transition-colors"
                >
                  <Copy className="w-4 h-4 text-[#888888]" />
                  Duplicate file
                </button>
              </div>
              <div className="border-t border-[#353539] py-2">
                <button
                  onClick={() => { setIsLogoMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#353539] transition-colors"
                >
                  <Share2 className="w-4 h-4 text-[#888888]" />
                  Share file
                </button>
              </div>
              <div className="border-t border-[#353539] py-2">
                <button
                  onClick={() => { setIsLogoMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-white hover:bg-[#353539] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-[#888888]" />
                    Preferences
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#888888]" />
                </button>
              </div>
            </div>
          )}
        </div>

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
        <div className="w-60 h-full bg-[#212126] border-r border-[rgba(255,255,255,0.12)] flex flex-col overflow-hidden">
          {/* Workflow Name Header */}
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
                className="w-full pl-9 pr-3 py-2 bg-[#353539] border border-[rgba(255,255,255,0.12)] rounded-lg text-xs text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors"
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="px-4 flex-1 overflow-y-auto">
            {searchQuery ? (
              <>
                {filteredNodes.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-xs text-[rgba(255,255,255,0.4)] mb-2">Nodes ({filteredNodes.length})</h4>
                    {filteredNodes.map((node) => (
                      <div
                        key={node.id}
                        className="p-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg text-xs text-white"
                      >
                        {(node.data as { label?: string }).label || node.type}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[rgba(255,255,255,0.4)]">No nodes found</p>
                )}
                {filteredTools.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs text-[rgba(255,255,255,0.4)] mb-2">Tools ({filteredTools.length})</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {filteredTools.map((tool) => (
                        <div
                          key={tool.type}
                          draggable
                          onDragStart={(e) => handleDragStart(e, tool.type)}
                          className="flex flex-col items-center justify-center gap-2 p-4 bg-[#212126] border border-[#343438] rounded-lg hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.04)] cursor-grab active:cursor-grabbing transition-all group w-[100px] h-[100px]"
                        >
                          <tool.icon className="w-6 h-6 text-[rgba(255,255,255,0.6)] group-hover:text-white" />
                          <span className="text-xs text-[rgba(255,255,255,0.6)] group-hover:text-white text-center leading-tight">{tool.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-[rgba(255,255,255,0.4)]">Type to search nodes and tools...</p>
            )}
          </div>
        </div>
      )}

      {/* Expanded Panel - Quick Access / Toolbox */}
      {activePanel === 'recent' && (
        <div className="w-60 h-full bg-[#212126] border-r border-[rgba(255,255,255,0.12)] flex flex-col overflow-hidden">
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
                className="w-full pl-9 pr-3 py-2 bg-[#353539] border border-[rgba(255,255,255,0.12)] rounded-lg text-xs text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors"
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
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-[#212126] border border-[#343438] rounded-lg hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.04)] cursor-grab active:cursor-grabbing transition-all group w-[100px] h-[100px]"
                >
                  <item.icon className="w-6 h-6 text-[rgba(255,255,255,0.6)] group-hover:text-white" />
                  <span className="text-xs text-[rgba(255,255,255,0.6)] group-hover:text-white text-center leading-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expanded Panel - Tools */}
      {activePanel === 'tools' && (
        <div className="w-60 h-full bg-[#212126] border-r border-[rgba(255,255,255,0.12)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.12)]">
            <span className="text-sm text-white font-medium">Tools</span>
          </div>

          {/* Search Input */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools"
                className="w-full pl-9 pr-3 py-2 bg-[#353539] border border-[rgba(255,255,255,0.12)] rounded-lg text-xs text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors"
              />
            </div>
          </div>

          {/* Tools Grid */}
          <div className="px-4 pb-3 flex-1 overflow-y-auto">
            <h4 className="text-sm font-medium text-white mb-3">Text tools</h4>
            <div className="grid grid-cols-2 gap-2">
              {toolsList.map((tool) => (
                <div
                  key={tool.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tool.type)}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-[#212126] border border-[#343438] rounded-lg hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.04)] cursor-grab active:cursor-grabbing transition-all group w-[100px] h-[100px]"
                >
                  <tool.icon className="w-6 h-6 text-[rgba(255,255,255,0.6)] group-hover:text-white" />
                  <span className="text-xs text-[rgba(255,255,255,0.6)] group-hover:text-white text-center leading-tight">
                    {tool.label}
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
