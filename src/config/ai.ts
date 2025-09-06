import { MindNode } from '../types';

export type AIProvider = 'openai' | 'anthropic' | 'local' | 'deepseek' | 'glm' | 'kimi' | 'qwen';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  maxTokens: number;
  temperature: number;
}

export interface AIProviderConfig {
  name: string;
  baseUrl?: string;
  models: string[];
  defaultModel: string;
  maxTokens: {
    min: number;
    max: number;
    default: number;
  };
  temperature: {
    min: number;
    max: number;
    default: number;
  };
  supportsApiKey: boolean;
  documentation: string;
}

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o'],
    defaultModel: 'gpt-3.5-turbo',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 2, default: 0.7 },
    supportsApiKey: true,
    documentation: 'https://platform.openai.com/docs/api-reference'
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-3-sonnet-20240229', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    defaultModel: 'claude-3-sonnet-20240229',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 1, default: 0.7 },
    supportsApiKey: true,
    documentation: 'https://docs.anthropic.com/claude/docs'
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    models: ['deepseek-chat', 'deepseek-coder'],
    defaultModel: 'deepseek-chat',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 2, default: 0.7 },
    supportsApiKey: true,
    documentation: 'https://platform.deepseek.com/'
  },
  glm: {
    name: 'GLM',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: ['glm-4', 'glm-3-turbo', 'glm-4v'],
    defaultModel: 'glm-4',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 1, default: 0.7 },
    supportsApiKey: true,
    documentation: 'https://open.bigmodel.cn/'
  },
  kimi: {
    name: 'Kimi',
    baseUrl: 'https://api.moonshot.cn/v1',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    defaultModel: 'moonshot-v1-8k',
    maxTokens: { min: 1, max: 128000, default: 1000 },
    temperature: { min: 0, max: 1, default: 0.3 },
    supportsApiKey: true,
    documentation: 'https://platform.moonshot.cn/docs/'
  },
  qwen: {
    name: 'Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-max-longcontext'],
    defaultModel: 'qwen-turbo',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 2, default: 0.7 },
    supportsApiKey: true,
    documentation: 'https://help.aliyun.com/zh/dashscope/'
  },
  local: {
    name: 'Local AI',
    models: [],
    defaultModel: '',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 2, default: 0.7 },
    supportsApiKey: false,
    documentation: ''
  }
};

export const getAIConfig = (): AIConfig => {
  const provider = (process.env.REACT_APP_AI_PROVIDER as AIProvider) || 'openai';
  const providerConfig = AI_PROVIDERS[provider];
  
  return {
    provider,
    model: process.env.REACT_APP_AI_MODEL || providerConfig.defaultModel,
    apiKey: process.env.REACT_APP_AI_API_KEY,
    baseUrl: process.env.REACT_APP_AI_BASE_URL || providerConfig.baseUrl,
    maxTokens: parseInt(process.env.REACT_APP_AI_MAX_TOKENS || providerConfig.maxTokens.default.toString()),
    temperature: parseFloat(process.env.REACT_APP_AI_TEMPERATURE || providerConfig.temperature.default.toString()),
  };
};

export const validateAIConfig = (config: AIConfig): boolean => {
  if (!config.provider) return false;
  if (!config.model) return false;
  
  const providerConfig = AI_PROVIDERS[config.provider];
  if (providerConfig.supportsApiKey && !config.apiKey) return false;
  
  if (config.maxTokens < providerConfig.maxTokens.min || config.maxTokens > providerConfig.maxTokens.max) return false;
  if (config.temperature < providerConfig.temperature.min || config.temperature > providerConfig.temperature.max) return false;
  
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