# Test Cases

## Node Operations

- **Add a new node:**
  - Click the "Add Node" button.
  - A new node should appear in the same column.
  - The new node should have default text like "New Node".
- **Add a child node:**
  - Select a node.
  - Click the "Add Child Node" button.
  - A new column should appear to the right with the new child node.
- **Delete a node:**
  - Click the "Delete" button on a node.
  - The node and all its children should be removed.
- **Edit a node's text:**
  - Double-click on a node's text.
  - The text should become editable.
  - After editing and pressing Enter or clicking away, the new text should be saved.

## Drag and Drop

- **Reorder nodes within a column:**
  - Drag a node and drop it in a different position within the same column.
  - The node's position in the list of siblings should be updated.
- **Move a node to another column (as a child of a node in that column):**
  - Drag a node from one column and drop it onto a node in another column.
  - The dragged node should become a child of the drop target node.
- **Move a node to another column (as a sibling):**
  - Drag a node from one column and drop it in the space between nodes in another column.
  - The dragged node should be added to the new column as a sibling.

## Selection and Expansion

- **Select a node:**
  - Click on a node.
  - The node should be highlighted.
  - If the node has children, a new column should appear to the right with its children.
- **Deselect a node:**
  - Click on another node.
  - The previously selected node should no longer be highlighted.
- **Expand and collapse children:**
  - When a node is selected, its children are shown.
  - When another node at the same level is selected, the children of the previous node are hidden.

## File Operations

- **Save the mind map:**
  - Click the "Save" button.
  - The current state of the mind map should be saved to a local file.
- **Load a mind map:**
  - Click the "Load" button.
  - A file dialog should appear.
  - Selecting a valid mind map file should load the mind map onto the canvas.

## File Path Memory Feature

- **Save with file path memory:**
  - Click "Save As JSON" and select a file path.
  - The file path should be remembered and displayed in the toolbar.
  - Click "Save" button - should save to the remembered path without prompting.
  - The remembered file path should persist across browser sessions.

- **Save As Text with file path memory:**
  - Click "Save As Text" and select a file path.
  - The file path should be remembered and displayed in the toolbar.
  - Click "Save" button - should save to the remembered path without prompting.
  - The file format should be detected from the file extension.

- **Load with file path memory:**
  - Load a file using "Load As" button.
  - The file path should be remembered and displayed in the toolbar.
  - Click "Load" button - should load from the remembered path without prompting.
  - The file format should be automatically detected from the file extension.

- **File path display:**
  - The toolbar should display the current remembered file path.
  - When no file is selected, it should show "No file selected".
  - The display should update immediately when a new file is saved or loaded.

- **File format detection:**
  - Files with .json extension should be loaded as JSON format.
  - Files with .txt extension should be loaded as text format.
  - Files with other extensions should default to JSON format.

- **Button state management:**
  - "Save" button should be disabled when no file path is remembered.
  - "Load" button should be disabled when no file path is remembered.
  - "Save As" and "Load As" buttons should always be enabled.

- **Error handling:**
  - If save operation fails, an appropriate error message should be shown.
  - If load operation fails (invalid file format), an appropriate error message should be shown.
  - If remembered file path becomes inaccessible, the app should fall back to file selection dialog.

- **Local storage persistence:**
  - Remembered file paths should be saved to localStorage.
  - File paths should be restored from localStorage when the app loads.
  - Clearing localStorage should reset the remembered file paths.

## Test Code Location

- **Unit and integration tests:** `src/App.test.tsx`, `src/components/*.test.tsx`, `src/store/*.test.ts`
- **End-to-end tests:** (Not implemented yet, but would be in a separate `e2e` directory)

## Unit Test Cases for File Path Memory

### Store Tests (`src/store/mindmapStore.test.ts`)
- Test initial state of file paths
- Test setting JSON file path
- Test setting text file path
- Test clearing file paths
- Test localStorage integration

### File Utils Tests (`src/utils/file.test.ts`)
- Test format detection from file extension
- Test saveToFile with different formats
- Test loadFromFile with different formats
- Test error handling for invalid files

### Toolbar Component Tests (`src/components/Toolbar.test.ts`)
- Test file path display rendering
- Test button states based on file path availability
- Test save/load functionality with remembered paths
- Test save/load As functionality
- Test error message display