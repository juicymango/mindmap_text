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

## Test Code Location

- **Unit and integration tests:** `src/App.test.tsx`, `src/components/*.test.tsx`, `src/store/*.test.ts`
- **End-to-end tests:** (Not implemented yet, but would be in a separate `e2e` directory)