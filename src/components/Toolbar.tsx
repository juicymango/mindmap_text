import React from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { useSelectedPath } from '../contexts/SelectedPathContext';
import { saveAsFile, loadFromFile } from '../utils/file';
import { FileFormat } from '../types';
import styled from 'styled-components';
import { Plus, Trash2, ChevronUp, ChevronDown, Copy, FileText, Save, FolderOpen } from 'lucide-react';

const ToolbarContainer = styled.div`
  height: 48px;
  background: #FFFFFF;
  border-bottom: 1px solid #DEE2E6;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  /* Custom scrollbar styling for horizontal scrolling */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #F9FAFB;
  }

  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
  }

  /* Hide scrollbar when not hovering for cleaner appearance */
  &:not(:hover)::-webkit-scrollbar {
    height: 0;
  }
`;


const ToolbarButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  background: #FFFFFF;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F9FAFB;
    border-color: #9CA3AF;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.variant === 'primary' && `
    background: #4A90E2;
    border-color: #4A90E2;
    color: white;
    
    &:hover {
      background: #357ABD;
      border-color: #357ABD;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    border-color: #EF4444;
    color: #EF4444;
    
    &:hover {
      background: #FEE2E2;
      border-color: #DC2626;
    }
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 8px;
  border-right: 1px solid #E5E7EB;
  flex-shrink: 0;

  &:last-child {
    border-right: none;
  }
`;

export const Toolbar: React.FC = () => {
  const {
    mindmap,
    setMindmap,
    addNode,
    deleteNode,
    moveNodeUp,
    moveNodeDown,
    copyNodeAsJson,
    copyNodeAsText,
    pasteNodeAsJson,
    pasteNodeAsText,
    setJsonFilePath,
    setTextFilePath
  } = useMindMapStore();
  
  const { selectedPath, setSelectedPath } = useSelectedPath();
  const hasSelection = selectedPath.length > 0;
  const hasRootSelection = selectedPath.length === 0; // Root node has empty path []

  const handleSaveAs = async (format: FileFormat) => {
    const path = await saveAsFile(mindmap, format);
    if (path) {
      if (format === 'json') {
        setJsonFilePath(path);
      } else {
        setTextFilePath(path);
      }
    }
  };

  const handleLoad = async () => {
    const { mindmap: newMindMap, path } = await loadFromFile();

    if (newMindMap) {
      setMindmap(newMindMap);
      const format = path.endsWith('.txt') ? 'text' : 'json';
      if (format === 'json') {
        setJsonFilePath(path);
      } else {
        setTextFilePath(path);
      }
    }
  };

  const handleAddChild = () => {
    if (hasSelection || hasRootSelection) {
      addNode(selectedPath, 'New Node');
    }
  };

  const handleDelete = () => {
    if (hasSelection) {
      deleteNode(selectedPath);
    }
  };

  const handleMoveUp = () => {
    if (hasSelection) {
      const newPath = moveNodeUp(selectedPath);
      if (newPath !== selectedPath) {
        setSelectedPath(newPath);
      }
    }
  };

  const handleMoveDown = () => {
    if (hasSelection) {
      const newPath = moveNodeDown(selectedPath);
      if (newPath !== selectedPath) {
        setSelectedPath(newPath);
      }
    }
  };

  const handleCopyJson = () => {
    if (hasSelection || hasRootSelection) {
      copyNodeAsJson(selectedPath);
    }
  };

  const handleCopyText = () => {
    if (hasSelection || hasRootSelection) {
      copyNodeAsText(selectedPath);
    }
  };

  const handlePasteJson = () => {
    if (hasSelection || hasRootSelection) {
      pasteNodeAsJson(selectedPath);
    }
  };

  const handlePasteText = () => {
    if (hasSelection || hasRootSelection) {
      pasteNodeAsText(selectedPath);
    }
  };

  return (
    <ToolbarContainer data-testid="toolbar-container">
      <ButtonGroup>
        <ToolbarButton onClick={handleAddChild} disabled={!(hasSelection || hasRootSelection)} title="Add Child Node">
          <Plus size={16} />
          <span>Add Child</span>
        </ToolbarButton>
        <ToolbarButton onClick={handleDelete} disabled={!hasSelection} variant="danger" title="Delete Node">
          <Trash2 size={16} />
          <span>Delete</span>
        </ToolbarButton>
        <ToolbarButton onClick={handleMoveUp} disabled={!hasSelection} title="Move Node Up">
          <ChevronUp size={16} />
          <span>Move Up</span>
        </ToolbarButton>
        <ToolbarButton onClick={handleMoveDown} disabled={!hasSelection} title="Move Node Down">
          <ChevronDown size={16} />
          <span>Move Down</span>
        </ToolbarButton>
      </ButtonGroup>
      
      <ButtonGroup>
        <ToolbarButton onClick={handleCopyJson} disabled={!(hasSelection || hasRootSelection)} title="Copy as JSON">
          <Copy size={16} />
          <span>Copy JSON</span>
        </ToolbarButton>
        <ToolbarButton onClick={handleCopyText} disabled={!(hasSelection || hasRootSelection)} title="Copy as Text">
          <FileText size={16} />
          <span>Copy Text</span>
        </ToolbarButton>
        <ToolbarButton onClick={handlePasteJson} disabled={!(hasSelection || hasRootSelection)} title="Paste JSON">
          <Copy size={16} />
          <span>Paste JSON</span>
        </ToolbarButton>
        <ToolbarButton onClick={handlePasteText} disabled={!(hasSelection || hasRootSelection)} title="Paste Text">
          <FileText size={16} />
          <span>Paste Text</span>
        </ToolbarButton>
      </ButtonGroup>
      
      <ButtonGroup>
        <ToolbarButton onClick={() => handleSaveAs('json')} title="Save as JSON">
          <Save size={16} />
          <span>Save JSON</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => handleSaveAs('text')} title="Save as Text">
          <FileText size={16} />
          <span>Save Text</span>
        </ToolbarButton>
        <ToolbarButton onClick={handleLoad} title="Load File">
          <FolderOpen size={16} />
          <span>Load File</span>
        </ToolbarButton>
      </ButtonGroup>
    </ToolbarContainer>
  );
};
