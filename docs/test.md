# Test Documentation

This document provides comprehensive testing documentation for the mind map application, including test structure, testing approach, and test coverage.

## Test Overview

The application has comprehensive test coverage with 57 tests across 9 test files, covering unit tests, integration tests, and component tests using React Testing Library and Jest.

## Testing Philosophy

### React Testing Library Best Practices

The testing approach follows React Testing Library best practices:

- **Screen queries**: Use `screen.getBy*` and `screen.queryBy*` methods for querying elements
- **No node access rules**: Avoid direct DOM node access, use semantic queries instead
- **User-centric testing**: Test from the user's perspective rather than implementation details
- **Accessibility**: Test with accessible selectors when possible

### Test Utilities

The project includes comprehensive testing utilities in `src/utils/test-utils.ts`:

- **Type-safe mocking**: `createMockMindMapStore()` for type-safe Zustand store mocking
- **Type guards**: `isNonNullString()`, `isValidMindMap()` for runtime type checking
- **Test data builders**: `createTestMindMap()`, `createTestNode()` for consistent test data
- **Clipboard API mocking**: Mock utilities for testing copy/paste functionality

## Test Structure

```
src/
├── components/
│   ├── App.test.tsx
│   ├── MindMap.test.tsx
│   ├── Column.test.tsx
│   ├── Node.test.tsx
│   └── Toolbar.test.tsx
├── store/
│   └── mindmapStore.test.ts
└── utils/
    ├── file.test.ts
    ├── textFormat.test.ts
    └── test-utils.ts
```

## Test Coverage

### Component Tests

#### App Component Tests (`src/components/App.test.tsx`)
- Test main application rendering
- Test Toolbar and MindMap component integration
- Test global styles application

#### MindMap Component Tests (`src/components/MindMap.test.tsx`)
- Test column generation based on selected path
- Test automatic expansion following selected_child_idx
- Test horizontal scrolling behavior
- Test keyboard shortcut handling for copy/paste operations

#### Column Component Tests (`src/components/Column.test.tsx`)
- Test column rendering with nodes
- Test empty column handling
- Test fixed width and flex-shrink properties
- Test column path handling

#### Node Component Tests (`src/components/Node.test.tsx`)
- Test node rendering with selection state
- Test inline editing functionality
- Test double-click to edit behavior
- Test click to select functionality
- Test add child functionality
- Test delete functionality
- Test node selection path tracking
- Test findNode helper function

#### Toolbar Component Tests (`src/components/Toolbar.test.tsx`)
- Test file path display rendering
- Test button states based on file path availability
- Test save functionality with remembered paths
- Test Save As functionality
- Test load file functionality
- Test saveAsFile calls with default file names ("mindmap.json" and "mindmap.txt")
- Test format detection and file path memory
- Test button grouping and layout

### Store Tests (`src/store/mindmapStore.test.ts`)
- Test initial state of mind map and file paths
- Test setting JSON file path with localStorage persistence
- Test setting text file path with localStorage persistence
- Test clearing file paths and localStorage cleanup
- Test addNode functionality with different parent paths
- Test deleteNode functionality and parent-child relationships
- Test updateNodeText functionality
- Test setSelectedChild functionality and expansion behavior
- Test copyNode functionality with various node structures
- Test copyNode auxiliary root compatibility and temporary structure creation
- Test copyNode error handling with clipboard API failures
- Test copyNode fallback to document.execCommand
- Test pasteNode functionality with valid clipboard content
- Test pasteNode auxiliary root handling for root and non-root targets
- Test pasteNode error handling with invalid clipboard data
- Test pasteNode graceful error handling
- Test enhanced paste functionality for root content preservation
- Test standalone root node pasting behavior
- Test root content addition as children to non-root nodes
- Test fallback clipboard API compatibility for older browsers
- Test findNode and findParent helper functions

### Utility Tests

#### File Utils Tests (`src/utils/file.test.ts`)
- Test format detection from file extension (case insensitive)
- Test saveToFile with JSON format
- Test saveToFile with text format
- Test saveAsFile with default JSON file name ("mindmap.json")
- Test saveAsFile with default text file name ("mindmap.txt")
- Test saveAsFile with no format specified (defaults to JSON)
- Test saveAsFile blob content creation for JSON format
- Test saveAsFile blob content creation for text format (excludes auxiliary root)
- Test loadFromFile with JSON format
- Test loadFromFile with text format
- Test error handling for invalid files
- Test downloadFile functionality

#### Text Format Tests (`src/utils/textFormat.test.ts`)
- Test mindMapToText conversion with auxiliary root node handling (skips root, starts from children)
- Test textToMindMap parsing with automatic auxiliary root node creation
- Test textToMindMap with empty input (returns null)
- Test textToMindMap with invalid indentation (first line starts with tab, returns null)
- Test textToMindMap with multiline content and hierarchical structure
- Test round-trip conversion (mindMapToText -> textToMindMap) preserving auxiliary root behavior
- Test that auxiliary root node "Root" is not included in text output
- Test that text input creates proper auxiliary root structure in mind map

## Test Cases

### Node Operations
- **Add a new node:** Click the "Add Node" button, verify new node appears in root column with default text "New Node"
- **Add a child node:** Select a node, click "+" button, verify new column appears with child node
- **Delete a node:** Click "x" button on node, verify node and all children are removed
- **Edit a node's text:** Double-click node text, edit content, verify changes are saved

### Selection and Expansion
- **Select a node:** Click on node, verify highlighting with light blue background
- **Automatic expansion:** When node has children, verify new column appears to the right
- **Selected path:** Verify selection is remembered using `selected_child_idx`
- **Deselect:** Click another node in same column, verify selection changes appropriately

### File Operations
- **Save As JSON:** Click button, verify file dialog appears and saves JSON format
- **Save As Text:** Click button, verify file dialog appears and saves text format with tab hierarchy
- **Load File:** Click button, verify file dialog appears and loads format automatically
- **File path memory:** Verify paths are remembered and displayed in toolbar
- **Default file names:** Verify "mindmap.json" and "mindmap.txt" are used appropriately

### Copy/Paste Operations
- **Copy Node Structure:** Use Ctrl+C/Cmd+C to copy selected node and subtree to clipboard
- **Paste with Root Node Preservation:** Use Ctrl+V/Cmd+V to paste clipboard content
- **Root Node Pasting:** When pasting to root, verify root text is updated and children are added
- **Non-Root Node Pasting:** When pasting to non-root nodes, verify auxiliary root's children are added directly
- **Hierarchy Preservation:** Verify proper hierarchy preservation during copy/paste operations
- **Cross-Browser Support:** Test modern clipboard API and fallback mechanisms
- **Error Handling:** Test graceful handling of clipboard permission errors and invalid content

### File Path Memory Feature
- **JSON File Path Memory:** Save and remember JSON file paths across sessions
- **Text File Path Memory:** Save and remember text file paths across sessions
- **Local Storage Persistence:** Verify file paths persist using localStorage
- **Path Display:** Verify toolbar shows current file path correctly
- **Clear Paths:** Test clearing file paths and localStorage cleanup

### Column-Based UI
- **Column Rendering:** Each selected node generates a column showing its children
- **Fixed Width:** Verify columns maintain 220px width to prevent shrinking
- **Horizontal Scrolling:** Test scrolling behavior for deep hierarchies
- **Column Behavior:** Selecting nodes automatically expands children in next column
- **Empty Columns:** Verify empty columns are not displayed

### Text Format Support
- **Auxiliary Root Handling:** Verify root node is excluded from text output
- **Tab Hierarchy:** Test proper tab indentation for hierarchical structure
- **Round-trip Conversion:** Verify consistency between mindMapToText and textToMindMap
- **Validation:** Test rejection of invalid input (empty text, text starting with tabs)

### Error Handling
- **Clipboard API Errors:** Graceful handling of permission denials and API unavailability
- **File Operation Errors:** Handling of invalid file formats and read/write errors
- **Invalid Node Operations:** Graceful handling of non-existent node targets
- **Local Storage Errors:** Handling of localStorage unavailability

## Integration Tests

### Full Workflow Test
- Create a mind map with multiple levels
- Save it in both JSON and text formats
- Load it back and verify data integrity
- Test file path memory persistence
- Test copy/paste workflow with keyboard shortcuts

### File Format Compatibility Test
- Create mind maps in both formats
- Verify they can be loaded correctly
- Test edge cases (empty files, invalid formats)

### UI Interaction Test
- Test complete user workflow from creation to saving
- Test selection and expansion behavior
- Test file operations with path memory
- Test copy/paste workflow across different node structures

## Test Commands

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Column.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="copyNode"
```

### Test Coverage Report
The test suite maintains high coverage across all components, utilities, and store functions. Coverage reports can be generated using the `--coverage` flag.

## Mocking Strategy

### Clipboard API Mocking
The test suite includes comprehensive mocking for clipboard operations:
- Mock `navigator.clipboard.writeText` and `navigator.clipboard.readText`
- Mock `document.execCommand` for fallback scenarios
- Test both success and error scenarios

### File API Mocking
- Mock `FileReader` for file loading operations
- Mock `URL.createObjectURL` and `URL.revokeObjectURL` for file downloads
- Mock file dialog interactions

### Store Mocking
- Type-safe Zustand store mocking using `createMockMindMapStore`
- localStorage persistence testing with mocked localStorage

## Test Data Management

### Test Data Builders
The project uses consistent test data builders:
- `createTestMindMap()` for creating mind map structures
- `createTestNode()` for creating individual nodes with children
- Consistent naming and structure for predictable test results

### Test Cleanup
- Proper cleanup of mocked functions and DOM elements
- Reset store state between tests
- Clear localStorage between file path tests

## Performance Testing

### Large Mind Map Testing
- Test rendering performance with large node structures
- Test clipboard operations with large subtrees
- Test file save/load operations with large data sets

### Memory Management
- Verify proper cleanup of event listeners
- Test memory usage with repeated operations
- Verify no memory leaks in long-running sessions

## Future Testing Enhancements

### End-to-End Testing
- Future implementation of Cypress or Playwright for full end-to-end testing
- Testing across different browsers and devices
- Performance testing with real user scenarios

### Accessibility Testing
- Enhanced accessibility testing with axe-core
- Keyboard navigation testing
- Screen reader compatibility testing

### Visual Regression Testing
- Visual regression testing with Percy or similar tools
- Testing UI consistency across different themes and screen sizes
- Testing responsive design behavior