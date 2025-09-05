import { renderHook, act } from '@testing-library/react';
import { useMindMapStore } from './mindmapStore';

describe('mindmapStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useMindMapStore());
    act(() => {
      result.current.setMindmap({ root: { text: 'Root', children: [] } });
      result.current.clearFilePaths();
    });
    
    // Clear localStorage
    localStorage.clear();
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

  it('should handle onDragEnd', () => {
    const { result } = renderHook(() => useMindMapStore());

    act(() => {
      result.current.addNode([], 'Node 1');
      result.current.addNode([], 'Node 2');
    });

    expect(result.current.mindmap.root.children[0].text).toBe('Node 1');
    expect(result.current.mindmap.root.children[1].text).toBe('Node 2');

    const dragResult = {
      source: { droppableId: '[]', index: 0 },
      destination: { droppableId: '[]', index: 1 },
      draggableId: '[0]',
    };

    act(() => {
      // @ts-ignore
      result.current.onDragEnd(dragResult);
    });

    expect(result.current.mindmap.root.children[0].text).toBe('Node 2');
    expect(result.current.mindmap.root.children[1].text).toBe('Node 1');
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
});