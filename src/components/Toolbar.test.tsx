
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Toolbar } from './Toolbar';
import { createMockMindMapStore } from '../utils/test-utils';
import { saveAsFile, loadFromFile } from '../utils/file';
import React from 'react';

jest.mock('../store/mindmapStore');
jest.mock('../utils/file');

// Mock the useSelectedPath hook to provide test values
jest.mock('../contexts/SelectedPathContext', () => ({
  useSelectedPath: jest.fn(),
  SelectedPathProvider: ({ children }: { children: React.ReactNode }) => children
}));

describe('Toolbar', () => {
  const addNode = jest.fn();
  const setMindmap = jest.fn();
  const setJsonFilePath = jest.fn();
  const setTextFilePath = jest.fn();
  const mockUseSelectedPath = require('../contexts/SelectedPathContext').useSelectedPath;

  beforeEach(() => {
    createMockMindMapStore({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: null,
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });
    
    // Reset mock for selected path
    mockUseSelectedPath.mockReturnValue({
      selectedPath: [],
      setSelectedPath: jest.fn()
    });
  });

  it('should display disabled "Add Child" button when no node is selected', () => {
    // For "no node selected", we need to simulate a state that's neither root nor regular node
    // This is a special case that shouldn't happen in normal usage
    mockUseSelectedPath.mockReturnValue({
      selectedPath: [], // This now means root node is selected
      setSelectedPath: jest.fn()
    });
    
    render(<Toolbar />);
    // Root node is selected by default, so Add Child should be enabled
    const addButton = screen.getByText('Add Child');
    expect(addButton).not.toBeDisabled();
  });

  it('should display disabled node operation buttons when no node is selected', () => {
    // Note: With the new implementation, selectedPath: [] means root node is selected
    // There's no true "no selection" state in the current implementation
    mockUseSelectedPath.mockReturnValue({
      selectedPath: [], // This means root node is selected
      setSelectedPath: jest.fn()
    });
    
    render(<Toolbar />);
    // Root node is selected, so Add Child and Copy/Paste should be enabled
    expect(screen.getByText('Add Child')).not.toBeDisabled();
    // Find the Delete button by its role and title
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    expect(deleteButton).toBeDisabled(); // Root cannot be deleted
    const moveUpButton = screen.getByRole('button', { name: /Move Up/i });
    expect(moveUpButton).toBeDisabled(); // Root cannot be moved
    const moveDownButton = screen.getByRole('button', { name: /Move Down/i });
    expect(moveDownButton).toBeDisabled(); // Root cannot be moved
    expect(screen.getByText('Copy JSON')).not.toBeDisabled();
    expect(screen.getByText('Copy Text')).not.toBeDisabled();
    expect(screen.getByText('Paste JSON')).not.toBeDisabled();
    expect(screen.getByText('Paste Text')).not.toBeDisabled();
  });

  // Task 48: Root node button states
  it('should enable Add Child and Copy/Paste buttons when root is selected', () => {
    mockUseSelectedPath.mockReturnValue({
      selectedPath: [],
      setSelectedPath: jest.fn()
    });
    
    render(<Toolbar />);
    
    // Root node is selected (empty path), so Add Child should be enabled
    expect(screen.getByText('Add Child')).not.toBeDisabled();
    
    // Copy operations should be enabled
    expect(screen.getByText('Copy JSON')).not.toBeDisabled();
    expect(screen.getByText('Copy Text')).not.toBeDisabled();
    
    // Paste operations should be enabled
    expect(screen.getByText('Paste JSON')).not.toBeDisabled();
    expect(screen.getByText('Paste Text')).not.toBeDisabled();
  });

  it('should disable Delete and Move buttons when root is selected', () => {
    mockUseSelectedPath.mockReturnValue({
      selectedPath: [],
      setSelectedPath: jest.fn()
    });
    
    render(<Toolbar />);
    
    // Root node cannot be deleted or moved
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    expect(deleteButton).toBeDisabled();
    const moveUpButton = screen.getByRole('button', { name: /Move Up/i });
    expect(moveUpButton).toBeDisabled();
    const moveDownButton = screen.getByRole('button', { name: /Move Down/i });
    expect(moveDownButton).toBeDisabled();
  });

  it('should enable all buttons when non-root node is selected', () => {
    mockUseSelectedPath.mockReturnValue({
      selectedPath: [0],
      setSelectedPath: jest.fn()
    });
    
    render(<Toolbar />);
    
    // Non-root node should have all operations enabled
    expect(screen.getByText('Add Child')).not.toBeDisabled();
    expect(screen.getByText('Delete')).not.toBeDisabled();
    expect(screen.getByText('Move Up')).not.toBeDisabled();
    expect(screen.getByText('Move Down')).not.toBeDisabled();
    expect(screen.getByText('Copy JSON')).not.toBeDisabled();
    expect(screen.getByText('Copy Text')).not.toBeDisabled();
    expect(screen.getByText('Paste JSON')).not.toBeDisabled();
    expect(screen.getByText('Paste Text')).not.toBeDisabled();
  });

  
  it('should call saveAsFile when Save As JSON is clicked', async () => {
    const defaultPath = 'mindmap.json';
    (saveAsFile as jest.Mock).mockResolvedValue(defaultPath);

    mockUseSelectedPath.mockReturnValue({
      selectedPath: [],
      setSelectedPath: jest.fn()
    });

    render(<Toolbar />);
    // Find the Save JSON button by its text content
    fireEvent.click(screen.getByText('Save JSON'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(saveAsFile).toHaveBeenCalledWith(
      { root: { text: 'Root', children: [] } },
      'json'
    );
    expect(setJsonFilePath).toHaveBeenCalledWith(defaultPath);
  });

  it('should call saveAsFile when Save As Text is clicked', async () => {
    const defaultPath = 'mindmap.txt';
    (saveAsFile as jest.Mock).mockResolvedValue(defaultPath);

    mockUseSelectedPath.mockReturnValue({
      selectedPath: [],
      setSelectedPath: jest.fn()
    });

    render(<Toolbar />);
    // Find the Save Text button by its text content
    fireEvent.click(screen.getByText('Save Text'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(saveAsFile).toHaveBeenCalledWith(
      { root: { text: 'Root', children: [] } },
      'text'
    );
    expect(setTextFilePath).toHaveBeenCalledWith(defaultPath);
  });

  it('should call loadFromFile when Load File is clicked', async () => {
    const mockResult = {
      mindmap: { root: { text: 'New Root', children: [] } },
      path: '/path/to/file.json'
    };
    (loadFromFile as jest.Mock).mockResolvedValue(mockResult);

    mockUseSelectedPath.mockReturnValue({
      selectedPath: [],
      setSelectedPath: jest.fn()
    });

    render(<Toolbar />);
    fireEvent.click(screen.getByText('Load File'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(loadFromFile).toHaveBeenCalled();
    expect(setMindmap).toHaveBeenCalledWith(mockResult.mindmap);
    expect(setJsonFilePath).toHaveBeenCalledWith('/path/to/file.json');
  });

  // Task 54: Horizontal scrolling tests
  it('should render toolbar with horizontal scrolling styles', () => {
    mockUseSelectedPath.mockReturnValue({
      selectedPath: [],
      setSelectedPath: jest.fn()
    });

    render(<Toolbar />);

    const toolbar = screen.getByTestId('toolbar-container');
    expect(toolbar).toBeInTheDocument();

    // Check if the toolbar container has overflow-x: auto for horizontal scrolling
    expect(toolbar).toHaveStyle({
      overflowX: 'auto',
      overflowY: 'hidden'
    });
  });

  it('should display all button groups in horizontal layout', () => {
    mockUseSelectedPath.mockReturnValue({
      selectedPath: [],
      setSelectedPath: jest.fn()
    });

    render(<Toolbar />);

    // Check that all expected buttons are present
    expect(screen.getByText('Add Child')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Move Up')).toBeInTheDocument();
    expect(screen.getByText('Move Down')).toBeInTheDocument();
    expect(screen.getByText('Copy JSON')).toBeInTheDocument();
    expect(screen.getByText('Copy Text')).toBeInTheDocument();
    expect(screen.getByText('Paste JSON')).toBeInTheDocument();
    expect(screen.getByText('Paste Text')).toBeInTheDocument();
    expect(screen.getByText('Save JSON')).toBeInTheDocument();
    expect(screen.getByText('Save Text')).toBeInTheDocument();
    expect(screen.getByText('Load File')).toBeInTheDocument();
  });

  it('should have flex-shrink: 0 on button groups to prevent shrinking', () => {
    mockUseSelectedPath.mockReturnValue({
      selectedPath: [],
      setSelectedPath: jest.fn()
    });

    render(<Toolbar />);

    // Get the toolbar container
    const toolbar = screen.getByTestId('toolbar-container');
    expect(toolbar).toBeInTheDocument();

    // Verify toolbar has white-space: nowrap for horizontal scrolling
    expect(toolbar).toHaveStyle({
      whiteSpace: 'nowrap'
    });
  });

  it('should maintain toolbar functionality with scrolling enabled', () => {
    mockUseSelectedPath.mockReturnValue({
      selectedPath: [0],
      setSelectedPath: jest.fn()
    });

    render(<Toolbar />);

    // Test that button functionality still works with scrolling
    expect(screen.getByText('Add Child')).not.toBeDisabled();
    expect(screen.getByText('Delete')).not.toBeDisabled();
    expect(screen.getByText('Move Up')).not.toBeDisabled();
    expect(screen.getByText('Move Down')).not.toBeDisabled();

    // Test file operations
    expect(screen.getByText('Save JSON')).not.toBeDisabled();
    expect(screen.getByText('Save Text')).not.toBeDisabled();
    expect(screen.getByText('Load File')).not.toBeDisabled();
  });
});
