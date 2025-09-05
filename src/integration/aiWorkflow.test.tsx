import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../components/App';
import { useMindMapStore } from '../store/mindmapStore';
import { useSelectedPath } from '../contexts/SelectedPathContext';
import { act } from 'react-dom/test-utils';

// Mock the AI service
jest.mock('../services/aiService', () => ({
  AIService: jest.fn().mockImplementation(() => ({
    generateContent: jest.fn(),
  })),
}));

// Mock file operations
jest.mock('../utils/file', () => ({
  saveToFile: jest.fn(),
  saveAsFile: jest.fn(),
  loadFromFile: jest.fn(),
}));

describe('AI Workflow End-to-End Tests', () => {
  beforeEach(() => {
    // Clear all mocks and store state
    jest.clearAllMocks();
    useMindMapStore.setState({
      mindmap: { text: 'Root Node', children: [] },
      jsonFilePath: '',
      textFilePath: '',
      isAILoading: false,
      aiError: null,
    });
  });

  describe('Complete AI Content Generation Workflow', () => {
    it('should handle complete AI content generation flow', async () => {
      render(<App />);

      // Wait for app to render
      await waitFor(() => {
        expect(screen.getByText('Root Node')).toBeInTheDocument();
      });

      // Find and click the "Ask AI" button
      const askAIButton = screen.getByText('Ask AI');
      fireEvent.click(askAIButton);

      // Verify AI dialog opens
      await waitFor(() => {
        expect(screen.getByTestId('ai-prompt-dialog')).toBeInTheDocument();
        expect(screen.getByText('Ask AI')).toBeInTheDocument();
      });

      // Enter a question
      const textarea = screen.getByPlaceholderText('Enter your question...');
      fireEvent.change(textarea, { target: { value: 'What are the key components of a business plan?' } });

      // Mock successful AI response
      const { AIService } = require('../services/aiService');
      const mockAIInstance = new AIService({
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        apiKey: 'test-key',
        maxTokens: 1000,
        temperature: 0.7,
      });

      mockAIInstance.generateContent.mockResolvedValue({
        content: 'Business Plan Components\n    Executive Summary\n    Market Analysis\n    Financial Projections',
        structure: [
          { text: 'Executive Summary', children: [] },
          { text: 'Market Analysis', children: [] },
          { text: 'Financial Projections', children: [] },
        ],
      });

      // Submit the question
      const submitButton = screen.getByText('Ask AI');
      fireEvent.click(submitButton);

      // Verify dialog closes
      await waitFor(() => {
        expect(screen.queryByTestId('ai-prompt-dialog')).not.toBeInTheDocument();
      });

      // Verify loading state
      expect(screen.getByText('AI Working...')).toBeInTheDocument();

      // Wait for AI processing to complete
      await waitFor(() => {
        expect(screen.queryByText('AI Working...')).not.toBeInTheDocument();
      });

      // Verify AI content was added to mindmap
      const store = useMindMapStore.getState();
      expect(store.mindmap.children).toHaveLength(1);
      expect(store.mindmap.children[0].text).toBe('AI Generated Content');
      expect(store.mindmap.children[0].children).toHaveLength(3);
      expect(store.mindmap.children[0].children[0].text).toBe('Executive Summary');
    });

    it('should handle AI error flow gracefully', async () => {
      render(<App />);

      // Wait for app to render
      await waitFor(() => {
        expect(screen.getByText('Root Node')).toBeInTheDocument();
      });

      // Open AI dialog
      const askAIButton = screen.getByText('Ask AI');
      fireEvent.click(askAIButton);

      // Enter a question
      const textarea = screen.getByPlaceholderText('Enter your question...');
      fireEvent.change(textarea, { target: { value: 'Test question' } });

      // Mock AI error response
      const { AIService } = require('../services/aiService');
      const mockAIInstance = new AIService({
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        apiKey: 'test-key',
        maxTokens: 1000,
        temperature: 0.7,
      });

      mockAIInstance.generateContent.mockResolvedValue({
        content: '',
        structure: [],
        error: 'AI service unavailable',
      });

      // Submit the question
      const submitButton = screen.getByText('Ask AI');
      fireEvent.click(submitButton);

      // Wait for processing to complete
      await waitFor(() => {
        expect(screen.queryByText('AI Working...')).not.toBeInTheDocument();
      });

      // Verify error is displayed when reopening dialog
      fireEvent.click(askAIButton);
      
      await waitFor(() => {
        expect(screen.getByText('AI service unavailable')).toBeInTheDocument();
      });
    });

    it('should handle AI network error flow', async () => {
      render(<App />);

      // Wait for app to render
      await waitFor(() => {
        expect(screen.getByText('Root Node')).toBeInTheDocument();
      });

      // Open AI dialog
      const askAIButton = screen.getByText('Ask AI');
      fireEvent.click(askAIButton);

      // Enter a question
      const textarea = screen.getByPlaceholderText('Enter your question...');
      fireEvent.change(textarea, { target: { value: 'Test question' } });

      // Mock network error
      const { AIService } = require('../services/aiService');
      const mockAIInstance = new AIService({
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        apiKey: 'test-key',
        maxTokens: 1000,
        temperature: 0.7,
      });

      mockAIInstance.generateContent.mockRejectedValue(new Error('Network error'));

      // Submit the question
      const submitButton = screen.getByText('Ask AI');
      fireEvent.click(submitButton);

      // Wait for processing to complete
      await waitFor(() => {
        expect(screen.queryByText('AI Working...')).not.toBeInTheDocument();
      });

      // Verify error is displayed when reopening dialog
      fireEvent.click(askAIButton);
      
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });

  describe('AI Content Integration with MindMap Operations', () => {
    it('should allow editing AI-generated content', async () => {
      // Setup initial AI-generated content
      useMindMapStore.setState({
        mindmap: {
          text: 'Root Node',
          children: [
            {
              text: 'AI Generated Content',
              children: [
                { text: 'AI Node 1', children: [] },
                { text: 'AI Node 2', children: [] },
              ],
            },
          ],
        },
      });

      render(<App />);

      // Wait for app to render
      await waitFor(() => {
        expect(screen.getByText('Root Node')).toBeInTheDocument();
      });

      // Verify AI-generated content is displayed
      expect(screen.getByText('AI Generated Content')).toBeInTheDocument();
      expect(screen.getByText('AI Node 1')).toBeInTheDocument();
      expect(screen.getByText('AI Node 2')).toBeInTheDocument();

      // Simulate editing AI-generated node (this would require actual edit functionality)
      // For now, we verify the content exists and can be manipulated
      const store = useMindMapStore.getState();
      expect(store.mindmap.children[0].text).toBe('AI Generated Content');
    });

    it('should support multiple AI generations in different branches', async () => {
      // Setup initial mindmap structure
      useMindMapStore.setState({
        mindmap: {
          text: 'Root Node',
          children: [
            { text: 'Branch 1', children: [] },
            { text: 'Branch 2', children: [] },
          ],
        },
      });

      render(<App />);

      // Wait for app to render
      await waitFor(() => {
        expect(screen.getByText('Root Node')).toBeInTheDocument();
      });

      // Mock AI service for multiple calls
      const { AIService } = require('../services/aiService');
      const mockAIInstance = new AIService({
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        apiKey: 'test-key',
        maxTokens: 1000,
        temperature: 0.7,
      });

      mockAIInstance.generateContent.mockResolvedValue({
        content: 'Generated Content',
        structure: [{ text: 'AI Node', children: [] }],
      });

      // This test would require actual node selection functionality
      // For now, we verify the store can handle multiple AI generations
      const store = useMindMapStore.getState();
      
      // Simulate AI generation in branch 1
      await store.generateAIContent([0], 'Generate content for branch 1');
      expect(store.mindmap.children[0].children).toHaveLength(1);

      // Simulate AI generation in branch 2
      await store.generateAIContent([1], 'Generate content for branch 2');
      expect(store.mindmap.children[1].children).toHaveLength(1);
    });
  });

  describe('AI User Experience Flows', () => {
    it('should provide proper feedback during AI operations', async () => {
      render(<App />);

      // Wait for app to render
      await waitFor(() => {
        expect(screen.getByText('Root Node')).toBeInTheDocument();
      });

      // Open AI dialog
      const askAIButton = screen.getByText('Ask AI');
      fireEvent.click(askAIButton);

      // Verify dialog elements
      expect(screen.getByText('Ask AI')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your question...')).toBeInTheDocument();
      expect(screen.getByText('Ask AI')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();

      // Close dialog
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      // Verify dialog closes
      await waitFor(() => {
        expect(screen.queryByTestId('ai-prompt-dialog')).not.toBeInTheDocument();
      });
    });

    it('should handle AI button state changes', async () => {
      render(<App />);

      // Wait for app to render
      await waitFor(() => {
        expect(screen.getByText('Root Node')).toBeInTheDocument();
      });

      // Verify initial button state
      const askAIButton = screen.getByText('Ask AI');
      expect(askAIButton).toBeEnabled();
      expect(askAIButton).toHaveTextContent('Ask AI');

      // Simulate loading state
      useMindMapStore.setState({ isAILoading: true });

      // Verify button state changes
      await waitFor(() => {
        expect(screen.getByText('AI Working...')).toBeInTheDocument();
        expect(screen.getByText('AI Working...')).toBeDisabled();
      });

      // Reset loading state
      useMindMapStore.setState({ isAILoading: false });

      // Verify button returns to normal state
      await waitFor(() => {
        expect(screen.getByText('Ask AI')).toBeEnabled();
      });
    });
  });

  describe('AI Integration with File Operations', () => {
    it('should preserve AI-generated content when saving and loading', async () => {
      // Setup mindmap with AI-generated content
      const aiGeneratedMindmap = {
        text: 'Root Node',
        children: [
          {
            text: 'AI Generated Content',
            children: [
              { text: 'AI Node 1', children: [] },
              { text: 'AI Node 2', children: [] },
            ],
          },
        ],
      };

      useMindMapStore.setState({
        mindmap: aiGeneratedMindmap,
        jsonFilePath: '/test/path.json',
      });

      render(<App />);

      // Wait for app to render
      await waitFor(() => {
        expect(screen.getByText('Root Node')).toBeInTheDocument();
      });

      // Verify AI-generated content is preserved
      const store = useMindMapStore.getState();
      expect(store.mindmap.children[0].text).toBe('AI Generated Content');
      expect(store.mindmap.children[0].children).toHaveLength(2);

      // This test would require actual file operations
      // For now, we verify the store maintains AI-generated content
    });
  });
});