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

- **Save As JSON:**
  - Click the "Save As JSON" button.
  - A file dialog should appear.
  - Selecting a file path should save the mind map in JSON format.
  - The file path should be remembered for future reference.
- **Save As Text:**
  - Click the "Save As Text" button.
  - A file dialog should appear.
  - Selecting a file path should save the mind map in text format with tab hierarchy.
  - The file path should be remembered for future reference.
- **Load File:**
  - Click the "Load File" button.
  - A file dialog should appear.
  - Selecting a file should load the mind map and detect the format automatically.
  - The file path should be remembered for future reference.

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
  - Load a file using "Load File" button.
  - The file path should be remembered and displayed in the toolbar.
  - The file format should be automatically detected from the file extension.

- **File path display:**
  - The toolbar should display the current remembered file path.
  - When no file is selected, it should show "No file selected".
  - The display should update immediately when a new file is saved or loaded.


## Enhanced Clipboard Operations

- **Copy Node Structure:**
  - Use Ctrl+C (Windows/Linux) or Cmd+C (Mac) to copy a selected node and its entire subtree.
  - The clipboard contains the hierarchical text representation using tabs for hierarchy.
  - Copy works with both modern clipboard API and fallback methods for browser compatibility.
  - **Auxiliary Root Compatibility:** The copy function creates a temporary structure where the copied node becomes a child of the auxiliary root to ensure proper text format conversion.

- **Paste with Root Node Preservation:**
  - Use Ctrl+V (Windows/Linux) or Cmd+V (Mac) to paste clipboard content as children to the selected node.
  - **Root Node Pasting:** When pasting to the root node, the root text is updated with the pasted content and children are added from the auxiliary root structure.
  - **Non-Root Node Pasting:** When pasting to non-root nodes, the auxiliary root's children are added directly as children of the target node.
  - **Standalone Root Handling:** Standalone root nodes (no children) update the root text when pasted to root, or are added as child nodes when pasted to non-root targets.
  - **Hierarchy Preservation:** The auxiliary root logic ensures proper hierarchy preservation during copy/paste operations.

- **Cross-Browser Clipboard Support:**
  - Modern browsers: Use Clipboard API for reliable copy/paste operations.
  - Legacy browsers: Fallback to document.execCommand for broader compatibility.
  - Error handling gracefully handles clipboard permission denials and API unavailability.

- **Paste Validation:**
  - Invalid clipboard content is rejected without breaking the application.
  - Empty clipboard content is handled gracefully with no action taken.
  - Malformed hierarchical text is parsed safely or ignored with appropriate error logging.
  - Non-existent node targets are handled silently without application errors.

- **File format detection:**
  - Files with .json extension should be loaded as JSON format.
  - Files with .txt extension should be loaded as text format.
  - Files with other extensions should default to JSON format.

- **Button state management:**
  - "Save" button should be disabled when no file path is remembered.
  - "Save As" and "Load File" buttons should always be enabled.

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

## Copy/Paste Functionality

- **Copy functionality:**
  - Copy current node and entire subtree to clipboard using text format
  - Use Ctrl+C (Windows/Linux) or Cmd+C (Mac) to copy selected node
  - Clipboard content uses text format with tab hierarchy
  - **Auxiliary Root Compatibility:** Creates temporary structure where copied node becomes child of auxiliary root
  - Handles clipboard API errors with fallback to document.execCommand
  - Shows error messages in console for failed copy operations

- **Paste functionality:**
  - Paste clipboard content to current node, appending as children
  - Use Ctrl+V (Windows/Linux) or Cmd+V (Mac) to paste to selected node
  - Parses clipboard text using existing text format utilities
  - **Root Node Handling:** Updates root text and adds children when pasting to root node
  - **Non-Root Node Handling:** Adds auxiliary root's children directly when pasting to non-root nodes
  - Automatically expands to show newly pasted children
  - Handles invalid clipboard content gracefully with error messages

- **Keyboard shortcuts:**
  - Ctrl+C/Cmd+C: Copy selected node and subtree
  - Ctrl+V/Cmd+V: Paste clipboard content as children of selected node
  - Shortcuts work when the MindMap component has focus
  - No UI buttons - keyboard shortcuts only

- **Text format integration:**
  - Copy uses existing `mindMapToText` utility for consistent format
  - Paste uses existing `textToMindMap` utility for parsing
  - **Auxiliary Root Logic:** Proper handling of auxiliary root node for compatibility
  - Maintains compatibility with existing text format files
  - Preserves hierarchy and node relationships

- **Error handling:**
  - Graceful handling of clipboard API permission errors
  - Fallback mechanisms for older browsers without clipboard API
  - Validation of clipboard content before pasting
  - Console error logging for debugging failed operations
  - Silent handling of non-existent node targets

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
- **Type guard utilities:** `isNonNullString()`, `isValidMindMap()` for runtime type checking
- **Test data builders:** `createTestMindMap()`, `createTestNode()` for creating consistent test data
- **Clipboard API mocking:** Mock utilities for testing copy/paste functionality

### Error Prevention Measures

- **TypeScript mocking fixes:** Resolved TS2352 errors by creating type-safe mock utilities
- **Null safety improvements:** Fixed TS2345 errors by adding proper null checks in Toolbar.tsx and file.ts
- **Async test improvements:** Fixed timeout issues by properly handling async operations in tests
- **Clipboard API error handling:** Graceful handling of clipboard permission errors and fallback mechanisms

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
- Test setSelectedChild functionality and expansion behavior
- Test copyNode functionality with various node structures
- Test copyNode auxiliary root compatibility and temporary structure creation
- Test copyNode error handling with clipboard API failures
- Test copyNode fallback to document.execCommand
- Test pasteNode functionality with valid clipboard content
- Test pasteNode auxiliary root handling for root and non-root targets
- Test pasteNode error handling with invalid clipboard data
- Test pasteNode graceful error handling
- Test enhanced paste functionality for root content preservation
- Test standalone root node pasting behavior
- Test root content addition as children to non-root nodes
- Test fallback clipboard API compatibility for older browsers
- Test findNode and findParent helper functions

### File Utils Tests (`src/utils/file.test.ts`)
- Test format detection from file extension (case insensitive)
- Test saveToFile with JSON format
- Test saveToFile with text format
- Test saveAsFile with default JSON file name ("mindmap.json")
- Test saveAsFile with default text file name ("mindmap.txt")
- Test saveAsFile with no format specified (defaults to JSON)
- Test saveAsFile blob content creation for JSON format
- Test saveAsFile blob content creation for text format (excludes auxiliary root)
- Test loadFromFile with JSON format
- Test loadFromFile with text format
- Test error handling for invalid files
- Test downloadFile functionality

### Text Format Tests (`src/utils/textFormat.test.ts`)
- Test mindMapToText conversion with auxiliary root node handling (skips root, starts from children)
- Test textToMindMap parsing with automatic auxiliary root node creation
- Test textToMindMap with empty input (returns null)
- Test textToMindMap with invalid indentation (first line starts with tab, returns null)
- Test textToMindMap with multiline content and hierarchical structure
- Test round-trip conversion (mindMapToText -> textToMindMap) preserving auxiliary root behavior
- Test that auxiliary root node "Root" is not included in text output
- Test that text input creates proper auxiliary root structure in mind map

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
- Test node selection path tracking
- Test findNode helper function

#### Toolbar Component Tests (`src/components/Toolbar.test.tsx`)
- Test file path display rendering
- Test button states based on file path availability
- Test save functionality with remembered paths
- Test save As functionality
- Test load file functionality
- Test saveAsFile calls with default file names ("mindmap.json" and "mindmap.txt")
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
  - Test selection and expansion behavior
  - Test file operations with path memory
  - Test copy/paste workflow with keyboard shortcuts
  - Test clipboard integration across different node structures