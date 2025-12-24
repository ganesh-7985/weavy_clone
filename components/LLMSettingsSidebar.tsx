'use client';

import { useCallback } from 'react';
import { ChevronDown, HelpCircle, Minus, Plus } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { LLMNodeData, GEMINI_MODELS, GeminiModel } from '@/types';

export function LLMSettingsSidebar() {
  const { nodes, selectedLLMNodeId, updateNodeData, setSelectedLLMNode } = useWorkflowStore();
  
  const selectedNode = nodes.find(node => node.id === selectedLLMNodeId);
  const nodeData = selectedNode?.data as LLMNodeData | undefined;

  const handleModelChange = useCallback((model: GeminiModel) => {
    if (selectedLLMNodeId) {
      updateNodeData(selectedLLMNodeId, { model });
    }
  }, [selectedLLMNodeId, updateNodeData]);

  const handleTemperatureChange = useCallback((temperature: number) => {
    if (selectedLLMNodeId) {
      updateNodeData(selectedLLMNodeId, { temperature: Math.max(0, Math.min(1, temperature)) });
    }
  }, [selectedLLMNodeId, updateNodeData]);

  const handleThinkingChange = useCallback((thinking: boolean) => {
    if (selectedLLMNodeId) {
      updateNodeData(selectedLLMNodeId, { thinking });
    }
  }, [selectedLLMNodeId, updateNodeData]);

  if (!selectedLLMNodeId || !nodeData) {
    return null;
  }

  const selectedModel = GEMINI_MODELS.find(m => m.value === nodeData.model);

  return (
    <div className="w-72 h-full bg-[#212126] border-l border-[rgba(255,255,255,0.12)] flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[rgba(255,255,255,0.12)]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[rgba(255,255,255,0.4)]">Tasks</span>
          <ChevronDown className="w-4 h-4 text-[rgba(255,255,255,0.4)]" />
        </div>
      </div>

      {/* Node Title */}
      <div className="px-4 py-4 border-b border-[rgba(255,255,255,0.12)]">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-white">Any LLM</span>
          <span className="text-xs text-[rgba(255,255,255,0.4)]">✱ 1</span>
        </div>
      </div>

      {/* Settings */}
      <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {/* Model Name */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm text-white">Model Name</span>
            <HelpCircle className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
          </div>
          <div className="relative">
            <select
              value={nodeData.model}
              onChange={(e) => handleModelChange(e.target.value as GeminiModel)}
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

        {/* Thinking */}
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleThinkingChange(!nodeData.thinking)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                nodeData.thinking
                  ? 'bg-[#f6ffa8] border-[#f6ffa8]'
                  : 'bg-transparent border-[#343438] hover:border-[rgba(255,255,255,0.4)]'
              }`}
            >
              {nodeData.thinking && (
                <svg className="w-3 h-3 text-[#121212]" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-1">
              <span className="text-sm text-white">Thinking</span>
              <HelpCircle className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center gap-1 mb-3">
            <span className="text-sm text-white">Temperature</span>
            <HelpCircle className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={nodeData.temperature}
              onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-[#343438] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="w-12 px-2 py-1 bg-[#212126] border border-[#343438] rounded text-sm text-white text-center">
              {nodeData.temperature}
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Run Selected */}
      <div className="px-4 py-4 border-t border-[rgba(255,255,255,0.12)]">
        <div className="text-xs text-[rgba(255,255,255,0.4)] mb-3">Run selected nodes</div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[rgba(255,255,255,0.64)]">Runs</span>
          <div className="flex items-center gap-2">
            <button className="w-6 h-6 flex items-center justify-center bg-[#212126] border border-[#343438] rounded hover:border-[rgba(255,255,255,0.2)] transition-colors">
              <Minus className="w-3 h-3 text-white" />
            </button>
            <span className="w-8 text-center text-sm text-white">1</span>
            <button className="w-6 h-6 flex items-center justify-center bg-[#212126] border border-[#343438] rounded hover:border-[rgba(255,255,255,0.2)] transition-colors">
              <Plus className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[rgba(255,255,255,0.4)]">Total cost</span>
          <span className="text-sm text-[rgba(255,255,255,0.64)]">✱ 1 credits</span>
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f6ffa8] text-[#121212] rounded-lg text-sm font-medium hover:bg-[#f6ffa8]/90 transition-colors">
          <span className="rotate-90">→</span>
          Run selected
        </button>
      </div>
    </div>
  );
}
