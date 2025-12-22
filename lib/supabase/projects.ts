import { createClient } from './client';
import { Workflow } from '@/types';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  workflow_data: Workflow;
  created_at: string;
  updated_at: string;
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

export async function createProject(workflow: Workflow): Promise<Project | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      id: workflow.id,
      user_id: user.id,
      name: workflow.name,
      description: workflow.description || null,
      workflow_data: workflow,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return data;
}

export async function updateProject(id: string, workflow: Workflow): Promise<Project | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .update({
      name: workflow.name,
      description: workflow.description || null,
      workflow_data: workflow,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  return data;
}

export async function deleteProject(id: string): Promise<boolean> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }

  return true;
}

export async function saveProject(workflow: Workflow): Promise<Project | null> {
  const existing = await getProjectById(workflow.id);
  
  if (existing) {
    return updateProject(workflow.id, workflow);
  } else {
    return createProject(workflow);
  }
}
