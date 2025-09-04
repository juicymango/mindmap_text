
import { renderHook, act } from '@testing-library/react';
import { useMindMapStore } from './mindmapStore';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('mindmapStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useMindMapStore());
    act(() => {
      result.current.setMindmap({ root: { id: 'root', text: 'Root', children: [] } });
    });
    (uuidv4 as jest.Mock).mockClear();
  });

  it('should add a node', () => {
    const { result } = renderHook(() => useMindMapStore());
    const nodeId = 'node1';
    (uuidv4 as jest.Mock).mockReturnValue(nodeId);

    act(() => {
      result.current.addNode('root', 'New Node');
    });

    expect(result.current.mindmap.root.children).toHaveLength(1);
    expect(result.current.mindmap.root.children[0].id).toBe(nodeId);
    expect(result.current.mindmap.root.children[0].text).toBe('New Node');
  });

  it('should delete a node', () => {
    const { result } = renderHook(() => useMindMapStore());
    const nodeId = 'node1';
    (uuidv4 as jest.Mock).mockReturnValue(nodeId);

    act(() => {
      result.current.addNode('root', 'New Node');
    });

    expect(result.current.mindmap.root.children).toHaveLength(1);

    act(() => {
      result.current.deleteNode(nodeId);
    });

    expect(result.current.mindmap.root.children).toHaveLength(0);
  });

  it('should update node text', () => {
    const { result } = renderHook(() => useMindMapStore());
    const nodeId = 'node1';
    (uuidv4 as jest.Mock).mockReturnValue(nodeId);

    act(() => {
      result.current.addNode('root', 'New Node');
    });

    act(() => {
      result.current.updateNodeText(nodeId, 'Updated Text');
    });

    expect(result.current.mindmap.root.children[0].text).toBe('Updated Text');
  });

  it('should set selected child', () => {
    const { result } = renderHook(() => useMindMapStore());
    const childId = 'child1';
    (uuidv4 as jest.Mock).mockReturnValueOnce('node1').mockReturnValueOnce(childId);

    act(() => {
      result.current.addNode('root', 'Parent Node');
    });
    
    const parentId = result.current.mindmap.root.children[0].id;

    act(() => {
        result.current.addNode(parentId, 'Child Node');
    });

    act(() => {
      result.current.setSelectedChild(parentId, childId);
    });

    const parentNode = result.current.mindmap.root.children.find(c => c.id === parentId);
    expect(parentNode?.selected_child_id).toBe(childId);
  });

  it('should handle onDragEnd', () => {
    const { result } = renderHook(() => useMindMapStore());
    const node1Id = 'node1';
    const node2Id = 'node2';
    (uuidv4 as jest.Mock).mockReturnValueOnce(node1Id).mockReturnValueOnce(node2Id);

    act(() => {
      result.current.addNode('root', 'Node 1');
      result.current.addNode('root', 'Node 2');
    });

    expect(result.current.mindmap.root.children[0].id).toBe(node1Id);
    expect(result.current.mindmap.root.children[1].id).toBe(node2Id);

    const dragResult = {
      source: { droppableId: 'root', index: 0 },
      destination: { droppableId: 'root', index: 1 },
      draggableId: node1Id,
    };

    act(() => {
      // @ts-ignore
      result.current.onDragEnd(dragResult);
    });

    expect(result.current.mindmap.root.children[0].id).toBe(node2Id);
    expect(result.current.mindmap.root.children[1].id).toBe(node1Id);
  });
});
