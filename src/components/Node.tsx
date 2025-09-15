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
}

const NodeContainer = styled.div<{ $nodeType: 'selected' | 'onPath' | 'withChildren' | 'withoutChildren' }>`
  padding: 8px;
  border: 1px solid ${(props) => NODE_COLORS[props.$nodeType].border};
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: ${(props) => NODE_COLORS[props.$nodeType].background};
  color: ${(props) => NODE_COLORS[props.$nodeType].text};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${(props) => NODE_COLORS[props.$nodeType].hover};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &:focus {
    outline: 2px solid ${(props) => NODE_COLORS.selected.border};
    outline-offset: 2px;
  }
`;


export const Node: React.FC<NodeProps> = ({ node, path, index, onSelect }) => {
  const { mindmap, updateNodeText, setSelectedChild, addNode, deleteNode } = useMindMapStore();
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

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    addNode(path, 'New Node');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(path);
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
            padding: '2px',
            borderRadius: '2px'
          }}
        />
      ) : (
        node.text
      )}
      <div>
        <button 
          onClick={handleAddChild}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid currentColor',
            color: 'inherit',
            padding: '2px 6px',
            borderRadius: '2px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        <button 
          onClick={handleDelete}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid currentColor',
            color: 'inherit',
            padding: '2px 6px',
            borderRadius: '2px',
            cursor: 'pointer'
          }}
        >
          x
        </button>
      </div>
    </NodeContainer>
  );
};