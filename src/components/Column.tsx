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

const ColumnContainer = styled.div<{ $isRoot?: boolean }>`
  margin: 8px 4px;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  width: 240px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  ${props => props.$isRoot && `
    border-left: 4px solid #4A90E2;
  `}
`;

export const Column: React.FC<ColumnProps> = ({ nodes, columnPath, index, onNodeSelect }) => {
  // Special handling for root column: if this is the first column (index 0) 
  // and contains only one node with empty columnPath, it's the root node
  const isRootColumn = index === 0 && columnPath.length === 0 && nodes.length === 1;
  
  return (
    <ColumnContainer $isRoot={isRootColumn}>
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