import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MindNode } from '../types';
import { useMindMapStore } from '../store/mindmapStore';
import styled from 'styled-components';

interface NodeProps {
  node: MindNode;
  index: number;
}

const NodeContainer = styled.div<{ isSelected: boolean }>`
  padding: 8px;
  border: 1px solid lightgrey;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isSelected ? 'lightblue' : 'white')};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Node: React.FC<NodeProps> = ({ node, index }) => {
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
    updateNodeText(node.id, text);
    setIsEditing(false);
  };

  const handleClick = () => {
    const parent = findParent(mindmap.root, node.id);
    if (parent) {
      setSelectedChild(parent.id, node.id);
    }
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    addNode(node.id, 'New Node');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(node.id);
  };

  const findParent = (currentNode: MindNode, nodeId: string): MindNode | null => {
    for (const child of currentNode.children) {
      if (child.id === nodeId) {
        return currentNode;
      }
      const found = findParent(child, nodeId);
      if (found) {
        return found;
      }
    }
    return null;
  };

  const parent = findParent(mindmap.root, node.id);
  const isSelected = parent?.selected_child_id === node.id;

  return (
    <Draggable draggableId={node.id} index={index}>
      {(provided) => (
        <NodeContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
          isSelected={isSelected}
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
      )}
    </Draggable>
  );
};
