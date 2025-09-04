
import { render, fireEvent } from '@testing-library/react';
import { Toolbar } from './Toolbar';
import { useMindMapStore } from '../store/mindmapStore';
import { saveToFile, loadFromFile, saveAsText, loadFromText } from '../utils/file';

jest.mock('../store/mindmapStore');
jest.mock('../utils/file');

describe('Toolbar', () => {
  const addNode = jest.fn();
  const setMindmap = jest.fn();

  beforeEach(() => {
    (useMindMapStore as jest.Mock).mockReturnValue({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
    });
  });

  it('should call addNode when "Add Node" button is clicked', () => {
    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Add Node'));
    expect(addNode).toHaveBeenCalledWith([], 'New Node');
  });

  it('should call saveToFile when "Save as JSON" button is clicked', () => {
    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Save as JSON'));
    expect(saveToFile).toHaveBeenCalled();
  });

  it('should call loadFromFile and setMindmap when "Load from JSON" button is clicked', async () => {
    const newMindMap = { root: { text: 'New Root', children: [] } };
    (loadFromFile as jest.Mock).mockResolvedValue(newMindMap);

    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Load from JSON'));

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for async actions

    expect(loadFromFile).toHaveBeenCalled();
    expect(setMindmap).toHaveBeenCalledWith(newMindMap);
  });

  it('should call saveAsText when "Save as Text" button is clicked', () => {
    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Save as Text'));
    expect(saveAsText).toHaveBeenCalled();
  });

  it('should call loadFromText and setMindmap when "Load from Text" button is clicked', async () => {
    const newMindMap = { root: { text: 'New Root from text', children: [] } };
    (loadFromText as jest.Mock).mockResolvedValue(newMindMap);

    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Load from Text'));

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for async actions

    expect(loadFromText).toHaveBeenCalled();
    expect(setMindmap).toHaveBeenCalledWith(newMindMap);
  });
});
