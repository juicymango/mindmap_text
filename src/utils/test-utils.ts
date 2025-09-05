import { MindMapState, useMindMapStore } from '../store/mindmapStore';
import { MindMap, MindNode } from '../types';
import React from 'react';

/**
 * Type-safe mock for the Zustand store
 * This provides proper TypeScript typing for mocking the mind map store
 */
export const createMockMindMapStore = (overrides: Partial<MindMapState> = {}) => {
  const baseState: MindMapState = {
    mindmap: { root: { text: 'Root', children: [] } },
    setMindmap: jest.fn(),
    addNode: jest.fn(),
    deleteNode: jest.fn(),
    updateNodeText: jest.fn(),
    setSelectedChild: jest.fn(),
    copyNode: jest.fn(),
    pasteNode: jest.fn(),
    generateAIContent: jest.fn(),
    isAILoading: false,
    aiError: null,
    clearAIError: jest.fn(),
    jsonFilePath: null,
    textFilePath: null,
    setJsonFilePath: jest.fn(),
    setTextFilePath: jest.fn(),
    clearFilePaths: jest.fn(),
  };
  
  const mockStore = { ...baseState, ...overrides };
  
  // Mock the actual store hook
  const mockedUseMindMapStore = useMindMapStore as jest.MockedFunction<typeof useMindMapStore>;
  mockedUseMindMapStore.mockReturnValue(mockStore);
  
  return mockStore;
};

/**
 * Helper function to create a test mind map with specified structure
 */
export const createTestMindMap = (structure: any): MindMap => {
  return {
    root: structure
  };
};

/**
 * Helper function to create a test node with children
 */
export const createTestNode = (text: string, children: MindNode[] = [], selected_child_idx?: number): MindNode => {
  return {
    text,
    children,
    selected_child_idx
  };
};

/**
 * Type guard for checking if a value is a non-null string
 */
export const isNonNullString = (value: string | null | undefined): value is string => {
  return typeof value === 'string' && value.length > 0;
};

/**
 * Type guard for checking if a mind map is valid
 */
export const isValidMindMap = (mindmap: MindMap | null): mindmap is MindMap => {
  return mindmap !== null && mindmap.root !== undefined;
};

/**
 * Mock for react-beautiful-dnd DragDropContext
 */
export const mockDragDropContext = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('div', null, children);
};

/**
 * Mock for react-beautiful-dnd Droppable
 */
export const mockDroppable = ({ children }: { children: (provided: any) => React.ReactNode }) => {
  return children({
    droppableProps: {},
    innerRef: jest.fn(),
    placeholder: null
  });
};

/**
 * Mock for react-beautiful-dnd Draggable
 */
export const mockDraggable = ({ children }: { children: (provided: any) => React.ReactNode }) => {
  return children({
    draggableProps: { style: {} },
    dragHandleProps: {},
    innerRef: jest.fn(),
  });
};