import { renderHook, act } from '@testing-library/react';
import { useMindMapStore } from './mindmapStore';

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
    readText: jest.fn(),
  },
});

// Mock document.execCommand for fallback
Object.assign(document, {
  execCommand: jest.fn(),
});

describe('mindmapStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useMindMapStore());
    act(() => {
      result.current.setMindmap({ root: { text: 'Root', children: [] } });
      result.current.clearFilePaths();
    });
    
    // Clear localStorage and mocks
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should add a node', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.addNode([], 'New Node');
    });

    expect(result.current.mindmap.root.children).toHaveLength(1);
    expect(result.current.mindmap.root.children[0].text).toBe('New Node');
  });

  it('should delete a node', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.addNode([], 'New Node');
    });

    expect(result.current.mindmap.root.children).toHaveLength(1);

    act(() => {
      result.current.deleteNode([0]);
    });

    expect(result.current.mindmap.root.children).toHaveLength(0);
  });

  it('should update node text', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.addNode([], 'New Node');
    });

    act(() => {
      result.current.updateNodeText([0], 'Updated Text');
    });

    expect(result.current.mindmap.root.children[0].text).toBe('Updated Text');
  });

  it('should set selected child', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.addNode([], 'Parent Node');
    });
    
    act(() => {
      result.current.addNode([0], 'Child Node');
    });

    act(() => {
      result.current.setSelectedChild([], 0);
    });

    expect(result.current.mindmap.root.selected_child_idx).toBe(0);
  });

  // File path memory tests
  it('should initialize with null file paths', () => {
    const { result } = renderHook(() => useMindMapStore());

    expect(result.current.jsonFilePath).toBeNull();
    expect(result.current.textFilePath).toBeNull();
  });

  it('should set JSON file path', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.setJsonFilePath('/path/to/file.json');
    });

    expect(result.current.jsonFilePath).toBe('/path/to/file.json');
    expect(localStorage.getItem('jsonFilePath')).toBe('/path/to/file.json');
  });

  it('should set text file path', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.setTextFilePath('/path/to/file.txt');
    });

    expect(result.current.textFilePath).toBe('/path/to/file.txt');
    expect(localStorage.getItem('textFilePath')).toBe('/path/to/file.txt');
  });

  it('should clear file paths', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.setJsonFilePath('/path/to/file.json');
      result.current.setTextFilePath('/path/to/file.txt');
    });

    expect(result.current.jsonFilePath).toBe('/path/to/file.json');
    expect(result.current.textFilePath).toBe('/path/to/file.txt');

    act(() => {
      result.current.clearFilePaths();
    });

    expect(result.current.jsonFilePath).toBeNull();
    expect(result.current.textFilePath).toBeNull();
    expect(localStorage.getItem('jsonFilePath')).toBeNull();
    expect(localStorage.getItem('textFilePath')).toBeNull();
  });

  it('should handle null file path setting', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.setJsonFilePath('/path/to/file.json');
      result.current.setJsonFilePath(null);
    });

    expect(result.current.jsonFilePath).toBeNull();
    expect(localStorage.getItem('jsonFilePath')).toBe('');
  });

  // Copy functionality tests
  it('should copy node to clipboard', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Setup a node to copy
    act(() => {
      result.current.addNode([], 'Node to Copy');
      result.current.addNode([0], 'Child Node');
    });

    // Mock clipboard API
    (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      await result.current.copyNode([0]);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Node to Copy\n\tChild Node');
  });

  it('should handle copy failure with fallback', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Setup a node to copy
    act(() => {
      result.current.addNode([], 'Node to Copy');
    });

    // Mock clipboard API failure
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('Clipboard error'));

    // Mock console.error to suppress error output
    const originalError = console.error;
    console.error = jest.fn();

    await act(async () => {
      await result.current.copyNode([0]);
    });

    // Should fallback to document.execCommand
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    
    // Restore console.error
    console.error = originalError;
  });

  it('should not copy non-existent node', async () => {
    const { result } = renderHook(() => useMindMapStore());

    await act(async () => {
      await result.current.copyNode([999]);
    });

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  // Paste functionality tests
  it('should paste nodes from clipboard', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Setup target node
    act(() => {
      result.current.addNode([], 'Target Node');
    });

    // Mock clipboard content - when parsed, creates root with children
    // The parsed structure will be: { root: { text: 'Pasted Node', children: [{ text: 'Child Node', children: [] }] } }
    // But we only add the root's children to the target, so the target gets: [{ text: 'Child Node', children: [] }]
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Root Node\n\tPasted Node\n\t\tChild Node');

    await act(async () => {
      await result.current.pasteNode([0]);
    });

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(result.current.mindmap.root.children[0].children).toHaveLength(1);
    expect(result.current.mindmap.root.children[0].children[0].text).toBe('Pasted Node');
    expect(result.current.mindmap.root.children[0].children[0].children).toHaveLength(1);
    expect(result.current.mindmap.root.children[0].children[0].children[0].text).toBe('Child Node');
  });

  it('should handle paste error gracefully', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Setup target node
    act(() => {
      result.current.addNode([], 'Target Node');
    });

    // Mock clipboard error
    (navigator.clipboard.readText as jest.Mock).mockRejectedValue(new Error('Clipboard error'));
    
    // Mock console.error to suppress error output
    const originalError = console.error;
    console.error = jest.fn();

    await act(async () => {
      await result.current.pasteNode([0]);
    });

    // Should not throw error, just log it
    expect(result.current.mindmap.root.children[0].children).toHaveLength(0);
    
    // Restore console.error
    console.error = originalError;
  });

  it('should not paste invalid clipboard content', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Setup target node
    act(() => {
      result.current.addNode([], 'Target Node');
    });

    // Mock invalid clipboard content
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Invalid content without proper root');

    await act(async () => {
      await result.current.pasteNode([0]);
    });

    // Should not add any nodes
    expect(result.current.mindmap.root.children[0].children).toHaveLength(0);
  });

  it('should not paste to non-existent node', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Mock clipboard content
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Pasted Node');

    await act(async () => {
      await result.current.pasteNode([999]);
    });

    // The function should still attempt to read clipboard but fail silently
    expect(navigator.clipboard.readText).toHaveBeenCalled();
  });

  // Helper function tests
  it('should find node correctly', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.addNode([], 'Parent');
      result.current.addNode([0], 'Child');
    });

    // The findNode function is not exposed, but we can test its behavior through other functions
    expect(result.current.mindmap.root.children[0].text).toBe('Parent');
    expect(result.current.mindmap.root.children[0].children[0].text).toBe('Child');
  });
});