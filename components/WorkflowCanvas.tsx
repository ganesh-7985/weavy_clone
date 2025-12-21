'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MousePointer2, Hand, Undo2, Redo2, ChevronDown } from 'lucide-react';

import { TextNode, ImageNode, LLMNode, PromptNode, FileNode } from '@/components/nodes';
import { useWorkflowStore } from '@/store/workflowStore';

const nodeTypes = {
  text: TextNode,
  image: ImageNode,
  llm: LLMNode,
  prompt: PromptNode,
  file: FileNode,
};

function WorkflowCanvasInner() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    addPromptNode,
    addFileNode,
    addLLMNode,
    addTextNode,
    addImageNode,
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fitView, getZoom, screenToFlowPosition } = useReactFlow();
  const isInitialized = useRef(false);
  const [tool, setTool] = useState<'select' | 'pan'>('select');
  const [zoom, setZoom] = useState(100);

  // Update zoom display
  useEffect(() => {
    const interval = setInterval(() => {
      setZoom(Math.round(getZoom() * 100));
    }, 100);
    return () => clearInterval(interval);
  }, [getZoom]);

  // Fit view on initial load
  useEffect(() => {
    if (nodes.length > 0 && !isInitialized.current) {
      setTimeout(() => {
        fitView({ padding: 0.2 });
        isInitialized.current = true;
      }, 100);
    }
  }, [nodes.length, fitView]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't delete nodes if user is typing in an input/textarea
      const activeElement = document.activeElement;
      const isTyping = activeElement?.tagName === 'INPUT' || 
                       activeElement?.tagName === 'TEXTAREA' ||
                       activeElement?.getAttribute('contenteditable') === 'true';

      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping) {
        const selectedNodes = nodes.filter((node) => node.selected);
        selectedNodes.forEach((node) => deleteNode(node.id));
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !isTyping) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      // Tool shortcuts - only when not typing
      if (!isTyping) {
        if (e.key === 'v') setTool('select');
        if (e.key === 'h') setTool('pan');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, deleteNode, undo, redo]);

  const handleNodeDragStop = useCallback(() => {
    saveToHistory();
  }, [saveToHistory]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;

      const { nodeType, model } = JSON.parse(data);
      
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      switch (nodeType) {
        case 'prompt':
          addPromptNode(position);
          break;
        case 'file':
          addFileNode(position);
          break;
        case 'llm':
          addLLMNode(position);
          break;
        case 'text':
          addTextNode(position);
          break;
        case 'image':
          addImageNode(position);
          break;
      }
    },
    [screenToFlowPosition, addPromptNode, addFileNode, addLLMNode, addTextNode, addImageNode]
  );

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full relative" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#a855f7', strokeWidth: 2 },
        }}
        connectionLineStyle={{ stroke: '#a855f7', strokeWidth: 2 }}
        proOptions={{ hideAttribution: true }}
        panOnDrag={tool === 'pan' ? true : [1, 2]}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        selectionOnDrag={tool === 'select'}
        minZoom={0.1}
        maxZoom={2}
        className="bg-[#0d0d12]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={40}
          size={2}
          color="#4a4a55"
        />
      </ReactFlow>

      {/* Floating Bottom Toolbar - Weavy Style */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 bg-[#1e1e1e] border border-[#333333] rounded-lg shadow-xl">
        {/* Select Tool */}
        <button
          onClick={() => setTool('select')}
          className={`p-2 rounded transition-all ${
            tool === 'select'
              ? 'bg-[#c8e600] text-[#0d0d0d]'
              : 'text-[#888888] hover:text-white hover:bg-[#252525]'
          }`}
          title="Select (V)"
        >
          <MousePointer2 className="w-4 h-4" />
        </button>

        {/* Pan Tool */}
        <button
          onClick={() => setTool('pan')}
          className={`p-2 rounded transition-all ${
            tool === 'pan'
              ? 'bg-[#c8e600] text-[#0d0d0d]'
              : 'text-[#888888] hover:text-white hover:bg-[#252525]'
          }`}
          title="Pan (H)"
        >
          <Hand className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#333333] mx-1" />

        {/* Undo */}
        <button
          onClick={undo}
          disabled={!canUndo()}
          className="p-2 rounded text-[#888888] hover:text-white hover:bg-[#252525] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Undo (⌘Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          onClick={redo}
          disabled={!canRedo()}
          className="p-2 rounded text-[#888888] hover:text-white hover:bg-[#252525] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Redo (⌘⇧Z)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#333333] mx-1" />

        {/* Zoom */}
        <button
          onClick={() => fitView({ padding: 0.2 })}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[#888888] hover:text-white hover:bg-[#252525] transition-all"
        >
          <span>{zoom}%</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
}
