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
  // Special handling for root column: if this is the first column (index 0) 
  // and contains only one node with empty columnPath, it's the root node
  const isRootColumn = index === 0 && columnPath.length === 0 && nodes.length === 1;
  
  return (
    <ColumnContainer>
      {nodes.map((node, nodeIndex) => (
        <Node 
          key={nodeIndex} 
          node={node} 
          path={isRootColumn && nodeIndex === 0 ? [] : [...columnPath, nodeIndex]} 
          index={nodeIndex}
          onSelect={onNodeSelect}
        />
      ))}
    </ColumnContainer>
  );
};