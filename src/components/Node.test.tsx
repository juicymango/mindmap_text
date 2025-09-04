
import { render, fireEvent } from '@testing-library/react';
import { Node } from './Node';
import { useMindMapStore } from '../store/mindmapStore';
import { Draggable } from 'react-beautiful-dnd';

jest.mock('../store/mindmapStore');
jest.mock('react-beautiful-dnd', () => ({
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

describe('Node', () => {
  const updateNodeText = jest.fn();
  const setSelectedChild = jest.fn();
  const addNode = jest.fn();
  const deleteNode = jest.fn();

  const node = {
    id: 'node1',
    text: 'Test Node',
    children: [],
  };

  const mindmap = {
    root: {
      id: 'root',
      text: 'Root',
      children: [node],
    },
  };

  beforeEach(() => {
    (useMindMapStore as jest.Mock).mockReturnValue({
      updateNodeText,
      setSelectedChild,
      addNode,
      deleteNode,
      mindmap,
    });
  });

  it('should render node text', () => {
    const { getByText } = render(<Node node={node} index={0} />);
    expect(getByText('Test Node')).toBeInTheDocument();
  });

  it('should enter edit mode on double click', () => {
    const { getByText, getByDisplayValue } = render(<Node node={node} index={0} />);
    fireEvent.doubleClick(getByText('Test Node'));
    expect(getByDisplayValue('Test Node')).toBeInTheDocument();
  });

  it('should call updateNodeText on blur', () => {
    const { getByText, getByDisplayValue } = render(<Node node={node} index={0} />);
    fireEvent.doubleClick(getByText('Test Node'));
    const input = getByDisplayValue('Test Node');
    fireEvent.change(input, { target: { value: 'Updated Text' } });
    fireEvent.blur(input);
    expect(updateNodeText).toHaveBeenCalledWith('node1', 'Updated Text');
  });

  it('should call setSelectedChild on click', () => {
    const { getByText } = render(<Node node={node} index={0} />);
    fireEvent.click(getByText('Test Node'));
    expect(setSelectedChild).toHaveBeenCalledWith('root', 'node1');
  });

  it('should call addNode on add child button click', () => {
    const { getByText } = render(<Node node={node} index={0} />);
    fireEvent.click(getByText('+'));
    expect(addNode).toHaveBeenCalledWith('node1', 'New Node');
  });

  it('should call deleteNode on delete button click', () => {
    const { getByText } = render(<Node node={node} index={0} />);
    fireEvent.click(getByText('x'));
    expect(deleteNode).toHaveBeenCalledWith('node1');
  });
});
