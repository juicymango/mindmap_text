import { render, screen } from '@testing-library/react';
import { Column } from './Column';
import { MindNode } from '../types';

jest.mock('./Node', () => ({
  Node: ({ node, path }: { node: MindNode, path: number[] }) => <div data-testid="node">{node.text}</div>,
}));

describe('Column', () => {
  const nodes = [
    { text: 'Node 1', children: [] },
    { text: 'Node 2', children: [] },
  ];

  it('should render nodes', () => {
    render(
      <Column nodes={nodes} columnPath={[]} index={0} onNodeSelect={jest.fn()} />
    );
    const renderedNodes = screen.getAllByTestId('node');
    expect(renderedNodes).toHaveLength(2);
    expect(renderedNodes[0]).toHaveTextContent('Node 1');
    expect(renderedNodes[1]).toHaveTextContent('Node 2');
  });

  it('should handle empty nodes array', () => {
    const { container } = render(
      <Column nodes={[]} columnPath={[]} index={0} onNodeSelect={jest.fn()} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should pass correct path to nodes', () => {
    render(
      <Column nodes={nodes} columnPath={[0, 1]} index={0} onNodeSelect={jest.fn()} />
    );
    const renderedNodes = screen.getAllByTestId('node');
    expect(renderedNodes).toHaveLength(2);
  });

  // Task 52: Column Height and Scrolling Tests
  it('should render with scrollable container when many nodes are present', () => {
    // Create a large number of nodes to test scrolling behavior
    const manyNodes = Array.from({ length: 50 }, (_, i) => ({
      text: `Node ${i + 1}`,
      children: [],
    }));

    render(
      <Column nodes={manyNodes} columnPath={[]} index={0} onNodeSelect={jest.fn()} />
    );

    const columnContainer = screen.getByTestId('column-container');
    expect(columnContainer).toBeInTheDocument();
    
    // Verify the column has the correct styling for scrolling
    expect(columnContainer).toHaveStyle({
      'overflow-y': 'auto',
      'max-height': 'calc(100vh - 120px)',
    });
  });

  it('should display all nodes without truncation', () => {
    const manyNodes = Array.from({ length: 25 }, (_, i) => ({
      text: `Test Node ${i + 1}`,
      children: [],
    }));

    render(
      <Column nodes={manyNodes} columnPath={[]} index={0} onNodeSelect={jest.fn()} />
    );

    const renderedNodes = screen.getAllByTestId('node');
    expect(renderedNodes).toHaveLength(25);
    
    // Verify first and last nodes are rendered correctly
    expect(renderedNodes[0]).toHaveTextContent('Test Node 1');
    expect(renderedNodes[24]).toHaveTextContent('Test Node 25');
  });

  it('should handle root column styling correctly', () => {
    const rootNode = { text: 'Root', children: [] };
    
    render(
      <Column nodes={[rootNode]} columnPath={[]} index={0} onNodeSelect={jest.fn()} />
    );

    const columnContainer = screen.getByTestId('column-container');
    expect(columnContainer).toHaveStyle({
      'border-left': '4px solid #4A90E2',
    });
  });

  it('should maintain fixed width while allowing height flexibility', () => {
    const nodes = [
      { text: 'Node 1', children: [] },
      { text: 'Node 2', children: [] },
    ];

    render(
      <Column nodes={nodes} columnPath={[]} index={1} onNodeSelect={jest.fn()} />
    );

    const columnContainer = screen.getByTestId('column-container');
    expect(columnContainer).toHaveStyle({
      'width': '240px',
      'flex-shrink': '0',
    });
  });

  it('should apply custom scrollbar styling', () => {
    render(
      <Column nodes={nodes} columnPath={[]} index={0} onNodeSelect={jest.fn()} />
    );

    const columnContainer = screen.getByTestId('column-container');
    expect(columnContainer).toBeInTheDocument();
    
    // The scrollbar styling is applied via CSS, so we verify the container
    // has the correct overflow behavior that would trigger scrollbar display
    expect(columnContainer).toHaveStyle({
      'overflow-y': 'auto',
    });
  });

  it('should handle very long node text content', () => {
    const nodesWithLongText = [
      { text: 'This is a very long node text that should wrap properly within the column container without causing layout issues or overflow problems', children: [] },
      { text: 'Another long text node that tests the column\'s ability to handle content overflow gracefully while maintaining readability and layout stability', children: [] },
    ];

    render(
      <Column nodes={nodesWithLongText} columnPath={[]} index={0} onNodeSelect={jest.fn()} />
    );

    const columnContainer = screen.getByTestId('column-container');
    expect(columnContainer).toBeInTheDocument();
    
    const renderedNodes = screen.getAllByTestId('node');
    expect(renderedNodes).toHaveLength(2);
    expect(renderedNodes[0]).toHaveTextContent('This is a very long node text that should wrap properly within the column container without causing layout issues or overflow problems');
  });
});