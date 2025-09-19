import { create } from 'zustand';

interface MobileState {
  // Track which nodes are expanded in mobile view
  expandedNodes: Set<string>;
  
  // Track currently selected path for mobile
  selectedPath: number[];
  
  // Track which node is currently being edited
  editingPath: number[] | null;
  
  // Track which node's action menu is open
  actionMenuPath: number[] | null;
  
  // Actions
  toggleExpand: (path: number[]) => void;
  setExpanded: (path: number[], expanded: boolean) => void;
  setAllExpanded: (expanded: boolean) => void;
  setSelectedPath: (path: number[]) => void;
  setEditingPath: (path: number[] | null) => void;
  setActionMenuPath: (path: number[] | null) => void;
  
  // Utility actions
  clearAllExpanded: () => void;
  expandAll: (rootNode: any) => void;
  collapseAll: () => void;
}

// Helper function to convert path array to string key
const pathToKey = (path: number[]): string => path.join('-');

// Helper function to recursively expand all nodes
const expandAllNodes = (node: any, expandedNodes: Set<string>, path: number[] = []): void => {
  if (node.children && node.children.length > 0) {
    const key = pathToKey(path);
    expandedNodes.add(key);
    
    node.children.forEach((child: any, index: number) => {
      expandAllNodes(child, expandedNodes, [...path, index]);
    });
  }
};

export const useMobileState = create<MobileState>((set, get) => ({
  expandedNodes: new Set(),
  selectedPath: [],
  editingPath: null,
  actionMenuPath: null,

  toggleExpand: (path: number[]) => {
    const key = pathToKey(path);
    const { expandedNodes } = get();
    const newExpanded = new Set(expandedNodes);
    
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    
    set({ expandedNodes: newExpanded });
  },

  setExpanded: (path: number[], expanded: boolean) => {
    const key = pathToKey(path);
    const { expandedNodes } = get();
    const newExpanded = new Set(expandedNodes);
    
    if (expanded) {
      newExpanded.add(key);
    } else {
      newExpanded.delete(key);
    }
    
    set({ expandedNodes: newExpanded });
  },

  setAllExpanded: (expanded: boolean) => {
    if (expanded) {
      // When setting to true, we'll need the root node to expand all
      // This should be called with the root node from the component
      set({ expandedNodes: new Set(['']) }); // Root node has empty path
    } else {
      set({ expandedNodes: new Set() });
    }
  },

  setSelectedPath: (path: number[]) => {
    set({ selectedPath: path });
  },

  setEditingPath: (path: number[] | null) => {
    set({ editingPath: path });
  },

  setActionMenuPath: (path: number[] | null) => {
    set({ actionMenuPath: path });
  },

  clearAllExpanded: () => {
    set({ expandedNodes: new Set() });
  },

  expandAll: (rootNode: any) => {
    const expandedNodes = new Set<string>();
    expandAllNodes(rootNode, expandedNodes);
    set({ expandedNodes });
  },

  collapseAll: () => {
    set({ expandedNodes: new Set() });
  },
}));