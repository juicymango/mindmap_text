# Mind Map Text

Mind Map Text is a web-based mind mapping application that uses a column-based interface similar to macOS Finder to visualize and interact with hierarchical data. It's designed for users who prefer a text-based and keyboard-driven approach to mind mapping.

## Features

*   **Column-Based UI:** Navigate your mind map in a familiar, intuitive column view.
*   **Node Operations:** Easily add, delete, and edit nodes.
*   **File Operations:** Save your mind maps as JSON or a simple, human-readable text format.
*   **Copy and Paste:** Copy and paste nodes and their subtrees within the mind map.
*   **Keyboard Shortcuts:** Optimized for keyboard-driven usage.
*   **State Management:** Uses Zustand for efficient and predictable state management.
*   **File Path Memory:** Remembers your last used file paths for quick saving and loading.

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

This will launch the test runner in interactive watch mode.

## Usage

*   **Add a node:** Click the "Add Node" button in the toolbar to add a new node to the root column.
*   **Add a child node:** Click the "+" button on a node to add a child to it.
*   **Delete a node:** Click the "x" button on a node to delete it and all its children.
*   **Edit a node:** Double-click on a node's text to edit it.
*   **Select a node:** Click on a node to select it. The children of the selected node will be displayed in the next column.
*   **Copy and Paste:** Use `Ctrl+C` (or `Cmd+C` on Mac) to copy a selected node and its subtree, and `Ctrl+V` (or `Cmd+V` on Mac) to paste it as a child of another node.

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