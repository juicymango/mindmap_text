
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
| Toolbar: [Add Node] [Save] [Save As] [Load] [Load As]     |
|         [Ask AI] [AI Config]                                |
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
    - **Save:** Saves the mind map to the remembered file path. If no path is remembered, defaults to JSON format.
    - **Save As JSON:** Saves as JSON format using the default file name "mindmap.json" and remembers the path.
    - **Save As Text:** Saves as text format using the default file name "mindmap.txt" and remembers the path. The auxiliary root node is automatically excluded from the text output.
    - **Load:** Loads from the remembered file path, detecting format automatically.
    - **Load As:** Opens a file dialog to load and remembers the path.
    - **File Path Memory:** The application remembers the last used file paths for both JSON and text formats using localStorage.
    - **Text Format Handling:** Text files use tab-indented format where the auxiliary root node is automatically created during loading and excluded during saving.
    - **Default File Names:** Save operations use default file names ("mindmap.json" and "mindmap.txt") instead of prompting users to choose file locations.

8.  **Copy/Paste Operations:**
    - **Copy:** Select a node and press Ctrl+C (Cmd+C on Mac) to copy the node and its entire subtree to clipboard in text format.
    - **Paste:** Select a node and press Ctrl+V (Cmd+V on Mac) to paste clipboard content as children to the selected node.
    - Uses the existing text format for clipboard operations with auxiliary root node handling.
    - The auxiliary root node is automatically managed during copy/paste operations to ensure proper hierarchy preservation.

9.  **AI Content Generation with Transparency:**
    - **AI Configuration:** Users configure AI models through a user-friendly dialog interface with support for OpenAI, Anthropic, and Local AI providers.
    - **Question Input:** Select a node and use the "Ask AI" feature to input a question through an enhanced dialog with process visibility.
    - **Process Transparency:** Users can view their complete AI interaction history, including exact prompts sent to the AI and responses received.
    - **Configuration Transparency:** Current AI settings are displayed in the prompt dialog for full visibility into the generation process.
    - **AI Response:** The AI generates content in mind map structure and appends it as child nodes to the selected node.
    - **Error Analysis:** AI errors are analyzed with detailed explanations and actionable suggestions for resolution.
    - **Security:** API keys are stored locally with environment variable priority for sensitive data.

10. **Data Formats:**

## Technical Implementation

### State Management
- **Zustand:** Used for state management with actions for node operations and file path memory.
- **File Path Memory:** Stores JSON and text file paths separately with localStorage persistence.

### AI Integration
- **AI Configuration:** User-friendly configuration dialog with support for multiple AI providers, local storage of preferences, and environment variable fallback for security.
- **Process Transparency:** Complete AI interaction history tracking with detailed logging of prompts, responses, and error states.
- **Enhanced Error Handling:** Intelligent error analysis with categorized error types, severity levels, and actionable suggestions.
- **Prompt Engineering:** Context-aware prompts that include relevant mind map context for accurate AI responses.
- **Response Processing:** AI responses are parsed and converted to mind map node structure automatically.
- **Security:** API keys stored locally with environment variable priority, ensuring sensitive data is never exposed in the UI.

### Components
- **App:** Main application component that renders Toolbar and MindMap.
- **Toolbar:** Contains file operation buttons, AI features, and displays current file path.
- **MindMap:** Renders columns based on the selected path and handles keyboard shortcuts.
- **Column:** Renders a column of nodes.
- **Node:** Renders an individual node with edit and delete controls.
- **AIPromptDialog:** Enhanced modal dialog for AI questions with process history, configuration transparency, and error display.
- **AIConfigDialog:** User-friendly dialog for configuring AI settings with validation, testing, and provider-specific options.
- **AIErrorDisplay:** Intelligent error display component with analysis, categorized suggestions, and technical details.

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
