export interface MindNode {
  id: string;
  text: string;
  children: MindNode[];
  selected_child_id?: string;
  children_order?: string[];
}

export interface MindMap {
  root: MindNode;
}
