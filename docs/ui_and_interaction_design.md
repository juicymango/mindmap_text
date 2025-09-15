
# UI and Interaction Design for Mind Map

This document outlines the UI and interaction design for the mind map tool, following the principles of a column-based view similar to macOS Finder.

## Core Concepts

The UI is composed of a series of columns. Each column represents a level in the mind map hierarchy. The leftmost column is the root of the mind map.

- **Node:** A single item in the mind map.
- **Column:** A vertical list of nodes that are children of a selected node from the previous column.
- **Selected Path:** The sequence of selected nodes from the root to the currently focused node.

## UI Layout

The UI is a horizontally scrolling view of columns with a toolbar at the top:

```
+-------------------------------------------------------------+
| Toolbar: [Add Node] [Save As JSON] [Save As Text] [Load File] |
| Current file: /path/to/file.json                            |
+-------------------------------------------------------------+
| Column 1 (Root) | Column 2         | Column 3         |
|-----------------|------------------|------------------|
| - Node 1.1      | - Node 2.1 (S)   | - Node 3.1       |
| - Node 1.2 (S)  | - Node 2.2       | - Node 3.2 (S)   |
| - Node 1.3      | - Node 2.3       | - Node 3.3       |
+-----------------+------------------+------------------+
```

- `(S)` indicates the selected node in the column.
- Selected nodes are highlighted with a light blue background.
- Each column has a fixed width of 220px to prevent shrinking.

## Interaction Design

1.  **Selection:**
    - Clicking on a node in a column selects it.
    - When a node is selected, it is highlighted with a light blue background.
    - If the selected node has children, a new column appears to its right, displaying its children.
    - If the selected node has no children, no new column is displayed.

2.  **Expansion:**
    - When a node is selected, its "selected child" is automatically selected in the next column. This continues recursively, creating a "selected path".
    - The user can change the "selected child" for any node by clicking on a different child in the corresponding column. This new selection is remembered for the parent node using `selected_child_idx`.

3.  **Navigation:**
    - The user can navigate horizontally using scrollbars to see different levels of the mind map.
    - The view supports horizontal scrolling for deep mind map structures.

4.  **Node Creation:**
    - An "Add Node" button in the toolbar adds a new node to the root level.
    - A "+" button next to each node adds a child to that node.

5.  **Node Editing:**
    - Double-clicking a node's text allows inline editing.
    - Pressing Enter or clicking away saves the changes.

6.  **Node Deletion:**
    - An "x" button next to each node deletes it.
    - Deletion removes the node and all its children.

7.  **File Operations:**
    - **Save As JSON:** Saves as JSON format using the default file name "mindmap.json" and remembers the path.
    - **Save As Text:** Saves as text format using the default file name "mindmap.txt" and remembers the path. The auxiliary root node is automatically excluded from the text output.
    - **Load File:** Opens a file dialog to load and automatically remembers the path based on the file format.
    - **File Path Memory:** The application remembers the last used file paths for both JSON and text formats using localStorage.
    - **Text Format Handling:** Text files use tab-indented format where the auxiliary root node is automatically created during loading and excluded during saving.
    - **Default File Names:** Save operations use default file names ("mindmap.json" and "mindmap.txt") instead of prompting users to choose file locations.

8.  **Copy/Paste Operations:**
    - **Copy:** Select a node and press Ctrl+C (Cmd+C on Mac) to copy the node and its entire subtree to clipboard in text format.
    - **Paste:** Select a node and press Ctrl+V (Cmd+V on Mac) to paste clipboard content as children to the selected node.
    - Uses the existing text format for clipboard operations with auxiliary root node handling.
    - The auxiliary root node is automatically managed during copy/paste operations to ensure proper hierarchy preservation.
    - **Copy Logic Enhancement:** Fixed compatibility with auxiliary root node logic - when copying, the node becomes a child of the auxiliary root in the temporary structure, ensuring the copied content is preserved correctly in text format.
    - **Paste Logic Enhancement:** Fixed auxiliary root handling for both root and non-root targets - when pasting to root, the root text is updated and children are added; when pasting to non-root nodes, the auxiliary root's children are added directly to maintain proper hierarchy.
## Technical Implementation

### State Management
- **Zustand:** Used for state management with actions for node operations and file path memory.
- **File Path Memory:** Stores JSON and text file paths separately with localStorage persistence.

### Components
- **App:** Main application component that renders Toolbar and MindMap.
- **Toolbar:** Contains file operation buttons and displays current file path.
- **MindMap:** Renders columns based on the selected path and handles keyboard shortcuts.
- **Column:** Renders a column of nodes.
- **Node:** Renders an individual node with edit and delete controls.

### Data Structure
```typescript
interface MindNode {
  text: string;
  children: MindNode[];
  selected_child_idx?: number;
}

interface MindMap {
  root: MindNode;
}
```

## Default State

- On initial load, the root node is present with no children.
- File paths are loaded from localStorage if available.
- The first child of the root node is selected by default when children exist.

## File Format Support

### JSON Format
```json
{
  "root": {
    "text": "Root",
    "children": [
      {
        "text": "Child 1",
        "children": [],
        "selected_child_idx": 0
      }
    ]
  }
}
```

### Text Format
```
Root
	Child 1
	Child 2
		Grandchild 1
	Child 3
```

- Each line represents a node
- Tabs (`\t`) indicate hierarchical structure
- A node with `n` leading tabs is a child of the last line above it with `n-1` leading tabs
