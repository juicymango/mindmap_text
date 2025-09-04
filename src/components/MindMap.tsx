import React from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { Column } from './Column';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { MindNode } from '../types';

const MindMapContainer = styled.div`
  display: flex;
`;

export const MindMap: React.FC = () => {
  const { mindmap, onDragEnd } = useMindMapStore();

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <MindMapContainer>
        {columns.map((column, index) => (
          <Column
            key={JSON.stringify(column.path)}
            columnPath={column.path}
            nodes={column.nodes}
            index={index}
          />
        ))}
      </MindMapContainer>
    </DragDropContext>
  );
};