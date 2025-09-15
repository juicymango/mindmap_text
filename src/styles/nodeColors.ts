export const NODE_COLORS = {
  selected: {
    background: '#4A90E2',
    border: '#357ABD',
    text: '#FFFFFF',
    hover: '#357ABD'
  },
  onPath: {
    background: '#E8F4FD',
    border: '#B8D4F1',
    text: '#333333',
    hover: '#D1E7FC'
  },
  withChildren: {
    background: '#aab7c0ff',
    border: '#90CAF9',
    text: '#333333',
    hover: '#BBDEFB'
  },
  withoutChildren: {
    background: '#FFFFFF',
    border: '#DEE2E6',
    text: '#333333',
    hover: '#F8F9FA'
  }
} as const;

export type NodeType = keyof typeof NODE_COLORS;