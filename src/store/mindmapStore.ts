import { create, StoreApi, UseBoundStore } from 'zustand';
import { MindMap, MindNode } from '../types';
import { mindMapToText, textToMindMap } from '../utils/textFormat';

export interface MindMapState {
  mindmap: MindMap;
  setMindmap: (mindmap: MindMap) => void;
  addNode: (parentPath: number[], text: string) => void;
  deleteNode: (path: number[]) => void;
  updateNodeText: (path: number[], text: string) => void;
  copyNode: (path: number[]) => Promise<void>;
  pasteNode: (path: number[]) => Promise<void>;
  setSelectedChild: (parentPath: number[], childIndex: number | undefined) => void;
  // File path memory state
  jsonFilePath: string | null;
  textFilePath: string | null;
  setJsonFilePath: (path: string | null) => void;
  setTextFilePath: (path: string | null) => void;
  clearFilePaths: () => void;
}

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

const findParent = (root: MindNode, path: number[]): MindNode | null => {
  if (path.length === 0) {
    return null;
  }
  const parentPath = path.slice(0, -1);
  return findNode(root, parentPath);
};

// Initialize from localStorage
const getInitialFilePaths = () => {
  if (typeof window !== 'undefined') {
    return {
      jsonFilePath: localStorage.getItem('jsonFilePath') || null,
      textFilePath: localStorage.getItem('textFilePath') || null,
    };
  }
  return {
    jsonFilePath: null,
    textFilePath: null,
  };
};

export const useMindMapStore: UseBoundStore<StoreApi<MindMapState>> = create<MindMapState>((set, get) => ({
  mindmap: { root: { text: 'Root', children: [] } },
  ...getInitialFilePaths(),
  setMindmap: (mindmap: MindMap) => set({ mindmap }),
  addNode: (parentPath: number[], text: string) => {
    const { mindmap } = get();
    const newMindMap = { ...mindmap };
    const parent = findNode(newMindMap.root, parentPath);
    if (parent) {
      const newNode: MindNode = { text, children: [] };
      parent.children.push(newNode);
      set({ mindmap: newMindMap });
    }
  },
  deleteNode: (path: number[]) => {
    const { mindmap } = get();
    const newMindMap = { ...mindmap };
    const parent = findParent(newMindMap.root, path);
    const nodeIndex = path[path.length - 1];
    if (parent && parent.children[nodeIndex] !== undefined) {
      parent.children.splice(nodeIndex, 1);
      set({ mindmap: newMindMap });
    }
  },
  updateNodeText: (path: number[], text: string) => {
    const { mindmap } = get();
    const newMindMap = { ...mindmap };
    const node = findNode(newMindMap.root, path);
    if (node) {
      node.text = text;
      set({ mindmap: newMindMap });
    }
  },
  setSelectedChild: (parentPath: number[], childIndex: number | undefined) => {
    const { mindmap } = get();
    const newMindMap = { ...mindmap };
    const parent = findNode(newMindMap.root, parentPath);
    if (parent) {
      parent.selected_child_idx = childIndex;
      set({ mindmap: newMindMap });
    }
  },
  setJsonFilePath: (path: string | null) => {
    set({ jsonFilePath: path });
    if (typeof window !== 'undefined') {
      localStorage.setItem('jsonFilePath', path || '');
    }
  },
  setTextFilePath: (path: string | null) => {
    set({ textFilePath: path });
    if (typeof window !== 'undefined') {
      localStorage.setItem('textFilePath', path || '');
    }
  },
  copyNode: async (path: number[]) => {
    const { mindmap } = get();
    const node = findNode(mindmap.root, path);
    if (!node) return;
    
    // Create a temporary mind map with just this node
    const tempMindMap: MindMap = { root: node };
    const textFormat = mindMapToText(tempMindMap);
    
    try {
      await navigator.clipboard.writeText(textFormat);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback: use document.execCommand for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textFormat;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  },
  pasteNode: async (path: number[]) => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const parsedMindMap = textToMindMap(clipboardText);
      
      if (!parsedMindMap) {
        throw new Error('Invalid clipboard format');
      }
      
      // Add parsed nodes as children to target node
      const { mindmap } = get();
      const newMindMap = { ...mindmap };
      const targetNode = findNode(newMindMap.root, path);
      if (targetNode) {
        targetNode.children.push(...parsedMindMap.root.children);
        // Update selected child to show pasted content
        get().setSelectedChild(path, targetNode.children.length - 1);
        set({ mindmap: newMindMap });
      }
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
    }
  },
  clearFilePaths: () => {
    set({ jsonFilePath: null, textFilePath: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jsonFilePath');
      localStorage.removeItem('textFilePath');
    }
  },
}));