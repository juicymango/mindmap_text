import { MindNode } from '../types';

/**
 * Checks if a node is part of the selected path hierarchy
 * Returns true only if nodePath is a prefix of selectedPath (node is an ancestor)
 */
export const isNodeOnSelectedPath = (
  nodePath: number[], 
  selectedPath: number[]
): boolean => {
  // Empty path (root) is ancestor of any non-empty selected path
  if (nodePath.length === 0) {
    return selectedPath.length > 0;
  }
  
  if (selectedPath.length === 0) {
    return false;
  }
  
  // Node must be shorter than or equal to selected path to be an ancestor
  if (nodePath.length > selectedPath.length) {
    return false;
  }
  
  // Check if nodePath is a prefix of selectedPath
  for (let i = 0; i < nodePath.length; i++) {
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