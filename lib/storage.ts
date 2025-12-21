import { Workflow } from '@/types';

const WORKFLOWS_KEY = 'galaxy-ai-workflows';
const CURRENT_WORKFLOW_KEY = 'galaxy-ai-current-workflow';

export function saveWorkflowToStorage(workflow: Workflow): void {
  if (typeof window === 'undefined') return;
  
  const workflows = getAllWorkflows();
  const existingIndex = workflows.findIndex((w) => w.id === workflow.id);
  
  if (existingIndex >= 0) {
    workflows[existingIndex] = { ...workflow, updatedAt: new Date().toISOString() };
  } else {
    workflows.push(workflow);
  }
  
  localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflows));
  localStorage.setItem(CURRENT_WORKFLOW_KEY, workflow.id);
}

export function getAllWorkflows(): Workflow[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(WORKFLOWS_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data) as Workflow[];
  } catch {
    return [];
  }
}

export function getWorkflowById(id: string): Workflow | null {
  const workflows = getAllWorkflows();
  return workflows.find((w) => w.id === id) || null;
}

export function deleteWorkflowFromStorage(id: string): void {
  if (typeof window === 'undefined') return;
  
  const workflows = getAllWorkflows().filter((w) => w.id !== id);
  localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflows));
}

export function getCurrentWorkflowId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_WORKFLOW_KEY);
}

export function setCurrentWorkflowId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_WORKFLOW_KEY, id);
}

export function exportWorkflowAsJSON(workflow: Workflow): string {
  return JSON.stringify(workflow, null, 2);
}

export function importWorkflowFromJSON(json: string): Workflow | null {
  try {
    const workflow = JSON.parse(json) as Workflow;
    // Basic validation
    if (!workflow.id || !workflow.name || !Array.isArray(workflow.nodes) || !Array.isArray(workflow.edges)) {
      throw new Error('Invalid workflow format');
    }
    return workflow;
  } catch {
    return null;
  }
}
