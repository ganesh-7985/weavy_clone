import { create } from 'zustand';
import { 
  Connection, 
  EdgeChange, 
  NodeChange, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges 
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { 
  WorkflowNode, 
  WorkflowEdge, 
  TextNodeData, 
  ImageNodeData, 
  LLMNodeData,
  PromptNodeData,
  FileNodeData,
  PromptConcatenatorNodeData,
  ImageDescriberNodeData,
  HistoryState,
  Workflow,
  GeminiModel
} from '@/types';

const MAX_HISTORY = 50;

interface WorkflowState {
  // Workflow data
  workflowId: string;
  workflowName: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  
  // History for undo/redo
  history: HistoryState[];
  historyIndex: number;
  
  // Sidebar state
  isSidebarCollapsed: boolean;
  selectedLLMNodeId: string | null;
  selectedImageDescriberNodeId: string | null;
  
  // Actions
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  // Node operations
  addTextNode: (position: { x: number; y: number }) => void;
  addImageNode: (position: { x: number; y: number }) => void;
  addLLMNode: (position: { x: number; y: number }) => void;
  addPromptNode: (position: { x: number; y: number }) => void;
  addFileNode: (position: { x: number; y: number }) => void;
  addPromptConcatenatorNode: (position: { x: number; y: number }) => void;
  addImageDescriberNode: (position: { x: number; y: number }) => void;
  addPromptEnhancerNode: (position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<TextNodeData | ImageNodeData | LLMNodeData | PromptNodeData | FileNodeData | PromptConcatenatorNodeData | ImageDescriberNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  
  // History operations
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Sidebar
  toggleSidebar: () => void;
  setSelectedLLMNode: (nodeId: string | null) => void;
  setSelectedImageDescriberNode: (nodeId: string | null) => void;
  
  // Workflow operations
  saveWorkflow: () => Workflow;
  loadWorkflow: (workflow: Workflow) => void;
  clearWorkflow: () => void;
  setWorkflowName: (name: string) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflowId: uuidv4(),
  workflowName: 'Untitled Workflow',
  nodes: [],
  edges: [],
  history: [],
  historyIndex: -1,
  isSidebarCollapsed: false,
  selectedLLMNodeId: null,
  selectedImageDescriberNodeId: null,
  
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[],
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    // Determine edge color based on source handle type
    // Green (#6eddb3) for file/image outputs, Pink (#f1a0fa) for text/prompt outputs
    const sourceNode = get().nodes.find(n => n.id === connection.source);
    const isFileOrImageSource = sourceNode?.type === 'file' || sourceNode?.type === 'image';
    const edgeColor = isFileOrImageSource ? '#6eddb3' : '#f1a0fa';
    
    const newEdge: WorkflowEdge = {
      ...connection,
      id: uuidv4(),
      source: connection.source,
      target: connection.target,
      animated: false,
      style: { stroke: edgeColor, strokeWidth: 2 },
    };
    set({
      edges: addEdge(newEdge, get().edges) as WorkflowEdge[],
    });
    get().saveToHistory();
  },
  
  addTextNode: (position) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: 'text',
      position,
      data: {
        label: 'Text Input',
        text: '',
      } as TextNodeData,
    };
    set({ nodes: [...get().nodes, newNode] });
    get().saveToHistory();
  },
  
  addImageNode: (position) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: 'image',
      position,
      data: {
        label: 'Image Input',
        imageUrl: null,
        imageBase64: null,
        fileName: null,
      } as ImageNodeData,
    };
    set({ nodes: [...get().nodes, newNode] });
    get().saveToHistory();
  },
  
  addLLMNode: (position) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: 'llm',
      position,
      data: {
        label: 'Run Any LLM',
        model: 'gemini-3-flash-preview' as GeminiModel,
        systemPrompt: '',
        userPrompt: '',
        output: '',
        isLoading: false,
        error: null,
        temperature: 0,
        thinking: false,
      } as LLMNodeData,
    };
    set({ nodes: [...get().nodes, newNode] });
    get().saveToHistory();
  },
  
  addPromptNode: (position) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: 'prompt',
      position,
      data: {
        label: 'Prompt',
        text: '',
      } as PromptNodeData,
    };
    set({ nodes: [...get().nodes, newNode] });
    get().saveToHistory();
  },
  
  addFileNode: (position) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: 'file',
      position,
      data: {
        label: 'File',
        fileUrl: null,
        fileBase64: null,
        fileName: null,
        fileType: null,
        linkUrl: null,
      } as FileNodeData,
    };
    set({ nodes: [...get().nodes, newNode] });
    get().saveToHistory();
  },
  
  addPromptConcatenatorNode: (position) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: 'promptConcatenator',
      position,
      data: {
        label: 'Prompt Concatenator',
        texts: ['', ''],
      } as PromptConcatenatorNodeData,
    };
    set({ nodes: [...get().nodes, newNode] });
    get().saveToHistory();
  },
  
  addImageDescriberNode: (position) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: 'imageDescriber',
      position,
      data: {
        label: 'Image Describer',
        output: '',
        isLoading: false,
        error: null,
        imageInputCount: 1,
      } as ImageDescriberNodeData,
    };
    set({ nodes: [...get().nodes, newNode] });
    get().saveToHistory();
  },
  
  addPromptEnhancerNode: (position) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: 'promptEnhancer',
      position,
      data: {
        label: 'Prompt Enhancer',
        output: '',
        isLoading: false,
        error: null,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
    get().saveToHistory();
  },
  
  
  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ) as WorkflowNode[],
    });
  },
  
  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
    get().saveToHistory();
  },
  
  saveToHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
  
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      set({
        nodes: prevState.nodes,
        edges: prevState.edges,
        historyIndex: historyIndex - 1,
      });
    }
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        nodes: nextState.nodes,
        edges: nextState.edges,
        historyIndex: historyIndex + 1,
      });
    }
  },
  
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
  
  toggleSidebar: () => set({ isSidebarCollapsed: !get().isSidebarCollapsed }),
  
  setSelectedLLMNode: (nodeId) => set({ 
    selectedLLMNodeId: nodeId,
    selectedImageDescriberNodeId: nodeId ? null : get().selectedImageDescriberNodeId 
  }),
  
  setSelectedImageDescriberNode: (nodeId) => set({ 
    selectedImageDescriberNodeId: nodeId,
    selectedLLMNodeId: nodeId ? null : get().selectedLLMNodeId 
  }),
  
  saveWorkflow: () => {
    const { workflowId, workflowName, nodes, edges } = get();
    const workflow: Workflow = {
      id: workflowId,
      name: workflowName,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return workflow;
  },
  
  loadWorkflow: (workflow) => {
    set({
      workflowId: workflow.id,
      workflowName: workflow.name,
      nodes: workflow.nodes,
      edges: workflow.edges,
      history: [{ nodes: workflow.nodes, edges: workflow.edges }],
      historyIndex: 0,
    });
  },
  
  clearWorkflow: () => {
    set({
      workflowId: uuidv4(),
      workflowName: 'Untitled Workflow',
      nodes: [],
      edges: [],
      history: [],
      historyIndex: -1,
    });
  },
  
  setWorkflowName: (name) => set({ workflowName: name }),
}));
