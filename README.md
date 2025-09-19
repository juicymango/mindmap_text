# Mind Map Text

Mind Map Text is a web-based mind mapping application that uses a column-based interface similar to macOS Finder to visualize and interact with hierarchical data. It's designed for users who prefer a text-based and keyboard-driven approach to mind mapping.

## Features

*   **Responsive Design:** Automatically switches between desktop column view and mobile tree view based on screen size.
*   **Desktop Column-Based UI:** Navigate your mind map in a familiar, intuitive column view with auxiliary root column.
*   **Mobile Tree Interface:** Touch-friendly hierarchical tree view with breadcrumb navigation and bottom controls.
*   **Adjustable Column Height:** Columns support vertical scrolling when containing many nodes, with maximum height constraint and custom scrollbar styling.
*   **Node Operations:** Easily add, delete, and edit nodes using toolbar controls.
*   **File Operations:** Save your mind maps as JSON or a simple, human-readable text format.
*   **Copy and Paste:** Copy and paste nodes in JSON or text format using toolbar buttons.
*   **Node Movement:** Move nodes up and down within their parent's children list.
*   **State Management:** Uses Zustand for efficient and predictable state management.
*   **File Path Memory:** Remembers your last used file paths for quick saving and loading.
*   **Enhanced Visual Design:** Modern styling with improved spacing, shadows, and color-coded node states.
*   **Status Bar:** Real-time display of save status, file information, and node count statistics.
*   **Comprehensive Testing:** 127 tests across 12 test files ensuring robust functionality and preventing regressions.

## Demo

![UI Layout](https://i.imgur.com/rA8t1gY.png)

## Getting Started

### Prerequisites

*   Node.js (v14 or later)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/juicymango/mindmap_text.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd mindmap_text
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

```bash
npm start
```

This will start the development server and open the application in your default browser at `http://localhost:3000`.

### Running Tests

```bash
npm test
```

This will launch the test runner in interactive watch mode. The test suite includes 127 tests covering all components, utilities, and edge cases, including comprehensive tests for responsive behavior, mobile detection, and scrolling functionality.

## Usage

### Desktop Interface
*   **Select a node:** Click on a node to select it. The children of the selected node will be displayed in the next column.
*   **Add a child node:** Select a node and click the "Add Child" button in the toolbar to add a child to it.
*   **Delete a node:** Select a node and click the "Delete" button in the toolbar to delete it and all its children.
*   **Edit a node:** Double-click on a node's text to edit it.
*   **Move nodes:** Select a node and use "Move Up" or "Move Down" buttons to reorder it within its parent.
*   **Copy and Paste:** Select a node and use "Copy JSON"/"Copy Text" to copy to clipboard, then "Paste JSON"/"Paste Text" to paste as a child of another selected node.

### Mobile Interface
*   **Navigation:** Use breadcrumb navigation to quickly jump to parent nodes
*   **Select a node:** Tap on a node to select it. Expand/collapse nodes with the chevron button.
*   **Add a child node:** Select a node and tap the "Add" button in the bottom navigation bar.
*   **Delete a node:** Select a node and tap the "More" button, then "Delete Node".
*   **Edit a node:** Select a node and tap the "More" button, then "Edit Node".
*   **Copy and Paste:** Use the copy/paste buttons in the bottom navigation bar.
*   **Home:** Return to the root node using the "Home" button.

### Responsive Behavior
*   **Automatic Switching:** The interface automatically switches between desktop and mobile views at 768px screen width.
*   **State Preservation:** Your current selection and expanded nodes are preserved when switching between views.
*   **Touch Optimized:** Mobile interface features larger touch targets and bottom navigation for easy thumb access.

## UI Improvements

The application has been enhanced with several visual and functional improvements:

### Mobile UI Implementation (Task 53)
- **Responsive Design:** Automatic switching between desktop column view and mobile tree view at 768px breakpoint
- **Touch-Optimized Interface:** Mobile features include breadcrumb navigation, expandable tree nodes, and bottom navigation bar
- **Mobile State Management:** Dedicated state management for mobile-specific features like expanded nodes and action menus
- **Feature Parity:** All desktop functionality is available on mobile, including add, delete, edit, copy, paste, load, and save operations
- **Seamless Transition:** State preservation ensures no data loss when switching between desktop and mobile views

### Column Height Enhancements (Task 52)
- **Adjustable Height:** Columns have a maximum height constraint of `calc(100vh - 120px)` to account for toolbar and status bar
- **Vertical Scrolling:** When a column contains many nodes, it automatically becomes scrollable with a custom-styled scrollbar
- **Fixed Width:** Columns maintain a consistent 240px width while allowing flexible height
- **Top Alignment:** Columns with different heights align to the top for better visual consistency

### Visual Design
- **Color-Coded Nodes:** Four distinct node types with appropriate colors (selected, on path, with children, without children)
- **Enhanced Styling:** Modern button design, improved spacing, and subtle shadows
- **Status Bar:** Real-time display of save status, current file path, format information, and node count
- **Root Column Highlighting:** The root column is visually distinguished with a blue left border

### Responsive Behavior
- **Horizontal Scrolling:** Smooth horizontal scrolling for deep mind map structures
- **Custom Scrollbars:** Both horizontal and vertical scrollbars are styled for consistency
- **Flexible Layout:** The interface adapts to different screen sizes while maintaining usability

## File Formats

### JSON

The mind map can be saved in a JSON format that represents the hierarchical structure of the nodes.

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

### Text

The mind map can also be saved in a simple, human-readable text format that uses tabs to represent the hierarchy.

```
Root
	Child 1
	Child 2
		Grandchild 1
	Child 3
```

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.