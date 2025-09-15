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
 * Checks if a node is part of the selected path hierarchy including selected_child_idx chain
 * Returns true if node is on the path determined by following selected_child_idx from selected node
 */
export const isNodeOnSelectedPathWithChildIndex = (
  nodePath: number[],
  selectedPath: number[],
  rootNode: MindNode
): boolean => {
  // First check if it's a regular ancestor
  if (isNodeOnSelectedPath(nodePath, selectedPath)) {
    return true;
  }
  
  // If not, check if it's part of the selected_child_idx chain extending from the selected node
  if (nodePath.length > selectedPath.length) {
    // Check if nodePath extends selectedPath
    for (let i = 0; i < selectedPath.length; i++) {
      if (nodePath[i] !== selectedPath[i]) {
        return false;
      }
    }
    
    // Now check if each subsequent index matches the selected_child_idx
    let currentNode = rootNode;
    for (let i = 0; i < selectedPath.length; i++) {
      if (currentNode.children && selectedPath[i] < currentNode.children.length) {
        currentNode = currentNode.children[selectedPath[i]];
      } else {
        return false;
      }
    }
    
    // Check the extension part
    for (let i = selectedPath.length; i < nodePath.length; i++) {
      const expectedChildIndex = currentNode.selected_child_idx ?? 0;
      if (nodePath[i] !== expectedChildIndex) {
        return false;
      }
      
      if (currentNode.children && expectedChildIndex < currentNode.children.length) {
        currentNode = currentNode.children[expectedChildIndex];
      } else {
        return false;
      }
    }
    
    return true;
  }
  
  return false;
};

/**
 * Determines the node type for styling purposes
 * Returns the most specific type that applies to the node
 */
export const getNodeType = (
  node: MindNode,
  nodePath: number[],
  selectedPath: number[],
  rootNode?: MindNode
): 'selected' | 'onPath' | 'withChildren' | 'withoutChildren' => {
  if (isNodeSelected(nodePath, selectedPath)) {
    return 'selected';
  }
  
  if (isNodeOnSelectedPath(nodePath, selectedPath)) {
    return 'onPath';
  }
  
  // Check if it's part of the selected_child_idx chain (if root node is provided)
  if (rootNode && isNodeOnSelectedPathWithChildIndex(nodePath, selectedPath, rootNode)) {
    return 'onPath';
  }
  
  if (hasChildren(node)) {
    return 'withChildren';
  }
  
  return 'withoutChildren';
};