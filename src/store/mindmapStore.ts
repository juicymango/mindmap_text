import { create, StoreApi, UseBoundStore } from 'zustand';
import { MindMap, MindNode } from '../types';
import { DropResult } from 'react-beautiful-dnd';

interface MindMapState {
  mindmap: MindMap;
  setMindmap: (mindmap: MindMap) => void;
  addNode: (parentPath: number[], text: string) => void;
  deleteNode: (path: number[]) => void;
  updateNodeText: (path: number[], text: string) => void;
  onDragEnd: (result: DropResult) => void;
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
  onDragEnd: (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    const { mindmap } = get();
    const newMindMap = { ...mindmap };

    const sourceParent = findNode(newMindMap.root, JSON.parse(source.droppableId));
    const destParent = findNode(newMindMap.root, JSON.parse(destination.droppableId));

    if (sourceParent && destParent) {
      const [removed] = sourceParent.children.splice(source.index, 1);
      destParent.children.splice(destination.index, 0, removed);
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
  clearFilePaths: () => {
    set({ jsonFilePath: null, textFilePath: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jsonFilePath');
      localStorage.removeItem('textFilePath');
    }
  },
}));