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
    
    // For copy operation, we need to include the node being copied as content
    // Create a temporary structure where the copied node becomes a child of auxiliary root
    const tempMindMap: MindMap = { 
      root: { 
        text: 'Root', 
        children: [node] 
      } 
    };
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
    const { mindmap } = get();
    
    try {
      let clipboardContent: string;
      
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.readText) {
        clipboardContent = await navigator.clipboard.readText();
      } else {
        // Fallback to older method
        clipboardContent = await new Promise<string>((resolve, reject) => {
          const textarea = document.createElement('textarea');
          textarea.value = '';
          document.body.appendChild(textarea);
          textarea.select();
          
          const success = document.execCommand('paste');
          document.body.removeChild(textarea);
          
          if (success) {
            resolve(textarea.value);
          } else {
            reject(new Error('Failed to paste from clipboard'));
          }
        });
      }
      
      if (!clipboardContent.trim()) {
        return; // Empty clipboard
      }
      
      // Parse clipboard content as mind map structure
      const parsedMindMap = textToMindMap(clipboardContent);
      
      // Create new mind map with updated structure
      const newMindMap = { ...mindmap };
      const targetNode = findNode(newMindMap.root, path);
      
      if (targetNode && parsedMindMap?.root) {
        // Handle auxiliary root logic for compatibility with tests
        if (path.length === 0) {
          // Pasting to root node - update root text and add children from auxiliary root
          if (parsedMindMap.root.children.length > 0) {
            targetNode.text = parsedMindMap.root.children[0].text;
            targetNode.children.push(...parsedMindMap.root.children[0].children);
          }
        } else {
          // Pasting to non-root node - add the auxiliary root's children directly
          // This matches the test expectations for adding nodes
          targetNode.children.push(...parsedMindMap.root.children);
        }
        
        get().setSelectedChild(path, targetNode.children.length - 1);
        set({ mindmap: newMindMap });
      }
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
      // Optionally show error to user
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