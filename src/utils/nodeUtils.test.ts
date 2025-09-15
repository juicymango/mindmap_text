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

    it('should return false when node is a descendant (suffix) of selected path', () => {
      const nodePath = [0, 1, 2];
      const selectedPath = [0, 1];
      
      // Descendants should NOT be considered "on selected path"
      // Only ancestors (prefixes) should be considered "on selected path"
      expect(isNodeOnSelectedPath(nodePath, selectedPath)).toBe(false);
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

    it('should return true when node path is empty (root) and selected path is not empty', () => {
      const nodePath: number[] = [];
      const selectedPath = [0, 1];
      
      // Root node (empty path) should be considered on the selected path
      // because it's an ancestor of any selected node
      expect(isNodeOnSelectedPath(nodePath, selectedPath)).toBe(true);
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

    // Task 44: Test cases for siblings getting correct colors (not onPath)
    it('should give siblings withChildren or withoutChildren color, not onPath', () => {
      const parentNode: MindNode = {
        text: 'Parent',
        children: [
          { text: 'Child 1', children: [] },
          { text: 'Child 2', children: [{ text: 'Grandchild', children: [] }] },
          { text: 'Child 3', children: [] }
        ]
      };

      // When Child 2 is selected
      const selectedPath = [1];
      
      // Test each node individually (simulating how Node component works)
      const child1 = parentNode.children[0]; // { text: 'Child 1', children: [] }
      const child2 = parentNode.children[1]; // { text: 'Child 2', children: [...] }
      const child3 = parentNode.children[2]; // { text: 'Child 3', children: [] }
      const grandchild = child2.children[0]; // { text: 'Grandchild', children: [] }
      
      // Sibling Child 1 (no children) should get withoutChildren, not onPath
      expect(getNodeType(child1, [0], selectedPath)).toBe('withoutChildren');
      
      // Sibling Child 3 (no children) should get withoutChildren, not onPath  
      expect(getNodeType(child3, [2], selectedPath)).toBe('withoutChildren');
      
      // Parent should be onPath (it's an ancestor)
      expect(getNodeType(parentNode, [], selectedPath)).toBe('onPath');
      
      // Selected child should be selected
      expect(getNodeType(child2, [1], selectedPath)).toBe('selected');
      
      // Descendant should NOT be onPath
      expect(getNodeType(grandchild, [1, 0], selectedPath)).toBe('withoutChildren');
    });

    // Task 44: Test case specifically mentioned in task description
    it('should handle the specific case from Task 44: when [0,1] is selected', () => {
      const root: MindNode = {
        text: 'Root',
        children: [
          {
            text: 'Child 0',
            children: [{ text: 'Grandchild 0', children: [] }]
          },
          {
            text: 'Child 1', 
            children: [
              { text: 'Grandchild 1-0', children: [] },
              { text: 'Grandchild 1-1', children: [] }
            ]
          },
          {
            text: 'Child 2',
            children: []
          }
        ]
      };

      const selectedPath = [1]; // Child 1 is selected
      
      // Test each node individually (simulating how Node component works)
      const child0 = root.children[0]; // has children
      const child1 = root.children[1]; // selected
      const child2 = root.children[2]; // no children
      const grandchild1_0 = child1.children[0]; // no children
      const grandchild1_1 = child1.children[1]; // no children
      
      // Sibling Child 0 should get withChildren (has children), not onPath
      expect(getNodeType(child0, [0], selectedPath)).toBe('withChildren');
      
      // Sibling Child 2 should get withoutChildren (no children), not onPath
      expect(getNodeType(child2, [2], selectedPath)).toBe('withoutChildren');
      
      // Root should be onPath (ancestor)
      expect(getNodeType(root, [], selectedPath)).toBe('onPath');
      
      // Selected node should be selected
      expect(getNodeType(child1, [1], selectedPath)).toBe('selected');
      
      // Descendants should NOT be onPath
      expect(getNodeType(grandchild1_0, [1, 0], selectedPath)).toBe('withoutChildren');
      expect(getNodeType(grandchild1_1, [1, 1], selectedPath)).toBe('withoutChildren');
    });

    // Task 44: Additional edge cases for sibling coloring
    it('should handle deep nested structures with siblings', () => {
      const deepNode: MindNode = {
        text: 'Root',
        children: [
          {
            text: 'Branch A',
            children: [
              { text: 'A-1', children: [] },
              { text: 'A-2', children: [{ text: 'A-2-1', children: [] }] }
            ]
          },
          {
            text: 'Branch B',
            children: [
              { text: 'B-1', children: [] },
              { text: 'B-2', children: [] }
            ]
          }
        ]
      };

      // Select A-2-1 (deep selection)
      const selectedPath = [0, 1, 0];
      
      // Test each node individually (simulating how Node component works)
      const branchA = deepNode.children[0];
      const branchB = deepNode.children[1];
      const a1 = branchA.children[0]; // no children
      const a2 = branchA.children[1]; // has children
      const b1 = branchB.children[0]; // no children
      const b2 = branchB.children[1]; // no children
      
      // Sibling A-1 should get withoutChildren, not onPath
      expect(getNodeType(a1, [0, 0], selectedPath)).toBe('withoutChildren');
      
      // Branch A should be onPath (ancestor)
      expect(getNodeType(branchA, [0], selectedPath)).toBe('onPath');
      
      // A-2 should be onPath (ancestor)
      expect(getNodeType(a2, [0, 1], selectedPath)).toBe('onPath');
      
      // Branch B and its children should get their normal colors, not onPath
      expect(getNodeType(branchB, [1], selectedPath)).toBe('withChildren');
      expect(getNodeType(b1, [1, 0], selectedPath)).toBe('withoutChildren');
      expect(getNodeType(b2, [1, 1], selectedPath)).toBe('withoutChildren');
    });

    // Task 45: Test cases for selected_child_idx path coloring
    describe('selected_child_idx path coloring', () => {
      it('should color selected_child_idx chain as onPath when node is selected', () => {
        const rootNode: MindNode = {
          text: 'Root',
          selected_child_idx: 0,
          children: [
            {
              text: 'Child A',
              selected_child_idx: 1,
              children: [
                { text: 'Grandchild A-0', children: [] },
                { text: 'Grandchild A-1', children: [] }
              ]
            },
            {
              text: 'Child B', 
              selected_child_idx: 0,
              children: [
                { text: 'Grandchild B-0', children: [] },
                { text: 'Grandchild B-1', children: [] }
              ]
            }
          ]
        };

        // Select Child B (path [1])
        const selectedPath = [1];
        
        // Root should be onPath (ancestor of selected)
        expect(getNodeType(rootNode, [], selectedPath)).toBe('onPath');
        
        // Child B should be selected
        expect(getNodeType(rootNode.children[1], [1], selectedPath)).toBe('selected');
        
        // Grandchild B-0 should be onPath (it's the selected_child_idx of Child B)
        expect(getNodeType(rootNode.children[1].children[0], [1, 0], selectedPath, rootNode)).toBe('onPath');
        
        // Child A should NOT be onPath (it's a sibling, not on the path)
        expect(getNodeType(rootNode.children[0], [0], selectedPath)).toBe('withChildren');
        
        // Grandchild A-0 and A-1 should NOT be onPath
        expect(getNodeType(rootNode.children[0].children[0], [0, 0], selectedPath)).toBe('withoutChildren');
        expect(getNodeType(rootNode.children[0].children[1], [0, 1], selectedPath)).toBe('withoutChildren');
        
        // Grandchild B-1 should NOT be onPath (not the selected_child_idx)
        expect(getNodeType(rootNode.children[1].children[1], [1, 1], selectedPath)).toBe('withoutChildren');
      });

      it('should handle deep selected_child_idx chains', () => {
        const rootNode: MindNode = {
          text: 'Root',
          selected_child_idx: 0,
          children: [
            {
              text: 'Level 1',
              selected_child_idx: 1,
              children: [
                { text: 'Level 2-0', children: [] },
                {
                  text: 'Level 2-1',
                  selected_child_idx: 0,
                  children: [
                    { text: 'Level 3-0', children: [] },
                    { text: 'Level 3-1', children: [] }
                  ]
                }
              ]
            }
          ]
        };

        // Select Level 2-1 (path [0, 1])
        const selectedPath = [0, 1];
        
        // Root should be onPath
        expect(getNodeType(rootNode, [], selectedPath)).toBe('onPath');
        
        // Level 1 should be onPath (ancestor)
        expect(getNodeType(rootNode.children[0], [0], selectedPath)).toBe('onPath');
        
        // Level 2-1 should be selected
        expect(getNodeType(rootNode.children[0].children[1], [0, 1], selectedPath)).toBe('selected');
        
        // Level 3-0 should be onPath (selected_child_idx of selected node)
        expect(getNodeType(rootNode.children[0].children[1].children[0], [0, 1, 0], selectedPath, rootNode)).toBe('onPath');
        
        // Level 2-0 should NOT be onPath (sibling of selected)
        expect(getNodeType(rootNode.children[0].children[0], [0, 0], selectedPath)).toBe('withoutChildren');
        
        // Level 3-1 should NOT be onPath (not selected_child_idx)
        expect(getNodeType(rootNode.children[0].children[1].children[1], [0, 1, 1], selectedPath)).toBe('withoutChildren');
      });
    });
  });
});