export const NODE_COLORS = {
  selected: {
    background: '#4A90E2',
    border: '#357ABD',
    text: '#FFFFFF',
    hover: '#357ABD'
  },
  onPath: {
    background: '#B8D4F1',
    border: '#7DB8E8',
    text: '#1565C0',
    hover: '#A8CCEF'
  },
  withChildren: {
    background: '#E3F2FD',
    border: '#90CAF9',
    text: '#333333',
    hover: '#D1E7FC'
  },
  withoutChildren: {
    background: '#FFFFFF',
    border: '#DEE2E6',
    text: '#333333',
    hover: '#F8F9FA'
  }
} as const;

export type NodeType = keyof typeof NODE_COLORS;