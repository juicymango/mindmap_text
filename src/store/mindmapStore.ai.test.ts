import { useMindMapStore } from '../store/mindmapStore';
import { AIService } from '../services/aiService';
import { MindNode } from '../types';

// Mock AIService
jest.mock('../services/aiService');
const MockAIService = AIService as jest.MockedClass<typeof AIService>;

// Mock environment variables
const mockAIConfig = {
  provider: 'openai' as const,
  model: 'gpt-3.5-turbo',
  apiKey: 'test-api-key',
  maxTokens: 1000,
  temperature: 0.7,
};

describe('MindMapStore AI Integration', () => {
  let store: ReturnType<typeof useMindMapStore>;
  let mockAIInstance: jest.Mocked<AIService>;

  beforeEach(() => {
    // Clear all stores before each test
    useMindMapStore.setState({
      mindmap: { text: 'Root Node', children: [] },
      jsonFilePath: '',
      textFilePath: '',
      isAILoading: false,
      aiError: null,
    });

    store = useMindMapStore.getState();
    
    // Create mock AI instance
    mockAIInstance = {
      generateContent: jest.fn(),
    } as any;

    MockAIService.mockImplementation(() => mockAIInstance);
  });

  describe('generateAIContent', () => {
    it('should generate AI content successfully', async () => {
      const selectedPath = [0];
      const question = 'What are the key components?';
      
      const mockAIResponse = {
        content: 'Main Topic\n    Subtopic 1\n    Subtopic 2',
        structure: [
          { text: 'Subtopic 1', children: [] },
          { text: 'Subtopic 2', children: [] },
        ],
      };

      mockAIInstance.generateContent.mockResolvedValue(mockAIResponse);

      await store.generateAIContent(selectedPath, question);

      expect(store.isAILoading).toBe(false);
      expect(store.aiError).toBeNull();
      expect(store.mindmap.children).toHaveLength(1);
      expect(store.mindmap.children[0].text).toBe('AI Generated Content');
      expect(store.mindmap.children[0].children).toEqual(mockAIResponse.structure);
    });

    it('should handle AI API errors', async () => {
      const selectedPath = [0];
      const question = 'Test question';
      
      mockAIInstance.generateContent.mockResolvedValue({
        content: '',
        structure: [],
        error: 'API Error: Failed to generate content',
      });

      await store.generateAIContent(selectedPath, question);

      expect(store.isAILoading).toBe(false);
      expect(store.aiError).toBe('API Error: Failed to generate content');
      expect(store.mindmap.children).toHaveLength(0);
    });

    it('should handle network errors', async () => {
      const selectedPath = [0];
      const question = 'Test question';
      
      mockAIInstance.generateContent.mockRejectedValue(new Error('Network error'));

      await store.generateAIContent(selectedPath, question);

      expect(store.isAILoading).toBe(false);
      expect(store.aiError).toBe('Network error');
      expect(store.mindmap.children).toHaveLength(0);
    });

    it('should handle empty AI response', async () => {
      const selectedPath = [0];
      const question = 'Test question';
      
      mockAIInstance.generateContent.mockResolvedValue({
        content: '',
        structure: [],
      });

      await store.generateAIContent(selectedPath, question);

      expect(store.isAILoading).toBe(false);
      expect(store.aiError).toBeNull();
      expect(store.mindmap.children).toHaveLength(0);
    });

    it('should add AI content to correct parent node', async () => {
      // Setup initial mindmap with structure
      const initialMindmap: MindNode = {
        text: 'Root Node',
        children: [
          { text: 'Existing Child', children: [] },
          { text: 'Target Node', children: [] },
        ],
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      store = useMindMapStore.getState();

      const selectedPath = [1]; // Target the second child
      const question = 'Add subtopics';
      
      const mockAIResponse = {
        content: 'New Subtopic\n    Detail 1\n    Detail 2',
        structure: [
          { text: 'New Subtopic', children: [] },
          { text: 'Detail 1', children: [] },
          { text: 'Detail 2', children: [] },
        ],
      };

      mockAIInstance.generateContent.mockResolvedValue(mockAIResponse);

      await store.generateAIContent(selectedPath, question);

      expect(store.mindmap.children[1].children).toHaveLength(1);
      expect(store.mindmap.children[1].children[0].text).toBe('AI Generated Content');
      expect(store.mindmap.children[1].children[0].children).toEqual(mockAIResponse.structure);
    });

    it('should set loading state during AI generation', async () => {
      const selectedPath = [0];
      const question = 'Test question';
      
      // Simulate async operation
      let resolvePromise: any;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockAIInstance.generateContent.mockReturnValue(promise);

      const generatePromise = store.generateAIContent(selectedPath, question);
      
      // Check loading state is set
      expect(store.isAILoading).toBe(true);
      expect(store.aiError).toBeNull();

      // Resolve the promise
      resolvePromise({
        content: 'Test response',
        structure: [{ text: 'Test', children: [] }],
      });

      await generatePromise;
      
      // Check loading state is cleared
      expect(store.isAILoading).toBe(false);
    });
  });

  describe('clearAIError', () => {
    it('should clear AI error state', () => {
      useMindMapStore.setState({
        aiError: 'Previous error',
      });

      store = useMindMapStore.getState();
      store.clearAIError();

      expect(store.aiError).toBeNull();
    });

    it('should handle clearing null error', () => {
      useMindMapStore.setState({
        aiError: null,
      });

      store = useMindMapStore.getState();
      store.clearAIError();

      expect(store.aiError).toBeNull();
    });
  });

  describe('AI state management', () => {
    it('should maintain AI state independently of other store state', () => {
      const initialMindmap: MindNode = {
        text: 'Root Node',
        children: [{ text: 'Child Node', children: [] }],
      };

      useMindMapStore.setState({
        mindmap: initialMindmap,
        isAILoading: true,
        aiError: 'Test error',
        jsonFilePath: '/path/to/file.json',
      });

      store = useMindMapStore.getState();

      // Update unrelated state
      store.addNode([0], 'New Node');

      // AI state should remain unchanged
      expect(store.isAILoading).toBe(true);
      expect(store.aiError).toBe('Test error');
      
      // Other state should be updated
      expect(store.mindmap.children[0].children).toHaveLength(1);
      expect(store.mindmap.children[0].children[0].text).toBe('New Node');
    });

    it('should reset AI state when clearing errors', () => {
      useMindMapStore.setState({
        isAILoading: true,
        aiError: 'Test error',
      });

      store = useMindMapStore.getState();
      store.clearAIError();

      expect(store.isAILoading).toBe(false);
      expect(store.aiError).toBeNull();
    });
  });

  describe('AI integration with existing mindmap operations', () => {
    it('should work correctly with addNode operation', async () => {
      const selectedPath = [0];
      const question = 'Generate content';
      
      const mockAIResponse = {
        content: 'AI Content',
        structure: [{ text: 'AI Node', children: [] }],
      };

      mockAIInstance.generateContent.mockResolvedValue(mockAIResponse);

      await store.generateAIContent(selectedPath, question);

      // Add regular node
      store.addNode([0, 0], 'Regular Node');

      expect(store.mindmap.children[0].children).toHaveLength(2);
      expect(store.mindmap.children[0].children[0].text).toBe('AI Generated Content');
      expect(store.mindmap.children[0].children[1].text).toBe('Regular Node');
    });

    it('should work correctly with updateNode operation', async () => {
      const selectedPath = [0];
      const question = 'Generate content';
      
      const mockAIResponse = {
        content: 'AI Content',
        structure: [{ text: 'AI Node', children: [] }],
      };

      mockAIInstance.generateContent.mockResolvedValue(mockAIResponse);

      await store.generateAIContent(selectedPath, question);

      // Update AI-generated node
      store.updateNode([0, 0], 'Updated AI Node');

      expect(store.mindmap.children[0].children[0].text).toBe('Updated AI Node');
    });

    it('should work correctly with deleteNode operation', async () => {
      const selectedPath = [0];
      const question = 'Generate content';
      
      const mockAIResponse = {
        content: 'AI Content',
        structure: [{ text: 'AI Node', children: [] }],
      };

      mockAIInstance.generateContent.mockResolvedValue(mockAIResponse);

      await store.generateAIContent(selectedPath, question);

      // Delete AI-generated node
      store.deleteNode([0, 0]);

      expect(store.mindmap.children[0].children).toHaveLength(0);
    });
  });
});