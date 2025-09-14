
import { render, fireEvent, act } from '@testing-library/react';
import { Toolbar } from './Toolbar';
import { createMockMindMapStore } from '../utils/test-utils';
import { saveToFile, saveAsFile, loadFromFile } from '../utils/file';
import { SelectedPathProvider } from '../contexts/SelectedPathContext';

jest.mock('../store/mindmapStore');
jest.mock('../utils/file');

describe('Toolbar', () => {
  const addNode = jest.fn();
  const setMindmap = jest.fn();
  const setJsonFilePath = jest.fn();
  const setTextFilePath = jest.fn();

  beforeEach(() => {
    const mockStore = createMockMindMapStore({
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
    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    fireEvent.click(getByText('Add Node'));
    expect(addNode).toHaveBeenCalledWith([], 'New Node');
  });

  it('should display "No file selected" when no file path is set', () => {
    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    expect(getByText('Current file: No file selected')).toBeInTheDocument();
  });

  it('should display current file path when JSON file path is set', () => {
    const mockStore = createMockMindMapStore({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: '/path/to/file.json',
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    expect(getByText('Current file: /path/to/file.json')).toBeInTheDocument();
  });

  it('should display current file path when text file path is set', () => {
    const mockStore = createMockMindMapStore({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: null,
      textFilePath: '/path/to/file.txt',
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    expect(getByText('Current file: /path/to/file.txt')).toBeInTheDocument();
  });

  it('should disable Save button when no file path is set', () => {
    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    
    expect(getByText('Save')).toBeDisabled();
  });

  it('should enable Save button when file path is set', () => {
    const mockStore = createMockMindMapStore({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: '/path/to/file.json',
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    
    expect(getByText('Save')).not.toBeDisabled();
  });

  it('should call saveToFile with JSON file path when Save is clicked', () => {
    const mockStore = createMockMindMapStore({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: '/path/to/file.json',
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    fireEvent.click(getByText('Save'));
    
    expect(saveToFile).toHaveBeenCalledWith(
      { root: { text: 'Root', children: [] } },
      '/path/to/file.json'
    );
  });

  it('should call saveToFile with text file path when Save is clicked', () => {
    const mockStore = createMockMindMapStore({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: null,
      textFilePath: '/path/to/file.txt',
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    fireEvent.click(getByText('Save'));
    
    expect(saveToFile).toHaveBeenCalledWith(
      { root: { text: 'Root', children: [] } },
      '/path/to/file.txt'
    );
  });

  it('should have Save button disabled when no file path is set', () => {
    // Clear any existing mocks and create fresh mock store
    jest.clearAllMocks();
    
    createMockMindMapStore({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: null,
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    
    const saveButton = getByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('should call saveAsFile when Save As JSON is clicked', async () => {
    const defaultPath = 'mindmap.json';
    (saveAsFile as jest.Mock).mockResolvedValue(defaultPath);

    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    fireEvent.click(getByText('Save As JSON'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(saveAsFile).toHaveBeenCalledWith(
      { root: { text: 'Root', children: [] } },
      'json'
    );
    expect(setJsonFilePath).toHaveBeenCalledWith(defaultPath);
  });

  it('should call saveAsFile when Save As Text is clicked', async () => {
    const defaultPath = 'mindmap.txt';
    (saveAsFile as jest.Mock).mockResolvedValue(defaultPath);

    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    fireEvent.click(getByText('Save As Text'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(saveAsFile).toHaveBeenCalledWith(
      { root: { text: 'Root', children: [] } },
      'text'
    );
    expect(setTextFilePath).toHaveBeenCalledWith(defaultPath);
  });

  it('should call loadFromFile when Load File is clicked', async () => {
    const mockResult = {
      mindmap: { root: { text: 'New Root', children: [] } },
      path: '/path/to/file.json'
    };
    (loadFromFile as jest.Mock).mockResolvedValue(mockResult);

    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    fireEvent.click(getByText('Load File'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(loadFromFile).toHaveBeenCalled();
    expect(setMindmap).toHaveBeenCalledWith(mockResult.mindmap);
    expect(setJsonFilePath).toHaveBeenCalledWith('/path/to/file.json');
  });

  it('should prioritize JSON file path when both are set', () => {
    createMockMindMapStore({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: '/path/to/file.json',
      textFilePath: '/path/to/file.txt',
      setJsonFilePath,
      setTextFilePath,
    });

    const { getByText } = render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    expect(getByText('Current file: /path/to/file.json')).toBeInTheDocument();
  });
});
