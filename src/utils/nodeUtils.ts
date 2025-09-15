import { MindNode } from '../types';

/**
 * Checks if a node is part of the selected path hierarchy
 * Returns true if nodePath is a prefix of selectedPath or vice versa
 */
export const isNodeOnSelectedPath = (
  nodePath: number[], 
  selectedPath: number[]
): boolean => {
  if (nodePath.length === 0 || selectedPath.length === 0) {
    return false;
  }
  
  const minLength = Math.min(nodePath.length, selectedPath.length);
  for (let i = 0; i < minLength; i++) {
    if (nodePath[i] !== selectedPath[i]) {
      return false;
    }
  }
  return true;
};

/**
 * Checks if a node is the currently selected node
 * Returns true only if paths match exactly
 */
export const isNodeSelected = (
  nodePath: number[], 
  selectedPath: number[]
): boolean => {
  if (nodePath.length !== selectedPath.length) {
    return false;
  }
  
  return nodePath.every((val, idx) => val === selectedPath[idx]);
};

/**
 * Determines if a node has children
 */
export const hasChildren = (node: MindNode): boolean => {
  return Array.isArray(node.children) && node.children.length > 0;
};

/**
 * Determines the node type for styling purposes
 * Returns the most specific type that applies to the node
 */
export const getNodeType = (
  node: MindNode,
  nodePath: number[],
  selectedPath: number[]
): 'selected' | 'onPath' | 'withChildren' | 'withoutChildren' => {
  if (isNodeSelected(nodePath, selectedPath)) {
    return 'selected';
  }
  
  if (isNodeOnSelectedPath(nodePath, selectedPath)) {
    return 'onPath';
  }
  
  if (hasChildren(node)) {
    return 'withChildren';
  }
  
  return 'withoutChildren';
};