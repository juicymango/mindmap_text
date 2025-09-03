import React from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { Column } from './Column';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { MindNode } from '../types';

const MindMapContainer = styled.div`
  display: flex;
`;

export const MindMap: React.FC = () => {
  const { mindmap, onDragEnd } = useMindMapStore();

  const findChild = (nodes: MindNode[], childId: string) => nodes.find((child) => child.id === childId);

  const getColumns = () => {
    const columns: { id: string; nodes: MindNode[] }[] = [];
    let currentNode = mindmap.root;
    columns.push({ id: currentNode.id, nodes: currentNode.children });

    while (currentNode.selected_child_id) {
      const selectedChild = findChild(currentNode.children, currentNode.selected_child_id);
      if (selectedChild) {
        columns.push({ id: selectedChild.id, nodes: selectedChild.children });
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
      <Droppable droppableId="mindmap" direction="horizontal" type="COLUMN">
        {(provided) => (
          <MindMapContainer {...provided.droppableProps} ref={provided.innerRef}>
            {columns.map((column, index) => (
              <Column key={column.id} columnId={column.id} nodes={column.nodes} index={index} />
            ))}
            {provided.placeholder}
          </MindMapContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};
