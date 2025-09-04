import { render } from '@testing-library/react';
import { MindMap } from './MindMap';
import { useMindMapStore } from '../store/mindmapStore';

jest.mock('../store/mindmapStore');
jest.mock('./Column', () => ({
  Column: ({ columnPath }: { columnPath: number[] }) => <div data-testid="column">{JSON.stringify(columnPath)}</div>,
}));
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: any }) => <div>{children}</div>,
}));

describe('MindMap', () => {
  it('should render columns based on mindmap state', () => {
    const mindmap = {
      root: {
        text: 'Root',
        children: [
          {
            text: 'Node 1',
            children: [
              { text: 'Node 3', children: [] },
            ],
            selected_child_idx: 0,
          },
          { text: 'Node 2', children: [] },
        ],
        selected_child_idx: 0,
      },
    };

    (useMindMapStore as jest.Mock).mockReturnValue({ mindmap, onDragEnd: jest.fn() });

    const { getAllByTestId } = render(<MindMap />);
    const columns = getAllByTestId('column');
    expect(columns).toHaveLength(3);
    expect(columns[0]).toHaveTextContent('[]');
    expect(columns[1]).toHaveTextContent('[0]');
    expect(columns[2]).toHaveTextContent('[0,0]');
  });
});