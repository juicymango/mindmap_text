import React, { useState } from 'react';
import { MindNode } from '../types';
import { useMindMapStore } from '../store/mindmapStore';
import { useSelectedPath } from '../contexts/SelectedPathContext';
import { getNodeType } from '../utils/nodeUtils';
import { NODE_COLORS } from '../styles/nodeColors';
import styled from 'styled-components';

interface NodeProps {
  node: MindNode;
  path: number[];
  index: number;
  onSelect: (path: number[]) => void;
  isMobile?: boolean;
}

const NodeContainer = styled.div<{ $nodeType: 'selected' | 'onPath' | 'withChildren' | 'withoutChildren'; $isMobile?: boolean }>`
  position: relative;
  padding: ${props => props.$isMobile ? '16px 12px' : '12px'};
  border: 2px solid ${(props) => NODE_COLORS[props.$nodeType].border};
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => NODE_COLORS[props.$nodeType].background};
  color: ${(props) => NODE_COLORS[props.$nodeType].text};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: ${props => props.$isMobile ? '48px' : '44px'};
  user-select: none;
  
  // Mobile-specific touch feedback
  ${props => props.$isMobile && `
    -webkit-tap-highlight-color: transparent;
    
    &:active {
      transform: scale(0.98);
      background-color: ${NODE_COLORS[props.$nodeType].hover};
    }
    
    &:focus {
      outline: 3px solid ${NODE_COLORS.selected.border};
      outline-offset: 2px;
    }
  `}
  
  // Desktop hover effects
  ${props => !props.$isMobile && `
    &:hover {
      background-color: ${NODE_COLORS[props.$nodeType].hover};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-color: ${NODE_COLORS[props.$nodeType].border};
    }
    
    &:focus {
      outline: 2px solid ${NODE_COLORS.selected.border};
      outline-offset: 2px;
    }
  `}
`;


export const Node: React.FC<NodeProps> = ({ node, path, index, onSelect, isMobile }) => {
  const { mindmap, updateNodeText, setSelectedChild } = useMindMapStore();
  const { selectedPath } = useSelectedPath();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(node.text);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    updateNodeText(path, text);
    setIsEditing(false);
  };

  const handleClick = () => {
    const parentPath = path.slice(0, -1);
    setSelectedChild(parentPath, index);
    onSelect(path);
  };

  const nodeType = getNodeType(node, path, selectedPath, mindmap.root);

  return (
    <NodeContainer
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      $nodeType={nodeType}
      $isMobile={isMobile}
      tabIndex={0} // Make focusable for accessibility
    >
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          style={{
            backgroundColor: 'transparent',
            border: '1px solid currentColor',
            color: 'inherit',
            padding: isMobile ? '6px 12px' : '4px 8px',
            borderRadius: '4px',
            fontSize: isMobile ? '16px' : '14px',
            fontWeight: '500',
            width: '100%',
            outline: 'none'
          }}
        />
      ) : (
        <span style={{ 
          fontSize: isMobile ? '16px' : '14px', 
          fontWeight: '500',
          lineHeight: '1.4',
          wordBreak: 'break-word'
        }}>
          {node.text}
        </span>
      )}
    </NodeContainer>
  );
};