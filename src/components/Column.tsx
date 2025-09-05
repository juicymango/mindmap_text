import React from 'react';
import { Node } from './Node';
import { MindNode } from '../types';
import styled from 'styled-components';

interface ColumnProps {
  nodes: MindNode[];
  columnPath: number[];
  index: number;
  onNodeSelect: (path: number[]) => void;
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

export const Column: React.FC<ColumnProps> = ({ nodes, columnPath, index, onNodeSelect }) => {
  return (
    <ColumnContainer>
      {nodes.map((node, nodeIndex) => (
        <Node 
          key={nodeIndex} 
          node={node} 
          path={[...columnPath, nodeIndex]} 
          index={nodeIndex}
          onSelect={onNodeSelect}
        />
      ))}
    </ColumnContainer>
  );
};