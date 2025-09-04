import { render } from '@testing-library/react';
import { Column } from './Column';
import { MindNode } from '../types';

jest.mock('./Node', () => ({
  Node: ({ node, path }: { node: MindNode, path: number[] }) => <div data-testid="node">{node.text}</div>,
}));

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }: { children: any }) =>
    children(
      {
        droppableProps: {},
        innerRef: jest.fn(),
        placeholder: <div data-testid="placeholder" />,
      },
      {}
    ),
}));

describe('Column', () => {
  const nodes = [
    { text: 'Node 1', children: [] },
    { text: 'Node 2', children: [] },
  ];

  it('should render nodes', () => {
    const { getAllByTestId } = render(
      <Column nodes={nodes} columnPath={[]} index={0} />
    );
    const renderedNodes = getAllByTestId('node');
    expect(renderedNodes).toHaveLength(2);
    expect(renderedNodes[0]).toHaveTextContent('Node 1');
    expect(renderedNodes[1]).toHaveTextContent('Node 2');
  });

  it('should render a placeholder', () => {
    const { getByTestId } = render(
      <Column nodes={nodes} columnPath={[]} index={0} />
    );
    expect(getByTestId('placeholder')).toBeInTheDocument();
  });
});