import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MobileToolbar } from '../components/MobileToolbar';
import { useMindMapStore } from '../store/mindmapStore';
import { useSelectedPath } from '../contexts/SelectedPathContext';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { saveAsFile, loadFromFile } from '../utils/file';

// Mock dependencies
jest.mock('../store/mindmapStore');
jest.mock('../contexts/SelectedPathContext');
jest.mock('../hooks/useMobileDetection');
jest.mock('../utils/file');

const mockUseMindMapStore = useMindMapStore as jest.MockedFunction<typeof useMindMapStore>;
const mockUseSelectedPath = useSelectedPath as jest.MockedFunction<typeof useSelectedPath>;
const mockUseMobileDetection = useMobileDetection as jest.MockedFunction<typeof useMobileDetection>;
const mockSaveAsFile = saveAsFile as jest.MockedFunction<typeof saveAsFile>;
const mockLoadFromFile = loadFromFile as jest.MockedFunction<typeof loadFromFile>;

describe('MobileToolbar', () => {
  const mockMindMapStore = {
    mindmap: {
      root: {
        text: 'Root Node',
        children: [
          { text: 'Child 1', children: [] },
          { text: 'Child 2', children: [] },
        ],
        selected_child_idx: 0,
      },
    },
    setMindmap: jest.fn(),
    addNode: jest.fn(),
    deleteNode: jest.fn(),
    setJsonFilePath: jest.fn(),
    setTextFilePath: jest.fn(),
  };

  const mockSelectedPathContext = {
    selectedPath: [0],
    setSelectedPath: jest.fn(),
  };

  const mockMobileDetection = {
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    columnWidth: 180,
    screenWidth: 375,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseMindMapStore.mockReturnValue(mockMindMapStore);
    mockUseSelectedPath.mockReturnValue(mockSelectedPathContext);
    mockUseMobileDetection.mockReturnValue(mockMobileDetection);
    mockSaveAsFile.mockResolvedValue('/path/to/file.json');
    mockLoadFromFile.mockResolvedValue({
      mindmap: mockMindMapStore.mindmap,
      path: '/path/to/file.json',
    });
  });

  it('should not render on desktop', () => {
    mockUseMobileDetection.mockReturnValue({
      ...mockMobileDetection,
      isMobile: false,
    });

    render(React.createElement(MobileToolbar));
    expect(screen.queryByTestId('mobile-toolbar')).not.toBeInTheDocument();
  });

  it('should render on mobile', () => {
    render(React.createElement(MobileToolbar));
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Load')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('should disable delete button when no node is selected', () => {
    mockUseSelectedPath.mockReturnValue({
      ...mockSelectedPathContext,
      selectedPath: [],
    });

    render(React.createElement(MobileToolbar));
    
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
  });

  it('should enable delete button when node is selected', () => {
    render(React.createElement(MobileToolbar));
    
    expect(screen.getByRole('button', { name: /delete/i })).not.toBeDisabled();
  });

  it('should enable add button when node is selected or at root', () => {
    render(React.createElement(MobileToolbar));
    
    expect(screen.getByRole('button', { name: /add/i })).not.toBeDisabled();
  });

  it('should call handleGoHome when home button is clicked', () => {
    render(React.createElement(MobileToolbar));
    
    fireEvent.click(screen.getByRole('button', { name: /home/i }));
    
    expect(mockSelectedPathContext.setSelectedPath).toHaveBeenCalledWith([]);
  });

  it('should call handleAddChild when add button is clicked', () => {
    render(React.createElement(MobileToolbar));
    
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    
    expect(mockMindMapStore.addNode).toHaveBeenCalledWith([0], 'New Node');
  });

  it('should call handleDelete when delete button is clicked', () => {
    render(React.createElement(MobileToolbar));
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    
    expect(mockMindMapStore.deleteNode).toHaveBeenCalledWith([0]);
  });

  it('should call handleLoad when load button is clicked', async () => {
    render(React.createElement(MobileToolbar));
    
    fireEvent.click(screen.getByRole('button', { name: /load/i }));
    
    await waitFor(() => {
      expect(mockLoadFromFile).toHaveBeenCalled();
    });
    
    expect(mockMindMapStore.setMindmap).toHaveBeenCalledWith(mockMindMapStore.mindmap);
    expect(mockMindMapStore.setJsonFilePath).toHaveBeenCalledWith('/path/to/file.json');
  });

  it('should show action menu when more button is clicked', () => {
    render(React.createElement(MobileToolbar));
    
    // Initially menu should be hidden
    expect(screen.getByTestId('menu-overlay')).not.toBeVisible();
    
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    
    // Menu should now be visible
    expect(screen.getByTestId('menu-overlay')).toBeVisible();
    expect(screen.getByText('More Options')).toBeInTheDocument();
    expect(screen.getByText('Save as JSON')).toBeInTheDocument();
    expect(screen.getByText('Save as Text')).toBeInTheDocument();
    expect(screen.getByText('Load File')).toBeInTheDocument();
  });

  it('should hide action menu when overlay is clicked', () => {
    render(React.createElement(MobileToolbar));
    
    // Show menu
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    
    expect(screen.getByTestId('menu-overlay')).toBeVisible();
    
    // Click overlay to close
    fireEvent.click(screen.getByTestId('menu-overlay'));
    
    // Menu should be hidden
    expect(screen.getByTestId('menu-overlay')).not.toBeVisible();
  });

  it('should call handleSaveAs when save as JSON is clicked', async () => {
    render(React.createElement(MobileToolbar));
    
    // Show menu
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    
    // Click save as JSON
    fireEvent.click(screen.getByText('Save as JSON'));
    
    await waitFor(() => {
      expect(mockSaveAsFile).toHaveBeenCalledWith(mockMindMapStore.mindmap, 'json');
    });
    
    expect(mockMindMapStore.setJsonFilePath).toHaveBeenCalledWith('/path/to/file.json');
    
    // Menu should be closed
    expect(screen.getByTestId('menu-overlay')).not.toBeVisible();
  });

  it('should call handleSaveAs when save as Text is clicked', async () => {
    render(React.createElement(MobileToolbar));
    
    // Show menu
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    
    // Click save as Text
    fireEvent.click(screen.getByText('Save as Text'));
    
    await waitFor(() => {
      expect(mockSaveAsFile).toHaveBeenCalledWith(mockMindMapStore.mindmap, 'text');
    });
    
    expect(mockMindMapStore.setTextFilePath).toHaveBeenCalledWith('/path/to/file.json');
    
    // Menu should be closed
    expect(screen.getByTestId('menu-overlay')).not.toBeVisible();
  });

  it('should call handleLoad when load file is clicked from menu', async () => {
    render(React.createElement(MobileToolbar));
    
    // Show menu
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    
    // Click load file
    fireEvent.click(screen.getByText('Load File'));
    
    await waitFor(() => {
      expect(mockLoadFromFile).toHaveBeenCalled();
    });
    
    expect(mockMindMapStore.setMindmap).toHaveBeenCalledWith(mockMindMapStore.mindmap);
    
    // Menu should be closed
    expect(screen.getByTestId('menu-overlay')).not.toBeVisible();
  });

  it('should close menu when close button is clicked', () => {
    render(React.createElement(MobileToolbar));
    
    // Show menu
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    
    expect(screen.getByTestId('menu-overlay')).toBeVisible();
    
    // Click close button
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    
    // Menu should be hidden
    expect(screen.getByTestId('menu-overlay')).not.toBeVisible();
  });

  it('should handle file save error gracefully', async () => {
    mockSaveAsFile.mockResolvedValue('');
    
    render(React.createElement(MobileToolbar));
    
    // Show menu
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    
    // Click save as JSON
    fireEvent.click(screen.getByText('Save as JSON'));
    
    await waitFor(() => {
      expect(mockSaveAsFile).toHaveBeenCalledWith(mockMindMapStore.mindmap, 'json');
    });
    
    expect(mockMindMapStore.setJsonFilePath).not.toHaveBeenCalled();
  });

  it('should handle file load error gracefully', async () => {
    mockLoadFromFile.mockResolvedValue({
      mindmap: null,
      path: '',
    });
    
    render(React.createElement(MobileToolbar));
    
    fireEvent.click(screen.getByRole('button', { name: /load/i }));
    
    await waitFor(() => {
      expect(mockLoadFromFile).toHaveBeenCalled();
    });
    
    expect(mockMindMapStore.setMindmap).not.toHaveBeenCalled();
  });

  it('should detect text file format correctly when loading', async () => {
    mockLoadFromFile.mockResolvedValue({
      mindmap: mockMindMapStore.mindmap,
      path: '/path/to/file.txt',
    });
    
    render(React.createElement(MobileToolbar));
    
    fireEvent.click(screen.getByRole('button', { name: /load/i }));
    
    await waitFor(() => {
      expect(mockLoadFromFile).toHaveBeenCalled();
    });
    
    expect(mockMindMapStore.setMindmap).toHaveBeenCalledWith(mockMindMapStore.mindmap);
    expect(mockMindMapStore.setTextFilePath).toHaveBeenCalledWith('/path/to/file.txt');
  });

  it('should add child node when at root level', () => {
    mockUseSelectedPath.mockReturnValue({
      ...mockSelectedPathContext,
      selectedPath: [],
    });

    render(React.createElement(MobileToolbar));
    
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    
    expect(mockMindMapStore.addNode).toHaveBeenCalledWith([], 'New Node');
  });
});