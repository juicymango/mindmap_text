import { MindNode } from '../types';

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'local';
  model: string;
  apiKey?: string;
  baseUrl?: string;
  maxTokens: number;
  temperature: number;
}

export const getAIConfig = (): AIConfig => {
  return {
    provider: (process.env.REACT_APP_AI_PROVIDER as 'openai' | 'anthropic' | 'local') || 'openai',
    model: process.env.REACT_APP_AI_MODEL || 'gpt-3.5-turbo',
    apiKey: process.env.REACT_APP_AI_API_KEY,
    baseUrl: process.env.REACT_APP_AI_BASE_URL,
    maxTokens: parseInt(process.env.REACT_APP_AI_MAX_TOKENS || '1000'),
    temperature: parseFloat(process.env.REACT_APP_AI_TEMPERATURE || '0.7'),
  };
};

export const validateAIConfig = (config: AIConfig): boolean => {
  if (!config.provider) return false;
  if (!config.model) return false;
  if (config.provider !== 'local' && !config.apiKey) return false;
  if (config.maxTokens <= 0) return false;
  if (config.temperature < 0 || config.temperature > 2) return false;
  return true;
};

export const sanitizeAIResponse = (response: string): string => {
  return response
    .replace(/api[_-]?key/gi, '[API_KEY]')
    .replace(/secret/gi, '[SECRET]')
    .replace(/password/gi, '[PASSWORD]')
    .replace(/token/gi, '[TOKEN]');
};

export const getNodePath = (root: MindNode, path: number[]): MindNode[] => {
  const nodes: MindNode[] = [];
  let currentNode: MindNode | null = root;
  
  for (let i = 0; i < path.length; i++) {
    if (!currentNode) break;
    nodes.push(currentNode);
    const index = path[i];
    if (currentNode.children && currentNode.children[index]) {
      currentNode = currentNode.children[index];
    } else {
      currentNode = null;
    }
  }
  
  return nodes;
};