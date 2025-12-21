'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Grid3X3, LayoutGrid, FolderOpen, Users, AppWindow, MessageCircle, Sparkles } from 'lucide-react';
import { getAllWorkflows } from '@/lib/storage';
import { Workflow } from '@/types';

interface ProjectsPageProps {
  onOpenWorkflow: (workflowId: string) => void;
  onCreateNew: () => void;
  onLoadTemplate?: () => void;
}

// Template data
const WORKFLOW_TEMPLATES = [
  { id: 'product-listing', name: 'Product Listing', description: 'Generate e-commerce product listings' },
  { id: 'text-summarizer', name: 'Text Summarizer', description: 'Summarize long documents' },
  { id: 'image-analyzer', name: 'Image Analyzer', description: 'Analyze and describe images' },
  { id: 'content-writer', name: 'Content Writer', description: 'Generate blog posts and articles' },
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

  return (
    <div className="h-full w-full bg-[#0d0d12] flex">
      {/* Left Sidebar */}
      <div className="w-52 h-full bg-[#0d0d12] border-r border-[#1a1a1f] flex flex-col py-4">
        {/* User */}
        <div className="px-4 mb-4">
          <button className="flex items-center gap-2 text-white text-sm">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
            <span className="truncate">User</span>
            <span className="text-[#666666]">▾</span>
          </button>
        </div>

        {/* Create New Button */}
        <div className="px-3 mb-4">
          <button
            onClick={onCreateNew}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f6ffa8] text-[#0d0d12] rounded-lg font-medium text-sm hover:bg-[#f8ffb8] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New File
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 px-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-white text-sm rounded-lg hover:bg-[#1a1a1f] transition-colors">
            <FolderOpen className="w-4 h-4" />
            My Files
            <Plus className="w-3.5 h-3.5 ml-auto text-[#666666]" />
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-[#888888] text-sm rounded-lg hover:bg-[#1a1a1f] transition-colors">
            <Users className="w-4 h-4" />
            Shared with me
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-[#888888] text-sm rounded-lg hover:bg-[#1a1a1f] transition-colors">
            <AppWindow className="w-4 h-4" />
            Apps
          </button>
        </div>

        {/* Bottom */}
        <div className="px-2 mt-auto">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-[#888888] text-sm rounded-lg hover:bg-[#1a1a1f] transition-colors">
            <MessageCircle className="w-4 h-4" />
            Discord
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with workspace name */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#1a1a1f]">
          <h1 className="text-sm text-[#888888]">User&apos;s Workspace</h1>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#f6ffa8] text-[#0d0d12] rounded-lg font-medium text-sm hover:bg-[#f8ffb8] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New File
          </button>
        </div>

        {/* Workflow Library Section */}
        <div className="px-6 py-4">
          <div className="bg-[#1a1a1f] rounded-xl p-4 mb-6">
            {/* Tabs */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setActiveTab('library')}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'library'
                    ? 'bg-[#252528] text-white'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                Workflow library
              </button>
              <button
                onClick={() => setActiveTab('tutorials')}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'tutorials'
                    ? 'bg-[#252528] text-white'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                Tutorials
              </button>
            </div>

            {/* Template Cards */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {WORKFLOW_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={onLoadTemplate}
                  className="flex-shrink-0 w-36 cursor-pointer group"
                >
                  <div className="aspect-[4/3] bg-[#252528] rounded-lg mb-2 flex items-center justify-center border border-[#333338] group-hover:border-[#f6ffa8] transition-colors">
                    <Sparkles className="w-8 h-8 text-[#555555] group-hover:text-[#f6ffa8]" />
                  </div>
                  <p className="text-xs text-white truncate">{template.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Files Header */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">My files</h2>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-48 pl-10 pr-4 py-1.5 bg-[#1a1a1f] border border-[#2a2a30] rounded-lg text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#3a3a45] transition-colors"
                />
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center border border-[#2a2a30] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-[#2a2a30] text-white' 
                      : 'text-[#666666] hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-[#2a2a30] text-white' 
                      : 'text-[#666666] hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-[#1a1a1f] rounded-lg flex items-center justify-center mb-4">
                <Grid3X3 className="w-8 h-8 text-[#555555]" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {searchQuery ? 'No workflows found' : 'No workflows yet'}
              </h3>
              <p className="text-sm text-[#888888] mb-4">
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
          ) : (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onOpenWorkflow(project.id)}
                  className="group cursor-pointer bg-[#1a1a1f] border border-[#2a2a30] rounded-lg overflow-hidden hover:border-[#3a3a45] transition-all"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-[#14141a] flex items-center justify-center">
                    <Grid3X3 className="w-10 h-10 text-[#3a3a45]" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-white mb-0.5">
                      {project.name || 'untitled'}
                    </h3>
                    <p className="text-xs text-[#666666]">
                      {formatDate(project.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
