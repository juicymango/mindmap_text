
# UI and Interaction Design for Mind Map

This document outlines the UI and interaction design for the mind map tool, following the principles of a column-based view similar to macOS Finder.

## Core Concepts

The UI is composed of a series of columns. Each column represents a level in the mind map hierarchy. The leftmost column is the root of the mind map.

- **Node:** A single item in the mind map.
- **Column:** A vertical list of nodes that are children of a selected node from the previous column.
- **Selected Path:** The sequence of selected nodes from the root to the currently focused node.

## UI Layout

The UI is a vertically organized layout with three main sections:

```
+-----------------------------------------------------------+
| Toolbar: [Add Child] [Delete] [Move Up] [Move Down] | [Copy] | [Save] | [Load] |
+-----------------------------------------------------------+
|                                                           |
|  Mind Map View (Horizontal Scrolling Columns)             |
|                                                           |
|  +-----------+  +-----------+  +-----------+           |
|  |  Root     |  | Child 1   |  | Grandchild|           |
|  |           |  |           |  |           |           |
|  | + Node 1  |  | + Node A  |  | + Node X  |           |
|  | + Node 2  |  | + Node B  |  | + Node Y  |           |
|  | + Node 3  |  |           |  |           |           |
|  +-----------+  +-----------+  +-----------+           |
|                                                           |
+-----------------------------------------------------------+
| Status: Saved | /path/to/file.json | Format: JSON | 12 nodes |
+-----------------------------------------------------------+
```

### Layout Components

1. **Toolbar (48px height)**
   - Enhanced toolbar with icons and improved styling
   - Three button groups: Node Operations, Copy/Paste Operations, File Operations
   - Modern button design with hover effects and proper spacing
   - File path display integrated into toolbar

2. **Mind Map View (Flexible height)**
   - Horizontally scrolling column-based interface
   - Enhanced column styling with shadows and improved spacing
   - Root column highlighted with blue left border
   - Custom scrollbar styling for better aesthetics
   - **Task 52: Column Height Improvements:**
     - Columns now have adjustable height with vertical scrolling
     - Maximum column height set to `calc(100vh - 120px)` to account for toolbar and status bar
     - Individual columns scroll vertically when containing many nodes
     - Custom vertical scrollbar styling (6px width) for consistent aesthetics
     - Fixed width maintained (240px) while allowing flexible height
     - Columns align to top when they have different heights

3. **Status Bar (32px height)**
   - Save status indicator (saved/unsaved/saving)
   - Current file path and format information
   - Node count statistics
   - Last saved timestamp

### Key Improvements

- **Visual Hierarchy**: Clear separation between toolbar, main content, and status bar
- **Enhanced Styling**: Modern button design, improved spacing, and subtle shadows
- **Better UX**: Icon integration, tooltips, and improved visual feedback
- **Responsive Layout**: Proper flexbox layout that adapts to screen size
- **Information Density**: Status bar provides additional context without cluttering the interface

- `(S)` indicates the selected node in the column.
- Nodes are color-coded based on their type and state (see Node Color Coding section below).
- Each column has a fixed width of 240px with enhanced styling.

## Interaction Design

1.  **Selection:**
    - Clicking on a node in a column selects it.
    - When a node is selected, it is highlighted with a blue background and white text.
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

## Node Color Coding System

The application uses a sophisticated color coding system to provide visual hierarchy and improve user experience. Each node is assigned one of four types based on its state and position in the selected path:

### Path Detection Logic (Updated)

The node color coding system uses sophisticated path detection algorithms to ensure accurate visual representation:

- **Ancestor Detection:** A node is considered "on the selected path" if it is an ancestor of the selected node (i.e., its path is a prefix of the selected path).
- **Root Node Handling:** The root node (empty path) is considered an ancestor of any selected node and receives the "onPath" color when any node is selected.
- **Selected Child Index Chain:** Nodes that are part of the `selected_child_idx` chain extending from the selected node also receive the "onPath" color. This means when a node is selected, its `selected_child_idx` child (and that child's `selected_child_idx`, etc.) are highlighted as part of the navigation path.
- **Descendant Exclusion:** Descendants of the selected node that are NOT part of the `selected_child_idx` chain receive their appropriate colors based on their children status.
- **Sibling Handling:** Siblings of the selected node receive "withChildren" or "withoutChildren" colors based on their children status, not the "onPath" color.

### Node Types and Colors

1.  **Selected Node (Blue)**
    - **Background:** `#4A90E2` (Blue)
    - **Border:** `#357ABD` (Dark Blue)
    - **Text:** `#FFFFFF` (White)
    - **Hover:** `#357ABD` (Dark Blue)
    - **Description:** The currently selected node in its column. This is the most prominent visual state.

2.  **Nodes on Selected Path (Light Blue)**
    - **Background:** `#E8F4FD` (Very Light Blue)
    - **Border:** `#B8D4F1` (Light Blue)
    - **Text:** `#333333` (Dark Gray)
    - **Hover:** `#D1E7FC` (Light Blue)
    - **Description:** Nodes that are ancestors of the selected node in the current path hierarchy.

3.  **Nodes with Children (Light Gray)**
    - **Background:** `#F8F9FA` (Very Light Gray)
    - **Border:** `#DEE2E6` (Light Gray)
    - **Text:** `#333333` (Dark Gray)
    - **Hover:** `#E9ECEF` (Light Gray)
    - **Description:** Nodes that have child nodes but are not on the selected path.

4.  **Nodes without Children (White)**
    - **Background:** `#FFFFFF` (White)
    - **Border:** `#DEE2E6` (Light Gray)
    - **Text:** `#333333` (Dark Gray)
    - **Hover:** `#F8F9FA` (Very Light Gray)
    - **Description:** Leaf nodes with no children that are not on the selected path.

### Visual Hierarchy and Accessibility

- **Priority System:** The color coding follows a priority system where "selected" takes precedence over "on path," which takes precedence over children status.
- **Hover Effects:** All nodes have smooth hover transitions that provide visual feedback and include a subtle elevation effect (box-shadow) and vertical translation.
- **Focus States:** Nodes include proper focus outlines for keyboard navigation accessibility.
- **Contrast Ratios:** All color combinations maintain sufficient contrast for accessibility compliance.
- **Smooth Transitions:** All color changes and hover effects use CSS transitions for a polished user experience.

### Color Psychology

- **Blue for Selection:** Blue is universally associated with selection and focus, making it ideal for the currently selected node.
- **Light Blue for Path:** The lighter blue tones create a visual breadcrumb trail showing the navigation path.
- **Gray Hierarchy:** The grayscale colors distinguish between nodes with and without children, providing subtle visual cues about the mind map structure. The withChildren color has been updated to #aab7c0ff for better visibility.
- **White for Leaves:** White background for leaf nodes creates a clean, minimalist aesthetic for the end points in the hierarchy.
## Technical Implementation

### State Management
- **Zustand:** Used for state management with actions for node operations and file path memory.
- **File Path Memory:** Stores JSON and text file paths separately with localStorage persistence.
- **Selection Context:** Custom context for managing selected path across components.

### Components
- **App:** Main application component with organized layout structure.
- **Toolbar:** Enhanced toolbar with icon integration, button groups, and improved styling.
- **MindMap:** Renders columns with custom scrollbar styling and flex layout.
- **Column:** Enhanced column design with root highlighting and improved spacing.
- **Node:** Enhanced node styling with better hover effects and improved typography.
- **StatusBar:** New component providing save status, file information, and statistics.

### Enhanced Features
- **Icon Integration:** Lucide React icons for better visual communication
- **Improved Styling:** Modern design with shadows, better spacing, and enhanced interactions
- **Status Indicators:** Visual feedback for save status and system information
- **Better Accessibility:** Improved focus states and keyboard navigation
- **Responsive Design:** Flexbox-based layout that adapts to different screen sizes

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
