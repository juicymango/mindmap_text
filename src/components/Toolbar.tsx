import React from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { saveAsFile, loadFromFile } from '../utils/file';
import { FileFormat } from '../types';
import { AIPromptDialog } from './AIPromptDialog';
import { AIConfigDialog } from './AIConfigDialog';
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
    clearAIError,
    aiConfig,
    aiConfigDialogOpen,
    setAIConfigDialogOpen,
    updateAIConfig
  } = useMindMapStore();

  const { selectedPath } = useSelectedPath();
  const [isAIDialogOpen, setIsAIDialogOpen] = React.useState(false);

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

  const handleAIConfigSave = (config: typeof aiConfig) => {
    updateAIConfig(config);
    setAIConfigDialogOpen(false);
  };

  const handleOpenAIConfigDialog = () => {
    setAIConfigDialogOpen(true);
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
        <button onClick={handleLoadAs}>Load As</button>
      </ButtonGroup>
      
      <ButtonGroup>
        <button 
          onClick={handleOpenAIDialog}
          disabled={isAILoading}
        >
          {isAILoading ? 'AI Working...' : 'Ask AI'}
        </button>
        <button 
          onClick={handleOpenAIConfigDialog}
          disabled={isAILoading}
        >
          AI Config
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
      <AIConfigDialog
        isOpen={aiConfigDialogOpen}
        onClose={() => setAIConfigDialogOpen(false)}
        onSave={handleAIConfigSave}
        currentConfig={aiConfig}
      />
    </ToolbarContainer>
  );
};
