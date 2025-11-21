# Mind Map Text

Mind Map Text is a web-based mind mapping application that uses a column-based interface similar to macOS Finder to visualize and interact with hierarchical data. It's designed for users who prefer a text-based and keyboard-driven approach to mind mapping.

## Features

*   **Column-Based UI:** Navigate your mind map in a familiar, intuitive column view with auxiliary root column.
*   **Adjustable Column Height:** Columns now support vertical scrolling when containing many nodes, with a maximum height constraint and custom scrollbar styling.
*   **Node Operations:** Easily add, delete, and edit nodes using toolbar controls.
*   **File Operations:** Save your mind maps as JSON or a simple, human-readable text format.
*   **Copy, Cut, and Paste:** Copy, cut, and paste nodes in JSON or text format using toolbar buttons. Cut operations copy nodes to clipboard and then delete them from the mind map.
*   **Node Movement:** Move nodes up and down within their parent's children list with reliable text editing after move operations.
*   **State Management:** Uses Zustand for efficient and predictable state management.
*   **File Path Memory:** Remembers your last used file paths for quick saving and loading.
*   **Enhanced Visual Design:** Modern styling with improved spacing, shadows, and color-coded node states.
*   **Improved Color Hierarchy:** Proper visual hierarchy where selected nodes are most prominent, followed by nodes on the selected path, with appropriate contrast for accessibility.
*   **Automatic Edit Mode:** Newly created nodes automatically enter edit mode for streamlined workflow - no more double-clicking required!
*   **Simplified Interface:** Clean layout focused on mind map content without status bar distractions.
*   **Responsive Toolbar:** Horizontal scrolling support for better usability on smaller screens and extensive button layouts.
*   **Comprehensive Testing:** 173 tests across 11 test files ensuring robust functionality and preventing regressions.

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

This will launch the test runner in interactive watch mode. The test suite includes 122 tests covering all components, utilities, and edge cases, including comprehensive tests for the column height improvements and scrolling behavior.

## Usage

*   **Select a node:** Click on a node to select it. The children of the selected node will be displayed in the next column.
*   **Add a child node:** Select a node and click the "Add Child" button in the toolbar to add a child to it.
*   **Delete a node:** Select a node and click the "Delete" button in the toolbar to delete it and all its children.
*   **Edit a node:** Double-click on a node's text to edit it.
*   **Move nodes:** Select a node and use "Move Up" or "Move Down" buttons to reorder it within its parent.
*   **Copy and Paste:** Select a node and use "Copy JSON"/"Copy Text" to copy to clipboard, then "Paste JSON"/"Paste Text" to paste as a child of another selected node.

## UI Improvements

The application has been enhanced with several visual and functional improvements:

### Column Height Enhancements (Task 52)
- **Adjustable Height:** Columns now have a maximum height constraint of `calc(100vh - 80px)` to account for toolbar only
- **Vertical Scrolling:** When a column contains many nodes, it automatically becomes scrollable with a custom-styled scrollbar
- **Fixed Width:** Columns maintain a consistent 240px width while allowing flexible height
- **Top Alignment:** Columns with different heights align to the top for better visual consistency

### Visual Design
- **Color-Coded Nodes:** Four distinct node types with appropriate colors (selected, on path, with children, without children)
- **Enhanced Styling:** Modern button design, improved spacing, and subtle shadows
- **Root Column Highlighting:** The root column is visually distinguished with a blue left border
- **Clean Layout:** Simplified interface without status bar for focused mind mapping

### Toolbar Enhancements (Task 54)
- **Horizontal Scrolling:** Toolbar now supports horizontal scrolling when content exceeds viewport width
- **Custom Scrollbar:** 6px horizontal scrollbar with hover visibility for cleaner appearance
- **Button Preservation:** Button groups maintain fixed width and don't shrink during scrolling
- **Responsive Design:** Maintains full functionality on smaller screens and mobile devices
- **Accessibility:** All toolbar controls remain accessible with scrolling enabled

### Responsive Behavior
- **Horizontal Scrolling:** Smooth horizontal scrolling for deep mind map structures
- **Custom Scrollbars:** Both horizontal and vertical scrollbars are styled for consistency
- **Flexible Layout:** The interface adapts to different screen sizes while maintaining usability

## Task 60: Latest Improvements

### Enhanced Visual Hierarchy
- **Fixed Color Priority:** Resolved visual hierarchy issue where nodes on the selected path (`onPath`) appeared more prominent than selected nodes
- **Improved Color Scheme:** Updated `onPath` nodes to use lighter blue background with dark text, ensuring selected nodes remain visually dominant
- **Accessibility Compliance:** All color combinations maintain proper contrast ratios for WCAG compliance

### Streamlined User Workflow
- **Automatic Edit Mode:** When clicking "Add Child", new nodes immediately enter edit mode with empty text - no double-clicking required!
- **Reduced Friction:** Node creation workflow improved from 3 steps (Add → Click → Double-click) to 2 steps (Add → Type)
- **Intuitive Interaction:** New behavior matches user expectations for immediate content entry

### Technical Improvements
- **Optimized State Management:** Consolidated React useEffect hooks for better performance and reliability
- **Enhanced Testing:** Added automated color hierarchy validation using RGB sum comparison algorithms
- **Comprehensive Coverage:** 173 tests ensure all new functionality is thoroughly tested and regression-proof

### Visual Design Updates
```
Selected Node:     Dark Blue (#4A90E2) + White Text - Most Prominent
On Path Nodes:     Light Blue (#B8D4F1) + Dark Text - Secondary Prominence
With Children:     Very Light Blue (#E3F2FD) + Dark Text - Tertiary
Without Children:  White (#FFFFFF) + Dark Text - Least Prominent
```
The new color system provides clear visual feedback about node states while maintaining the application's established blue color family.

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