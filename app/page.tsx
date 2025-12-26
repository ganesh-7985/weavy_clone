'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { WorkflowCanvas } from '@/components/WorkflowCanvas';
import { ProjectsPage } from '@/components/ProjectsPage';
import { LLMSettingsSidebar } from '@/components/LLMSettingsSidebar';
import { ImageDescriberSettingsSidebar } from '@/components/ImageDescriberSettingsSidebar';
import { useWorkflowStore } from '@/store/workflowStore';
import { createProductListingGeneratorWorkflow, createProductContentPipelineWorkflow } from '@/lib/templates';
import {
  saveWorkflowToStorage,
  exportWorkflowAsJSON,
  importWorkflowFromJSON,
  getCurrentWorkflowId,
  getWorkflowById,
  setCurrentWorkflowId,
} from '@/lib/storage';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function Home() {
  const { saveWorkflow, loadWorkflow, clearWorkflow, workflowName, selectedLLMNodeId, selectedImageDescriberNodeId, nodes } = useWorkflowStore();
  
  // Determine node type for the selected describer node
  const selectedDescriberNode = nodes.find(n => n.id === selectedImageDescriberNodeId);
  const selectedDescriberNodeType = selectedDescriberNode?.type as 'imageDescriber' | 'promptEnhancer' | undefined;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showProjects, setShowProjects] = useState(true);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      if (hash === '#canvas') {
        setShowProjects(false);
      } else {
        setShowProjects(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Check initial URL
    if (window.location.hash === '#canvas') {
      setShowProjects(false);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const currentId = getCurrentWorkflowId();
    if (currentId) {
      const workflow = getWorkflowById(currentId);
      if (workflow) {
        loadWorkflow(workflow);
      }
    }
    setIsLoaded(true);
  }, [loadWorkflow]);

  const handleOpenWorkflow = useCallback((workflowId: string) => {
    const workflow = getWorkflowById(workflowId);
    if (workflow) {
      loadWorkflow(workflow);
      setCurrentWorkflowId(workflowId);
      setShowProjects(false);
      window.history.pushState({ view: 'canvas' }, '', '#canvas');
      showToast('Workflow opened successfully!', 'success');
    }
  }, [loadWorkflow, showToast]);

  const handleCreateNew = useCallback(() => {
    const newWorkflow = {
      id: uuidv4(),
      name: 'untitled',
      description: 'New workflow',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    clearWorkflow();
    loadWorkflow(newWorkflow);
    setCurrentWorkflowId(newWorkflow.id);
    setShowProjects(false);
    window.history.pushState({ view: 'canvas' }, '', '#canvas');
  }, [clearWorkflow, loadWorkflow]);

  const handleBackToProjects = useCallback(() => {
    const workflow = saveWorkflow();
    saveWorkflowToStorage(workflow);
    setShowProjects(true);
    window.history.pushState({ view: 'projects' }, '', '/');
  }, [saveWorkflow]);

  const handleSave = useCallback(() => {
    const workflow = saveWorkflow();
    saveWorkflowToStorage(workflow);
    showToast('Workflow saved successfully!', 'success');
  }, [saveWorkflow, showToast]);

  const handleExport = useCallback(() => {
    const workflow = saveWorkflow();
    const json = exportWorkflowAsJSON(workflow);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Workflow exported successfully!', 'success');
  }, [saveWorkflow, showToast]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const json = reader.result as string;
        const workflow = importWorkflowFromJSON(json);
        if (workflow) {
          loadWorkflow(workflow);
          showToast('Workflow imported successfully!', 'success');
        } else {
          showToast('Failed to import workflow. Invalid format.', 'error');
        }
      };
      reader.readAsText(file);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [loadWorkflow, showToast]
  );

  const handleLoadTemplate = useCallback((templateId: string) => {
    let workflowName = 'Template';
    const workflow = (() => {
      switch (templateId) {
        case 'product-content-pipeline':
          workflowName = 'Product Content Pipeline';
          return createProductContentPipelineWorkflow();
        default:
          workflowName = 'Product Listing Generator';
          return createProductListingGeneratorWorkflow();
      }
    })();

    loadWorkflow(workflow);
    setCurrentWorkflowId(workflow.id);
    setShowProjects(false);
    window.history.pushState({ view: 'canvas' }, '', '#canvas');
    showToast(`${workflowName} template loaded!`, 'success');
  }, [loadWorkflow, showToast]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0d0d12]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#f6ffa8] border-t-transparent" />
          <span className="text-xs text-[#888888]">Loading...</span>
        </div>
      </div>
    );
  }

  if (showProjects) {
    return (
      <div className="h-screen w-screen bg-[#0d0d12]">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <ProjectsPage
          onOpenWorkflow={handleOpenWorkflow}
          onCreateNew={handleCreateNew}
          onLoadTemplate={handleLoadTemplate}
        />

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg shadow-xl text-xs ${
                toast.type === 'success'
                  ? 'bg-[#1e1e1e] border border-[#f6ffa8]/30 text-[#f6ffa8]'
                  : 'bg-[#1e1e1e] border border-red-500/30 text-red-400'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-1 hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d0d12]">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Sidebar */}
      <Sidebar
        onExport={handleExport}
        onImport={handleImport}
        onSave={handleSave}
        onLoadTemplate={() => handleLoadTemplate('product-content-pipeline')}
        onBackToProjects={handleBackToProjects}
        workflowName={workflowName}
      />

      <WorkflowCanvas />

      {selectedLLMNodeId && <LLMSettingsSidebar />}
      
      {selectedImageDescriberNodeId && selectedDescriberNodeType && (
        <ImageDescriberSettingsSidebar 
          nodeId={selectedImageDescriberNodeId} 
          nodeType={selectedDescriberNodeType} 
        />
      )}

      <div className="fixed bottom-16 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg shadow-xl text-xs ${
              toast.type === 'success'
                ? 'bg-[#1e1e1e] border border-[#f6ffa8]/30 text-[#f6ffa8]'
                : 'bg-[#1e1e1e] border border-red-500/30 text-red-400'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-1 hover:opacity-70 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
