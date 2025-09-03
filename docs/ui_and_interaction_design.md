
# UI and Interaction Design for Mind Map

This document outlines the UI and interaction design for the new mind map tool, following the principles of a column-based view similar to macOS Finder.

## Core Concepts

The UI is composed of a series of columns. Each column represents a level in the mind map hierarchy. The leftmost column is the root of the mind map.

- **Node:** A single item in the mind map.
- **Column:** A vertical list of nodes that are children of a selected node from the previous column.
- **Selected Path:** The sequence of selected nodes from the root to the currently focused node.

## UI Layout

The UI will be a horizontally scrolling view of columns.

```
+-----------------+------------------+------------------+
| Column 1 (Root) | Column 2         | Column 3         |
|-----------------|------------------|------------------|
| - Node 1.1      | - Node 2.1 (S)   | - Node 3.1       |
| - Node 1.2 (S)  | - Node 2.2       | - Node 3.2 (S)   |
| - Node 1.3      | - Node 2.3       | - Node 3.3       |
+-----------------+------------------+------------------+
```

- `(S)` indicates the selected node in the column.

## Interaction Design

1.  **Selection:**
    - Clicking on a node in a column selects it.
    - When a node is selected, it is highlighted.
    - If the selected node has children, a new column appears to its right, displaying its children.
    - If the selected node has no children, no new column is displayed.

2.  **Expansion:**
    - When a node is selected, its "selected child" is automatically selected in the next column. This continues recursively, creating a "selected path".
    - The user can change the "selected child" for any node by clicking on a different child in the corresponding column. This new selection is remembered for the parent node.

3.  **Navigation:**
    - The user can navigate horizontally to see different levels of the mind map.
    - The view will automatically scroll to keep the currently selected node in view.

4.  **Node Creation:**
    - A "+" button will be available at the top of each column to add a new sibling to the nodes in that column.
    - A "+" button will be available next to each node to add a child to that node.

5.  **Node Editing:**
    - Double-clicking a node will allow the user to edit its text.

6.  **Node Deletion:**
    - A "-" button will be available next to each node to delete it. A confirmation will be required.

## Default State

- On initial load, the root node is selected.
- The first child of the root node is selected in the second column, and so on, creating an initial "selected path".

## File Operations

- **Save:** A "Save" button will be present in the main toolbar. Clicking it will open a system dialog to save the mind map as a JSON file.
- **Load:** A "Load" button will be present in the main toolbar. Clicking it will open a system dialog to select a JSON file to load into the mind map.

## Data Format

The mind map will be saved in a JSON format. The structure will be a tree of nodes. Each node will have the following properties:

- `id`: A unique identifier for the node.
- `text`: The text content of the node.
- `children`: An array of child nodes.
- `selected_child_id`: The ID of the selected child.
