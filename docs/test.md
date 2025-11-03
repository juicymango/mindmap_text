# Test Documentation

This document provides comprehensive testing documentation for the mind map application, including test structure, testing approach, and test coverage.

## Test Overview

The application has comprehensive test coverage with 118 tests across 10 test files, covering unit tests, integration tests, and component tests using React Testing Library and Jest. The test suite covers all UI components including the newly enhanced Toolbar, improved visual styling components, and Task 52 column height improvements.

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
│   ├── NodeColor.test.tsx
│   └── Toolbar.test.tsx
├── store/
│   └── mindmapStore.test.ts
└── utils/
    ├── file.test.ts
    ├── textFormat.test.ts
    ├── nodeUtils.test.ts
    └── test-utils.ts
```

## Test Coverage

### Component Tests

#### App Component Tests (`src/components/App.test.tsx`)
- Test main application rendering with simplified layout structure
- Test Toolbar and MindMap component integration
- Test global styles application and modern CSS reset
- Test responsive flexbox layout behavior
- Test proper component hierarchy and organization
- Test integration with SelectedPathContext

#### MindMap Component Tests (`src/components/MindMap.test.tsx`)
- Test column generation based on selected path
- Test automatic expansion following selected_child_idx
- Test horizontal scrolling behavior with custom scrollbar styling
- Test keyboard shortcut handling for copy/paste operations
- Test enhanced container styling with flex layout and background
- Test improved spacing and visual hierarchy
- Test responsive design across different screen sizes
- **Task 52: Column Layout Integration Tests:**
  - Test prevention of vertical scrolling at MindMap level with `overflow-y: hidden`
  - Test top alignment of columns with different heights using `align-items: flex-start`
  - Test flex container behavior with `min-height: 0` for proper shrinking
  - Test background color and spacing for column container
  - Test proper integration with Column component scrolling behavior

#### Column Component Tests (`src/components/Column.test.tsx`)
- Test column rendering with nodes
- Test empty column handling
- Test fixed width and enhanced styling (240px width, shadows, spacing)
- Test column path handling and root column highlighting
- Test improved visual design with better borders and shadows
- Test root column blue border highlighting
- Test enhanced spacing and layout organization
- **Task 52: Column Height and Scrolling Tests:**
  - Test scrollable container behavior when many nodes are present (50+ nodes)
  - Test node display without truncation with large numbers of nodes
  - Test root column styling with blue left border
  - Test fixed width maintenance (240px) while allowing height flexibility
  - Test custom vertical scrollbar styling (6px width)
  - Test very long node text content handling
  - Test maximum height constraint: `calc(100vh - 80px)`
  - Test vertical scrolling behavior with `overflow-y: auto`
  - Test proper alignment of columns with different heights
  - Test accessibility with proper test ID attributes

#### Node Component Tests (`src/components/Node.test.tsx`)
- Test node rendering with color-coded states
- Test inline editing functionality with color preservation
- Test double-click to edit behavior
- Test click to select functionality
- Test enhanced hover effects with elevation and translation
- Test modern button design and interaction patterns
- Test node selection path tracking
- Test node type determination and color application
- Test improved visual styling with better spacing and typography
- Test accessibility features (tabIndex, keyboard navigation)
- Test integration with new icon-based toolbar system

#### Node Color Visual Tests (`src/components/NodeColor.test.tsx`)
- Test actual DOM computed styles for all 4 node types (selected, onPath, withChildren, withoutChildren)
- Test color accuracy and conversion from hex to rgb/rgba formats
- Test border color rendering for selected and withChildren nodes
- Test hover color values and CSS style definitions
- Test accessibility color contrast between background and text colors
- Test dynamic color updates when selection state changes
- Test consistent styling across multiple nodes with different states
- Test empty selected path handling and default color application

#### Toolbar Component Tests (`src/components/Toolbar.test.tsx`)
- Test file path display rendering
- Test button states based on file path availability
- Test Save As functionality with default file names ("mindmap.json" and "mindmap.txt")
- Test load file functionality
- Test format detection and file path memory
- Test enhanced button grouping with icon integration
- Test modern toolbar design with improved spacing and shadows
- Test Lucide React icon integration and accessibility
- Test file path display without "Current file:" prefix
- **Task 48: Root Node Button States:**
  - Test Add Child button behavior when root node is selected (should be enabled)
  - Test Copy/Paste button behavior when root node is selected (should be enabled)
  - Test Delete button behavior when root node is selected (should be disabled)
  - Test Move Up/Down button behavior when root node is selected (should be disabled)
  - Test button states for non-root nodes (all operations should be enabled)
  - Test proper root node selection handling with path `[]`
- **UI Enhancement Testing:**
  - Test icon integration with Lucide React icons
  - Test enhanced button styling with hover effects
  - Test improved toolbar layout with better organization
  - Test button text changes (e.g., "Save As JSON" → "Save JSON")

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

#### Node Utils Tests (`src/utils/nodeUtils.test.ts`)
- Test `isNodeOnSelectedPath` function with various path scenarios
- Test `isNodeOnSelectedPath` returns true when node is on selected path (prefix)
- Test `isNodeOnSelectedPath` returns true when node is on selected path (suffix)
- Test `isNodeOnSelectedPath` returns true when paths are identical
- Test `isNodeOnSelectedPath` returns false when paths diverge
- Test `isNodeOnSelectedPath` handles empty paths correctly
- Test `isNodeSelected` function with exact path matching
- Test `isNodeSelected` returns true only when paths are identical
- Test `isNodeSelected` handles different path lengths correctly
- Test `isNodeSelected` handles empty paths correctly
- Test `hasChildren` function with various node structures
- Test `hasChildren` returns true when node has children
- Test `hasChildren` returns false when node has empty children array
- Test `hasChildren` returns false when node has no children property
- Test `hasChildren` returns false when children is undefined
- Test `getNodeType` function with comprehensive scenarios
- Test `getNodeType` returns "selected" when node is selected
- Test `getNodeType` returns "onPath" when node is on selected path but not selected
- Test `getNodeType` returns "withChildren" when node has children but not on path
- Test `getNodeType` returns "withoutChildren" when node has no children and not on path
- Test `getNodeType` prioritizes "selected" over other types
- Test `getNodeType` prioritizes "onPath" over children status
- Test `getNodeType` handles empty paths correctly
- Test `getNodeType` handles complex nested scenarios
- Test `getNodeType` gives siblings withChildren or withoutChildren color, not onPath
- Test `getNodeType` handles specific case from Task 44: when [0,1] is selected
- Test `getNodeType` handles deep nested structures with siblings
- Test `getNodeType` selected_child_idx path coloring - colors selected_child_idx chain as onPath when node is selected
- Test `getNodeType` handles deep selected_child_idx chains with multiple levels
- Test edge cases and error handling in all node utility functions

## Test Cases

### Node Operations
- **Add a new node:** Click the "Add Node" button, verify new node appears in root column with default text "New Node"
- **Add a child node:** Select a node, click "+" button, verify new column appears with child node
- **Delete a node:** Click "x" button on node, verify node and all children are removed
- **Edit a node's text:** Double-click node text, edit content, verify changes are saved

### Selection and Expansion
- **Select a node:** Click on node, verify blue background highlighting with white text
- **Automatic expansion:** When node has children, verify new column appears to the right
- **Selected path:** Verify selection is remembered using `selected_child_idx`
- **Deselect:** Click another node in same column, verify selection changes appropriately
- **Color-coded states:** Verify nodes display correct colors based on their type (selected, on path, with children, without children)
- **Visual hierarchy:** Test that color priority system works correctly (selected > on path > children status)
- **selected_child_idx path coloring:** Verify that grandchildren get `onPath` color when they're the `selected_child_idx` of the selected node
- **selected_child_idx chain behavior:** Test that the chain of selected_child_idx nodes from the selected node gets `onPath` coloring

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
- **Fixed Width:** Verify columns maintain 240px width to prevent shrinking
- **Horizontal Scrolling:** Test scrolling behavior for deep hierarchies
- **Column Behavior:** Selecting nodes automatically expands children in next column
- **Empty Columns:** Verify empty columns are not displayed
- **Task 52: Adjustable Column Height:**
  - Test maximum height constraint: `calc(100vh - 80px)` accounting for toolbar and status bar
  - Test vertical scrolling when content exceeds maximum height
  - Test custom vertical scrollbar styling (6px width) for consistent aesthetics
  - Test proper column alignment when columns have different heights
  - Test that columns maintain fixed width while allowing height flexibility

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
- Test selection and expansion behavior with new color coding
- Test file operations with path memory (Save As only, no Save button)
- Test copy/paste workflow across different node structures
- Test visual feedback and hover effects for different node types
- Test keyboard navigation and accessibility features
- Test color coding system across different mind map hierarchies and states

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
The test suite maintains high coverage across all components, utilities, and store functions with 122 tests covering comprehensive scenarios including the enhanced UI system, icon integration, improved styling, status bar functionality, visual DOM testing, selected_child_idx path coloring, root node button state management, and Task 52 column height improvements. Coverage reports can be generated using the `--coverage` flag.

## UI Enhancement Testing

### Icon Integration Testing
- **Lucide React Icons:** Test proper integration and accessibility of all toolbar icons
- **Icon-Text Combinations:** Test button layouts with icons and text labels
- **Hover Effects:** Test enhanced hover states with icon animations
- **Screen Reader Support:** Test proper ARIA labels and descriptions for icon-based buttons

### Enhanced Styling Testing
- **Modern Button Design:** Test new button styling with shadows, borders, and hover effects
- **Improved Spacing:** Test enhanced padding, margins, and gap layouts
- **Color Consistency:** Test consistent color application across all UI components
- **Typography:** Test improved font sizes, weights, and text rendering
- **Visual Hierarchy:** Test proper layering and z-index management

### Layout System Testing
- **Flexbox Architecture:** Test responsive flexbox layouts across all components
- **Component Organization:** Test proper component hierarchy and structure
- **Responsive Design:** Test layout adaptation to different screen sizes
- **Custom Scrollbars:** Test enhanced scrollbar styling and behavior
- **Status Bar Integration:** Test status bar positioning and information display

### Accessibility Testing
- **Focus Management:** Test proper keyboard navigation and focus states
- **Color Contrast:** Test accessibility compliance of all color combinations
- **Screen Reader Compatibility:** Test proper ARIA labels and roles
- **Keyboard Shortcuts:** Test keyboard navigation and interaction patterns
- **High Contrast Mode:** Test visual consistency in high contrast themes

## Task 45: selected_child_idx Path Coloring Tests

### New Function Testing
- **isNodeOnSelectedPathWithChildIndex function:** Test the new function that detects if a node is part of the selected_child_idx chain extending from the selected node
- **Tree traversal algorithm:** Test the logic that follows selected_child_idx values from the selected node to determine onPath status
- **Root node parameter:** Test the updated getNodeType function with the optional root node parameter

### Test Scenarios
- **Basic selected_child_idx coloring:** When a node is selected, its selected_child_idx child should get onPath color
- **Deep chain coloring:** When a node is selected, the entire chain of selected_child_idx nodes should get onPath color
- **Mixed hierarchy:** Test scenarios where some descendants are on the selected_child_idx path and others are not
- **Edge cases:** Test with undefined selected_child_idx values and empty children arrays

### Integration Testing
- **Node component integration:** Test that the Node component correctly passes the root node to getNodeType
- **Visual consistency:** Test that the color coding matches the expected behavior across different mind map structures
- **Sibling behavior:** Verify that siblings not on the selected_child_idx path get appropriate colors (withChildren/withoutChildren)

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

### Color Coding System Testing
- Test node type determination across all possible scenarios
- Test color application for each node type (selected, on path, with children, without children)
- Test hover effects and transitions for different node states
- Test focus states and keyboard navigation accessibility
- Test edge cases and boundary conditions in node utility functions
- Test visual hierarchy and priority system for node colors
- Test color contrast and accessibility compliance

## Task 48: Root Node Selection and Button State Management

### Root Column Understanding
- **Root Node Path:** The root node in the root column is assigned path `[]` (empty array)
- **Selection State:** Root node selection is indicated by `selectedPath: []`
- **Auxiliary Root:** The root column contains the actual `MindMap.root` node, not a display-only auxiliary node

### Button State Logic Testing
- **Root Node Operations:**
  - Add Child: Enabled (root can have children added)
  - Copy JSON: Enabled (root content can be copied)
  - Copy Text: Enabled (root content can be copied)
  - Paste JSON: Enabled (content can be pasted to root)
  - Paste Text: Enabled (content can be pasted to root)
  - Delete: Disabled (root cannot be deleted)
  - Move Up: Disabled (root cannot be moved)
  - Move Down: Disabled (root cannot be moved)

- **Non-Root Node Operations:**
  - All operations enabled for non-root nodes

### Test Implementation
- **Mock Selection Context:** Tests use mocked `useSelectedPath` hook to control selection state
- **Path-based Testing:** Tests verify behavior with `selectedPath: []` (root) vs `selectedPath: [0]` (non-root)
- **Button State Verification:** Comprehensive testing of disabled/enabled states for all operations
- **Legacy Test Compatibility:** Updated existing tests to reflect new root node behavior

### Integration with Column Component
- **Root Path Assignment:** Column component correctly assigns path `[]` to root node in first column
- **Selection Propagation:** Root node selection properly propagates to Toolbar component
- **Visual Feedback:** Root node selection provides appropriate visual feedback in UI

### Accessibility Testing
- Enhanced accessibility testing with axe-core
- Keyboard navigation testing with proper focus management
- Screen reader compatibility testing for color-coded nodes
- Test proper ARIA labels and roles for interactive elements
- Test high contrast mode compatibility

### Visual Regression Testing
- Visual regression testing with Percy or similar tools
- Testing UI consistency across different themes and screen sizes
- Testing responsive design behavior
- Testing color consistency across different browser environments

## Task 52: Column Height Testing Strategy

### Test Objectives
The Task 52 test suite specifically addresses the column height issue where background white blocks were fixed to window size and not adjustable for nodes with many children.

### Core Functionality Tests
- **Height Constraint Testing:** Verify columns have `max-height: calc(100vh - 120px)` to account for toolbar (48px) and status bar (32px) plus margins
- **Vertical Scrolling:** Test `overflow-y: auto` behavior when content exceeds maximum height
- **Scrollbar Styling:** Verify custom vertical scrollbar styling with 6px width and proper hover effects
- **Fixed Width Maintenance:** Ensure columns maintain 240px width while allowing height flexibility

### Component Integration Tests
- **MindMap-Level Prevention:** Test that MindMap component prevents vertical scrolling with `overflow-y: hidden`
- **Column Alignment:** Verify columns align to top when they have different heights using `align-items: flex-start`
- **Flex Container Behavior:** Test proper flex container shrinking with `min-height: 0`

### Performance and Scalability Tests
- **Large Node Counts:** Test rendering with 50+ nodes to ensure scrolling performance
- **Long Text Content:** Test handling of very long node text content within scrollable columns
- **Multiple Column Heights:** Test behavior when columns have significantly different heights

### Visual and UX Tests
- **Scrollbar Aesthetics:** Test custom scrollbar styling matches application design
- **Root Column Highlighting:** Verify root column blue border (4px solid #4A90E2) displays correctly
- **Visual Consistency:** Test that scrolling doesn't break visual hierarchy or styling

### Accessibility Compliance
- **Test ID Attributes:** Verify proper `data-testid="column-container"` for testing accessibility
- **Keyboard Navigation:** Test that scrolling behavior doesn't interfere with keyboard navigation
- **Screen Reader Compatibility:** Test that scrollable regions are properly announced

### Regression Prevention
- **Cross-Browser Testing:** Verify scrollbar behavior across different browsers
- **Responsive Design:** Test column height behavior on different screen sizes
- **Memory Management:** Test that scrolling doesn't cause memory leaks or performance issues
- **State Preservation:** Test that scrolling state doesn't interfere with application state

### Test Implementation Details
- **Mock Components:** Test uses mock Node component for isolated Column testing
- **Large Data Sets:** Tests create arrays of 50+ nodes to verify scrolling behavior
- **Style Verification:** Tests verify both presence and correct values of CSS properties
- **Edge Case Handling:** Tests cover empty columns, single-node columns, and overflow scenarios

### Integration with Existing Test Suite
- **No Breaking Changes:** Task 52 tests verify that existing functionality remains intact
- **Enhanced Coverage:** New tests complement existing test coverage for Column and MindMap components
- **Documentation Updates:** Test documentation updated to reflect new test cases and coverage