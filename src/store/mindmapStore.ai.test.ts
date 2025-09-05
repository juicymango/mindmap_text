import { useMindMapStore } from '../store/mindmapStore';
import { AIService } from '../services/aiService';
import { MindNode } from '../types';

// Mock AIService
jest.mock('../services/aiService');
const MockAIService = AIService as jest.MockedClass<typeof AIService>;

// Mock AI config
jest.mock('../config/ai', () => ({
  getAIConfig: () => ({
    provider: 'openai' as const,
    model: 'gpt-3.5-turbo',
    apiKey: 'test-api-key',
    maxTokens: 1000,
    temperature: 0.7,
  }),
  validateAIConfig: () => true,
  sanitizeAIResponse: (response: string) => response,
  getNodePath: () => [],
}));

describe('MindMapStore AI Integration', () => {
  let store: ReturnType<typeof useMindMapStore>;
  let mockAIInstance: jest.Mocked<AIService>;

  beforeEach(() => {
    // Clear all stores before each test
    useMindMapStore.setState({
      mindmap: { root: { text: 'Root Node', children: [] } },
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
      // Setup initial mindmap with a target node
      useMindMapStore.setState({
        mindmap: {
          root: {
            text: 'Root Node',
            children: [{ text: 'Target Node', children: [] }],
          },
        },
      });
      store = useMindMapStore.getState();
      
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

      const finalStore = useMindMapStore.getState();
      expect(finalStore.isAILoading).toBe(false);
      expect(finalStore.aiError).toBeNull();
      expect(finalStore.mindmap.root.children[0].children).toHaveLength(2);
      expect(finalStore.mindmap.root.children[0].children[0].text).toBe('Subtopic 1');
      expect(finalStore.mindmap.root.children[0].children[1].text).toBe('Subtopic 2');
    });

    it('should handle AI API errors', async () => {
      // Setup initial mindmap with a target node
      useMindMapStore.setState({
        mindmap: {
          root: {
            text: 'Root Node',
            children: [{ text: 'Target Node', children: [] }],
          },
        },
      });
      store = useMindMapStore.getState();
      
      const selectedPath = [0];
      const question = 'Test question';
      
      mockAIInstance.generateContent.mockResolvedValue({
        content: '',
        structure: [],
        error: 'API Error: Failed to generate content',
      });

      await store.generateAIContent(selectedPath, question);

      const finalStore = useMindMapStore.getState();
      expect(finalStore.isAILoading).toBe(false);
      expect(finalStore.aiError).toBe('API Error: Failed to generate content');
      expect(finalStore.mindmap.root.children[0].children).toHaveLength(0);
    });

    it('should handle network errors', async () => {
      // Setup initial mindmap with a target node
      useMindMapStore.setState({
        mindmap: {
          root: {
            text: 'Root Node',
            children: [{ text: 'Target Node', children: [] }],
          },
        },
      });
      store = useMindMapStore.getState();
      
      const selectedPath = [0];
      const question = 'Test question';
      
      mockAIInstance.generateContent.mockRejectedValue(new Error('Network error'));

      await store.generateAIContent(selectedPath, question);

      const finalStore = useMindMapStore.getState();
      expect(finalStore.isAILoading).toBe(false);
      expect(finalStore.aiError).toBe('Network error');
      expect(finalStore.mindmap.root.children[0].children).toHaveLength(0);
    });

    it('should handle empty AI response', async () => {
      // Setup initial mindmap with a target node
      useMindMapStore.setState({
        mindmap: {
          root: {
            text: 'Root Node',
            children: [{ text: 'Target Node', children: [] }],
          },
        },
      });
      store = useMindMapStore.getState();
      
      const selectedPath = [0];
      const question = 'Test question';
      
      mockAIInstance.generateContent.mockResolvedValue({
        content: '',
        structure: [],
      });

      await store.generateAIContent(selectedPath, question);

      expect(store.isAILoading).toBe(false);
      expect(store.aiError).toBeNull();
      expect(store.mindmap.root.children[0].children).toHaveLength(0);
    });

    it('should add AI content to correct parent node', async () => {
      // Setup initial mindmap with structure
      const initialMindmap = {
        root: {
          text: 'Root Node',
          children: [
            { text: 'Existing Child', children: [] },
            { text: 'Target Node', children: [] },
          ],
        },
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

      const finalStore = useMindMapStore.getState();
      expect(finalStore.mindmap.root.children[1].children).toHaveLength(3);
      expect(finalStore.mindmap.root.children[1].children[0].text).toBe('New Subtopic');
      expect(finalStore.mindmap.root.children[1].children[1].text).toBe('Detail 1');
      expect(finalStore.mindmap.root.children[1].children[2].text).toBe('Detail 2');
    });

    it('should set loading state during AI generation', async () => {
      // Setup initial mindmap with a target node
      useMindMapStore.setState({
        mindmap: {
          root: {
            text: 'Root Node',
            children: [{ text: 'Target Node', children: [] }],
          },
        },
      });
      store = useMindMapStore.getState();
      
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
      expect(useMindMapStore.getState().isAILoading).toBe(true);
      expect(useMindMapStore.getState().aiError).toBeNull();

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

      const updatedStore = useMindMapStore.getState();
      updatedStore.clearAIError();

      expect(useMindMapStore.getState().aiError).toBeNull();
    });

    it('should handle clearing null error', () => {
      useMindMapStore.setState({
        aiError: null,
      });

      const updatedStore = useMindMapStore.getState();
      updatedStore.clearAIError();

      expect(useMindMapStore.getState().aiError).toBeNull();
    });
  });

  describe('AI state management', () => {
    it('should maintain AI state independently of other store state', () => {
      const initialMindmap = {
        root: {
          text: 'Root Node',
          children: [{ text: 'Child Node', children: [] }],
        },
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
      expect(store.mindmap.root.children[0].children).toHaveLength(1);
      expect(store.mindmap.root.children[0].children[0].text).toBe('New Node');
    });

    it('should reset AI state when clearing errors', () => {
      useMindMapStore.setState({
        isAILoading: true,
        aiError: 'Test error',
      });

      const updatedStore = useMindMapStore.getState();
      updatedStore.clearAIError();

      const finalStore = useMindMapStore.getState();
      expect(finalStore.isAILoading).toBe(true); // Loading state is not reset by clearAIError
      expect(finalStore.aiError).toBeNull();
    });
  });

  describe('AI integration with existing mindmap operations', () => {
    it('should work correctly with addNode operation', async () => {
      // Setup initial mindmap with a target node
      useMindMapStore.setState({
        mindmap: {
          root: {
            text: 'Root Node',
            children: [{ text: 'Target Node', children: [] }],
          },
        },
      });
      const testStore = useMindMapStore.getState();
      
      const selectedPath = [0];
      const question = 'Generate content';
      
      const mockAIResponse = {
        content: 'AI Content',
        structure: [{ text: 'AI Node', children: [] }],
      };

      mockAIInstance.generateContent.mockResolvedValue(mockAIResponse);

      await testStore.generateAIContent(selectedPath, question);

      // Add regular node
      testStore.addNode([0, 0], 'Regular Node');

      const finalStore = useMindMapStore.getState();
      expect(finalStore.mindmap.root.children[0].children).toHaveLength(1);
      expect(finalStore.mindmap.root.children[0].children[0].text).toBe('AI Node');
      expect(finalStore.mindmap.root.children[0].children[0].children[0].text).toBe('Regular Node');
    });

    it('should work correctly with updateNode operation', async () => {
      // Setup initial mindmap with a target node
      useMindMapStore.setState({
        mindmap: {
          root: {
            text: 'Root Node',
            children: [{ text: 'Target Node', children: [] }],
          },
        },
      });
      const testStore = useMindMapStore.getState();
      
      const selectedPath = [0];
      const question = 'Generate content';
      
      const mockAIResponse = {
        content: 'AI Content',
        structure: [{ text: 'AI Node', children: [] }],
      };

      mockAIInstance.generateContent.mockResolvedValue(mockAIResponse);

      await testStore.generateAIContent(selectedPath, question);

      // Update AI-generated node
      testStore.updateNodeText([0, 0], 'Updated AI Node');

      const finalStore = useMindMapStore.getState();
      expect(finalStore.mindmap.root.children[0].children[0].text).toBe('Updated AI Node');
    });

    it('should work correctly with deleteNode operation', async () => {
      // Setup initial mindmap with a target node
      useMindMapStore.setState({
        mindmap: {
          root: {
            text: 'Root Node',
            children: [{ text: 'Target Node', children: [] }],
          },
        },
      });
      const testStore = useMindMapStore.getState();
      
      const selectedPath = [0];
      const question = 'Generate content';
      
      const mockAIResponse = {
        content: 'AI Content',
        structure: [{ text: 'AI Node', children: [] }],
      };

      mockAIInstance.generateContent.mockResolvedValue(mockAIResponse);

      await testStore.generateAIContent(selectedPath, question);

      // Delete AI-generated node
      testStore.deleteNode([0, 0]);

      const finalStore = useMindMapStore.getState();
      expect(finalStore.mindmap.root.children[0].children).toHaveLength(0);
    });
  });
});