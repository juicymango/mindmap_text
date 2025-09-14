import React from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { Column } from './Column';
import { useSelectedPath } from '../contexts/SelectedPathContext';
import styled from 'styled-components';
import { MindNode } from '../types';

const MindMapContainer = styled.div`
  display: flex;
  overflow-x: auto;
`;

export const MindMap: React.FC = () => {
  const { mindmap, copyNode, pasteNode, setSelectedChild } = useMindMapStore();
  const { selectedPath, setSelectedPath } = useSelectedPath();

  const getColumns = () => {
    const columns: { path: number[]; nodes: MindNode[] }[] = [];
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Check for Ctrl+C or Cmd+C
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
      event.preventDefault();
      copyNode(selectedPath);
    }
    
    // Check for Ctrl+V or Cmd+V
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
      event.preventDefault();
      pasteNode(selectedPath);
    }
  };

  const handleNodeSelect = (path: number[]) => {
    setSelectedPath(path);
    if (path.length > 0) {
      const parentPath = path.slice(0, -1);
      const childIndex = path[path.length - 1];
      setSelectedChild(parentPath, childIndex);
    }
  };

  return (
    <MindMapContainer onKeyDown={handleKeyDown} tabIndex={0}>
      {columns.map((column, index) => (
        <Column
          key={JSON.stringify(column.path)}
          columnPath={column.path}
          nodes={column.nodes}
          index={index}
          onNodeSelect={handleNodeSelect}
        />
      ))}
    </MindMapContainer>
  );
};