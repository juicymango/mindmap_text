import { MindMap, MindNode } from '../types';

export const mindMapToText = (mindMap: MindMap): string => {
  const lines: string[] = [];
  // Skip the root node (auxiliary node) and start from its children
  mindMap.root.children.forEach(child => traverse(child, 0));
  
  function traverse(node: MindNode, depth: number) {
    lines.push('\t'.repeat(depth) + node.text);
    node.children.forEach(child => traverse(child, depth + 1));
  }
  
  return lines.join('\n');
};

export const textToMindMap = (text: string): MindMap | null => {
  if (text.trim() === '') {
    return null;
  }
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) {
    return null;
  }

  const getDepth = (line: string) => {
      let depth = 0;
      for (let i = 0; i < line.length; i++) {
          if (line[i] === '\t') {
              depth++;
          } else {
              break;
          }
      }
      return depth;
  }

  // Check if first line has depth > 0 (invalid text format)
  const firstLine = lines[0];
  if (getDepth(firstLine) !== 0) {
      return null;
  }

  // Create auxiliary root node that won't appear in the text output
  const root: MindNode = { text: 'Root', children: [] };
  const parentStack: MindNode[] = [root];

  lines.forEach(line => {
    const depth = getDepth(line);
    const text = line.trim();
    const newNode: MindNode = { text, children: [] };

    // All lines in the text should be children of the auxiliary root
    // So we adjust the depth accordingly
    const adjustedDepth = depth + 1;

    while (parentStack.length > adjustedDepth) {
      parentStack.pop();
    }

    if (parentStack.length > 0) {
        parentStack[parentStack.length - 1].children.push(newNode);
    }
    parentStack.push(newNode);
  });

  return { root };
};