import { AIService } from '../services/aiService';
import { MindNode } from '../types';

// Mock environment variables
const mockAIConfig = {
  provider: 'openai' as const,
  model: 'gpt-3.5-turbo',
  apiKey: 'test-api-key',
  maxTokens: 1000,
  temperature: 0.7,
};

// Mock global fetch
global.fetch = jest.fn();

describe('AIService', () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService(mockAIConfig);
    jest.clearAllMocks();
  });

  describe('buildPrompt', () => {
    it('should build context-aware prompts', () => {
      const request = {
        question: 'What are the benefits of remote work?',
        context: {
          selectedNode: 'Work Models',
          parentNodes: ['Company Strategy'],
          mindMapContext: 'Work Models\n\tRemote Work\n\tOffice Work\n\tHybrid',
        },
      };

      const prompt = (aiService as any).buildPrompt(request);
      
      expect(prompt).toContain('Work Models');
      expect(prompt).toContain('Company Strategy');
      expect(prompt).toContain('benefits of remote work');
      expect(prompt).toContain('Mind Map Structure');
      expect(prompt).toContain('hierarchical format');
    });

    it('should include proper formatting instructions', () => {
      const request = {
        question: 'Test question',
        context: {
          selectedNode: 'Test Node',
          parentNodes: [],
          mindMapContext: 'Test Node',
        },
      };

      const prompt = (aiService as any).buildPrompt(request);
      
      expect(prompt).toContain('Main Topic');
      expect(prompt).toContain('Subtopic 1');
      expect(prompt).toContain('Detail 1');
      expect(prompt).toContain('hierarchical format');
    });
  });

  describe('parseResponseToMindMap', () => {
    it('should parse valid hierarchical response', () => {
      const response = `Main Benefits
\tFlexibility
\tCost Savings
\tBetter Work-Life Balance
\tIncreased Productivity`;

      const structure = (aiService as any).parseResponseToMindMap(response);
      
      expect(structure).toHaveLength(4);
      expect(structure[0].text).toBe('Flexibility');
      expect(structure[0].children).toEqual([]);
    });

    it('should handle nested hierarchical structure', () => {
      const response = `Project Management
\tPlanning
\t\tRequirements Analysis
\t\tTimeline Creation
\t\tResource Allocation
\tExecution
\t\tTask Management
\t\tProgress Monitoring
\tClosing
\t\tDocumentation
\t\tReview`;

      const structure = (aiService as any).parseResponseToMindMap(response);
      
      expect(structure).toHaveLength(3);
      expect(structure[0].text).toBe('Planning');
      expect(structure[0].children).toHaveLength(3);
      expect(structure[0].children[0].text).toBe('Requirements Analysis');
    });

    it('should handle empty response', () => {
      const response = '';
      const structure = (aiService as any).parseResponseToMindMap(response);
      
      expect(structure).toHaveLength(0);
    });

    it('should handle malformed response gracefully', () => {
      const response = 'Just some text without proper hierarchy';
      const structure = (aiService as any).parseResponseToMindMap(response);
      
      expect(structure).toHaveLength(0);
    });
  });

  describe('callAI', () => {
    it('should call OpenAI API correctly', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'AI response' } }],
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await (aiService as any).callOpenAI('Test prompt');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key',
          }),
          body: expect.stringContaining('"model":"gpt-3.5-turbo"'),
        })
      );
      
      expect(result).toBe('AI response');
    });

    it('should handle OpenAI API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect((aiService as any).callOpenAI('Test prompt')).rejects.toThrow(
        'OpenAI API error: 401 Unauthorized'
      );
    });

    it('should call Anthropic API correctly', async () => {
      const anthropicService = new AIService({
        ...mockAIConfig,
        provider: 'anthropic',
      });

      const mockResponse = {
        content: [{ text: 'Anthropic response' }],
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await (anthropicService as any).callAnthropic('Test prompt');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-api-key': 'test-api-key',
            'anthropic-version': '2023-06-01',
          }),
        })
      );
      
      expect(result).toBe('Anthropic response');
    });

    it('should call local AI API correctly', async () => {
      const localService = new AIService({
        ...mockAIConfig,
        provider: 'local',
        baseUrl: 'http://localhost:8080',
      });

      const mockResponse = {
        choices: [{ message: { content: 'Local AI response' } }],
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await (localService as any).callLocalAI('Test prompt');
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      
      expect(result).toBe('Local AI response');
    });

    it('should throw error for local AI without base URL', async () => {
      const localService = new AIService({
        ...mockAIConfig,
        provider: 'local',
      });

      await expect((localService as any).callLocalAI('Test prompt')).rejects.toThrow(
        'Base URL is required for local AI provider'
      );
    });

    // Tests for new AI providers
    it('should call DeepSeek API correctly', async () => {
      const deepseekService = new AIService({
        ...mockAIConfig,
        provider: 'deepseek',
      });

      const mockResponse = {
        choices: [{ message: { content: 'DeepSeek response' } }],
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await (deepseekService as any).callDeepSeek('Test prompt');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.deepseek.com/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key',
          }),
          body: expect.stringContaining('"model":"gpt-3.5-turbo"'),
        })
      );
      
      expect(result).toBe('DeepSeek response');
    });

    it('should call GLM API correctly', async () => {
      const glmService = new AIService({
        ...mockAIConfig,
        provider: 'glm',
      });

      const mockResponse = {
        choices: [{ message: { content: 'GLM response' } }],
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await (glmService as any).callGLM('Test prompt');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key',
          }),
          body: expect.stringContaining('"model":"gpt-3.5-turbo"'),
        })
      );
      
      expect(result).toBe('GLM response');
    });

    it('should call Kimi API correctly', async () => {
      const kimiService = new AIService({
        ...mockAIConfig,
        provider: 'kimi',
      });

      const mockResponse = {
        choices: [{ message: { content: 'Kimi response' } }],
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await (kimiService as any).callKimi('Test prompt');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.moonshot.cn/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key',
          }),
          body: expect.stringContaining('"model":"gpt-3.5-turbo"'),
        })
      );
      
      expect(result).toBe('Kimi response');
    });

    it('should call Qwen API correctly', async () => {
      const qwenService = new AIService({
        ...mockAIConfig,
        provider: 'qwen',
      });

      const mockResponse = {
        output: { text: 'Qwen response' },
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await (qwenService as any).callQwen('Test prompt');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key',
          }),
          body: expect.stringContaining('"model":"gpt-3.5-turbo"'),
        })
      );
      
      expect(result).toBe('Qwen response');
    });

    it('should handle DeepSeek API errors', async () => {
      const deepseekService = new AIService({
        ...mockAIConfig,
        provider: 'deepseek',
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect((deepseekService as any).callDeepSeek('Test prompt')).rejects.toThrow(
        'DeepSeek API error: 401 Unauthorized'
      );
    });

    it('should handle GLM API errors', async () => {
      const glmService = new AIService({
        ...mockAIConfig,
        provider: 'glm',
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
      });

      await expect((glmService as any).callGLM('Test prompt')).rejects.toThrow(
        'GLM API error: 429 Too Many Requests'
      );
    });

    it('should handle Kimi API errors', async () => {
      const kimiService = new AIService({
        ...mockAIConfig,
        provider: 'kimi',
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect((kimiService as any).callKimi('Test prompt')).rejects.toThrow(
        'Kimi API error: 500 Internal Server Error'
      );
    });

    it('should handle Qwen API errors', async () => {
      const qwenService = new AIService({
        ...mockAIConfig,
        provider: 'qwen',
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect((qwenService as any).callQwen('Test prompt')).rejects.toThrow(
        'Qwen API error: 400 Bad Request'
      );
    });
  });

  describe('generateContent', () => {
    it('should generate content successfully', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Main Topic\n\tSubtopic 1\n\tSubtopic 2' } }],
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const request = {
        question: 'What are the key components?',
        context: {
          selectedNode: 'Business Plan',
          parentNodes: ['Strategy'],
          mindMapContext: 'Business Plan',
        },
      };

      const response = await aiService.generateContent(request);
      
      expect(response.content).toBe('Main Topic\n\tSubtopic 1\n\tSubtopic 2');
      expect(response.structure).toHaveLength(2);
      expect(response.structure[0].text).toBe('Subtopic 1');
      expect(response.error).toBeUndefined();
    });

    it('should handle API errors gracefully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const request = {
        question: 'Test question',
        context: {
          selectedNode: 'Test',
          parentNodes: [],
          mindMapContext: 'Test',
        },
      };

      const response = await aiService.generateContent(request);
      
      expect(response.content).toBe('');
      expect(response.structure).toHaveLength(0);
      expect(response.error).toBe('OpenAI API error: 500 Internal Server Error');
    });

    it('should handle network errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const request = {
        question: 'Test question',
        context: {
          selectedNode: 'Test',
          parentNodes: [],
          mindMapContext: 'Test',
        },
      };

      const response = await aiService.generateContent(request);
      
      expect(response.content).toBe('');
      expect(response.structure).toHaveLength(0);
      expect(response.error).toBe('Network error');
    });

    it('should handle unsupported provider', async () => {
      const unsupportedService = new AIService({
        ...mockAIConfig,
        provider: 'unsupported' as any,
      });

      const request = {
        question: 'Test question',
        context: {
          selectedNode: 'Test',
          parentNodes: [],
          mindMapContext: 'Test',
        },
      };

      const response = await unsupportedService.generateContent(request);
      
      expect(response.content).toBe('');
      expect(response.structure).toHaveLength(0);
      expect(response.error).toBe('Unsupported AI provider: unsupported');
    });
  });
});