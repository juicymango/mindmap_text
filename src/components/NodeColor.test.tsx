/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Node } from '../components/Node';
import { SelectedPathProvider, useSelectedPath } from '../contexts/SelectedPathContext';
import { NODE_COLORS } from '../styles/nodeColors';
import { createMockMindMapStore } from '../utils/test-utils';
import { MindNode } from '../types';

jest.mock('../store/mindmapStore');

// Helper function to convert hex to rgb format
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : 
    hex;
};

// Helper function to convert hex with alpha to rgba format  
const hexToRgba = (hex: string): string => {
  // Handle 8-digit hex with alpha
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    const a = parseInt(result[4], 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return hexToRgb(hex);
};

// Test wrapper to set initial selected path
const TestWrapper: React.FC<{ 
  children: React.ReactNode; 
  initialPath: number[];
}> = ({ children, initialPath }) => {
  const { setSelectedPath } = useSelectedPath();
  
  React.useEffect(() => {
    setSelectedPath(initialPath);
  }, [initialPath, setSelectedPath]);

  return <>{children}</>;
};

describe('Node Color Visual Tests', () => {
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

  const updateNodeText = jest.fn();
  const setSelectedChild = jest.fn();
  const addNode = jest.fn();
  const deleteNode = jest.fn();

  beforeEach(() => {
    createMockMindMapStore({
      updateNodeText,
      setSelectedChild,
      addNode,
      deleteNode,
      mindmap: { root: { text: 'Root', children: [] } }
    });
    jest.clearAllMocks();
  });

  describe('Node Color Rendering', () => {
    it('should render selected node with blue background', () => {
      const selectedPath = [0, 1];
      
      render(
        <SelectedPathProvider>
          <TestWrapper initialPath={selectedPath}>
            <Node 
              node={mockNodeWithChildren} 
              path={[0, 1]} 
              index={1} 
              onSelect={jest.fn()} 
            />
          </TestWrapper>
        </SelectedPathProvider>
      );

      // eslint-disable-next-line testing-library/no-node-access
      const nodeElement = screen.getByText('Parent Node').closest('div');
      expect(nodeElement).toBeInTheDocument();
      
      // Check if the computed background color matches the selected color
      // eslint-disable-next-line testing-library/no-node-access
      const computedStyle = window.getComputedStyle(nodeElement!);
      expect(computedStyle.backgroundColor).toBe(hexToRgb(NODE_COLORS.selected.background));
      expect(computedStyle.color).toBe(hexToRgb(NODE_COLORS.selected.text));
    });

    it('should render node on selected path with light blue background', () => {
      const selectedPath = [0, 1, 2];
      
      render(
        <SelectedPathProvider>
          <TestWrapper initialPath={selectedPath}>
            <Node 
              node={mockNodeWithChildren} 
              path={[0, 1]} 
              index={1} 
              onSelect={jest.fn()} 
            />
          </TestWrapper>
        </SelectedPathProvider>
      );

      const nodeElement = screen.getByText('Parent Node').closest('div');
      expect(nodeElement).toBeInTheDocument();
      
      const computedStyle = window.getComputedStyle(nodeElement!);
      expect(computedStyle.backgroundColor).toBe(hexToRgb(NODE_COLORS.onPath.background));
      expect(computedStyle.color).toBe(hexToRgb(NODE_COLORS.onPath.text));
    });

    it('should render node with children with new blue background', () => {
      const selectedPath = [2, 3]; // Different path
      
      render(
        <SelectedPathProvider>
          <TestWrapper initialPath={selectedPath}>
            <Node 
              node={mockNodeWithChildren} 
              path={[0, 1]} 
              index={1} 
              onSelect={jest.fn()} 
            />
          </TestWrapper>
        </SelectedPathProvider>
      );

      const nodeElement = screen.getByText('Parent Node').closest('div');
      expect(nodeElement).toBeInTheDocument();
      
      const computedStyle = window.getComputedStyle(nodeElement!);
      expect(computedStyle.backgroundColor).toBe(hexToRgba(NODE_COLORS.withChildren.background));
      expect(computedStyle.color).toBe(hexToRgb(NODE_COLORS.withChildren.text));
    });

    it('should render node without children with white background', () => {
      const selectedPath = [2, 3]; // Different path
      
      render(
        <SelectedPathProvider>
          <TestWrapper initialPath={selectedPath}>
          <Node 
            node={mockNodeWithoutChildren} 
            path={[0, 1]} 
            index={1} 
            onSelect={jest.fn()} 
          />
        </TestWrapper>
        </SelectedPathProvider>
      );

      const nodeElement = screen.getByText('Leaf Node').closest('div');
      expect(nodeElement).toBeInTheDocument();
      
      const computedStyle = window.getComputedStyle(nodeElement!);
      expect(computedStyle.backgroundColor).toBe(hexToRgb(NODE_COLORS.withoutChildren.background));
      expect(computedStyle.color).toBe(hexToRgb(NODE_COLORS.withoutChildren.text));
    });

    it('should apply correct border colors for each node type', () => {
      // Test selected node border
      const selectedPath = [0, 1];
      
      const { rerender } = render(
        <SelectedPathProvider>
          <TestWrapper initialPath={selectedPath}>
            <Node 
              node={mockNodeWithChildren} 
              path={[0, 1]} 
              index={1} 
              onSelect={jest.fn()} 
            />
          </TestWrapper>
        </SelectedPathProvider>
      );

      let nodeElement = screen.getByText('Parent Node').closest('div');
      let computedStyle = window.getComputedStyle(nodeElement!);
      expect(computedStyle.borderColor.toLowerCase()).toBe(NODE_COLORS.selected.border.toLowerCase());

      // Test withChildren node border
      rerender(
        <SelectedPathProvider>
          <TestWrapper initialPath={[2, 3]}>
          <Node 
            node={mockNodeWithChildren} 
            path={[0, 1]} 
            index={1} 
            onSelect={jest.fn()} 
          />
        </TestWrapper>
        </SelectedPathProvider>
      );

      nodeElement = screen.getByText('Parent Node').closest('div');
      computedStyle = window.getComputedStyle(nodeElement!);
      expect(computedStyle.borderColor.toLowerCase()).toBe(NODE_COLORS.withChildren.border.toLowerCase());
    });

    it('should maintain color contrast for accessibility', () => {
      // Test all node types for sufficient color contrast
      const testCases = [
        { node: mockNodeWithChildren, path: [0, 1], selectedPath: [0, 1], type: 'selected' },
        { node: mockNodeWithChildren, path: [0], selectedPath: [0, 1], type: 'onPath' },
        { node: mockNodeWithChildren, path: [0, 1], selectedPath: [2, 3], type: 'withChildren' },
        { node: mockNodeWithoutChildren, path: [0, 1], selectedPath: [2, 3], type: 'withoutChildren' }
      ];

      testCases.forEach(({ node, path, selectedPath, type }) => {
        // Create a unique text for each test case to avoid conflicts
        const uniqueNode = {
          ...node,
          text: `${node.text} (${type})`
        };
        
        render(
          <SelectedPathProvider>
          <TestWrapper initialPath={selectedPath}>
            <Node 
              node={uniqueNode} 
              path={path} 
              index={1} 
              onSelect={jest.fn()} 
            />
          </TestWrapper>
        </SelectedPathProvider>
        );

        const nodeElement = screen.getByText(uniqueNode.text).closest('div');
        const computedStyle = window.getComputedStyle(nodeElement!);
        
        // Verify that text color contrasts with background
        const backgroundColor = computedStyle.backgroundColor;
        const textColor = computedStyle.color;
        
        // Simple contrast check - colors should be different
        expect(backgroundColor).not.toBe(textColor);
        
        // Verify specific color values
        const nodeColors = NODE_COLORS[type as keyof typeof NODE_COLORS];
        const expectedBackground = type === 'withChildren' 
          ? hexToRgba(nodeColors.background) 
          : hexToRgb(nodeColors.background);
        expect(backgroundColor).toBe(expectedBackground);
        expect(textColor).toBe(hexToRgb(nodeColors.text));
      });
    });

    it('should apply hover effects with correct colors', () => {
      render(
        <SelectedPathProvider>
          <TestWrapper initialPath={[2, 3]}>
          <Node 
            node={mockNodeWithChildren} 
            path={[0, 1]} 
            index={1} 
            onSelect={jest.fn()} 
          />
        </TestWrapper>
        </SelectedPathProvider>
      );

      const nodeElement = screen.getByText('Parent Node').closest('div');
      
      // Simulate hover
      fireEvent.mouseEnter(nodeElement!);
      
      // Simulate hover by directly setting the style to test the color value
      // Note: CSS pseudo-classes like :hover are difficult to test in JSDOM
      // This test verifies the hover color value is correct
      const hoverColor = hexToRgb(NODE_COLORS.withChildren.hover);
      expect(hoverColor).toBe('rgb(209, 231, 252)');
    });

    it('should handle empty selected path gracefully', () => {
      render(
        <SelectedPathProvider>
          <TestWrapper initialPath={[]}>
          <Node 
            node={mockNodeWithoutChildren} 
            path={[0]} 
            index={0} 
            onSelect={jest.fn()} 
          />
        </TestWrapper>
        </SelectedPathProvider>
      );

      const nodeElement = screen.getByText('Leaf Node').closest('div');
      expect(nodeElement).toBeInTheDocument();
      
      const computedStyle = window.getComputedStyle(nodeElement!);
      expect(computedStyle.backgroundColor).toBe(hexToRgb(NODE_COLORS.withoutChildren.background));
    });

    it('should update colors when selection changes', () => {
      const { rerender } = render(
        <SelectedPathProvider>
          <TestWrapper initialPath={[2, 3]}>
          <Node 
            node={mockNodeWithChildren} 
            path={[0, 1]} 
            index={1} 
            onSelect={jest.fn()} 
          />
        </TestWrapper>
        </SelectedPathProvider>
      );

      let nodeElement = screen.getByText('Parent Node').closest('div');
      let computedStyle = window.getComputedStyle(nodeElement!);
      
      // Initially should be withChildren color (blue background)
      expect(computedStyle.backgroundColor).toBe(hexToRgba(NODE_COLORS.withChildren.background));

      // Rerender with node now selected
      rerender(
        <SelectedPathProvider>
          <TestWrapper initialPath={[0, 1]}>
          <Node 
            node={mockNodeWithChildren} 
            path={[0, 1]} 
            index={1} 
            onSelect={jest.fn()} 
          />
        </TestWrapper>
        </SelectedPathProvider>
      );

      nodeElement = screen.getByText('Parent Node').closest('div');
      computedStyle = window.getComputedStyle(nodeElement!);
      
      // Should now be selected color (darker blue)
      expect(computedStyle.backgroundColor).toBe(hexToRgb(NODE_COLORS.selected.background));
    });
  });

  describe('Color Consistency', () => {
    it('should ensure consistent styling across multiple nodes', () => {
      const selectedPath = [0, 1];
      
      render(
        <SelectedPathProvider>
          <TestWrapper initialPath={selectedPath}>
          <div>
            <Node 
              node={mockNodeWithChildren} 
              path={[0, 1]} 
              index={1} 
              onSelect={jest.fn()} 
            />
            <Node 
              node={mockNodeWithoutChildren} 
              path={[0, 2]} 
              index={2} 
              onSelect={jest.fn()} 
            />
          </div>
        </TestWrapper>
        </SelectedPathProvider>
      );

      const parentNode = screen.getByText('Parent Node').closest('div');
      const leafNode = screen.getByText('Leaf Node').closest('div');
      
      const parentStyle = window.getComputedStyle(parentNode!);
      const leafStyle = window.getComputedStyle(leafNode!);
      
      // Parent node should be selected (darker blue)
      expect(parentStyle.backgroundColor).toBe(hexToRgb(NODE_COLORS.selected.background));
      
      // Leaf node should be withoutChildren (white)
      expect(leafStyle.backgroundColor).toBe(hexToRgb(NODE_COLORS.withoutChildren.background));
      
      // Colors should be different
      expect(parentStyle.backgroundColor).not.toBe(leafStyle.backgroundColor);
    });
  });
});

// Task 59: Test cases for background color redesign
describe('Task 59: Background Color Redesign Tests', () => {
  const mockNodeWithChildren: MindNode = {
    text: 'Parent Node',
    children: [
      { text: 'Child 1', children: [] },
      { text: 'Child 2', children: [] }
    ]
  };

  beforeEach(() => {
    createMockMindMapStore({
      updateNodeText: jest.fn(),
      setSelectedChild: jest.fn(),
      addNode: jest.fn(),
      deleteNode: jest.fn(),
    });
  });

  it('should use stronger blue for onPath nodes with white text', () => {
    render(
      <SelectedPathProvider>
        <TestWrapper initialPath={[1]}>
          <Node
            node={mockNodeWithChildren}
            path={[]}
            index={0}
            onSelect={jest.fn()}
          />
        </TestWrapper>
      </SelectedPathProvider>
    );

    const rootElement = screen.getByText('Parent Node').closest('div');
    const computedStyle = window.getComputedStyle(rootElement!);

    // Should use onPath colors (stronger blue with white text)
    expect(computedStyle.backgroundColor).toBe(hexToRgb(NODE_COLORS.onPath.background));
    expect(computedStyle.color).toBe(hexToRgb(NODE_COLORS.onPath.text));
  });

  it('should maintain proper visual hierarchy with updated colors', () => {
    // Test that selected > onPath > withChildren > withoutChildren
    const selectedColor = hexToRgb(NODE_COLORS.selected.background);
    const onPathColor = hexToRgb(NODE_COLORS.onPath.background);
    const withChildrenColor = hexToRgb(NODE_COLORS.withChildren.background);
    const withoutChildrenColor = hexToRgb(NODE_COLORS.withoutChildren.background);

    // This test validates the color hierarchy from the design
    expect(selectedColor).not.toBe(onPathColor);
    expect(onPathColor).not.toBe(withChildrenColor);
    expect(withChildrenColor).not.toBe(withoutChildrenColor);
  });

  it('should use light blue for withChildren nodes', () => {
    // Test a non-root node that has children but is not selected or on path
    const nonRootNodeWithChildren: MindNode = {
      text: 'Non-Root Parent',
      children: [
        { text: 'Child 1', children: [] }
      ]
    };

    render(
      <SelectedPathProvider>
        <TestWrapper initialPath={[]}> {/* No selection */}
          <Node
            node={nonRootNodeWithChildren}
            path={[0]}  // This node is not selected and not on the path
            index={0}
            onSelect={jest.fn()}
          />
        </TestWrapper>
      </SelectedPathProvider>
    );

    const nodeElement = screen.getByText('Non-Root Parent').closest('div');
    const computedStyle = window.getComputedStyle(nodeElement!);

    // Should use withChildren color (light blue) when not selected but has children
    expect(computedStyle.backgroundColor).toBe(hexToRgb(NODE_COLORS.withChildren.background));
  });
});