
import { render } from '@testing-library/react';
import { MindMap } from './MindMap';
import { useMindMapStore } from '../store/mindmapStore';

jest.mock('../store/mindmapStore');
jest.mock('./Column', () => ({
  Column: ({ columnId }: { columnId: string }) => <div data-testid="column">{columnId}</div>,
}));
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: any }) => <div>{children}</div>,
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

describe('MindMap', () => {
  it('should render columns based on mindmap state', () => {
    const mindmap = {
      root: {
        id: 'root',
        text: 'Root',
        children: [
          {
            id: 'node1',
            text: 'Node 1',
            children: [
              { id: 'node3', text: 'Node 3', children: [] },
            ],
            selected_child_id: 'node3',
          },
          { id: 'node2', text: 'Node 2', children: [] },
        ],
        selected_child_id: 'node1',
      },
    };

    (useMindMapStore as jest.Mock).mockReturnValue({ mindmap, onDragEnd: jest.fn() });

    const { getAllByTestId } = render(<MindMap />);
    const columns = getAllByTestId('column');
    expect(columns).toHaveLength(3);
    expect(columns[0]).toHaveTextContent('root');
    expect(columns[1]).toHaveTextContent('node1');
    expect(columns[2]).toHaveTextContent('node3');
  });
});
