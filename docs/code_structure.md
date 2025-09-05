# Code Structure

This document describes the directory structure, files, and the functions and structures within them.

## Directory Structure

```
mindmap-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── App.tsx
│   │   ├── MindMap.tsx
│   │   ├── Column.tsx
│   │   ├── Node.tsx
│   │   └── Toolbar.tsx
│   ├── store/
│   │   └── mindmapStore.ts
│   ├── styles/
│   │   └── GlobalStyles.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── file.ts
│   ├── index.tsx
│   └── react-app-env.d.ts
├── package.json
└── tsconfig.json
```

### Directory Functions

-   `public/`: Contains the main HTML file.
-   `src/`: Contains the source code of the application.
-   `src/components/`: Contains the React components.
-   `src/store/`: Contains the Zustand store.
-   `src/styles/`: Contains the global styles.
-   `src/types/`: Contains the TypeScript types.
-   `src/utils/`: Contains utility functions.

## File Functions and Structures

### `src/components/App.tsx`

-   **Function:** The main component of the application.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { MindMap } from './MindMap';
    import { Toolbar } from './Toolbar';
    import { GlobalStyles } from '../styles/GlobalStyles';

    export const App: React.FC = () => {
      return (
        <>
          <GlobalStyles />
          <Toolbar />
          <MindMap />
        </>
      );
    };
    ```

### `src/components/MindMap.tsx`

-   **Function:** Renders the mind map columns.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { useMindMapStore } from '../store/mindmapStore';
    import { Column } from './Column';
    import { DragDropContext, DropResult } from 'react-beautiful-dnd';

    export const MindMap: React.FC = () => {
      // get state and actions from store
      const { columns, onDragEnd } = useMindMapStore();

      return (
        <DragDropContext onDragEnd={onDragEnd}>
          {/* render columns */}
        </DragDropContext>
      );
    };
    ```

### `src/components/Column.tsx`

-   **Function:** Renders a single column of nodes.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { Droppable } from 'react-beautiful-dnd';
    import { Node } from './Node';
    import { MindNode } from '../types';

    interface ColumnProps {
      nodes: MindNode[];
      columnId: string;
    }

    export const Column: React.FC<ColumnProps> = ({ nodes, columnId }) => {
      return (
        <Droppable droppableId={columnId}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {/* render nodes */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    };
    ```

### `src/components/Node.tsx`

-   **Function:** Renders a single node.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { Draggable } from 'react-beautiful-dnd';
    import { MindNode } from '../types';

    interface NodeProps {
      node: MindNode;
      index: number;
    }

    export const Node: React.FC<NodeProps> = ({ node, index }) => {
      return (
        <Draggable draggableId={node.id} index={index}>
          {(provided) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              {node.text}
            </div>
          )}
        </Draggable>
      );
    };
    ```

### `src/components/Toolbar.tsx`

-   **Function:** Renders the toolbar with save/load buttons and file path display.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { useMindMapStore } from '../store/mindmapStore';
    import { saveToFile, saveAsFile, loadFromFile } from '../utils/file';
    import { FileFormat } from '../types';
    import styled from 'styled-components';

    const ToolbarContainer = styled.div`
      padding: 8px;
      border-bottom: 1px solid lightgrey;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    `;

    const FilePathDisplay = styled.div`
      font-size: 12px;
      color: #666;
      margin-left: 8px;
    `;

    const ButtonGroup = styled.div`
      display: flex;
      gap: 4px;
    `;

    export const Toolbar: React.FC = () => {
      const { 
        mindmap, 
        setMindmap, 
        addNode, 
        jsonFilePath, 
        textFilePath, 
        setJsonFilePath, 
        setTextFilePath 
      } = useMindMapStore();

      const handleSave = async () => {
        if (jsonFilePath) {
          saveToFile(mindmap, jsonFilePath);
        } else {
          const path = await saveAsFile(mindmap, 'json');
          if (path) {
            setJsonFilePath(path);
          }
        }
      };

      const handleSaveAs = async (format: FileFormat) => {
        const path = await saveAsFile(mindmap, format);
        if (path) {
          if (format === 'json') {
            setJsonFilePath(path);
          } else {
            setTextFilePath(path);
          }
        }
      };

      const handleLoad = async () => {
        const filePath = jsonFilePath || textFilePath;
        const { mindmap: newMindMap, path } = await loadFromFile(filePath);
        
        if (newMindMap) {
          setMindmap(newMindMap);
          const format = path.endsWith('.txt') ? 'text' : 'json';
          if (format === 'json') {
            setJsonFilePath(path);
          } else {
            setTextFilePath(path);
          }
        }
      };

      const handleLoadAs = async () => {
        const { mindmap: newMindMap, path } = await loadFromFile();
        
        if (newMindMap) {
          setMindmap(newMindMap);
          const format = path.endsWith('.txt') ? 'text' : 'json';
          if (format === 'json') {
            setJsonFilePath(path);
          } else {
            setTextFilePath(path);
          }
        }
      };

      const handleAddNode = () => {
        addNode([], 'New Node');
      };

      const getCurrentFilePath = () => {
        return jsonFilePath || textFilePath || 'No file selected';
      };

      return (
        <ToolbarContainer>
          <button onClick={handleAddNode}>Add Node</button>
          
          <ButtonGroup>
            <button onClick={handleSave} disabled={!jsonFilePath && !textFilePath}>
              Save
            </button>
            <button onClick={() => handleSaveAs('json')}>Save As JSON</button>
            <button onClick={() => handleSaveAs('text')}>Save As Text</button>
          </ButtonGroup>
          
          <ButtonGroup>
            <button onClick={handleLoad} disabled={!jsonFilePath && !textFilePath}>
              Load
            </button>
            <button onClick={handleLoadAs}>Load As</button>
          </ButtonGroup>
          
          <FilePathDisplay>
            Current file: {getCurrentFilePath()}
          </FilePathDisplay>
        </ToolbarContainer>
      );
    };
    ```

### `src/store/mindmapStore.ts`

-   **Function:** Zustand store for the mind map with file path memory.
-   **Structure:**
    ```typescript
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

    export const useMindMapStore: UseBoundStore<StoreApi<MindMapState>> = create<MindMapState>((set, get) => ({
      mindmap: { root: { text: 'Root', children: [] } },
      jsonFilePath: null,
      textFilePath: null,
      setMindmap: (mindmap: MindMap) => set({ mindmap }),
      addNode: (parentPath: number[], text: string) => { /* ... */ },
      deleteNode: (path: number[]) => { /* ... */ },
      updateNodeText: (path: number[], text: string) => { /* ... */ },
      onDragEnd: (result: DropResult) => { /* ... */ },
      setSelectedChild: (parentPath: number[], childIndex: number | undefined) => { /* ... */ },
      setJsonFilePath: (path: string | null) => {
        set({ jsonFilePath: path });
        localStorage.setItem('jsonFilePath', path || '');
      },
      setTextFilePath: (path: string | null) => {
        set({ textFilePath: path });
        localStorage.setItem('textFilePath', path || '');
      },
      clearFilePaths: () => {
        set({ jsonFilePath: null, textFilePath: null });
        localStorage.removeItem('jsonFilePath');
        localStorage.removeItem('textFilePath');
      },
    }));
    ```

### `src/styles/GlobalStyles.ts`

-   **Function:** Contains global styles for the application.
-   **Structure:**
    ```typescript
    import { createGlobalStyle } from 'styled-components';

    export const GlobalStyles = createGlobalStyle`
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
      }
    `;
    ```

### `src/types/index.ts`

-   **Function:** Contains TypeScript types for the application.
-   **Structure:**
    ```typescript
    export interface MindNode {
      text: string;
      children: MindNode[];
      selected_child_idx?: number;
    }

    export interface MindMap {
      root: MindNode;
    }

    export type FileFormat = 'json' | 'text';
    ```

### `src/utils/file.ts`

-   **Function:** Contains utility functions for file operations with path memory.
-   **Structure:**
    ```typescript
    import { MindMap, FileFormat } from '../types';
    import { mindMapToText, textToMindMap } from './textFormat';

    export const detectFormat = (filePath: string): FileFormat => {
      return filePath.endsWith('.txt') ? 'text' : 'json';
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
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = format === 'text' ? '.txt' : '.json';
        input.setAttribute('nwsaveas', `mindmap.${format === 'text' ? 'txt' : 'json'}`);
        
        input.onchange = (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            saveToFile(mindmap, file.path);
            resolve(file.path);
          } else {
            resolve('');
          }
        };
        input.click();
      });
    };

    export const loadFromFile = async (filePath?: string): Promise<{ mindmap: MindMap | null, path: string }> => {
      if (filePath) {
        return loadFromPath(filePath);
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
                  mindmap = textToMindMap(text);
                } else {
                  mindmap = JSON.parse(e.target?.result as string);
                }
                
                resolve({ mindmap, path: file.path || file.name });
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

    const loadFromPath = async (filePath: string): Promise<{ mindmap: MindMap | null, path: string }> => {
      // Implementation for loading from specific path
      // This would use Node.js fs API or similar
      return { mindmap: null, path: filePath };
    };

    const downloadFile = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    };
    ```
