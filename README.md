# Mind Map Text

Mind Map Text is a web-based mind mapping application that uses a column-based interface similar to macOS Finder to visualize and interact with hierarchical data. It's designed for users who prefer a text-based and keyboard-driven approach to mind mapping.

## Features

*   **Responsive Design:** Seamlessly adapts between desktop and mobile while preserving the core column-based architecture.
*   **Desktop Column-Based UI:** Navigate your mind map in a familiar, intuitive column view with auxiliary root column.
*   **Mobile Column Interface:** Touch-optimized horizontal scrolling columns with gesture navigation and bottom toolbar.
*   **Adjustable Column Height:** Columns support vertical scrolling when containing many nodes, with maximum height constraint and custom scrollbar styling.
*   **Node Operations:** Easily add, delete, and edit nodes using toolbar controls.
*   **File Operations:** Save your mind maps as JSON or a simple, human-readable text format.
*   **Copy and Paste:** Copy and paste nodes in JSON or text format using toolbar buttons.
*   **Node Movement:** Move nodes up and down within their parent's children list.
*   **State Management:** Uses Zustand for efficient and predictable state management.
*   **File Path Memory:** Remembers your last used file paths for quick saving and loading.
*   **Enhanced Visual Design:** Modern styling with improved spacing, shadows, and color-coded node states.
*   **Status Bar:** Real-time display of save status, file information, and node count statistics.
*   **Comprehensive Testing:** 159 tests across 15 test files ensuring robust functionality and preventing regressions.
*   **Zero Console Warnings:** Clean development experience with no styled-components or other console warnings.
*   **Enhanced Mobile Experience:** Comprehensive mobile UI improvements with complete feature parity and optimized user experience.

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

This will launch the test runner in interactive watch mode. The test suite includes 159 tests covering all components, utilities, and edge cases, including comprehensive tests for responsive behavior, mobile detection, scrolling functionality, styled-components fixes, mobile menu functionality, and Task 56 mobile UI improvements.

## Usage

### Desktop Interface
*   **Select a node:** Click on a node to select it. The children of the selected node will be displayed in the next column.
*   **Add a child node:** Select a node and click the "Add Child" button in the toolbar to add a child to it.
*   **Delete a node:** Select a node and click the "Delete" button in the toolbar to delete it and all its children.
*   **Edit a node:** Double-click on a node's text to edit it.
*   **Move nodes:** Select a node and use "Move Up" or "Move Down" buttons to reorder it within its parent.
*   **Copy and Paste:** Select a node and use "Copy JSON"/"Copy Text" to copy to clipboard, then "Paste JSON"/"Paste Text" to paste as a child of another selected node.

### Mobile Interface
*   **Navigation:** Use swipe gestures (left/right) to navigate between columns with visual feedback indicators
*   **Select a node:** Tap on a node to select it. Children automatically appear in the next column.
*   **Add a child node:** Select a node and tap the "Add" button in the bottom toolbar.
*   **Delete a node:** Select a node and tap the "Delete" button in the bottom toolbar.
*   **Edit a node:** Long-press (500ms) on a node's text to edit it directly.
*   **Copy and Paste:** Use the "More" menu to access Copy as JSON/Text and Paste JSON/Text operations.
*   **Move Nodes:** Use the "More" menu to access Move Up/Down functionality for reordering nodes.
*   **Home:** Enhanced home button with scroll-to-top functionality for better navigation.
*   **Load/Save:** Access save/load functionality through the main "Load" button and "More" menu options.

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

### Mobile Features (Enhanced with Task 56!)
- **Complete Feature Parity:** All desktop functionality now available on mobile including move up/down and copy/paste operations
- **Preserved Column Architecture:** The core column-based design is maintained even on mobile devices
- **Enhanced Gesture Navigation:** Optimized swipe gestures with 80px minimum distance and 30px max vertical deviation for better user control
- **Comprehensive Mobile Toolbar:** Bottom-mounted toolbar with Home (enhanced), Add, Delete, Load, and expanded More menu
- **Long-Press Text Editing:** Mobile-optimized text editing with 500ms long-press detection and 10px move cancellation
- **Responsive Column Widths:** Columns automatically adjust width based on screen size (180px mobile, 240px desktop)
- **Enhanced Safe Area Handling:** Proper handling of notched devices with env(safe-area-inset-bottom) support
- **44px Touch Targets:** All interactive elements meet mobile accessibility standards
- **Performance Optimized:** Smooth 60fps scrolling with hardware acceleration
- **Improved Menu Organization:** Cleaner interface with duplicate "Load File" removed from More menu
- **Enhanced Home Button:** Now includes scroll-to-top functionality alongside selection clearing

### Bug Fixes and Improvements (Task 55)
- **Styled-Components Fix:** Resolved console warnings about unknown "variant" prop by implementing transient props ($variant)
- **Mobile Menu Fix:** Fixed mobile more options button functionality by correcting menu positioning (translateY(100vh))
- **Enhanced Testing:** Added comprehensive test coverage for both fixes with zero console warnings
- **Code Quality:** Improved code quality following styled-components best practices
- **User Experience:** Enhanced mobile user experience with properly functioning menus and interactions

### Comprehensive Mobile UI Improvements (Task 56)
- **Phone UI Problem Resolution:** Fixed all identified mobile UI issues including missing functionality and poor user experience
- **Enhanced Text Editing:** Implemented long-press (500ms) text editing for mobile devices with move cancellation to prevent accidental triggers
- **Improved Home Button:** Enhanced home button with scroll-to-top functionality alongside selection clearing for better navigation
- **Complete Feature Parity:** Added missing mobile functionality including Move Up/Down and Copy/Paste JSON/Text operations
- **Optimized Gesture Navigation:** Adjusted gesture sensitivity (80px min swipe distance, 30px max vertical deviation) for better scrolling experience
- **Enhanced Menu Design:** Redesigned mobile button UI with proper disabled state handling and better feature access
- **Clarified Load Functionality:** Removed duplicate "Load File" from More menu to eliminate user confusion
- **Improved Button Accessibility:** All mobile buttons now maintain 44px minimum touch target size with proper visual feedback
- **Enhanced Testing:** Comprehensive test coverage for all mobile improvements with 159 total tests and zero warnings
- **Cross-Platform Consistency:** Ensured consistent behavior between desktop and mobile versions while optimizing each platform's strengths

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