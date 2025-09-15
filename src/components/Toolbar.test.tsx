
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Toolbar } from './Toolbar';
import { createMockMindMapStore } from '../utils/test-utils';
import { saveAsFile, loadFromFile } from '../utils/file';
import { SelectedPathProvider } from '../contexts/SelectedPathContext';

jest.mock('../store/mindmapStore');
jest.mock('../utils/file');

describe('Toolbar', () => {
  const addNode = jest.fn();
  const setMindmap = jest.fn();
  const setJsonFilePath = jest.fn();
  const setTextFilePath = jest.fn();

  beforeEach(() => {
    createMockMindMapStore({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: null,
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });
  });

  it('should display disabled "Add Child" button when no node is selected', () => {
    render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    const addButton = screen.getByText('Add Child');
    expect(addButton).toBeDisabled();
  });

  it('should display disabled node operation buttons when no node is selected', () => {
    render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    expect(screen.getByText('Add Child')).toBeDisabled();
    expect(screen.getByText('Delete')).toBeDisabled();
    expect(screen.getByText('Move Up')).toBeDisabled();
    expect(screen.getByText('Move Down')).toBeDisabled();
    expect(screen.getByText('Copy JSON')).toBeDisabled();
    expect(screen.getByText('Copy Text')).toBeDisabled();
    expect(screen.getByText('Paste JSON')).toBeDisabled();
    expect(screen.getByText('Paste Text')).toBeDisabled();
  });

  it('should display "No file selected" when no file path is set', () => {
    render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    expect(screen.getByText('Current file: No file selected')).toBeInTheDocument();
  });

  it('should display current file path when JSON file path is set', () => {
    createMockMindMapStore({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: '/path/to/file.json',
      textFilePath: null,
      setJsonFilePath,
      setTextFilePath,
    });

    render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    expect(screen.getByText('Current file: /path/to/file.json')).toBeInTheDocument();
  });

  it('should display current file path when text file path is set', () => {
    createMockMindMapStore({
      mindmap: { root: { text: 'Root', children: [] } },
      setMindmap,
      addNode,
      jsonFilePath: null,
      textFilePath: '/path/to/file.txt',
      setJsonFilePath,
      setTextFilePath,
    });

    render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    expect(screen.getByText('Current file: /path/to/file.txt')).toBeInTheDocument();
  });

  it('should call saveAsFile when Save As JSON is clicked', async () => {
    const defaultPath = 'mindmap.json';
    (saveAsFile as jest.Mock).mockResolvedValue(defaultPath);

    render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    fireEvent.click(screen.getByText('Save As JSON'));

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

    render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    fireEvent.click(screen.getByText('Save As Text'));

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

    render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    fireEvent.click(screen.getByText('Load File'));

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

    render(
      <SelectedPathProvider>
        <Toolbar />
      </SelectedPathProvider>
    );
    expect(screen.getByText('Current file: /path/to/file.json')).toBeInTheDocument();
  });
});
