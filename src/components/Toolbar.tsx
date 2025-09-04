import React from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { saveToFile, loadFromFile } from '../utils/file';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  padding: 8px;
  border-bottom: 1px solid lightgrey;
`;

export const Toolbar: React.FC = () => {
  const { mindmap, setMindmap, addNode } = useMindMapStore();

  const handleSave = () => saveToFile(mindmap);
  const handleLoad = async () => {
    const newMindMap = await loadFromFile();
    if (newMindMap) {
      setMindmap(newMindMap);
    }
  };

  const handleAddNode = () => {
    // For simplicity, we add a new node to the root.
    // A more complete implementation would allow selecting the parent.
    addNode([], 'New Node');
  };

  return (
    <ToolbarContainer>
      <button onClick={handleAddNode}>Add Node</button>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleLoad}>Load</button>
    </ToolbarContainer>
  );
};
