'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, LayoutGrid, FolderOpen, Users, AppWindow, Sparkles, List, Grid3X3 } from 'lucide-react';
import { getAllWorkflows } from '@/lib/storage';
import { Workflow } from '@/types';
import { UserDropdown } from './UserDropdown';
import { useAuth } from '@/context/AuthContext';

interface ProjectsPageProps {
  onOpenWorkflow: (workflowId: string) => void;
  onCreateNew: () => void;
  onLoadTemplate?: () => void;
}

// Template data for workflow library
const WORKFLOW_TEMPLATES = [
  { id: 'weavy-welcome', name: 'Weavy Welcome', image: '/templates/welcome.jpg' },
  { id: 'weavy-iterators', name: 'Weavy Iterators', image: '/templates/iterators.jpg' },
  { id: 'multiple-image', name: 'Multiple Image Models', image: '/templates/multiple.jpg' },
  { id: 'editing-images', name: 'Editing Images', image: '/templates/editing.jpg' },
  { id: 'compositor-node', name: 'Compositor Node', image: '/templates/compositor.jpg' },
  { id: 'image-to-video', name: 'Image to Video', image: '/templates/video.jpg' },
];

// Tutorial data
const TUTORIALS = [
  { id: 'getting-started', name: 'Getting Started', image: '/tutorials/start.jpg' },
  { id: 'advanced-flows', name: 'Advanced Flows', image: '/tutorials/advanced.jpg' },
  { id: 'ai-models', name: 'AI Models Guide', image: '/tutorials/models.jpg' },
];

export function ProjectsPage({ onOpenWorkflow, onCreateNew, onLoadTemplate }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Workflow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'library' | 'tutorials'>('library');

  useEffect(() => {
    const workflows = getAllWorkflows();
    setProjects(workflows);
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `Last edited ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `Last edited ${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `Last edited ${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const { profile } = useAuth();
  const displayName = profile?.full_name || 'User';

  const currentItems = activeTab === 'library' ? WORKFLOW_TEMPLATES : TUTORIALS;

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const handleDiscordClick = () => {
    window.open('https://discord.com/invite/jB6vn2ewxW', '_blank');
  };

  return (
    <div className="h-full w-full bg-[#0d0d12] flex">
      {/* Left Sidebar */}
      <div className="w-[239px] h-full bg-[#0d0d12] border-r border-[rgba(240,240,229,0.08)] flex flex-col py-2">
        {/* User Dropdown */}
        <div className="px-2 mb-2">
          <UserDropdown />
        </div>

        {/* Create New Button */}
        <div className="px-2 mb-2">
          <button
            onClick={onCreateNew}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f6ffa8] text-[#0d0d12] rounded-lg font-medium text-sm hover:bg-[#f8ffb8] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New File
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 p-2">
          <button className="w-full flex items-center gap-3 p-2 text-white text-sm rounded-lg hover:bg-[#1a1a1f] transition-colors">
            <FolderOpen className="w-4 h-4" />
            My Files
            <Plus className="w-3.5 h-3.5 ml-auto text-[#666666]" />
          </button>
          <button className="w-full flex items-center gap-3 p-2 text-[#666666] text-sm rounded-lg hover:bg-[#1a1a1f] transition-colors">
            <Users className="w-4 h-4" />
            Shared with me
          </button>
          <button className="w-full flex items-center gap-3 p-2 text-[#666666] text-sm rounded-lg hover:bg-[#1a1a1f] transition-colors">
            <AppWindow className="w-4 h-4" />
            Apps
          </button>
        </div>

        {/* Bottom - Discord */}
        <div className="p-2 mt-auto">
          <button 
            onClick={handleDiscordClick}
            className="w-full flex items-center gap-3 p-2 text-[#666666] text-sm rounded-lg hover:bg-[#1a1a1f] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with workspace name */}
        <div className="px-16 pt-8 pb-4 flex items-center justify-between">
          <h1 className="text-sm text-[#666666]">{displayName}&apos;s Workspace</h1>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#f6ffa8] text-[#0d0d12] rounded-lg font-medium text-sm hover:bg-[#f8ffb8] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New File
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-16">
          {/* Workflow Library Section */}
          <div className="bg-[#18181b] rounded-xl p-4 mb-8">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setActiveTab('library')}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'library'
                    ? 'bg-[#252528] text-white'
                    : 'text-[#666666] hover:text-white'
                }`}
              >
                Workflow library
              </button>
              <button
                onClick={() => setActiveTab('tutorials')}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'tutorials'
                    ? 'bg-[#252528] text-white'
                    : 'text-[#666666] hover:text-white'
                }`}
              >
                Tutorials
              </button>
            </div>

            {/* Horizontally Scrollable Template Cards */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  onClick={onLoadTemplate}
                  className="shrink-0 w-[140px] cursor-pointer group"
                >
                  <div className="aspect-4/3 bg-[#252528] rounded-lg mb-2 flex items-center justify-center overflow-hidden border border-transparent group-hover:border-[rgba(255,255,255,0.12)] transition-all">
                    <Sparkles className="w-8 h-8 text-[#444] group-hover:text-[#888]" />
                  </div>
                  <p className="text-xs text-white truncate">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* My Files Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium text-white">My files</h2>
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-40 pl-9 pr-3 py-1.5 bg-[#18181b] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#333] transition-colors"
                  />
                </div>
                
                {/* View Toggle */}
                <div className="flex items-center gap-0.5 bg-[#18181b] rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-[#252528] text-white' 
                        : 'text-[#555] hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-[#252528] text-white' 
                        : 'text-[#555] hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Display */}
            {filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-[#18181b] rounded-lg flex items-center justify-center mb-4">
                  <Grid3X3 className="w-8 h-8 text-[#444]" />
                </div>
                <h3 className="text-base font-medium text-white mb-2">
                  {searchQuery ? 'No workflows found' : 'No workflows yet'}
                </h3>
                <p className="text-sm text-[#666] mb-4">
                  {searchQuery ? 'Try adjusting your search' : 'Create your first workflow to get started'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={onCreateNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f6ffa8] text-[#0d0d12] rounded-lg font-medium text-sm hover:bg-[#f8ffb8] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Workflow
                  </button>
                )}
              </div>
            ) : viewMode === 'list' ? (
              /* List View */
              <div className="w-full">
                {/* Table Header */}
                <div className="grid grid-cols-[auto_1fr_100px_140px_120px] gap-4 px-4 py-2 text-xs text-[#666] border-b border-[#1a1a1f]">
                  <div className="w-16"></div>
                  <div>Name</div>
                  <div>Files</div>
                  <div className="flex items-center gap-1">
                    Last modified
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div>Created at</div>
                </div>
                
                {/* Table Rows */}
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => onOpenWorkflow(project.id)}
                    className="grid grid-cols-[auto_1fr_100px_140px_120px] gap-4 px-4 py-3 items-center hover:bg-[#18181b] cursor-pointer transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-12 bg-[#18181b] rounded-lg flex items-center justify-center overflow-hidden">
                      <Sparkles className="w-5 h-5 text-[#444]" />
                    </div>
                    {/* Name */}
                    <div className="text-sm text-white truncate">{project.name || 'untitled'}</div>
                    {/* Files count */}
                    <div className="text-sm text-[#666]">-</div>
                    {/* Last Modified */}
                    <div className="text-sm text-[#666]">{formatDateShort(project.updatedAt)}</div>
                    {/* Created At */}
                    <div className="text-sm text-[#666]">{formatDateShort(project.createdAt)}</div>
                  </div>
                ))}
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => onOpenWorkflow(project.id)}
                    className="group cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-4/3 bg-[#18181b] rounded-lg mb-2 flex items-center justify-center overflow-hidden group-hover:ring-1 group-hover:ring-[#333] transition-all">
                      <Sparkles className="w-10 h-10 text-[#333] group-hover:text-[#444]" />
                    </div>
                    {/* Content */}
                    <h3 className="text-sm font-medium text-white mb-0.5 truncate">
                      {project.name || 'untitled'}
                    </h3>
                    <p className="text-xs text-[#666]">
                      {formatDate(project.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
