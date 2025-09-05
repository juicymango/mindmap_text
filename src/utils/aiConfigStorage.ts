import { AIConfig } from '../config/ai';

const STORAGE_KEY = 'mindmap-ai-config';

export const saveAIConfig = (config: AIConfig): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
};

export const loadAIConfig = (): AIConfig | null => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const config = JSON.parse(stored);
        // Merge with environment variables for security
        const envConfig = {
          provider: (process.env.REACT_APP_AI_PROVIDER as 'openai' | 'anthropic' | 'local') || 'openai',
          model: process.env.REACT_APP_AI_MODEL || 'gpt-3.5-turbo',
          apiKey: process.env.REACT_APP_AI_API_KEY,
          baseUrl: process.env.REACT_APP_AI_BASE_URL,
          maxTokens: parseInt(process.env.REACT_APP_AI_MAX_TOKENS || '1000'),
          temperature: parseFloat(process.env.REACT_APP_AI_TEMPERATURE || '0.7'),
        };
        
        return {
          ...envConfig,
          ...config,
          // Never override secure values from environment with stored values
          apiKey: config.apiKey || envConfig.apiKey,
        };
      }
    } catch (error) {
      console.error('Failed to load AI config from storage:', error);
    }
  }
  return null;
};

export const clearAIConfig = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const getStoredAIConfig = (): AIConfig => {
  const storedConfig = loadAIConfig();
  if (storedConfig) {
    return storedConfig;
  }
  
  // Fallback to environment variables
  return {
    provider: (process.env.REACT_APP_AI_PROVIDER as 'openai' | 'anthropic' | 'local') || 'openai',
    model: process.env.REACT_APP_AI_MODEL || 'gpt-3.5-turbo',
    apiKey: process.env.REACT_APP_AI_API_KEY,
    baseUrl: process.env.REACT_APP_AI_BASE_URL,
    maxTokens: parseInt(process.env.REACT_APP_AI_MAX_TOKENS || '1000'),
    temperature: parseFloat(process.env.REACT_APP_AI_TEMPERATURE || '0.7'),
  };
};