import { saveAIConfig, loadAIConfig, clearAIConfig, getStoredAIConfig } from './aiConfigStorage';
import { AIConfig } from '../config/ai';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = mockLocalStorage as any;

describe('AI Configuration Storage', () => {
  const mockConfig: AIConfig = {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    apiKey: 'test-api-key',
    maxTokens: 1000,
    temperature: 0.7,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    process.env.REACT_APP_AI_PROVIDER = undefined;
    process.env.REACT_APP_AI_MODEL = undefined;
    process.env.REACT_APP_AI_API_KEY = undefined;
    process.env.REACT_APP_AI_BASE_URL = undefined;
    process.env.REACT_APP_AI_MAX_TOKENS = undefined;
    process.env.REACT_APP_AI_TEMPERATURE = undefined;
  });

  describe('saveAIConfig', () => {
    it('should save configuration to localStorage', () => {
      saveAIConfig(mockConfig);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'mindmap-ai-config',
        JSON.stringify(mockConfig)
      );
    });

    it('should not save when window is undefined', () => {
      const originalWindow = global.window;
      delete (global as any).window;
      
      saveAIConfig(mockConfig);
      
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      
      global.window = originalWindow;
    });
  });

  describe('loadAIConfig', () => {
    it('should load configuration from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockConfig));
      
      const result = loadAIConfig();
      
      expect(result).toEqual(mockConfig);
    });

    it('should return null when no configuration is stored', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = loadAIConfig();
      
      expect(result).toBeNull();
    });

    it('should return null when localStorage throws error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const result = loadAIConfig();
      
      expect(result).toBeNull();
    });

    it('should merge with environment variables prioritizing env for secure values', () => {
      process.env.REACT_APP_AI_API_KEY = 'env-api-key';
      process.env.REACT_APP_AI_MODEL = 'env-model';
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        ...mockConfig,
        apiKey: 'stored-api-key',
        model: 'stored-model',
      }));
      
      const result = loadAIConfig();
      
      expect(result).toEqual({
        provider: 'openai',
        model: 'stored-model',
        apiKey: 'env-api-key', // Environment takes precedence
        maxTokens: 1000,
        temperature: 0.7,
      });
    });

    it('should not load when window is undefined', () => {
      const originalWindow = global.window;
      delete (global as any).window;
      
      const result = loadAIConfig();
      
      expect(result).toBeNull();
      
      global.window = originalWindow;
    });
  });

  describe('clearAIConfig', () => {
    it('should remove configuration from localStorage', () => {
      clearAIConfig();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('mindmap-ai-config');
    });

    it('should not clear when window is undefined', () => {
      const originalWindow = global.window;
      delete (global as any).window;
      
      clearAIConfig();
      
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
      
      global.window = originalWindow;
    });
  });

  describe('getStoredAIConfig', () => {
    it('should return stored configuration when available', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockConfig));
      
      const result = getStoredAIConfig();
      
      expect(result).toEqual(mockConfig);
    });

    it('should fallback to environment variables when no stored config', () => {
      process.env.REACT_APP_AI_PROVIDER = 'anthropic';
      process.env.REACT_APP_AI_MODEL = 'claude-3-sonnet-20240229';
      process.env.REACT_APP_AI_API_KEY = 'env-api-key';
      process.env.REACT_APP_AI_MAX_TOKENS = '2000';
      process.env.REACT_APP_AI_TEMPERATURE = '0.5';
      
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = getStoredAIConfig();
      
      expect(result).toEqual({
        provider: 'anthropic',
        model: 'claude-3-sonnet-20240229',
        apiKey: 'env-api-key',
        maxTokens: 2000,
        temperature: 0.5,
      });
    });

    it('should use default values when no stored config or env vars', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = getStoredAIConfig();
      
      expect(result).toEqual({
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        apiKey: undefined,
        maxTokens: 1000,
        temperature: 0.7,
      });
    });

    it('should handle environment variable parsing correctly', () => {
      process.env.REACT_APP_AI_MAX_TOKENS = '1500';
      process.env.REACT_APP_AI_TEMPERATURE = '1.2';
      
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = getStoredAIConfig();
      
      expect(result.maxTokens).toBe(1500);
      expect(result.temperature).toBe(1.2);
    });

    it('should handle invalid environment variable values', () => {
      process.env.REACT_APP_AI_MAX_TOKENS = 'invalid';
      process.env.REACT_APP_AI_TEMPERATURE = 'invalid';
      
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = getStoredAIConfig();
      
      expect(result.maxTokens).toBeNaN();
      expect(result.temperature).toBeNaN();
    });
  });
});