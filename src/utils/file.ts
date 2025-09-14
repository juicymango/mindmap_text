import { MindMap, FileFormat } from '../types';
import { mindMapToText, textToMindMap } from './textFormat';

export const detectFormat = (filePath: string): FileFormat => {
  return filePath.toLowerCase().endsWith('.txt') ? 'text' : 'json';
};

export const saveToFile = (mindmap: MindMap, filePath?: string) => {
  const path = filePath || 'mindmap.json';
  const format = detectFormat(path);
  
  if (format === 'text') {
    const data = mindMapToText(mindmap);
    const blob = new Blob([data], { type: 'text/plain' });
    downloadFile(blob, path);
  } else {
    const data = JSON.stringify(mindmap, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    downloadFile(blob, path);
  }
};

export const saveAsFile = async (mindmap: MindMap, format: FileFormat = 'json'): Promise<string> => {
  const defaultFileName = `mindmap.${format === 'text' ? 'txt' : 'json'}`;
  saveToFile(mindmap, defaultFileName);
  return defaultFileName;
};

export const loadFromFile = async (filePath?: string): Promise<{ mindmap: MindMap | null, path: string }> => {
  if (filePath) {
    // For browser environment, we can't directly load from file path
    // This would require Node.js fs API or similar
    return { mindmap: null, path: filePath };
  }
  
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const format = detectFormat(file.name);
            let mindmap: MindMap;
            
            if (format === 'text') {
              const text = e.target?.result as string;
              const parsedMindMap = textToMindMap(text);
              if (!parsedMindMap) {
                throw new Error('Invalid text format');
              }
              mindmap = parsedMindMap;
            } else {
              mindmap = JSON.parse(e.target?.result as string);
            }
            
            resolve({ mindmap, path: file.name });
          } catch (error) {
            console.error('Error parsing file', error);
            resolve({ mindmap: null, path: '' });
          }
        };
        reader.readAsText(file);
      } else {
        resolve({ mindmap: null, path: '' });
      }
    };
    input.click();
  });
};

// Legacy functions for backward compatibility
export const saveAsText = (mindmap: MindMap) => {
  saveToFile(mindmap, 'mindmap.txt');
};

export const loadFromText = async (): Promise<MindMap | null> => {
  const result = await loadFromFile();
  return result.mindmap;
};

const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
