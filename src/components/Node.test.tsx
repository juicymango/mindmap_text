import { render, screen, fireEvent } from '@testing-library/react';
import { Node } from './Node';
import { createMockMindMapStore } from '../utils/test-utils';

jest.mock('../store/mindmapStore');

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
    createMockMindMapStore({
      updateNodeText,
      setSelectedChild,
      addNode,
      deleteNode,
      mindmap,
    });
  });

  it('should render node text', () => {
    render(<Node node={node} path={[0]} index={0} onSelect={jest.fn()} />);
    expect(screen.getByText('Test Node')).toBeInTheDocument();
  });

  it('should enter edit mode on double click', () => {
    render(<Node node={node} path={[0]} index={0} onSelect={jest.fn()} />);
    fireEvent.doubleClick(screen.getByText('Test Node'));
    expect(screen.getByDisplayValue('Test Node')).toBeInTheDocument();
  });

  it('should call updateNodeText on blur', () => {
    render(<Node node={node} path={[0]} index={0} onSelect={jest.fn()} />);
    fireEvent.doubleClick(screen.getByText('Test Node'));
    const input = screen.getByDisplayValue('Test Node');
    fireEvent.change(input, { target: { value: 'Updated Text' } });
    fireEvent.blur(input);
    expect(updateNodeText).toHaveBeenCalledWith([0], 'Updated Text');
  });

  it('should call setSelectedChild on click', () => {
    render(<Node node={node} path={[0]} index={0} onSelect={jest.fn()} />);
    fireEvent.click(screen.getByText('Test Node'));
    expect(setSelectedChild).toHaveBeenCalledWith([], 0);
  });

  it('should call addNode on add child button click', () => {
    render(<Node node={node} path={[0]} index={0} onSelect={jest.fn()} />);
    fireEvent.click(screen.getByText('+'));
    expect(addNode).toHaveBeenCalledWith([0], 'New Node');
  });

  it('should call deleteNode on delete button click', () => {
    render(<Node node={node} path={[0]} index={0} onSelect={jest.fn()} />);
    fireEvent.click(screen.getByText('x'));
    expect(deleteNode).toHaveBeenCalledWith([0]);
  });
});