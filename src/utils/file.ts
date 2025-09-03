import { MindMap } from '../types';

export const saveToFile = (mindmap: MindMap) => {
  const data = JSON.stringify(mindmap, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mindmap.json';
  a.click();
  URL.revokeObjectURL(url);
};

export const loadFromFile = async (): Promise<MindMap | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const mindmap = JSON.parse(e.target?.result as string);
            resolve(mindmap);
          } catch (error) {
            console.error('Error parsing JSON file', error);
            resolve(null);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  });
};
