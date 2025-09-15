# Mind Map Text

Mind Map Text is a web-based mind mapping application that uses a column-based interface similar to macOS Finder to visualize and interact with hierarchical data. It's designed for users who prefer a text-based and keyboard-driven approach to mind mapping.

## Features

*   **Column-Based UI:** Navigate your mind map in a familiar, intuitive column view with auxiliary root column.
*   **Node Operations:** Easily add, delete, and edit nodes using toolbar controls.
*   **File Operations:** Save your mind maps as JSON or a simple, human-readable text format.
*   **Copy and Paste:** Copy and paste nodes in JSON or text format using toolbar buttons.
*   **Node Movement:** Move nodes up and down within their parent's children list.
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

*   **Select a node:** Click on a node to select it. The children of the selected node will be displayed in the next column.
*   **Add a child node:** Select a node and click the "Add Child" button in the toolbar to add a child to it.
*   **Delete a node:** Select a node and click the "Delete" button in the toolbar to delete it and all its children.
*   **Edit a node:** Double-click on a node's text to edit it.
*   **Move nodes:** Select a node and use "Move Up" or "Move Down" buttons to reorder it within its parent.
*   **Copy and Paste:** Select a node and use "Copy JSON"/"Copy Text" to copy to clipboard, then "Paste JSON"/"Paste Text" to paste as a child of another selected node.

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