/* eslint-disable testing-library/no-node-access */
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
  });

  it('should add a node', () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

    act(() => {
      result.current.setMindmap({ root: { text: 'Root', children: [] } });
      result.current.addNode([], 'New Node');
    });

    expect(result.current.mindmap.root.children).toHaveLength(1);
    expect(result.current.mindmap.root.children[0]?.text).toBe('New Node');
  });

  it('should delete a node', () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

    act(() => {
      result.current.addNode([], 'New Node');
    });

    act(() => {
      result.current.updateNodeText([0], 'Updated Text');
    });

    expect(result.current.mindmap.root.children[0]?.text).toBe('Updated Text');
  });

  it('should set selected child', () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

    expect(result.current.jsonFilePath).toBeNull();
    expect(result.current.textFilePath).toBeNull();
  });

  it('should set JSON file path', () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

    act(() => {
      result.current.setJsonFilePath('/path/to/file.json');
    });

    expect(result.current.jsonFilePath).toBe('/path/to/file.json');
    expect(localStorage.getItem('jsonFilePath')).toBe('/path/to/file.json');
  });

  it('should set text file path', () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

    act(() => {
      result.current.setTextFilePath('/path/to/file.txt');
    });

    expect(result.current.textFilePath).toBe('/path/to/file.txt');
    expect(localStorage.getItem('textFilePath')).toBe('/path/to/file.txt');
  });

  it('should clear file paths', () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

    await act(async () => {
      await result.current.copyNode([999]);
    });

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  // Paste functionality tests
  it('should paste nodes from clipboard', async () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    expect(result.current.mindmap.root.children[0]?.children).toHaveLength(1);
    expect(result.current.mindmap.root.children[0]?.children?.[0]?.text).toBe('Pasted Node');
    expect(result.current.mindmap.root.children[0]?.children?.[0]?.children).toHaveLength(1);
    expect(result.current.mindmap.root.children[0]?.children?.[0]?.children?.[0]?.text).toBe('Child Node');
  });

  it('should handle paste error gracefully', async () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    expect(result.current.mindmap.root.children[0]?.children).toHaveLength(0);
    
    // Restore console.error
    console.error = originalError;
  });

  it('should not paste invalid clipboard content', async () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    expect(result.current.mindmap.root.children[0]?.children).toHaveLength(0);
  });

  it('should not paste to non-existent node', async () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

    // Mock clipboard with root and children
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Root Content\n\tChild 1\n\tChild 2');

    await act(async () => {
      await result.current.pasteNode([]);
    });

    expect(result.current.mindmap.root.text).toBe('Root Content'); // Root text preserved
    expect(result.current.mindmap.root.children).toHaveLength(2); // Children added
    expect(result.current.mindmap.root.children[0]?.text).toBe('Child 1');
    expect(result.current.mindmap.root.children[1]?.text).toBe('Child 2');
  });

  it('should add standalone root as child when pasting to root', async () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

    // Setup target node
    act(() => {
      result.current.addNode([], 'Target Node');
    });

    // Mock clipboard with root and children
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Root Content\n\tChild 1\n\tChild 2');

    await act(async () => {
      await result.current.pasteNode([0]);
    });

    expect(result.current.mindmap.root.children[0]?.text).toBe('Target Node'); // Target preserved
    expect(result.current.mindmap.root.children[0]?.children).toHaveLength(1); // Root content added as single child
    expect(result.current.mindmap.root.children[0]?.children?.[0]?.text).toBe('Root Content');
    expect(result.current.mindmap.root.children[0]?.children?.[0]?.children).toHaveLength(2); // Children of root content
    expect(result.current.mindmap.root.children[0]?.children?.[0]?.children?.[0]?.text).toBe('Child 1');
    expect(result.current.mindmap.root.children[0]?.children?.[0]?.children?.[1]?.text).toBe('Child 2');
  });

  it('should handle fallback clipboard API when modern API is not available', async () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Reset store to initial state
    act(() => {
      result.current.reset();
    });

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
    expect(result.current.mindmap.root.children[0]?.children).toHaveLength(1);
    expect(result.current.mindmap.root.children[0]?.children?.[0]?.text).toBe('Fallback Content');

    // Restore clipboard
    Object.assign(navigator, { clipboard: originalClipboard });
  });

  // Helper function tests are covered by other test cases

  // Task 46: Move Operations Tests
  describe('moveNodeUp', () => {
    it('should move node up by swapping with previous sibling', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [], selected_child_idx: 0 },
            { text: 'Node 3', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      store.moveNodeUp([1]); // Move Node 2 up

      expect(store.mindmap.root.children[0].text).toBe('Node 2');
      expect(store.mindmap.root.children[1].text).toBe('Node 1');
      expect(store.mindmap.root.children[2].text).toBe('Node 3');
      expect(store.mindmap.root.selected_child_idx).toBe(0); // Updated selected_child_idx
    });

    it('should not move root node', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      store.moveNodeUp([]); // Try to move root

      expect(store.mindmap.root.children[0].text).toBe('Node 1');
      expect(store.mindmap.root.children[1].text).toBe('Node 2');
    });

    it('should not move first child up', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      store.moveNodeUp([0]); // Try to move first child

      expect(store.mindmap.root.children[0].text).toBe('Node 1');
      expect(store.mindmap.root.children[1].text).toBe('Node 2');
    });

    it('should move nested node up and update parent selected_child_idx', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            {
              text: 'Parent',
              children: [
                { text: 'Child 1', children: [] },
                { text: 'Child 2', children: [] },
                { text: 'Child 3', children: [] },
              ],
              selected_child_idx: 1,
            },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      store.moveNodeUp([0, 2]); // Move Child 3 up

      expect(store.mindmap.root.children[0].children[0].text).toBe('Child 1');
      expect(store.mindmap.root.children[0].children[1].text).toBe('Child 3');
      expect(store.mindmap.root.children[0].children[2].text).toBe('Child 2');
      expect(store.mindmap.root.children[0].selected_child_idx).toBe(1); // Updated selected_child_idx
    });
  });

  describe('moveNodeDown', () => {
    it('should move node down by swapping with next sibling', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [], selected_child_idx: 0 },
            { text: 'Node 3', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      store.moveNodeDown([1]); // Move Node 2 down

      expect(store.mindmap.root.children[0].text).toBe('Node 1');
      expect(store.mindmap.root.children[1].text).toBe('Node 3');
      expect(store.mindmap.root.children[2].text).toBe('Node 2');
      expect(store.mindmap.root.selected_child_idx).toBe(2); // Updated selected_child_idx
    });

    it('should not move root node', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      store.moveNodeDown([]); // Try to move root

      expect(store.mindmap.root.children[0].text).toBe('Node 1');
      expect(store.mindmap.root.children[1].text).toBe('Node 2');
    });

    it('should not move last child down', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      store.moveNodeDown([1]); // Try to move last child

      expect(store.mindmap.root.children[0].text).toBe('Node 1');
      expect(store.mindmap.root.children[1].text).toBe('Node 2');
    });

    it('should move nested node down and update parent selected_child_idx', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            {
              text: 'Parent',
              children: [
                { text: 'Child 1', children: [] },
                { text: 'Child 2', children: [] },
                { text: 'Child 3', children: [] },
              ],
              selected_child_idx: 1,
            },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      store.moveNodeDown([0, 0]); // Move Child 1 down

      expect(store.mindmap.root.children[0].children[0].text).toBe('Child 2');
      expect(store.mindmap.root.children[0].children[1].text).toBe('Child 1');
      expect(store.mindmap.root.children[0].children[2].text).toBe('Child 3');
      expect(store.mindmap.root.children[0].selected_child_idx).toBe(1); // Updated selected_child_idx
    });

    // Task 47: Move operation path return tests
    it('should return new path when moving node up', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [] },
            { text: 'Node 3', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      const newPath = store.moveNodeUp([2]); // Move Node 3 up
      expect(newPath).toEqual([1]); // Should return new position [1]
    });

    it('should return new path when moving node down', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [] },
            { text: 'Node 3', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      const newPath = store.moveNodeDown([0]); // Move Node 1 down
      expect(newPath).toEqual([1]); // Should return new position [1]
    });

    it('should return original path when move operation fails', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      // Try to move first node up (should fail)
      const newPath1 = store.moveNodeUp([0]);
      expect(newPath1).toEqual([0]); // Should return original path

      // Try to move last node down (should fail)
      const newPath2 = store.moveNodeDown([1]);
      expect(newPath2).toEqual([1]); // Should return original path

      // Try to move root (should fail)
      const newPath3 = store.moveNodeUp([]);
      expect(newPath3).toEqual([]); // Should return original path
    });
  });

  // Task 46: Format-Specific Copy/Paste Tests
  describe('copyNodeAsJson', () => {
    beforeEach(() => {
      jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should copy node as JSON string', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            {
              text: 'Node 1',
              children: [
                { text: 'Child 1', children: [] },
              ],
            },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.copyNodeAsJson([0]);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify({
          text: 'Node 1',
          children: [
            { text: 'Child 1', children: [] },
          ],
        }, null, 2)
      );
    });

    it('should not copy if node does not exist', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.copyNodeAsJson([0]);

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it('should handle clipboard API failure with fallback', async () => {
      // Mock console.error to suppress error output
      const originalError = console.error;
      console.error = jest.fn();
      
      jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Clipboard API failed'));
      const mockExecCommand = jest.spyOn(document, 'execCommand').mockReturnValue(true);
      const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'textarea') {
          return {
            value: '',
            select: jest.fn(),
            appendChild: jest.fn(),
            removeChild: jest.fn(),
          } as any;
        }
        return document.createElement(tagName);
      });

      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.copyNodeAsJson([0]);

      expect(mockCreateElement).toHaveBeenCalledWith('textarea');
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      
      // Restore console.error
      console.error = originalError;
    });
  });

  describe('copyNodeAsText', () => {
    beforeEach(() => {
      jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should copy node as text format', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            {
              text: 'Node 1',
              children: [
                { text: 'Child 1', children: [] },
              ],
            },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.copyNodeAsText([0]);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Node 1\n\tChild 1'
      );
    });

    it('should not copy if node does not exist', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.copyNodeAsText([0]);

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });
  });

  describe('pasteNodeAsJson', () => {
    beforeEach(() => {
      jest.spyOn(navigator.clipboard, 'readText').mockResolvedValue('{"text":"Pasted Node","children":[{"text":"Pasted Child","children":[]}]}');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should paste valid JSON node', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.pasteNodeAsJson([0]);

      expect(store.mindmap.root.children[0].children).toHaveLength(1);
      expect(store.mindmap.root.children[0].children[0].text).toBe('Pasted Node');
      expect(store.mindmap.root.children[0].children[0].children[0].text).toBe('Pasted Child');
    });

    it('should not paste invalid JSON', async () => {
      // Mock console.error to suppress error output
      const originalError = console.error;
      console.error = jest.fn();
      
      jest.spyOn(navigator.clipboard, 'readText').mockResolvedValue('invalid json');

      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.pasteNodeAsJson([0]);

      expect(store.mindmap.root.children[0].children).toHaveLength(0);
      
      // Restore console.error
      console.error = originalError;
    });

    it('should not paste node without required structure', async () => {
      jest.spyOn(navigator.clipboard, 'readText').mockResolvedValue('{"invalid":"structure"}');

      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.pasteNodeAsJson([0]);

      expect(store.mindmap.root.children[0].children).toHaveLength(0);
    });

    it('should handle empty clipboard', async () => {
      jest.spyOn(navigator.clipboard, 'readText').mockResolvedValue('');

      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.pasteNodeAsJson([0]);

      expect(store.mindmap.root.children[0].children).toHaveLength(0);
    });
  });

  describe('pasteNodeAsText', () => {
    beforeEach(() => {
      jest.spyOn(navigator.clipboard, 'readText').mockResolvedValue('Pasted Node\n\tPasted Child 1\n\tPasted Child 2');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should paste text format as nodes', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.pasteNodeAsText([0]);

      expect(store.mindmap.root.children[0].children).toHaveLength(1);
      expect(store.mindmap.root.children[0].children[0].text).toBe('Pasted Node');
      expect(store.mindmap.root.children[0].children[0].children[0].text).toBe('Pasted Child 1');
      expect(store.mindmap.root.children[0].children[0].children[1].text).toBe('Pasted Child 2');
    });

    it('should not paste invalid text format when it starts with indentation', async () => {
      // Text format is invalid if it starts with indentation (depth > 0)
      jest.spyOn(navigator.clipboard, 'readText').mockResolvedValue('\tInvalid text format');

      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.pasteNodeAsText([0]);

      expect(store.mindmap.root.children[0].children).toHaveLength(0);
    });

    it('should handle empty clipboard', async () => {
      jest.spyOn(navigator.clipboard, 'readText').mockResolvedValue('');

      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.pasteNodeAsText([0]);

      expect(store.mindmap.root.children[0].children).toHaveLength(0);
    });
  });

  describe('cutNodeAsJson', () => {
    beforeEach(() => {
      jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should cut node as JSON string and delete it', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.cutNodeAsJson([0]);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify({
          text: 'Node 1',
          children: [],
        }, null, 2)
      );
      expect(store.mindmap.root.children).toHaveLength(1);
      expect(store.mindmap.root.children[0]?.text).toBe('Node 2');
    });

    it('should cut node with children as JSON string and delete it', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            {
              text: 'Node 1',
              children: [
                { text: 'Child 1', children: [] },
              ],
            },
            { text: 'Node 2', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.cutNodeAsJson([0]);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify({
          text: 'Node 1',
          children: [
            { text: 'Child 1', children: [] },
          ],
        }, null, 2)
      );
      expect(store.mindmap.root.children).toHaveLength(1);
      expect(store.mindmap.root.children[0]?.text).toBe('Node 2');
    });

    it('should not cut if node does not exist', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.cutNodeAsJson([1]); // Non-existent node

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
      expect(store.mindmap.root.children).toHaveLength(1);
      expect(store.mindmap.root.children[0]?.text).toBe('Node 1');
    });

    it('should handle clipboard API failure with fallback', async () => {
      // Mock console.error to suppress error output
      const originalError = console.error;
      console.error = jest.fn();

      jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Clipboard API failed'));

      // Mock document methods for fallback
      const mockCreateElement = jest.spyOn(document, 'createElement').mockReturnValue({
        value: '',
        select: jest.fn(),
      } as any);
      const mockAppendChild = jest.spyOn(document.body, 'appendChild').mockImplementation();
      const mockRemoveChild = jest.spyOn(document.body, 'removeChild').mockImplementation();
      const mockExecCommand = jest.spyOn(document, 'execCommand').mockReturnValue(true);

      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.cutNodeAsJson([0]);

      expect(mockCreateElement).toHaveBeenCalledWith('textarea');
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(store.mindmap.root.children).toHaveLength(0); // Node should still be deleted

      // Restore all mocks and console.error
      mockCreateElement.mockRestore();
      mockAppendChild.mockRestore();
      mockRemoveChild.mockRestore();
      mockExecCommand.mockRestore();
      console.error = originalError;
    });
  });

  describe('cutNodeAsText', () => {
    beforeEach(() => {
      jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should cut node as text format and delete it', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.cutNodeAsText([0]);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Node 1');
      expect(store.mindmap.root.children).toHaveLength(1);
      expect(store.mindmap.root.children[0]?.text).toBe('Node 2');
    });

    it('should cut node with children as text format and delete it', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            {
              text: 'Node 1',
              children: [
                { text: 'Child 1', children: [] },
              ],
            },
            { text: 'Node 2', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.cutNodeAsText([0]);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Node 1\n\tChild 1');
      expect(store.mindmap.root.children).toHaveLength(1);
      expect(store.mindmap.root.children[0]?.text).toBe('Node 2');
    });

    it('should not cut if node does not exist', async () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      await store.cutNodeAsText([1]); // Non-existent node

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
      expect(store.mindmap.root.children).toHaveLength(1);
      expect(store.mindmap.root.children[0]?.text).toBe('Node 1');
    });
  });

  // Task 56: Move + Edit Integration Tests
  describe('Move + Edit Integration', () => {
    it('should maintain correct text after move and edit operations', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [] },
            { text: 'Node 3', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      // Move Node 3 up (should move to position 1)
      const newPath = store.moveNodeUp([2]);
      expect(newPath).toEqual([1]);

      // Verify the move worked correctly
      expect(store.mindmap.root.children[0]?.text).toBe('Node 1');
      expect(store.mindmap.root.children[1]?.text).toBe('Node 3'); // Moved up
      expect(store.mindmap.root.children[2]?.text).toBe('Node 2');

      // Now edit the text of the moved node (at new path [1])
      store.updateNodeText([1], 'Edited Node 3');

      // Verify the correct node was updated
      expect(store.mindmap.root.children[0]?.text).toBe('Node 1');
      expect(store.mindmap.root.children[1]?.text).toBe('Edited Node 3');
      expect(store.mindmap.root.children[2]?.text).toBe('Node 2');
    });

    it('should maintain correct text after move down and edit operations', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [] },
            { text: 'Node 3', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      // Move Node 1 down (should move to position 1)
      const newPath = store.moveNodeDown([0]);
      expect(newPath).toEqual([1]);

      // Verify the move worked correctly
      expect(store.mindmap.root.children[0]?.text).toBe('Node 2');
      expect(store.mindmap.root.children[1]?.text).toBe('Node 1'); // Moved down
      expect(store.mindmap.root.children[2]?.text).toBe('Node 3');

      // Now edit the text of the moved node (at new path [1])
      store.updateNodeText([1], 'Edited Node 1');

      // Verify the correct node was updated
      expect(store.mindmap.root.children[0]?.text).toBe('Node 2');
      expect(store.mindmap.root.children[1]?.text).toBe('Edited Node 1');
      expect(store.mindmap.root.children[2]?.text).toBe('Node 3');
    });

    it('should handle multiple moves and edits correctly', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'A', children: [] },
            { text: 'B', children: [] },
            { text: 'C', children: [] },
            { text: 'D', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      // Move D up twice (from [3] to [2] to [1])
      let newPath = store.moveNodeUp([3]);
      expect(newPath).toEqual([2]);
      newPath = store.moveNodeUp([2]);
      expect(newPath).toEqual([1]);

      // Verify position after moves
      expect(store.mindmap.root.children[0]?.text).toBe('A');
      expect(store.mindmap.root.children[1]?.text).toBe('D'); // Moved up twice
      expect(store.mindmap.root.children[2]?.text).toBe('B');
      expect(store.mindmap.root.children[3]?.text).toBe('C');

      // Edit the moved node
      store.updateNodeText([1], 'Moved D');

      // Move B down
      store.moveNodeDown([2]);

      // Edit B at its new position
      store.updateNodeText([3], 'Moved B');

      // Verify final state
      expect(store.mindmap.root.children[0]?.text).toBe('A');
      expect(store.mindmap.root.children[1]?.text).toBe('Moved D');
      expect(store.mindmap.root.children[2]?.text).toBe('C');
      expect(store.mindmap.root.children[3]?.text).toBe('Moved B');
    });

    it('should update selected_child_idx correctly during moves', () => {
      const initialMindmap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Node 1', children: [] },
            { text: 'Node 2', children: [], selected_child_idx: 0 },
            { text: 'Node 3', children: [] },
          ],
        },
      };

      useMindMapStore.setState({ mindmap: initialMindmap });
      const store = useMindMapStore.getState();

      // Move Node 1 up (should not move since it's already at top)
      const newPath = store.moveNodeUp([0]);
      expect(newPath).toEqual([0]); // No change

      // Move Node 3 up (should move to position 1)
      store.moveNodeUp([2]);

      // Verify selected_child_idx is updated to point to the moved node's new position
      expect(store.mindmap.root.selected_child_idx).toBe(1); // Points to moved Node 3
    });
  });
});