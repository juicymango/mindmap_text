import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Node } from './Node';
import { createMockMindMapStore } from '../utils/test-utils';
import { SelectedPathProvider } from '../contexts/SelectedPathContext';
import { MindNode } from '../types';

jest.mock('../store/mindmapStore');

// Mock TestWrapper component (based on existing tests in NodeColor.test.tsx)
const TestWrapper: React.FC<{ children: React.ReactNode, initialPath?: number[] }> = ({
  children,
  initialPath = []
}) => {
  const { setSelectedPath } = require('../contexts/SelectedPathContext').useSelectedPath();

  React.useEffect(() => {
    setSelectedPath(initialPath);
  }, [initialPath, setSelectedPath]);

  return <>{children}</>;
};

describe('Node', () => {
  const updateNodeText = jest.fn();
  const setSelectedChild = jest.fn();

  const node = {
    text: 'Test Node',
    children: [],
  };

  const mindmap = {
    root: {
      text: 'Root',
      children: [node],
    },
  };

  beforeEach(() => {
    createMockMindMapStore({
      updateNodeText,
      setSelectedChild,
      mindmap,
    });
  });

  it('should render node text', () => {
    render(
      <SelectedPathProvider>
        <Node node={node} path={[0]} index={0} onSelect={jest.fn()} />
      </SelectedPathProvider>
    );
    expect(screen.getByText('Test Node')).toBeInTheDocument();
  });

  it('should enter edit mode on double click', () => {
    render(
      <SelectedPathProvider>
        <Node node={node} path={[0]} index={0} onSelect={jest.fn()} />
      </SelectedPathProvider>
    );
    fireEvent.doubleClick(screen.getByText('Test Node'));
    expect(screen.getByDisplayValue('Test Node')).toBeInTheDocument();
  });

  it('should call updateNodeText on blur', () => {
    render(
      <SelectedPathProvider>
        <Node node={node} path={[0]} index={0} onSelect={jest.fn()} />
      </SelectedPathProvider>
    );
    fireEvent.doubleClick(screen.getByText('Test Node'));
    const input = screen.getByDisplayValue('Test Node');
    fireEvent.change(input, { target: { value: 'Updated Text' } });
    fireEvent.blur(input);
    expect(updateNodeText).toHaveBeenCalledWith([0], 'Updated Text');
  });

  it('should call setSelectedChild on click', () => {
    render(
      <SelectedPathProvider>
        <Node node={node} path={[0]} index={0} onSelect={jest.fn()} />
      </SelectedPathProvider>
    );
    fireEvent.click(screen.getByText('Test Node'));
    expect(setSelectedChild).toHaveBeenCalledWith([], 0);
  });

  it('should not render add or delete buttons', () => {
    render(
      <SelectedPathProvider>
        <Node node={node} path={[0]} index={0} onSelect={jest.fn()} />
      </SelectedPathProvider>
    );
    expect(screen.queryByText('+')).not.toBeInTheDocument();
    expect(screen.queryByText('x')).not.toBeInTheDocument();
  });

  // Task 56: Test move + edit bug fix
  describe('Move + Edit Bug Fix', () => {
    it('should sync text when node prop changes after move operation', () => {
      const initialNode = { text: 'Original Text', children: [] };
      const movedNode = { text: 'Moved Text', children: [] };

      const { rerender } = render(
        <SelectedPathProvider>
          <Node node={initialNode} path={[0]} index={0} onSelect={jest.fn()} />
        </SelectedPathProvider>
      );

      // Verify initial text
      expect(screen.getByText('Original Text')).toBeInTheDocument();

      // Enter edit mode
      fireEvent.doubleClick(screen.getByText('Original Text'));
      expect(screen.getByDisplayValue('Original Text')).toBeInTheDocument();

      // Simulate node prop change (as would happen after move operation)
      rerender(
        <SelectedPathProvider>
          <Node node={movedNode} path={[1]} index={1} onSelect={jest.fn()} />
        </SelectedPathProvider>
      );

      // Text input should reflect the new node text
      expect(screen.getByDisplayValue('Moved Text')).toBeInTheDocument();
    });

    it('should update correct node when editing after move operation', () => {
      const node1 = { text: 'Node 1', children: [] };
      const node2 = { text: 'Node 2', children: [] };

      // First render with Node 1
      const { rerender } = render(
        <SelectedPathProvider>
          <Node node={node1} path={[0]} index={0} onSelect={jest.fn()} />
        </SelectedPathProvider>
      );

      // Enter edit mode
      fireEvent.doubleClick(screen.getByText('Node 1'));

      // Simulate node move (now path points to different node)
      rerender(
        <SelectedPathProvider>
          <Node node={node2} path={[0]} index={0} onSelect={jest.fn()} />
        </SelectedPathProvider>
      );

      // The input should show Node 2's text, not Node 1's
      expect(screen.getByDisplayValue('Node 2')).toBeInTheDocument();

      // Edit the text
      fireEvent.change(screen.getByDisplayValue('Node 2'), { target: { value: 'Edited Node 2' } });
      fireEvent.blur(screen.getByDisplayValue('Edited Node 2'));

      // Should update with the correct path and text
      expect(updateNodeText).toHaveBeenCalledWith([0], 'Edited Node 2');
    });

    it('should handle multiple node prop changes correctly', () => {
      const nodeA = { text: 'Node A', children: [] };
      const nodeB = { text: 'Node B', children: [] };
      const nodeC = { text: 'Node C', children: [] };

      const { rerender } = render(
        <SelectedPathProvider>
          <Node node={nodeA} path={[0]} index={0} onSelect={jest.fn()} />
        </SelectedPathProvider>
      );

      expect(screen.getByText('Node A')).toBeInTheDocument();

      // Simulate first move
      rerender(
        <SelectedPathProvider>
          <Node node={nodeB} path={[1]} index={1} onSelect={jest.fn()} />
        </SelectedPathProvider>
      );

      expect(screen.getByText('Node B')).toBeInTheDocument();

      // Simulate second move
      rerender(
        <SelectedPathProvider>
          <Node node={nodeC} path={[0]} index={0} onSelect={jest.fn()} />
        </SelectedPathProvider>
      );

      expect(screen.getByText('Node C')).toBeInTheDocument();

      // Enter edit mode after all moves
      fireEvent.doubleClick(screen.getByText('Node C'));
      expect(screen.getByDisplayValue('Node C')).toBeInTheDocument();
    });

    it('should maintain editing state during node prop changes', () => {
      const initialNode = { text: 'Initial', children: [] };
      const updatedNode = { text: 'Updated', children: [] };

      const { rerender } = render(
        <SelectedPathProvider>
          <Node node={initialNode} path={[0]} index={0} onSelect={jest.fn()} />
        </SelectedPathProvider>
      );

      // Enter edit mode
      fireEvent.doubleClick(screen.getByText('Initial'));

      // Simulate node prop change while in edit mode
      rerender(
        <SelectedPathProvider>
          <Node node={updatedNode} path={[1]} index={1} onSelect={jest.fn()} />
        </SelectedPathProvider>
      );

      // Should still be in edit mode with updated text
      expect(screen.getByDisplayValue('Updated')).toBeInTheDocument();

      // Should be able to edit the updated text
      fireEvent.change(screen.getByDisplayValue('Updated'), { target: { value: 'Edited Updated' } });
      expect(screen.getByDisplayValue('Edited Updated')).toBeInTheDocument();
    });
  });
});

// Task 59: Test cases for blank text editing feature
describe('Task 59: Blank Text Editing Tests', () => {
  const mockNodeWithChildren: MindNode = {
    text: 'Parent Node',
    children: []
  };

  const emptyNode: MindNode = {
    text: '',
    children: []
  };

  beforeEach(() => {
    createMockMindMapStore({
      updateNodeText: jest.fn(),
      setSelectedChild: jest.fn(),
      addNode: jest.fn(),
      deleteNode: jest.fn(),
    });
  });

  it('should auto-enter edit mode when node has empty text and is selected', () => {
    render(
      <SelectedPathProvider>
        <TestWrapper initialPath={[0]}>
          <Node
            node={emptyNode}
            path={[0]}
            index={0}
            onSelect={jest.fn()}
          />
        </TestWrapper>
      </SelectedPathProvider>
    );

    // Should automatically show input field for empty selected node
    // Use getAllByDisplayValue since there might be other empty inputs
    const inputs = screen.getAllByDisplayValue('');
    expect(inputs.length).toBeGreaterThan(0); // At least one input should be present

    // Just verify that an input field exists - we don't need to check node container specifics
    // The presence of an input with empty value indicates auto-edit mode is working
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('should not auto-enter edit mode for non-empty nodes', () => {
    render(
      <SelectedPathProvider>
        <TestWrapper initialPath={[0]}>
          <Node
            node={mockNodeWithChildren}
            path={[0]}
            index={0}
            onSelect={jest.fn()}
          />
        </TestWrapper>
      </SelectedPathProvider>
    );

    // Should show text normally, not in edit mode
    expect(screen.getByText('Parent Node')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Parent Node')).not.toBeInTheDocument();
  });

  it('should not auto-enter edit mode for empty nodes that are not selected', () => {
    render(
      <SelectedPathProvider>
        <TestWrapper initialPath={[]}>
          <Node
            node={emptyNode}
            path={[1]}
            index={1}
            onSelect={jest.fn()}
          />
        </TestWrapper>
      </SelectedPathProvider>
    );

    // Empty node is not selected, so should not show input field
    // Since empty text would render as empty span, we check that no input is present
    expect(screen.queryByDisplayValue('')).not.toBeInTheDocument();
  });
});