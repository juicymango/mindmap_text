import React from 'react';
import { Node } from './Node';
import { MindNode } from '../types';
import styled from 'styled-components';

interface ColumnProps {
  nodes: MindNode[];
  columnPath: number[];
  index: number;
  onNodeSelect: (path: number[]) => void;
  isMobile?: boolean;
  columnWidth?: number;
}

const ColumnContainer = styled.div<{ $isRoot?: boolean; $isMobile?: boolean; $columnWidth?: number }>`
  margin: ${props => props.$isMobile ? '4px 2px' : '8px 4px'};
  padding: ${props => props.$isMobile ? '8px' : '12px'};
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  width: ${props => props.$columnWidth || 240}px;
  min-width: ${props => props.$isMobile ? '180px' : '240px'};
  max-width: ${props => props.$isMobile ? '200px' : 'none'};
  max-height: ${props => props.$isMobile ? '60vh' : 'calc(100vh - 120px)'};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background: #FFFFFF;
  box-shadow: ${props => props.$isMobile ? '0 2px 8px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  overflow-y: auto;
  
  // Mobile-optimized scrolling
  ${props => props.$isMobile && `
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: y mandatory;
    
    // Touch-friendly scrollbar
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #F9FAFB;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #D1D5DB;
      border-radius: 4px;
    }
  `}
  
  // Desktop scrollbar styling
  ${props => !props.$isMobile && `
    // Custom scrollbar styling for vertical scroll
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #F9FAFB;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #D1D5DB;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #9CA3AF;
    }
  `}
  
  ${props => props.$isRoot && `
    border-left: 4px solid #4A90E2;
    ${props.$isMobile && `
      box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
    `}
  `}
`;

export const Column: React.FC<ColumnProps> = ({ nodes, columnPath, index, onNodeSelect, isMobile, columnWidth }) => {
  // Special handling for root column: if this is the first column (index 0) 
  // and contains only one node with empty columnPath, it's the root node
  const isRootColumn = index === 0 && columnPath.length === 0 && nodes.length === 1;
  
  return (
    <ColumnContainer 
      $isRoot={isRootColumn} 
      $isMobile={isMobile}
      $columnWidth={columnWidth}
      data-testid="column-container"
    >
      {nodes.map((node, nodeIndex) => (
        <Node 
          key={nodeIndex} 
          node={node} 
          path={isRootColumn && nodeIndex === 0 ? [] : [...columnPath, nodeIndex]} 
          index={nodeIndex}
          onSelect={onNodeSelect}
          isMobile={isMobile}
        />
      ))}
    </ColumnContainer>
  );
};