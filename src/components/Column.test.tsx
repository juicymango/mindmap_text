
import { render } from '@testing-library/react';
import { Column } from './Column';
import { MindNode } from '../types';

jest.mock('./Node', () => ({
  Node: ({ node }: { node: MindNode }) => <div data-testid="node">{node.text}</div>,
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
  Draggable: ({ children }: { children: any }) =>
    children(
      {
        draggableProps: { style: {} },
        dragHandleProps: {},
        innerRef: jest.fn(),
      },
      {}
    ),
}));

describe('Column', () => {
  const nodes = [
    { id: 'node1', text: 'Node 1', children: [] },
    { id: 'node2', text: 'Node 2', children: [] },
  ];

  it('should render nodes', () => {
    const { getAllByTestId } = render(
      <Column nodes={nodes} columnId="col1" index={0} />
    );
    const renderedNodes = getAllByTestId('node');
    expect(renderedNodes).toHaveLength(2);
    expect(renderedNodes[0]).toHaveTextContent('Node 1');
    expect(renderedNodes[1]).toHaveTextContent('Node 2');
  });

  it('should render a placeholder', () => {
    const { getByTestId } = render(
      <Column nodes={nodes} columnId="col1" index={0} />
    );
    expect(getByTestId('placeholder')).toBeInTheDocument();
  });
});
