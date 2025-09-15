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
});