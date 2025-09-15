import { render, screen } from '@testing-library/react';
import { MindMap } from './MindMap';
import { createMockMindMapStore } from '../utils/test-utils';
import { SelectedPathProvider } from '../contexts/SelectedPathContext';

jest.mock('../store/mindmapStore');
jest.mock('./Column', () => ({
  Column: ({ columnPath }: { columnPath: number[] }) => require('react').createElement('div', { 'data-testid': 'column' }, JSON.stringify(columnPath)),
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

    createMockMindMapStore({ mindmap, copyNode: jest.fn(), pasteNode: jest.fn() });

    render(
      <SelectedPathProvider>
        <MindMap />
      </SelectedPathProvider>
    );
    const columns = screen.getAllByTestId('column');
    expect(columns).toHaveLength(3);
    expect(columns[0]).toHaveTextContent('[]');
    expect(columns[1]).toHaveTextContent('[0]');
    expect(columns[2]).toHaveTextContent('[0,0]');
  });
});