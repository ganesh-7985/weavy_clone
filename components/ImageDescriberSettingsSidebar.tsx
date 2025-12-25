'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Minus, Plus, Share2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { GEMINI_MODELS, GeminiModel } from '@/types';

interface ImageDescriberSettingsSidebarProps {
  nodeId: string;
  nodeType: 'imageDescriber' | 'promptEnhancer';
}

export function ImageDescriberSettingsSidebar({ nodeId, nodeType }: ImageDescriberSettingsSidebarProps) {
  const { nodes } = useWorkflowStore();
  const [model, setModel] = useState<GeminiModel>('gemini-3-flash-preview');
  const [instructions, setInstructions] = useState(
    nodeType === 'imageDescriber' 
      ? 'You are an expert image analyst tasked with providing detailed accurate and helpful descriptions of images. Your goal is to make visual content accessible through clear comprehensive text'
      : 'You are an expert prompt engineer. Enhance the given prompt to be more detailed and effective.'
  );
  const [runs, setRuns] = useState(1);
  
  const selectedNode = nodes.find(node => node.id === nodeId);

  if (!nodeId || !selectedNode) {
    return null;
  }

  const nodeTitle = nodeType === 'imageDescriber' ? 'Image Describer' : 'Prompt Enhancer';

  return (
    <div className="w-72 h-full bg-[#212126] border-l border-[rgba(255,255,255,0.12)] flex flex-col">
      {/* Top Bar - Credits and Share */}
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.12)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white">✱ 54.6</span>
          <span className="text-xs px-2 py-0.5 bg-[#353539] rounded text-[rgba(255,255,255,0.6)]">Low credits</span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>

      {/* Tasks Dropdown */}
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.12)]">
        <button className="flex items-center gap-2 text-sm text-white">
          Tasks
          <ChevronDown className="w-4 h-4 text-[rgba(255,255,255,0.4)]" />
        </button>
      </div>

      {/* Node Title */}
      <div className="px-4 py-4 border-b border-[rgba(255,255,255,0.12)]">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-white">{nodeTitle}</span>
          <span className="text-xs text-[rgba(255,255,255,0.4)]">✱ 1</span>
        </div>
      </div>

      {/* Settings */}
      <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {/* Model Name */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm text-[rgba(255,255,255,0.6)]">Model Name</span>
            <HelpCircle className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
          </div>
          <div className="relative">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as GeminiModel)}
              className="w-full px-3 py-2 bg-[#212126] border border-[#343438] rounded-lg text-sm text-white appearance-none cursor-pointer hover:border-[rgba(255,255,255,0.2)] focus:outline-none focus:border-[#f6ffa8] transition-colors"
            >
              {GEMINI_MODELS.map((model) => (
                <option key={model.value} value={model.value}>
                  google/{model.value}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(255,255,255,0.4)] pointer-events-none" />
          </div>
        </div>

        {/* Model Instructions */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm text-[rgba(255,255,255,0.6)]">Model instructions</span>
            <HelpCircle className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
          </div>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full h-40 px-3 py-2 bg-[#1a1a1f] border border-[#2a2a35] rounded-lg text-sm text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors resize-none"
            placeholder="Enter model instructions..."
          />
        </div>
      </div>

      {/* Footer - Run Selected */}
      <div className="px-4 py-4 border-t border-[rgba(255,255,255,0.12)]">
        <div className="text-xs text-[rgba(255,255,255,0.4)] mb-3">Run selected nodes</div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[rgba(255,255,255,0.6)]">Runs</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setRuns(Math.max(1, runs - 1))}
              className="w-6 h-6 flex items-center justify-center bg-[#212126] border border-[#343438] rounded hover:border-[rgba(255,255,255,0.2)] transition-colors"
            >
              <Minus className="w-3 h-3 text-white" />
            </button>
            <span className="w-8 text-center text-sm text-white">{runs}</span>
            <button 
              onClick={() => setRuns(runs + 1)}
              className="w-6 h-6 flex items-center justify-center bg-[#212126] border border-[#343438] rounded hover:border-[rgba(255,255,255,0.2)] transition-colors"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[rgba(255,255,255,0.6)]">Total cost</span>
          <span className="text-sm text-white">✱ {runs} credits</span>
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f6ffa8] text-[#121212] rounded-lg text-sm font-medium hover:bg-[#f6ffa8]/90 transition-colors">
          <span>→</span>
          Run selected
        </button>
      </div>
    </div>
  );
}
