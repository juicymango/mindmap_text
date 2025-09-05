# Test Cases

## Node Operations

- **Add a new node:**
  - Click the "Add Node" button.
  - A new node should appear in the root column.
  - The new node should have default text "New Node".
- **Add a child node:**
  - Select a node by clicking on it.
  - Click the "+" button on the selected node.
  - A new column should appear to the right with the new child node.
- **Delete a node:**
  - Click the "x" button on a node.
  - The node and all its children should be removed from the mind map.
- **Edit a node's text:**
  - Double-click on a node's text.
  - The text should become an editable input field.
  - After editing and clicking away or pressing Tab, the new text should be saved.

## Drag and Drop

- **Reorder nodes within a column:**
  - Drag a node and drop it in a different position within the same column.
  - The node's position in the list of siblings should be updated.
  - The visual order should reflect the new order immediately.
- **Move a node to another column (as a child of a node in that column):**
  - Drag a node from one column and drop it onto a node in another column.
  - The dragged node should become a child of the drop target node.
  - A new column should appear showing the children of the drop target.
- **Move a node to another column (as a sibling):**
  - Drag a node from one column and drop it in the space between nodes in another column.
  - The dragged node should be added to the new column as a sibling.

## Selection and Expansion

- **Select a node:**
  - Click on a node.
  - The node should be highlighted with a light blue background.
  - If the node has children, a new column should appear to the right with its children.
  - The selection should be remembered using `selected_child_idx`.
- **Deselect a node:**
  - Click on another node in the same column.
  - The previously selected node should no longer be highlighted.
  - The newly selected node should be highlighted.
- **Expand and collapse children:**
  - When a node is selected, its children are shown in the next column.
  - When another node at the same level is selected, the children of the previous node are hidden.
  - The expansion state should be maintained using `selected_child_idx`.

## File Operations

- **Save the mind map:**
  - Click the "Save" button.
  - The current state of the mind map should be saved to the remembered file path.
  - If no file path is remembered, the button should be disabled.
- **Load a mind map:**
  - Click the "Load" button.
  - The mind map should be loaded from the remembered file path.
  - If no file path is remembered, the button should be disabled.
- **Save As JSON:**
  - Click the "Save As JSON" button.
  - A file dialog should appear.
  - Selecting a file path should save the mind map in JSON format.
  - The file path should be remembered for future save operations.
- **Save As Text:**
  - Click the "Save As Text" button.
  - A file dialog should appear.
  - Selecting a file path should save the mind map in text format with tab hierarchy.
  - The file path should be remembered for future save operations.
- **Load As:**
  - Click the "Load As" button.
  - A file dialog should appear.
  - Selecting a file should load the mind map and detect the format automatically.
  - The file path should be remembered for future load operations.

## File Path Memory Feature

- **Save with file path memory:**
  - Click "Save As JSON" and select a file path.
  - The file path should be remembered and displayed in the toolbar.
  - Click "Save" button - should save to the remembered path without prompting.
  - The remembered file path should persist across browser sessions using localStorage.

- **Save As Text with file path memory:**
  - Click "Save As Text" and select a file path.
  - The file path should be remembered and displayed in the toolbar.
  - Click "Save" button - should save to the remembered path without prompting.
  - The file format should be detected from the file extension (.txt).

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
  - If save operation fails, an appropriate error message should be shown in the console.
  - If load operation fails (invalid file format), an appropriate error message should be shown in the console.
  - If remembered file path becomes inaccessible, the app should fall back to file selection dialog.

- **Local storage persistence:**
  - Remembered file paths should be saved to localStorage.
  - File paths should be restored from localStorage when the app loads.
  - Clearing localStorage should reset the remembered file paths.

## Text Format Support

- **Text format conversion:**
  - Mind maps should be convertible to text format with tabs representing hierarchy.
  - Text files with tab hierarchy should be correctly parsed into mind maps.
  - The root node should be at depth 0 with no leading tabs.
  - Each level of indentation should correspond to one level in the hierarchy.

- **Text format validation:**
  - Empty text files should be rejected.
  - Text files with invalid indentation should be rejected.
  - The first line must be at depth 0 (no leading tabs).

## Column-Based UI

- **Column rendering:**
  - Each selected node should generate a column to its right showing its children.
  - Columns should have fixed width of 220px to prevent shrinking.
  - Columns should be horizontally scrollable for deep hierarchies.
  - Column headers should show the path to the parent node.

- **Column behavior:**
  - Selecting a node should automatically expand its children in the next column.
  - The expansion should follow the `selected_child_idx` of each node.
  - Empty columns should not be displayed.

## Test Code Location

- **Unit and integration tests:** `src/App.test.tsx`, `src/components/*.test.tsx`, `src/store/*.test.ts`, `src/utils/*.test.ts`
- **End-to-end tests:** (Not implemented yet, but would be in a separate `e2e` directory)
- **Test utilities:** `src/utils/test-utils.ts` - Type-safe mocking utilities and test helpers

## TypeScript Error Prevention and Testing Utilities

### Test Utilities (`src/utils/test-utils.ts`)

The project includes comprehensive test utilities to prevent TypeScript compilation errors and ensure type safety:

- **Type-safe mocking utilities:** `createMockMindMapStore()` provides proper TypeScript typing for mocking the Zustand store
- **React component mocks:** `mockDragDropContext`, `mockDroppable`, `mockDraggable` for testing react-beautiful-dnd components
- **Type guard utilities:** `isNonNullString()`, `isValidMindMap()` for runtime type checking
- **Test data builders:** `createTestMindMap()`, `createTestNode()` for creating consistent test data

### Error Prevention Measures

- **TypeScript mocking fixes:** Resolved TS2352 errors by creating type-safe mock utilities
- **Null safety improvements:** Fixed TS2345 errors by adding proper null checks in Toolbar.tsx and file.ts
- **Runtime error prevention:** Fixed react-beautiful-dnd "Cannot find droppable entry" error by using 'root' instead of '[]' for droppableId
- **Async test improvements:** Fixed timeout issues by properly handling async operations in tests

### ESLint Configuration

The project uses ESLint with TypeScript support to prevent common errors:
- Strict type checking enabled
- No unused variables allowed
- Proper null checking enforced
- Consistent code formatting maintained

## Unit Test Cases

### Store Tests (`src/store/mindmapStore.test.ts`)
- Test initial state of mind map and file paths
- Test setting JSON file path with localStorage persistence
- Test setting text file path with localStorage persistence
- Test clearing file paths and localStorage cleanup
- Test addNode functionality with different parent paths
- Test deleteNode functionality and parent-child relationships
- Test updateNodeText functionality
- Test onDragEnd functionality with old format droppableId (`[]`)
- Test onDragEnd functionality with new format droppableId (`root`)
- Test onDragEnd functionality with nested droppableId (`[0]`)
- Test onDragEnd functionality with invalid droppableId (graceful fallback)
- Test onDragEnd functionality with no destination
- Test setSelectedChild functionality and expansion behavior
- Test findNode and findParent helper functions

### File Utils Tests (`src/utils/file.test.ts`)
- Test format detection from file extension (case insensitive)
- Test saveToFile with JSON format
- Test saveToFile with text format
- Test saveAsFile with different formats
- Test loadFromFile with JSON format
- Test loadFromFile with text format
- Test error handling for invalid files
- Test downloadFile functionality

### Text Format Tests (`src/utils/textFormat.test.ts`)
- Test mindMapToText conversion with various hierarchies
- Test textToMindMap parsing with valid tab structures
- Test textToMindMap with empty input
- Test textToMindMap with invalid indentation
- Test textToMindMap with multiline content
- Test round-trip conversion (mindMapToText -> textToMindMap)

### Component Tests

#### MindMap Component Tests (`src/components/MindMap.test.tsx`)
- Test column generation based on selected path
- Test automatic expansion following selected_child_idx
- Test horizontal scrolling behavior
- Test drag and drop context integration

#### Column Component Tests (`src/components/Column.test.tsx`)
- Test column rendering with nodes
- Test droppable functionality with root droppableId (`root`)
- Test droppable functionality with nested droppableId (`[0,1]`)
- Test placeholder rendering
- Test empty nodes array handling
- Test fixed width and flex-shrink properties
- Test column path handling

#### Node Component Tests (`src/components/Node.test.tsx`)
- Test node rendering with selection state
- Test inline editing functionality
- Test double-click to edit
- Test click to select
- Test add child functionality
- Test delete functionality
- Test drag and drop integration
- Test findNode helper function

#### Toolbar Component Tests (`src/components/Toolbar.test.tsx`)
- Test file path display rendering
- Test button states based on file path availability
- Test save/load functionality with remembered paths
- Test save/load As functionality
- Test format detection and file path memory
- Test button grouping and layout

## Integration Tests

- **Full workflow test:**
  - Create a mind map with multiple levels
  - Save it in both JSON and text formats
  - Load it back and verify data integrity
  - Test file path memory persistence

- **File format compatibility test:**
  - Create mind maps in both formats
  - Verify they can be loaded correctly
  - Test edge cases (empty files, invalid formats)

- **UI interaction test:**
  - Test complete user workflow from creation to saving
  - Test drag and drop operations
  - Test selection and expansion behavior
  - Test file operations with path memory