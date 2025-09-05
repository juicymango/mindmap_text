export interface MindNode {
  text: string;
  children: MindNode[];
  selected_child_idx?: number;
}

export interface MindMap {
  root: MindNode;
}

export type FileFormat = 'json' | 'text';
