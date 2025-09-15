import React from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { useSelectedPath } from '../contexts/SelectedPathContext';
import { saveAsFile, loadFromFile } from '../utils/file';
import { FileFormat } from '../types';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  padding: 8px;
  border-bottom: 1px solid lightgrey;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilePathDisplay = styled.div`
  font-size: 12px;
  color: #666;
  margin-left: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
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
    jsonFilePath, 
    textFilePath, 
    setJsonFilePath, 
    setTextFilePath,
    generatePrompt
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

  const handleGeneratePrompt = () => {
    if (hasSelection || hasRootSelection) {
      generatePrompt(selectedPath);
    }
  };
  
  const getCurrentFilePath = () => {
    return jsonFilePath || textFilePath || 'No file selected';
  };

  return (
    <ToolbarContainer>
      <ButtonGroup>
        <button onClick={handleAddChild} disabled={!(hasSelection || hasRootSelection)}>Add Child</button>
        <button onClick={handleDelete} disabled={!hasSelection}>Delete</button>
        <button onClick={handleMoveUp} disabled={!hasSelection}>Move Up</button>
        <button onClick={handleMoveDown} disabled={!hasSelection}>Move Down</button>
      </ButtonGroup>
      
      <ButtonGroup>
        <button onClick={handleCopyJson} disabled={!(hasSelection || hasRootSelection)}>Copy JSON</button>
        <button onClick={handleCopyText} disabled={!(hasSelection || hasRootSelection)}>Copy Text</button>
        <button onClick={handlePasteJson} disabled={!(hasSelection || hasRootSelection)}>Paste JSON</button>
        <button onClick={handlePasteText} disabled={!(hasSelection || hasRootSelection)}>Paste Text</button>
        <button onClick={handleGeneratePrompt} disabled={!(hasSelection || hasRootSelection)}>Generate Prompt</button>
      </ButtonGroup>
      
      <ButtonGroup>
        <button onClick={() => handleSaveAs('json')}>Save As JSON</button>
        <button onClick={() => handleSaveAs('text')}>Save As Text</button>
        <button onClick={handleLoad}>Load File</button>
      </ButtonGroup>
      
      <FilePathDisplay>
        Current file: {getCurrentFilePath()}
      </FilePathDisplay>
    </ToolbarContainer>
  );
};
