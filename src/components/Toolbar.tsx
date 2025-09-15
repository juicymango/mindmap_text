import React from 'react';
import { useMindMapStore } from '../store/mindmapStore';
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
    jsonFilePath, 
    textFilePath, 
    setJsonFilePath, 
    setTextFilePath
  } = useMindMapStore();

  
  
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

  const handleAddNode = () => {
    addNode([], 'New Node');
  };

  
  const getCurrentFilePath = () => {
    return jsonFilePath || textFilePath || 'No file selected';
  };

  return (
    <ToolbarContainer>
      <button onClick={handleAddNode}>Add Node</button>
      
      <ButtonGroup>
        <button onClick={() => handleSaveAs('json')}>Save As JSON</button>
        <button onClick={() => handleSaveAs('text')}>Save As Text</button>
      </ButtonGroup>
      
      <ButtonGroup>
        <button onClick={handleLoad}>Load File</button>
      </ButtonGroup>
      
            
      <FilePathDisplay>
        Current file: {getCurrentFilePath()}
      </FilePathDisplay>
    </ToolbarContainer>
  );
};
