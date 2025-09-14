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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.assign(global, { localStorage: localStorageMock });


describe('mindmapStore', () => {
  // Clear localStorage and mocks before each test
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    
    // Reset the store state to initial values
    const { result } = renderHook(() => useMindMapStore());
    act(() => {
      result.current.reset();
    });
  });

  it('should add a node', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.setMindmap({ root: { text: 'Root', children: [] } });
      result.current.addNode([], 'New Node');
    });

    expect(result.current.mindmap.root.children).toHaveLength(1);
    expect(result.current.mindmap.root.children[0].text).toBe('New Node');
  });

  it('should delete a node', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.setMindmap({ root: { text: 'Root', children: [] } });
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
    // The parsed structure will be: { root: { text: 'Root', children: [{ text: 'Pasted Node', children: [{ text: 'Child Node', children: [] }] }] } }
    // When pasting to non-root node, we add the root's children to the target
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Pasted Node\n\tChild Node');

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

    // Mock invalid clipboard content (empty)
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('');

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

  // Enhanced paste functionality tests for Task 28
  it('should preserve root content when pasting to root node', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Mock clipboard with root and children
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Root Content\n\tChild 1\n\tChild 2');

    await act(async () => {
      await result.current.pasteNode([]);
    });

    expect(result.current.mindmap.root.text).toBe('Root Content'); // Root text preserved
    expect(result.current.mindmap.root.children).toHaveLength(2); // Children added
    expect(result.current.mindmap.root.children[0].text).toBe('Child 1');
    expect(result.current.mindmap.root.children[1].text).toBe('Child 2');
  });

  it('should add standalone root as child when pasting to root', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Mock clipboard with standalone root (no children)
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Standalone Root');

    await act(async () => {
      await result.current.pasteNode([]);
    });

    expect(result.current.mindmap.root.text).toBe('Standalone Root'); // Root text updated
    expect(result.current.mindmap.root.children).toHaveLength(0); // No children added
  });

  it('should add root content as children when pasting to non-root node', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Setup target node
    act(() => {
      result.current.addNode([], 'Target Node');
    });

    // Mock clipboard with root and children
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Root Content\n\tChild 1\n\tChild 2');

    await act(async () => {
      await result.current.pasteNode([0]);
    });

    expect(result.current.mindmap.root.children[0].text).toBe('Target Node'); // Target preserved
    expect(result.current.mindmap.root.children[0].children).toHaveLength(1); // Root content added as single child
    expect(result.current.mindmap.root.children[0].children[0].text).toBe('Root Content');
    expect(result.current.mindmap.root.children[0].children[0].children).toHaveLength(2); // Children of root content
    expect(result.current.mindmap.root.children[0].children[0].children[0].text).toBe('Child 1');
    expect(result.current.mindmap.root.children[0].children[0].children[1].text).toBe('Child 2');
  });

  it('should handle fallback clipboard API when modern API is not available', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Setup target node
    act(() => {
      result.current.addNode([], 'Target Node');
    });

    // Mock modern clipboard API as unavailable
    const originalClipboard = navigator.clipboard;
    Object.assign(navigator, {
      clipboard: { readText: undefined }
    });

    // Mock document.execCommand fallback
    const mockTextArea = {
      value: 'Fallback Content\n\tChild Content',
      select: jest.fn(),
      blur: jest.fn()
    };
    document.createElement = jest.fn().mockReturnValue(mockTextArea);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    (document.execCommand as jest.Mock).mockImplementation((command) => {
      if (command === 'paste') {
        mockTextArea.value = 'Fallback Content\n\tChild Content';
        return true;
      }
      return false;
    });

    await act(async () => {
      await result.current.pasteNode([0]);
    });

    // Should have used fallback and added content
    expect(result.current.mindmap.root.children[0].children).toHaveLength(1);
    expect(result.current.mindmap.root.children[0].children[0].text).toBe('Fallback Content');

    // Restore clipboard
    Object.assign(navigator, { clipboard: originalClipboard });
  });

  // Helper function tests are covered by other test cases
});