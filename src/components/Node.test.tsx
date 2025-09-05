import { render, fireEvent } from '@testing-library/react';
import { Node } from './Node';
import { createMockMindMapStore } from '../utils/test-utils';

jest.mock('../store/mindmapStore');
jest.mock('react-beautiful-dnd', () => ({
  Draggable: require('../utils/test-utils').mockDraggable,
}));

describe('Node', () => {
  const updateNodeText = jest.fn();
  const setSelectedChild = jest.fn();
  const addNode = jest.fn();
  const deleteNode = jest.fn();

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
    const mockStore = createMockMindMapStore({
      updateNodeText,
      setSelectedChild,
      addNode,
      deleteNode,
      mindmap,
    });
  });

  it('should render node text', () => {
    const { getByText } = render(<Node node={node} path={[0]} index={0} />);
    expect(getByText('Test Node')).toBeInTheDocument();
  });

  it('should enter edit mode on double click', () => {
    const { getByText, getByDisplayValue } = render(<Node node={node} path={[0]} index={0} />);
    fireEvent.doubleClick(getByText('Test Node'));
    expect(getByDisplayValue('Test Node')).toBeInTheDocument();
  });

  it('should call updateNodeText on blur', () => {
    const { getByText, getByDisplayValue } = render(<Node node={node} path={[0]} index={0} />);
    fireEvent.doubleClick(getByText('Test Node'));
    const input = getByDisplayValue('Test Node');
    fireEvent.change(input, { target: { value: 'Updated Text' } });
    fireEvent.blur(input);
    expect(updateNodeText).toHaveBeenCalledWith([0], 'Updated Text');
  });

  it('should call setSelectedChild on click', () => {
    const { getByText } = render(<Node node={node} path={[0]} index={0} />);
    fireEvent.click(getByText('Test Node'));
    expect(setSelectedChild).toHaveBeenCalledWith([], 0);
  });

  it('should call addNode on add child button click', () => {
    const { getByText } = render(<Node node={node} path={[0]} index={0} />);
    fireEvent.click(getByText('+'));
    expect(addNode).toHaveBeenCalledWith([0], 'New Node');
  });

  it('should call deleteNode on delete button click', () => {
    const { getByText } = render(<Node node={node} path={[0]} index={0} />);
    fireEvent.click(getByText('x'));
    expect(deleteNode).toHaveBeenCalledWith([0]);
  });
});