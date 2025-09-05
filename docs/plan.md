# Implementation and Testing Plan

This document outlines the plan for implementing and testing the mind map application using React.

## Project Setup

1.  **Initialize React App:** Use `create-react-app` with the TypeScript template to set up a new React project.
    ```bash
    npx create-react-app mindmap-app --template typescript
    ```
2.  **Dependencies:**
    - **State Management:** We will use `Zustand`. It's a small, fast and scalable bearbones state-management solution. It has a comfortable API based on hooks, and it's less boilerplate than Redux.
    - **Drag and Drop:** We will use `react-beautiful-dnd`. It's a popular, accessible and powerful library for drag and drop in React.
    - **Styling:** We will use `styled-components` for styling. It allows us to write actual CSS code to style our components, which is more intuitive and powerful than using plain JavaScript objects.
    - **UUID:** We will use the `uuid` library to generate unique IDs for our nodes.

    ```bash
    npm install zustand react-beautiful-dnd styled-components uuid
    npm install @types/react-beautiful-dnd @types/styled-components @types/uuid -D
    ```

## Component Structure

The application will be broken down into the following components:

-   **`App`:** The main component that holds the entire application. It will render the `Toolbar` and the `MindMap` components.
-   **`MindMap`:** The main container for the mind map. It will fetch the data from the Zustand store and render the columns.
-   **`Column`:** A component that renders a single column of nodes. It will be a droppable area for `react-beautiful-dnd`.
-   **`Node`:** A component that renders a single node within a column. It will be a draggable item for `react-beautiful-dnd`.
-   **`Toolbar`:** A component for buttons like "Save", "Load", etc.

## State Management with Zustand

-   A Zustand store will be created to manage the state of the mind map.
-   The store will contain the mind map data as a tree-like structure, as defined in `docs/ui_and_interaction_design.md`.
-   The store will also contain actions to manipulate the state, such as adding, deleting, and updating nodes.

## Implementation Details

1.  **Column View:** The `MindMap` component will get the selected path from the Zustand store and render a series of `Column` components.
2.  **Node Selection:** Each `Node` component will have an `onClick` handler that calls an action in the Zustand store to update the selected node.
3.  **Expansion:** The Zustand store will have a dedicated function to determine the selected path based on the currently selected node. The `MindMap` component will use this to render the columns.
4.  **Drag and Drop:** The `MindMap` component will be wrapped in a `DragDropContext`. The `Column` components will be `Droppable`, and the `Node` components will be `Draggable`. The `onDragEnd` handler will call an action in the Zustand store to update the order of the nodes.
5.  **File Operations:** The `Toolbar` component will have "Save" and "Load" buttons. The "Save" button will get the mind map data from the Zustand store and use the File System Access API to save it as a JSON file. The "Load" button will use the File System Access API to load a JSON file and update the Zustand store.

## Testing Strategy

-   **Unit Tests:** Each component will be tested in isolation using `jest` and `react-testing-library`. We will mock the Zustand store to test the components in a predictable way.
-   **Integration Tests:** We will test the integration between the components and the Zustand store. For example, we will test that clicking on a node correctly updates the state and re-renders the `MindMap` component.
-   **End-to-End Tests:** We will use `Cypress` to automate browser testing. We will create test scripts that simulate user flows, such as creating a new mind map, adding nodes, and saving the mind map.

## Task 17: File Path Memory Feature Implementation Plan

### Overview
Implement file path memory functionality to allow users to save and load mind maps from remembered file paths, with format detection based on file extension.

### Implementation Plan

1. **State Management Enhancement**
   - Add file path memory state to the Zustand store
   - Store remembered file paths for both JSON and text formats
   - Add actions to update and clear remembered file paths

2. **File Operations Enhancement**
   - Modify save/load functions to use remembered file paths
   - Add format detection based on file extension (.json/.txt)
   - Implement "Save" and "Load" buttons that use remembered paths
   - Keep "Save As" and "Load As" buttons for path selection

3. **UI Enhancements**
   - Display current remembered file path in the toolbar
   - Add "Save" and "Load" buttons alongside existing "Save As" and "Load As" buttons
   - Show appropriate error messages when file operations fail

4. **Local Storage Integration**
   - Use localStorage to persist remembered file paths across sessions
   - Implement fallback behavior when no file path is remembered

### Technical Approach

1. **Store State Extensions**
   ```typescript
   interface FilePathState {
     jsonFilePath: string | null;
     textFilePath: string | null;
     setJsonFilePath: (path: string | null) => void;
     setTextFilePath: (path: string | null) => void;
     clearFilePaths: () => void;
   }
   ```

2. **Enhanced File Operations**
   - `save(mindmap: MindMap, filePath?: string)` - Save to remembered path or prompt
   - `load(filePath?: string)` - Load from remembered path or prompt
   - `detectFormat(filePath: string)` - Determine format from file extension

3. **UI Components**
   - Add file path display to Toolbar component
   - Implement quick save/load buttons
   - Add error handling for file operations

### Implementation Steps

1. Update Zustand store with file path state
2. Enhance file utility functions with path memory
3. Update Toolbar component with new buttons and file path display
4. Implement localStorage persistence
5. Add comprehensive error handling
6. Update unit tests to cover new functionality
