import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Node } from './Node';
import { MindNode } from '../types';
import styled from 'styled-components';

interface ColumnProps {
  nodes: MindNode[];
  columnPath: number[];
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
  flex-shrink: 0;
`;

export const Column: React.FC<ColumnProps> = ({ nodes, columnPath, index }) => {
  // Ensure droppableId is always a valid string
  const droppableId = columnPath.length === 0 ? 'root' : JSON.stringify(columnPath);
  
  return (
    <ColumnContainer>
      <Droppable droppableId={droppableId} type="node">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {nodes.map((node, index) => (
              <Node key={index} node={node} path={[...columnPath, index]} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </ColumnContainer>
  );
};