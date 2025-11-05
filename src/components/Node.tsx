import React, { useState, useEffect } from 'react';
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
}

const NodeContainer = styled.div<{ $nodeType: 'selected' | 'onPath' | 'withChildren' | 'withoutChildren' }>`
  position: relative;
  padding: 12px;
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
  min-height: 44px;
  
  &:hover {
    background-color: ${(props) => NODE_COLORS[props.$nodeType].hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-color: ${(props) => NODE_COLORS[props.$nodeType].border};
  }
  
  &:focus {
    outline: 2px solid ${(props) => NODE_COLORS.selected.border};
    outline-offset: 2px;
  }
`;


export const Node: React.FC<NodeProps> = ({ node, path, index, onSelect }) => {
  const { mindmap, updateNodeText, setSelectedChild } = useMindMapStore();
  const { selectedPath } = useSelectedPath();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(node.text);

  // Sync local text state with node prop when it changes (e.g., after move operations)
  useEffect(() => {
    setText(node.text);
  }, [node.text]);

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
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            width: '100%',
            outline: 'none'
          }}
        />
      ) : (
        <span style={{ 
          fontSize: '14px', 
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