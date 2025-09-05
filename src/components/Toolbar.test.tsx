
import { render, fireEvent, act } from '@testing-library/react';
import { Toolbar } from './Toolbar';
import { useMindMapStore } from '../store/mindmapStore';
import { saveToFile, saveAsFile, loadFromFile } from '../utils/file';

jest.mock('../store/mindmapStore');
jest.mock('../utils/file');

describe('Toolbar', () => {
  const addNode = jest.fn();
  const setMindmap = jest.fn();
  const setJsonFilePath = jest.fn();
  const setTextFilePath = jest.fn();

  beforeEach(() => {
    (useMindMapStore as jest.Mock).mockReturnValue({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: null,
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });
  });

  it('should call addNode when "Add Node" button is clicked', () => {
    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Add Node'));
    expect(addNode).toHaveBeenCalledWith([], 'New Node');
  });

  it('should display "No file selected" when no file path is set', () => {
    const { getByText } = render(<Toolbar />);
    expect(getByText('Current file: No file selected')).toBeInTheDocument();
  });

  it('should display current file path when JSON file path is set', () => {
    (useMindMapStore as jest.Mock).mockReturnValue({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: '/path/to/file.json',
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(<Toolbar />);
    expect(getByText('Current file: /path/to/file.json')).toBeInTheDocument();
  });

  it('should display current file path when text file path is set', () => {
    (useMindMapStore as jest.Mock).mockReturnValue({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: null,
      textFilePath: '/path/to/file.txt',
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(<Toolbar />);
    expect(getByText('Current file: /path/to/file.txt')).toBeInTheDocument();
  });

  it('should disable Save and Load buttons when no file path is set', () => {
    const { getByText } = render(<Toolbar />);
    
    expect(getByText('Save')).toBeDisabled();
    expect(getByText('Load')).toBeDisabled();
  });

  it('should enable Save and Load buttons when file path is set', () => {
    (useMindMapStore as jest.Mock).mockReturnValue({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: '/path/to/file.json',
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(<Toolbar />);
    
    expect(getByText('Save')).not.toBeDisabled();
    expect(getByText('Load')).not.toBeDisabled();
  });

  it('should call saveToFile with JSON file path when Save is clicked', () => {
    (useMindMapStore as jest.Mock).mockReturnValue({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: '/path/to/file.json',
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Save'));
    
    expect(saveToFile).toHaveBeenCalledWith(
      { root: { text: 'Root', children: [] } },
      '/path/to/file.json'
    );
  });

  it('should call saveToFile with text file path when Save is clicked', () => {
    (useMindMapStore as jest.Mock).mockReturnValue({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: null,
      textFilePath: '/path/to/file.txt',
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Save'));
    
    expect(saveToFile).toHaveBeenCalledWith(
      { root: { text: 'Root', children: [] } },
      '/path/to/file.txt'
    );
  });

  it('should call saveAsFile when no file path is set and Save is clicked', async () => {
    const mockPath = '/path/to/newfile.json';
    const mockSaveAsFile = saveAsFile as jest.Mock;
    mockSaveAsFile.mockResolvedValue(mockPath);

    const { getByText } = render(<Toolbar />);
    
    // Mock the setTimeout to resolve immediately
    jest.useFakeTimers();
    
    fireEvent.click(getByText('Save'));
    
    // Fast-forward until all timers have been executed
    act(() => {
      jest.runAllTimers();
    });

    expect(mockSaveAsFile).toHaveBeenCalledWith(
      { root: { text: 'Root', children: [] } },
      'json'
    );
    expect(setJsonFilePath).toHaveBeenCalledWith(mockPath);
    
    // Restore real timers
    jest.useRealTimers();
  });

  it('should call saveAsFile when Save As JSON is clicked', async () => {
    const mockPath = '/path/to/newfile.json';
    (saveAsFile as jest.Mock).mockResolvedValue(mockPath);

    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Save As JSON'));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(saveAsFile).toHaveBeenCalledWith(
      { root: { text: 'Root', children: [] } },
      'json'
    );
    expect(setJsonFilePath).toHaveBeenCalledWith(mockPath);
  });

  it('should call saveAsFile when Save As Text is clicked', async () => {
    const mockPath = '/path/to/newfile.txt';
    (saveAsFile as jest.Mock).mockResolvedValue(mockPath);

    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Save As Text'));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(saveAsFile).toHaveBeenCalledWith(
      { root: { text: 'Root', children: [] } },
      'text'
    );
    expect(setTextFilePath).toHaveBeenCalledWith(mockPath);
  });

  it('should call loadFromFile with remembered path when Load is clicked', async () => {
    const mockResult = {
      mindmap: { root: { text: 'New Root', children: [] } },
      path: '/path/to/file.json'
    };
    (loadFromFile as jest.Mock).mockResolvedValue(mockResult);

    (useMindMapStore as jest.Mock).mockReturnValue({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: '/path/to/file.json',
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Load'));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(loadFromFile).toHaveBeenCalledWith('/path/to/file.json');
    expect(setMindmap).toHaveBeenCalledWith(mockResult.mindmap);
    expect(setJsonFilePath).toHaveBeenCalledWith('/path/to/file.json');
  });

  it('should call loadFromFile when Load As is clicked', async () => {
    const mockResult = {
      mindmap: { root: { text: 'New Root', children: [] } },
      path: '/path/to/file.json'
    };
    (loadFromFile as jest.Mock).mockResolvedValue(mockResult);

    const { getByText } = render(<Toolbar />);
    fireEvent.click(getByText('Load As'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(loadFromFile).toHaveBeenCalled();
    expect(setMindmap).toHaveBeenCalledWith(mockResult.mindmap);
    expect(setJsonFilePath).toHaveBeenCalledWith('/path/to/file.json');
  });

  it('should prioritize JSON file path when both are set', () => {
    (useMindMapStore as jest.Mock).mockReturnValue({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: '/path/to/file.json',
      textFilePath: '/path/to/file.txt',
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(<Toolbar />);
    expect(getByText('Current file: /path/to/file.json')).toBeInTheDocument();
  });
});
