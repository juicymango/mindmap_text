import { MindMap, FileFormat } from '../types';
import { mindMapToText, textToMindMap } from './textFormat';

export const detectFormat = (filePath: string): FileFormat => {
  return filePath.toLowerCase().endsWith('.txt') ? 'text' : 'json';
};

/**
 * Sanitizes a string to be safe for use as a filename across operating systems
 * @param text - The text to sanitize
 * @returns - Sanitized filename-safe string
 */
export const sanitizeFilename = (text: string): string => {
  if (!text || text.trim() === '') return '';

  // Remove invalid characters: < > : " / \ | ? * and control chars (ASCII 0-31)
  // eslint-disable-next-line no-control-regex
  let sanitized = text.replace(/[<>:"/\\|?*]/g, '').replace(/[\x00-\x1F]/g, '');

  // Replace multiple whitespace with single space
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // Remove leading/trailing dots (Windows doesn't allow)
  sanitized = sanitized.replace(/^\.+|\.+$/g, '');

  // Handle reserved names (Windows)
  const reservedNames = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
  ];

  if (reservedNames.includes(sanitized.toUpperCase())) {
    sanitized = `${sanitized}_mindmap`;
  }

  return sanitized;
};

/**
 * Generates a safe filename from root node text
 * @param rootText - The root node text
 * @param format - The file format ('json' or 'text')
 * @returns - Safe filename with appropriate extension
 */
export const generateFilenameFromRoot = (rootText: string, format: FileFormat): string => {
  const sanitized = sanitizeFilename(rootText);
  const base = sanitized || 'mindmap';
  const extension = format === 'text' ? 'txt' : 'json';

  // Truncate if too long (leaving room for extension)
  const maxLength = 100 - extension.length - 1;
  const truncated = base.length > maxLength ? base.substring(0, maxLength) : base;

  return `${truncated}.${extension}`;
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

export const saveAsFile = async (
  mindmap: MindMap,
  format: FileFormat = 'json',
  rootText?: string
): Promise<string> => {
  const filename = rootText
    ? generateFilenameFromRoot(rootText, format)
    : `mindmap.${format === 'text' ? 'txt' : 'json'}`;

  saveToFile(mindmap, filename);
  return filename;
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
