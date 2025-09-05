import React from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { saveToFile, saveAsFile, loadFromFile } from '../utils/file';
import { FileFormat } from '../types';
import { AIPromptDialog } from './AIPromptDialog';
import { useSelectedPath } from '../contexts/SelectedPathContext';
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
    setTextFilePath,
    generateAIContent,
    isAILoading,
    aiError,
    clearAIError
  } = useMindMapStore();

  const { selectedPath } = useSelectedPath();
  const [isAIDialogOpen, setIsAIDialogOpen] = React.useState(false);

  const handleSave = async () => {
    if (jsonFilePath) {
      saveToFile(mindmap, jsonFilePath);
    } else if (textFilePath) {
      saveToFile(mindmap, textFilePath);
    } else {
      const path = await saveAsFile(mindmap, 'json');
      if (path) {
        setJsonFilePath(path);
      }
    }
  };

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
    const filePath = jsonFilePath || textFilePath;
    if (!filePath) return;
    
    const { mindmap: newMindMap, path } = await loadFromFile(filePath);
    
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

  const handleLoadAs = async () => {
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

  const handleAIRequest = async (question: string) => {
    await generateAIContent(selectedPath, question);
    setIsAIDialogOpen(false);
  };

  const handleOpenAIDialog = () => {
    setIsAIDialogOpen(true);
    clearAIError();
  };

  const getCurrentFilePath = () => {
    return jsonFilePath || textFilePath || 'No file selected';
  };

  const hasFilePath = jsonFilePath || textFilePath;

  return (
    <ToolbarContainer>
      <button onClick={handleAddNode}>Add Node</button>
      
      <ButtonGroup>
        <button onClick={handleSave} disabled={!hasFilePath}>
          Save
        </button>
        <button onClick={() => handleSaveAs('json')}>Save As JSON</button>
        <button onClick={() => handleSaveAs('text')}>Save As Text</button>
      </ButtonGroup>
      
      <ButtonGroup>
        <button onClick={handleLoad} disabled={!hasFilePath}>
          Load
        </button>
        <button onClick={handleLoadAs}>Load As</button>
      </ButtonGroup>
      
      <ButtonGroup>
        <button 
          onClick={handleOpenAIDialog}
          disabled={isAILoading}
        >
          {isAILoading ? 'AI Working...' : 'Ask AI'}
        </button>
      </ButtonGroup>
      
      <FilePathDisplay>
        Current file: {getCurrentFilePath()}
      </FilePathDisplay>
      
      <AIPromptDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        onSubmit={handleAIRequest}
        isLoading={isAILoading}
        error={aiError || undefined}
      />
    </ToolbarContainer>
  );
};
