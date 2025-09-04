import { MindMap, MindNode } from '../types';

export const mindMapToText = (mindMap: MindMap): string => {
  const lines: string[] = [];
  function traverse(node: MindNode, depth: number) {
    lines.push('\t'.repeat(depth) + node.text);
    node.children.forEach(child => traverse(child, depth + 1));
  }
  traverse(mindMap.root, 0);
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

  const firstLine = lines.shift()!;
  if (getDepth(firstLine) !== 0) {
      return null;
  }
  const root: MindNode = { text: firstLine.trim(), children: [] };
  const parentStack: MindNode[] = [root];

  lines.forEach(line => {
    const depth = getDepth(line);
    const text = line.trim();
    const newNode: MindNode = { text, children: [] };

    while (parentStack.length > depth) {
      parentStack.pop();
    }

    if (parentStack.length > 0) {
        parentStack[parentStack.length - 1].children.push(newNode);
    }
    parentStack.push(newNode);
  });

  return { root };
};