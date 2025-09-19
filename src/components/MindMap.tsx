import React from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { Column } from './Column';
import { useSelectedPath } from '../contexts/SelectedPathContext';
import styled from 'styled-components';
import { MindNode } from '../types';

const MindMapContainer = styled.div`
  display: flex;
  overflow-x: auto;
  flex: 1;
  background: #F9FAFB;
  
  // Custom scrollbar styling
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F3F4F6;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
  }
`;

export const MindMap: React.FC = () => {
  const { mindmap, setSelectedChild } = useMindMapStore();
  const { setSelectedPath } = useSelectedPath();

  const getColumns = () => {
    const columns: { path: number[]; nodes: MindNode[] }[] = [];
    
    // Add auxiliary root column first (always present)
    columns.push({ path: [], nodes: [mindmap.root] });
    
    // Continue with existing column logic
    let currentNode = mindmap.root;
    let currentPath: number[] = [];
    columns.push({ path: currentPath, nodes: currentNode.children });

    while (true) {
      const selectedChildIndex = currentNode.selected_child_idx ?? 0;
      const selectedChild = currentNode.children[selectedChildIndex];
      if (selectedChild) {
        currentPath = [...currentPath, selectedChildIndex];
        columns.push({ path: currentPath, nodes: selectedChild.children });
        currentNode = selectedChild;
      } else {
        break;
      }
    }
    return columns;
  };

  const columns = getColumns();

  const handleNodeSelect = (path: number[]) => {
    setSelectedPath(path);
    if (path.length > 0) {
      const parentPath = path.slice(0, -1);
      const childIndex = path[path.length - 1];
      setSelectedChild(parentPath, childIndex);
    }
  };

  return (
    <MindMapContainer>
      {columns.map((column, index) => (
        <Column
          key={`${JSON.stringify(column.path)}-${index}`}
          columnPath={column.path}
          nodes={column.nodes}
          index={index}
          onNodeSelect={handleNodeSelect}
        />
      ))}
    </MindMapContainer>
  );
};