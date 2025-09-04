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
`;

export const Column: React.FC<ColumnProps> = ({ nodes, columnPath, index }) => {
  return (
    <ColumnContainer>
      <Droppable droppableId={JSON.stringify(columnPath)} type="node">
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