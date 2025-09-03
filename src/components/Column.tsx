import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Node } from './Node';
import { MindNode } from '../types';
import styled from 'styled-components';

interface ColumnProps {
  nodes: MindNode[];
  columnId: string;
  index: number;
}

const ColumnContainer = styled.div`
  margin: 8px;
  padding: 8px;
  border: 1px solid lightgrey;
  border-radius: 4px;
  width: 220px;
  display: flex;
  flex-direction: column;
`;

export const Column: React.FC<ColumnProps> = ({ nodes, columnId, index }) => {
  return (
    <Draggable draggableId={columnId} index={index} type="COLUMN">
      {(provided) => (
        <ColumnContainer {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
          <Droppable droppableId={columnId} type="node">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {nodes.map((node, index) => (
                  <Node key={node.id} node={node} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </ColumnContainer>
      )}
    </Draggable>
  );
};
