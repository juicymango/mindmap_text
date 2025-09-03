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

-   **Function:** Renders the toolbar with save and load buttons.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { useMindMapStore } from '../store/mindmapStore';
    import { saveToFile, loadFromFile } from '../utils/file';

    export const Toolbar: React.FC = () => {
      const { mindmap, setMindmap } = useMindMapStore();

      const handleSave = () => saveToFile(mindmap);
      const handleLoad = async () => {
        const newMindMap = await loadFromFile();
        if (newMindMap) {
          setMindmap(newMindMap);
        }
      };

      return (
        <div>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleLoad}>Load</button>
        </div>
      );
    };
    ```

### `src/store/mindmapStore.ts`

-   **Function:** Zustand store for the mind map.
-   **Structure:**
    ```typescript
    import create from 'zustand';
    import { MindMap, MindNode } from '../types';
    import { DropResult } from 'react-beautiful-dnd';

    interface MindMapState {
      mindmap: MindMap;
      setMindmap: (mindmap: MindMap) => void;
      addNode: (parentId: string, text: string) => void;
      deleteNode: (nodeId: string) => void;
      updateNodeText: (nodeId: string, text: string) => void;
      onDragEnd: (result: DropResult) => void;
    }

    export const useMindMapStore = create<MindMapState>((set) => ({
      mindmap: { root: { id: 'root', text: 'Root', children: [] } },
      setMindmap: (mindmap) => set({ mindmap }),
      addNode: (parentId, text) => { /* ... */ },
      deleteNode: (nodeId) => { /* ... */ },
      updateNodeText: (nodeId, text) => { /* ... */ },
      onDragEnd: (result) => { /* ... */ },
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
      id: string;
      text: string;
      children: MindNode[];
      selected_child_id?: string;
      children_order?: string[];
    }

    export interface MindMap {
      root: MindNode;
    }
    ```

### `src/utils/file.ts`

-   **Function:** Contains utility functions for file operations.
-   **Structure:**
    ```typescript
    import { MindMap } from '../types';

    export const saveToFile = (mindmap: MindMap) => {
      // ... use File System Access API to save file
    };

    export const loadFromFile = async (): Promise<MindMap | null> => {
      // ... use File System Access API to load file
      return null;
    };
    ```
