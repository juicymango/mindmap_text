import { create, StoreApi, UseBoundStore } from 'zustand';
import { MindMap, MindNode } from '../types';
import { DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

interface MindMapState {
  mindmap: MindMap;
  setMindmap: (mindmap: MindMap) => void;
  addNode: (parentId: string, text: string) => void;
  deleteNode: (nodeId: string) => void;
  updateNodeText: (nodeId: string, text: string) => void;
  onDragEnd: (result: DropResult) => void;
  setSelectedChild: (parentId: string, childId: string | undefined) => void;
}

const findNode = (nodes: MindNode[], nodeId: string): MindNode | null => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }
    const found = findNode(node.children, nodeId);
    if (found) {
      return found;
    }
  }
  return null;
};

export const useMindMapStore: UseBoundStore<StoreApi<MindMapState>> = create<MindMapState>((set, get) => ({
  mindmap: { root: { id: 'root', text: 'Root', children: [] } },
  setMindmap: (mindmap: MindMap) => set({ mindmap }),
  addNode: (parentId: string, text: string) => {
    const { mindmap } = get();
    const newMindMap = { ...mindmap };
    const parent = findNode([newMindMap.root], parentId);
    if (parent) {
      const newNode: MindNode = { id: uuidv4(), text, children: [] };
      parent.children.push(newNode);
      set({ mindmap: newMindMap });
    }
  },
  deleteNode: (nodeId: string) => {
    const { mindmap } = get();
    const newMindMap = { ...mindmap };

    const findParent = (nodes: MindNode[], nodeId: string): MindNode | null => {
      for (const node of nodes) {
        if (node.children.some(child => child.id === nodeId)) {
          return node;
        }
        const found = findParent(node.children, nodeId);
        if (found) {
          return found;
        }
      }
      return null;
    };

    const parent = findParent([newMindMap.root], nodeId);
    if (parent) {
      parent.children = parent.children.filter(child => child.id !== nodeId);
      set({ mindmap: newMindMap });
    }
  },
  updateNodeText: (nodeId: string, text: string) => {
    const { mindmap } = get();
    const newMindMap = { ...mindmap };
    const node = findNode([newMindMap.root], nodeId);
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

    const findParent = (nodes: MindNode[], nodeId: string): MindNode | null => {
      for (const node of nodes) {
        if (node.children.some(child => child.id === nodeId)) {
          return node;
        }
        const found = findParent(node.children, nodeId);
        if (found) {
          return found;
        }
      }
      return null;
    };

    const sourceParent = findParent([newMindMap.root], source.droppableId);
    const destParent = findParent([newMindMap.root], destination.droppableId);

    if (sourceParent && destParent) {
      const [removed] = sourceParent.children.splice(source.index, 1);
      destParent.children.splice(destination.index, 0, removed);
      set({ mindmap: newMindMap });
    }
  },
  setSelectedChild: (parentId: string, childId: string | undefined) => {
    const { mindmap } = get();
    const newMindMap = { ...mindmap };
    const parent = findNode([newMindMap.root], parentId);
    if (parent) {
      parent.selected_child_id = childId;
      set({ mindmap: newMindMap });
    }
  },
}));
