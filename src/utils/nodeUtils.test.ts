import { 
  isNodeOnSelectedPath, 
  isNodeSelected, 
  hasChildren, 
  getNodeType 
} from './nodeUtils';
import { MindNode } from '../types';

describe('Node Utils', () => {
  const mockNodeWithChildren: MindNode = {
    text: 'Parent Node',
    children: [
      { text: 'Child 1', children: [] },
      { text: 'Child 2', children: [] }
    ]
  };

  const mockNodeWithoutChildren: MindNode = {
    text: 'Leaf Node',
    children: []
  };

  describe('isNodeOnSelectedPath', () => {
    it('should return true when node is on selected path (prefix)', () => {
      const nodePath = [0, 1];
      const selectedPath = [0, 1, 2];
      
      expect(isNodeOnSelectedPath(nodePath, selectedPath)).toBe(true);
    });

    it('should return true when node is on selected path (suffix)', () => {
      const nodePath = [0, 1, 2];
      const selectedPath = [0, 1];
      
      expect(isNodeOnSelectedPath(nodePath, selectedPath)).toBe(true);
    });

    it('should return true when paths are identical', () => {
      const nodePath = [0, 1, 2];
      const selectedPath = [0, 1, 2];
      
      expect(isNodeOnSelectedPath(nodePath, selectedPath)).toBe(true);
    });

    it('should return false when paths diverge', () => {
      const nodePath = [0, 1];
      const selectedPath = [0, 2];
      
      expect(isNodeOnSelectedPath(nodePath, selectedPath)).toBe(false);
    });

    it('should return false when node path is empty', () => {
      const nodePath: number[] = [];
      const selectedPath = [0, 1];
      
      expect(isNodeOnSelectedPath(nodePath, selectedPath)).toBe(false);
    });

    it('should return false when selected path is empty', () => {
      const nodePath = [0, 1];
      const selectedPath: number[] = [];
      
      expect(isNodeOnSelectedPath(nodePath, selectedPath)).toBe(false);
    });
  });

  describe('isNodeSelected', () => {
    it('should return true when paths are identical', () => {
      const nodePath = [0, 1, 2];
      const selectedPath = [0, 1, 2];
      
      expect(isNodeSelected(nodePath, selectedPath)).toBe(true);
    });

    it('should return false when paths have different lengths', () => {
      const nodePath = [0, 1];
      const selectedPath = [0, 1, 2];
      
      expect(isNodeSelected(nodePath, selectedPath)).toBe(false);
    });

    it('should return false when paths differ', () => {
      const nodePath = [0, 1];
      const selectedPath = [0, 2];
      
      expect(isNodeSelected(nodePath, selectedPath)).toBe(false);
    });

    it('should return true when both paths are empty', () => {
      const nodePath: number[] = [];
      const selectedPath: number[] = [];
      
      expect(isNodeSelected(nodePath, selectedPath)).toBe(true);
    });
  });

  describe('hasChildren', () => {
    it('should return true when node has children', () => {
      expect(hasChildren(mockNodeWithChildren)).toBe(true);
    });

    it('should return true when node has empty children array', () => {
      const nodeWithEmptyArray: MindNode = {
        text: 'Empty Array',
        children: []
      };
      
      expect(hasChildren(nodeWithEmptyArray)).toBe(false);
    });

    it('should return false when node has no children property', () => {
      const nodeWithoutChildrenProp = {
        text: 'No Children Prop'
      } as unknown as MindNode;
      
      expect(hasChildren(nodeWithoutChildrenProp)).toBe(false);
    });

    it('should return false when children is undefined', () => {
      const nodeWithUndefinedChildren = {
        text: 'Undefined Children',
        children: undefined
      } as unknown as MindNode;
      
      expect(hasChildren(nodeWithUndefinedChildren)).toBe(false);
    });
  });

  describe('getNodeType', () => {
    it('should return "selected" when node is selected', () => {
      const nodePath = [0, 1];
      const selectedPath = [0, 1];
      
      expect(getNodeType(mockNodeWithChildren, nodePath, selectedPath)).toBe('selected');
    });

    it('should return "onPath" when node is on selected path but not selected', () => {
      const nodePath = [0];
      const selectedPath = [0, 1];
      
      expect(getNodeType(mockNodeWithChildren, nodePath, selectedPath)).toBe('onPath');
    });

    it('should return "withChildren" when node has children but not on path', () => {
      const nodePath = [0, 1];
      const selectedPath = [2, 3];
      
      expect(getNodeType(mockNodeWithChildren, nodePath, selectedPath)).toBe('withChildren');
    });

    it('should return "withoutChildren" when node has no children and not on path', () => {
      const nodePath = [0, 1];
      const selectedPath = [2, 3];
      
      expect(getNodeType(mockNodeWithoutChildren, nodePath, selectedPath)).toBe('withoutChildren');
    });

    it('should prioritize "selected" over other types', () => {
      const nodePath = [0, 1];
      const selectedPath = [0, 1];
      
      // Even though the node has children, it should return 'selected' because it's selected
      expect(getNodeType(mockNodeWithChildren, nodePath, selectedPath)).toBe('selected');
    });

    it('should prioritize "onPath" over children status', () => {
      const nodePath = [0];
      const selectedPath = [0, 1];
      
      // Even though the node has children, it should return 'onPath' because it's on the selected path
      expect(getNodeType(mockNodeWithChildren, nodePath, selectedPath)).toBe('onPath');
    });

    it('should handle empty paths', () => {
      const nodePath: number[] = [];
      const selectedPath: number[] = [];
      
      expect(getNodeType(mockNodeWithoutChildren, nodePath, selectedPath)).toBe('selected');
    });

    it('should handle complex nested scenarios', () => {
      const complexNode: MindNode = {
        text: 'Root',
        children: [
          {
            text: 'Child 1',
            children: [
              { text: 'Grandchild 1', children: [] },
              { text: 'Grandchild 2', children: [] }
            ]
          },
          { text: 'Child 2', children: [] }
        ]
      };

      // Test deep selection
      expect(getNodeType(complexNode, [0, 0], [0, 0, 0])).toBe('onPath');
      expect(getNodeType(complexNode, [0, 0], [0, 0])).toBe('selected');
      expect(getNodeType(complexNode, [1], [0, 0])).toBe('withChildren');
      expect(getNodeType(complexNode, [0, 0], [1])).toBe('withChildren');
      expect(getNodeType(complexNode, [0, 0], [])).toBe('withChildren');
    });
  });
});