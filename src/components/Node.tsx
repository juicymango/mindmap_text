import React, { useState } from 'react';
import { MindNode } from '../types';
import { useMindMapStore } from '../store/mindmapStore';
import styled from 'styled-components';

interface NodeProps {
  node: MindNode;
  path: number[];
  index: number;
  onSelect: (path: number[]) => void;
}

const NodeContainer = styled.div<{ $isSelected: boolean }>`
  padding: 8px;
  border: 1px solid lightgrey;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.$isSelected ? 'lightblue' : 'white')};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const findNode = (root: MindNode, path: number[]): MindNode | null => {
  if (path.length === 0) {
    return root;
  }
  let currentNode: MindNode | null = root;
  for (const index of path) {
    if (currentNode && currentNode.children && currentNode.children[index]) {
      currentNode = currentNode.children[index];
    } else {
      return null;
    }
  }
  return currentNode;
};

export const Node: React.FC<NodeProps> = ({ node, path, index, onSelect }) => {
  const { updateNodeText, setSelectedChild, mindmap, addNode, deleteNode } = useMindMapStore();
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

  const parentPath = path.slice(0, -1);
  const parent = findNode(mindmap.root, parentPath);
  const isSelected = (parent?.selected_child_idx ?? 0) === index;

  return (
    <NodeContainer
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      $isSelected={isSelected}
    >
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        node.text
      )}
      <div>
        <button onClick={handleAddChild}>+</button>
        <button onClick={handleDelete}>x</button>
      </div>
    </NodeContainer>
  );
};