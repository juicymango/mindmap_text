# Implementation and Testing Plan

This document outlines the plan for implementing and testing the mind map application using React.

## Project Setup

1.  **Initialize React App:** Use `create-react-app` with the TypeScript template to set up a new React project.
    ```bash
    npx create-react-app mindmap-app --template typescript
    ```
2.  **Dependencies:**
    - **State Management:** We will use `Zustand`. It's a small, fast and scalable bearbones state-management solution. It has a comfortable API based on hooks, and it's less boilerplate than Redux.
    - **Drag and Drop:** We will use `react-beautiful-dnd`. It's a popular, accessible and powerful library for drag and drop in React.
    - **Styling:** We will use `styled-components` for styling. It allows us to write actual CSS code to style our components, which is more intuitive and powerful than using plain JavaScript objects.
    - **UUID:** We will use the `uuid` library to generate unique IDs for our nodes.

    ```bash
    npm install zustand react-beautiful-dnd styled-components uuid
    npm install @types/react-beautiful-dnd @types/styled-components @types/uuid -D
    ```

## Component Structure

The application will be broken down into the following components:

-   **`App`:** The main component that holds the entire application. It will render the `Toolbar` and the `MindMap` components.
-   **`MindMap`:** The main container for the mind map. It will fetch the data from the Zustand store and render the columns.
-   **`Column`:** A component that renders a single column of nodes. It will be a droppable area for `react-beautiful-dnd`.
-   **`Node`:** A component that renders a single node within a column. It will be a draggable item for `react-beautiful-dnd`.
-   **`Toolbar`:** A component for buttons like "Save", "Load", etc.

## State Management with Zustand

-   A Zustand store will be created to manage the state of the mind map.
-   The store will contain the mind map data as a tree-like structure, as defined in `docs/ui_and_interaction_design.md`.
-   The store will also contain actions to manipulate the state, such as adding, deleting, and updating nodes.

## Implementation Details

1.  **Column View:** The `MindMap` component will get the selected path from the Zustand store and render a series of `Column` components.
2.  **Node Selection:** Each `Node` component will have an `onClick` handler that calls an action in the Zustand store to update the selected node.
3.  **Expansion:** The Zustand store will have a dedicated function to determine the selected path based on the currently selected node. The `MindMap` component will use this to render the columns.
4.  **Drag and Drop:** The `MindMap` component will be wrapped in a `DragDropContext`. The `Column` components will be `Droppable`, and the `Node` components will be `Draggable`. The `onDragEnd` handler will call an action in the Zustand store to update the order of the nodes.
5.  **File Operations:** The `Toolbar` component will have "Save" and "Load" buttons. The "Save" button will get the mind map data from the Zustand store and use the File System Access API to save it as a JSON file. The "Load" button will use the File System Access API to load a JSON file and update the Zustand store.

## Testing Strategy

-   **Unit Tests:** Each component will be tested in isolation using `jest` and `react-testing-library`. We will mock the Zustand store to test the components in a predictable way.
-   **Integration Tests:** We will test the integration between the components and the Zustand store. For example, we will test that clicking on a node correctly updates the state and re-renders the `MindMap` component.
-   **End-to-End Tests:** We will use `Cypress` to automate browser testing. We will create test scripts that simulate user flows, such as creating a new mind map, adding nodes, and saving the mind map.

## Task 17: File Path Memory Feature Implementation Plan

### Overview
Implement file path memory functionality to allow users to save and load mind maps from remembered file paths, with format detection based on file extension.

### Implementation Plan

1. **State Management Enhancement**
   - Add file path memory state to the Zustand store
   - Store remembered file paths for both JSON and text formats
   - Add actions to update and clear remembered file paths

2. **File Operations Enhancement**
   - Modify save/load functions to use remembered file paths
   - Add format detection based on file extension (.json/.txt)
   - Implement "Save" and "Load" buttons that use remembered paths
   - Keep "Save As" and "Load As" buttons for path selection

3. **UI Enhancements**
   - Display current remembered file path in the toolbar
   - Add "Save" and "Load" buttons alongside existing "Save As" and "Load As" buttons
   - Show appropriate error messages when file operations fail

4. **Local Storage Integration**
   - Use localStorage to persist remembered file paths across sessions
   - Implement fallback behavior when no file path is remembered

### Technical Approach

1. **Store State Extensions**
   ```typescript
   interface FilePathState {
     jsonFilePath: string | null;
     textFilePath: string | null;
     setJsonFilePath: (path: string | null) => void;
     setTextFilePath: (path: string | null) => void;
     clearFilePaths: () => void;
   }
   ```

2. **Enhanced File Operations**
   - `save(mindmap: MindMap, filePath?: string)` - Save to remembered path or prompt
   - `load(filePath?: string)` - Load from remembered path or prompt
   - `detectFormat(filePath: string)` - Determine format from file extension

3. **UI Components**
   - Add file path display to Toolbar component
   - Implement quick save/load buttons
   - Add error handling for file operations

### Implementation Steps

1. Update Zustand store with file path state
2. Enhance file utility functions with path memory
3. Update Toolbar component with new buttons and file path display
4. Implement localStorage persistence
5. Add comprehensive error handling
6. Update unit tests to cover new functionality

---

# Future Development Plan

## Overview

This document outlines potential future enhancements and features for the mind map application. The current implementation provides a solid foundation with core functionality including node operations, drag-and-drop, file operations with path memory, and dual format support (JSON/text).

## Phase 1: Enhanced User Experience

### 1.1 Keyboard Navigation and Shortcuts
- **Objective:** Improve accessibility and power user efficiency
- **Features:**
  - Arrow key navigation between nodes
  - Tab/Shift+Tab for moving between columns
  - Enter to create new child node
  - Delete/Backspace to delete selected node
  - F2 for inline editing
  - Ctrl+S for quick save
  - Ctrl+O for quick load
  - Ctrl+N for new mind map
  - Escape to cancel editing
- **Implementation:**
  - Add keyboard event handlers to MindMap component
  - Implement keyboard navigation state management
  - Add keyboard shortcut documentation

### 1.2 Improved Visual Design
- **Objective:** Enhance visual appeal and usability
- **Features:**
  - Modern color scheme with theme support (light/dark mode)
  - Smooth animations for node operations
  - Hover effects and visual feedback
  - Better visual hierarchy with node sizing
  - Icons for node actions (add, delete, edit)
  - Connection lines between parent and child nodes
  - Column headers showing parent node context
- **Implementation:**
  - Update styled-components with new design system
  - Add theme context provider
  - Implement CSS transitions and animations
  - Add icon library (react-icons)

### 1.3 Advanced Node Features
- **Objective:** Add more flexibility to node content
- **Features:**
  - Rich text formatting (bold, italic, colors)
  - Node icons and emojis
  - Node notes and descriptions
  - Node due dates and reminders
  - Node priority levels
  - Node tags and categories
  - Node attachments (links, images)
- **Implementation:**
  - Extend MindNode interface with new properties
  - Add rich text editor component
  - Implement attachment handling
  - Update file format support for new properties

## Phase 2: Enhanced Functionality

### 2.1 Advanced Export Options
- **Objective:** Provide more export formats and customization
- **Features:**
  - Export to PDF with custom layouts
  - Export to image formats (PNG, SVG)
  - Export to Markdown
  - Export to other mind map formats (FreeMind, XMind)
  - Customizable export templates
  - Batch export capabilities
- **Implementation:**
  - Add PDF generation library
  - Implement SVG rendering
  - Create format converter utilities
  - Add export options dialog

### 2.2 Import and Integration
- **Objective:** Support importing from various formats
- **Features:**
  - Import from other mind map applications
  - Import from outline formats (Markdown, OPML)
  - Import from spreadsheet data
  - Import from project management tools
  - API integration with external services
- **Implementation:**
  - Create format parser library
  - Add import wizard component
  - Implement API client for external services

### 2.3 Collaboration Features
- **Objective:** Enable real-time collaboration
- **Features:**
  - Real-time collaborative editing
  - User presence indicators
  - Comment threads on nodes
  - Version history and time travel
  - User permissions and access control
  - Sharing via links or invitations
- **Implementation:**
  - Add WebSocket support for real-time updates
  - Implement operational transformation for conflict resolution
  - Add user authentication system
  - Create comment and versioning components

## Phase 3: Performance and Scalability

### 3.1 Large Dataset Optimization
- **Objective:** Handle large mind maps efficiently
- **Features:**
  - Virtual scrolling for columns with many nodes
  - Lazy loading of child nodes
  - Progressive rendering
  - Memory optimization for large datasets
  - Performance monitoring and metrics
- **Implementation:**
  - Implement virtualized list components
  - Add lazy loading to store actions
  - Optimize rendering performance
  - Add performance monitoring tools

### 3.2 Offline Support
- **Objective:** Enable offline usage with synchronization
- **Features:**
  - Offline mode with local storage
  - Automatic synchronization when online
  - Conflict resolution for offline changes
  - Background sync capabilities
  - Offline indicator
- **Implementation:**
  - Add service worker for offline support
  - Implement sync queue and conflict resolution
  - Add offline status indicators
  - Create sync management interface

### 3.3 Mobile Responsiveness
- **Objective:** Full mobile support with touch gestures
- **Features:**
  - Responsive design for mobile devices
  - Touch gestures for drag and drop
  - Mobile-optimized toolbar and controls
  - Pinch-to-zoom functionality
  - Swipe gestures for navigation
- **Implementation:**
  - Add responsive breakpoints and styles
  - Implement touch event handlers
  - Create mobile-specific components
  - Add gesture recognition library

## Phase 4: Advanced Features

### 4.1 AI-Powered Features
- **Objective:** Leverage AI for enhanced productivity
- **Features:**
  - AI-powered node suggestions
  - Automatic mind map generation from text
  - Content summarization and expansion
  - Smart organization and clustering
  - Natural language processing for commands
- **Implementation:**
  - Integrate with AI service providers
  - Add AI suggestion components
  - Implement natural language processing
  - Create AI-powered automation tools

### 4.2 Analytics and Insights
- **Objective:** Provide data insights about mind maps
- **Features:**
  - Mind map statistics and metrics
  - Usage analytics and patterns
  - Productivity insights
  - Node relationship analysis
  - Interactive data visualizations
- **Implementation:**
  - Add analytics tracking and storage
  - Create data visualization components
  - Implement analysis algorithms
  - Build insights dashboard

### 4.3 Plugin System
- **Objective:** Enable third-party extensions
- **Features:**
  - Plugin architecture and API
  - Plugin marketplace
  - Custom node types and behaviors
  - Third-party integrations
  - Plugin development tools
- **Implementation:**
  - Design plugin system architecture
  - Create plugin API and SDK
  - Build plugin marketplace interface
  - Add plugin management tools

## Technical Debt and Maintenance

### Code Quality Improvements
- **Objective:** Improve code maintainability and quality
- **Tasks:**
  - Add comprehensive test coverage (target: 90%+)
  - Implement code linting and formatting standards
  - Add TypeScript strict mode
  - Improve error handling and logging
  - Add performance benchmarks
  - Implement continuous integration improvements

### Documentation and Onboarding
- **Objective:** Improve developer experience
- **Tasks:**
  - Create comprehensive API documentation
  - Add component storybook with examples
  - Develop onboarding tutorials
  - Create contribution guidelines
  - Add architecture decision records
  - Implement automated documentation generation

### Security Enhancements
- **Objective:** Improve application security
- **Tasks:**
  - Add input validation and sanitization
  - Implement secure file handling
  - Add authentication and authorization
  - Implement data encryption
  - Add security audit logging
  - Perform regular security assessments

## Implementation Timeline

### Short-term (1-3 months)
- Keyboard navigation and shortcuts
- Improved visual design and themes
- Advanced node features (rich text, icons)
- Enhanced export options

### Medium-term (3-6 months)
- Import and integration capabilities
- Large dataset optimization
- Mobile responsiveness
- Code quality improvements

### Long-term (6-12 months)
- Collaboration features
- Offline support
- AI-powered features
- Plugin system architecture

## Success Metrics

### User Engagement
- Daily active users
- Session duration
- Feature adoption rates
- User satisfaction scores

### Technical Performance
- Application load time
- Rendering performance
- Memory usage
- Error rates

### Business Impact
- User retention
- Feature usage patterns
- Export/import usage
- Collaboration adoption

## Conclusion

This future development plan provides a roadmap for evolving the mind map application from a solid foundation into a comprehensive, feature-rich platform. The plan balances user experience improvements, technical enhancements, and innovative features while maintaining code quality and performance.

The phased approach allows for incremental improvements while building toward more advanced capabilities. Each phase builds upon the previous one, creating a cohesive and scalable application architecture.

Key to success will be maintaining the simplicity and ease of use that characterizes the current implementation while adding powerful new features that enhance productivity and collaboration.

---

# Task 19: Error Analysis and Fix Plan

## Error Analysis

### 1. TypeScript Mocking Issues in Tests

**Problem:** Multiple TypeScript errors in test files related to mocking Zustand store:

```typescript
TS2352: Conversion of type 'UseBoundStore<StoreApi<MindMapState>>' to type 'Mock<any, any>' may be a mistake
```

**Root Cause:**
- Zustand's `useMindMapStore` returns a `UseBoundStore<StoreApi<MindMapState>>` type
- Jest's `jest.Mock` expects a different type structure
- TypeScript cannot safely cast between these types due to incompatible interfaces
- The mocking approach doesn't properly handle Zustand's store structure

**Files Affected:**
- `src/components/MindMap.test.tsx:32`
- `src/components/Node.test.tsx:37`
- `src/components/Toolbar.test.tsx:17,40,55,77,94,114,199,239`

### 2. Type Safety Issues in Source Code

**Problem:** Two TypeScript errors in source code:

```typescript
TS2345: Argument of type 'string | null' is not assignable to parameter of type 'string | undefined'
```

**Root Cause:**
- `Toolbar.tsx:64` - `loadFromFile(filePath)` expects `string | undefined` but receives `string | null`
- `file.ts:66` - `textToMindMap(text)` returns `MindMap | null` but assigned to `MindMap` type

**Files Affected:**
- `src/components/Toolbar.tsx:64`
- `src/utils/file.ts:66`

### 3. Runtime Error

**Problem:** 
```
Invariant failed: Cannot find droppable entry with id [[]]
```

**Root Cause:**
- Empty array path being used as droppable ID
- react-beautiful-dnd cannot find droppable with empty array ID
- Likely occurs when no nodes are selected or path is not properly initialized

## Automatic Test Methods to Prevent These Errors

### 1. Type-Safe Mocking Utilities

**Solution:** Create type-safe mocking utilities for Zustand stores:

```typescript
// utils/test-utils.ts
export const createMockStore = (partialState: Partial<MindMapState>) => {
  const mockStore = jest.fn() as jest.MockedFunction<typeof useMindMapStore>;
  mockStore.mockReturnValue({
    // Default state
    mindmap: { root: { text: 'Root', children: [] } },
    setMindmap: jest.fn(),
    addNode: jest.fn(),
    deleteNode: jest.fn(),
    updateNodeText: jest.fn(),
    onDragEnd: jest.fn(),
    setSelectedChild: jest.fn(),
    jsonFilePath: null,
    textFilePath: null,
    setJsonFilePath: jest.fn(),
    setTextFilePath: jest.fn(),
    clearFilePaths: jest.fn(),
    // Override with provided partial state
    ...partialState,
  });
  return mockStore;
};
```

### 2. Type Guard Utilities

**Solution:** Add type guards for null/undefined handling:

```typescript
// utils/type-guards.ts
export const isNonNullString = (value: string | null | undefined): value is string => {
  return typeof value === 'string' && value.length > 0;
};

export const isValidMindMap = (mindmap: MindMap | null): mindmap is MindMap => {
  return mindmap !== null && mindmap.root !== undefined;
};
```

### 3. Compile-Time Validation

**Solution:** Add ESLint rules and TypeScript configuration to prevent similar issues:

```json
{
  "rules": {
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/strict-null-checks": "error",
    "@typescript-eslint/explicit-function-return-type": "error"
  }
}
```

### 4. Integration Tests for Runtime Errors

**Solution:** Add tests that specifically check for react-beautiful-dnd edge cases:

```typescript
describe('react-beautiful-dnd integration', () => {
  it('should handle empty mind maps without errors', () => {
    const emptyMindMap = { root: { text: 'Root', children: [] } };
    // Test that empty paths don't cause droppable errors
  });
  
  it('should handle invalid droppable IDs gracefully', () => {
    // Test error handling for invalid droppable IDs
  });
});
```

## Fix Plan

### Phase 1: Immediate Fixes (Critical)

1. **Fix TypeScript Mocking Issues**
   - Create type-safe mocking utilities
   - Update all test files to use new mocking approach
   - Add proper TypeScript types for mocks

2. **Fix Type Safety Issues**
   - Add null/undefined handling in Toolbar.tsx
   - Add null checks in file.ts for textToMindMap results
   - Update type definitions to handle nullable values properly

3. **Fix Runtime Error**
   - Add validation for droppable IDs
   - Ensure empty arrays are handled gracefully
   - Add error boundaries for react-beautiful-dnd

### Phase 2: Prevention Measures (Important)

1. **Add Type Safety Utilities**
   - Create type guard utilities
   - Add runtime validation functions
   - Implement strict null checking

2. **Enhance Testing Infrastructure**
   - Add integration tests for edge cases
   - Add type checking in CI/CD pipeline
   - Add ESLint rules for type safety

3. **Improve Error Handling**
   - Add error boundaries for React components
   - Add graceful error handling for file operations
   - Add user-friendly error messages

### Phase 3: Long-term Improvements (Enhancement)

1. **Refactor Store Architecture**
   - Consider more type-safe state management
   - Add proper error boundaries
   - Implement better separation of concerns

2. **Add Comprehensive Testing**
   - Add end-to-end tests for critical workflows
   - Add performance testing
   - Add accessibility testing

3. **Documentation and Training**
   - Add documentation for type safety practices
   - Add examples for proper mocking
   - Create developer guidelines

## Implementation Strategy

### Step 1: Create Type-Safe Mocking Utilities
```typescript
// src/utils/test-utils.ts
export const mockMindMapStore = (overrides: Partial<MindMapState> = {}) => {
  const baseState: MindMapState = {
    mindmap: { root: { text: 'Root', children: [] } },
    setMindmap: jest.fn(),
    addNode: jest.fn(),
    deleteNode: jest.fn(),
    updateNodeText: jest.fn(),
    onDragEnd: jest.fn(),
    setSelectedChild: jest.fn(),
    jsonFilePath: null,
    textFilePath: null,
    setJsonFilePath: jest.fn(),
    setTextFilePath: jest.fn(),
    clearFilePaths: jest.fn(),
  };
  
  return jest.fn().mockReturnValue({ ...baseState, ...overrides });
};
```

### Step 2: Fix Type Safety Issues
```typescript
// src/components/Toolbar.tsx
const handleLoad = async () => {
  const filePath = jsonFilePath || textFilePath;
  if (filePath) { // Add null check
    const { mindmap: newMindMap, path } = await loadFromFile(filePath);
    // ... rest of the logic
  }
};
```

### Step 3: Fix Runtime Error
```typescript
// src/components/MindMap.tsx
const getColumns = () => {
  const columns: { path: number[]; nodes: MindNode[] }[] = [];
  let currentNode = mindmap.root;
  let currentPath: number[] = [];
  
  // Only add column if it has nodes or is the root
  if (currentPath.length === 0 || currentNode.children.length > 0) {
    columns.push({ path: currentPath, nodes: currentNode.children });
  }
  
  // ... rest of the logic
};
```

### Step 4: Add Comprehensive Tests
```typescript
// src/components/__tests__/error-handling.test.tsx
describe('Error Handling', () => {
  it('should handle null file paths gracefully', () => {
    // Test null file path handling
  });
  
  it('should handle invalid mind map data gracefully', () => {
    // Test invalid data handling
  });
  
  it('should handle react-beautiful-dnd errors gracefully', () => {
    // Test drag and drop error handling
  });
});
```

## Success Criteria

### Immediate Fixes
- ✅ All TypeScript compilation errors resolved
- ✅ All tests passing without type errors
- ✅ Runtime errors eliminated
- ✅ Proper null/undefined handling

### Prevention Measures
- ✅ Type-safe mocking utilities implemented
- ✅ Comprehensive test coverage for edge cases
- ✅ ESLint rules preventing similar issues
- ✅ CI/CD pipeline catching type errors early

### Long-term Improvements
- ✅ Enhanced error handling throughout the application
- ✅ Improved developer experience with better tooling
- ✅ Documentation for preventing similar issues
- ✅ Robust testing infrastructure

This comprehensive approach will not only fix the current issues but also prevent similar problems from occurring in the future, improving the overall code quality and developer experience.

---

# Task 20: Copy/Paste Implementation and Drag Removal Plan

## Overview

Task 20 requires removing all dragging features from the application and implementing copy/paste functionality using keyboard shortcuts and text format. This plan outlines the implementation strategy for these changes.

## Requirements Analysis

### Drag Removal Requirements
- Remove all react-beautiful-dnd dependencies and components
- Remove drag-related functionality from store and components
- Clean up drag-related tests and utilities
- Maintain existing node manipulation features (add, delete, edit)

### Copy/Paste Requirements
- **Copy functionality**: Copy current node and entire subtree to clipboard using text format
- **Paste functionality**: Paste clipboard content to current node, appending as children
- **Keyboard shortcuts**: Use Ctrl+C/Cmd+C for copy, Ctrl+V/Cmd+V for paste
- **No UI buttons**: Implement through keyboard shortcuts only
- **Text format**: Use existing text format functionality for clipboard operations

## Implementation Plan

### Phase 1: Remove Dragging Features

#### 1.1 Dependency Removal
- Remove `react-beautiful-dnd` and `@types/react-beautiful-dnd` from package.json
- Remove drag-related imports from all components
- Clean up package.json and update dependencies

#### 1.2 Store Updates
- Remove `onDragEnd` function from mindmap store
- Remove drag-related state and actions
- Update store interface to remove drag-related methods

#### 1.3 Component Updates
- **MindMap component**: Remove DragDropContext wrapper
- **Column component**: Remove Droppable wrapper and drag-related props
- **Node component**: Remove Draggable wrapper and drag-related props
- Clean up drag-related event handlers and props

#### 1.4 Test Updates
- Remove drag-related tests from all test files
- Update test utilities to remove drag mocking
- Clean up test data structures that reference drag functionality

### Phase 2: Implement Copy Functionality

#### 2.1 Store Updates
- Add `copyNode` function to mindmap store
- Function should:
  - Take a node path as parameter
  - Extract the node and its entire subtree
  - Convert to text format using existing `mindMapToText` utility
  - Write to clipboard using `navigator.clipboard.writeText`

#### 2.2 Keyboard Event Handling
- Add keyboard event listener to MindMap component
- Implement `handleKeyDown` function
- Detect Ctrl+C/Cmd+C keyboard shortcuts
- Call store's copy function with selected node path

#### 2.3 Text Format Integration
- Leverage existing `mindMapToText` utility
- Ensure proper text format with tab hierarchy
- Handle edge cases (empty nodes, special characters)

#### 2.4 Error Handling
- Handle clipboard API permission errors
- Graceful fallback for browsers without clipboard API
- Handle cases where no node is selected

### Phase 3: Implement Paste Functionality

#### 3.1 Store Updates
- Add `pasteNode` function to mindmap store
- Function should:
  - Take a target node path as parameter
  - Read text from clipboard using `navigator.clipboard.readText`
  - Parse text using existing `textToMindMap` utility
  - Append parsed nodes as children to target node

#### 3.2 Keyboard Event Handling
- Extend `handleKeyDown` function in MindMap component
- Detect Ctrl+V/Cmd+V keyboard shortcuts
- Call store's paste function with selected node path

#### 3.3 Data Integration
- Handle merging of clipboard data with existing mind map
- Update selected_child_idx to show newly pasted children
- Handle duplicate node names or conflicts

#### 3.4 Error Handling
- Handle invalid clipboard data format
- Graceful handling of parse errors
- Handle cases where no node is selected for paste target

### Phase 4: Testing

#### 4.1 Unit Tests
- Test copy functionality with various node structures
- Test paste functionality with valid and invalid clipboard data
- Test keyboard event handling and shortcut detection
- Test error handling for edge cases

#### 4.2 Integration Tests
- Test complete copy/paste workflow
- Test integration with existing text format utilities
- Test state updates after copy/paste operations

#### 4.3 Browser Compatibility Tests
- Test clipboard API compatibility
- Test fallback mechanisms for older browsers
- Test keyboard shortcuts across different platforms

## Technical Implementation Details

### Store Interface Updates
```typescript
// Remove from MindMapState interface:
onDragEnd: (result: DropResult) => void;

// Add to MindMapState interface:
copyNode: (path: number[]) => Promise<void>;
pasteNode: (path: number[]) => Promise<void>;
```

### Copy Function Implementation
```typescript
const copyNode = async (path: number[]) => {
  const node = findNode(mindmap, path);
  if (!node) return;
  
  // Create a temporary mind map with just this node
  const tempMindMap: MindMap = { root: node };
  const textFormat = mindMapToText(tempMindMap);
  
  try {
    await navigator.clipboard.writeText(textFormat);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // Fallback: use document.execCommand for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = textFormat;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};
```

### Paste Function Implementation
```typescript
const pasteNode = async (path: number[]) => {
  try {
    const clipboardText = await navigator.clipboard.readText();
    const parsedMindMap = textToMindMap(clipboardText);
    
    if (!parsedMindMap) {
      throw new Error('Invalid clipboard format');
    }
    
    // Add parsed nodes as children to target node
    const targetNode = findNode(mindmap, path);
    if (targetNode) {
      targetNode.children.push(...parsedMindMap.root.children);
      // Update selected child to show pasted content
      setSelectedChild(path, targetNode.children.length - 1);
    }
  } catch (error) {
    console.error('Failed to paste from clipboard:', error);
  }
};
```

### Keyboard Event Handler
```typescript
const handleKeyDown = (event: React.KeyboardEvent) => {
  // Check for Ctrl+C or Cmd+C
  if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
    event.preventDefault();
    copyNode(selectedPath);
  }
  
  // Check for Ctrl+V or Cmd+V
  if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
    event.preventDefault();
    pasteNode(selectedPath);
  }
};
```

## Success Criteria

### Drag Removal
- ✅ All react-beautiful-dnd dependencies removed
- ✅ Drag-related code removed from all components
- ✅ All drag-related tests removed or updated
- ✅ Application runs without drag functionality
- ✅ Existing features (add, delete, edit) work normally

### Copy/Paste Implementation
- ✅ Copy functionality works with Ctrl+C/Cmd+C
- ✅ Paste functionality works with Ctrl+V/Cmd+V
- ✅ Clipboard operations use text format correctly
- ✅ Error handling for clipboard API failures
- ✅ Proper integration with existing state management
- ✅ Cross-browser compatibility

### Testing
- ✅ Comprehensive test coverage for copy/paste functionality
- ✅ Tests pass without drag-related dependencies
- ✅ Error cases covered and handled gracefully
- ✅ Integration tests verify complete workflow

## Implementation Timeline

### Day 1: Drag Removal
- Remove dependencies and drag-related code
- Update components and store
- Remove drag-related tests
- Verify application works without drag features

### Day 2: Copy Implementation
- Implement copy function in store
- Add keyboard event handling
- Integrate with text format utilities
- Add error handling and fallbacks

### Day 3: Paste Implementation
- Implement paste function in store
- Handle clipboard data parsing
- Integrate with existing mind map structure
- Add conflict resolution and error handling

### Day 4: Testing and Refinement
- Write comprehensive tests
- Test cross-browser compatibility
- Handle edge cases and error scenarios
- Refine implementation based on testing

### Day 5: Documentation and Finalization
- Update documentation files
- Add keyboard shortcut documentation
- Final testing and bug fixes
- Commit and push changes

## Risk Mitigation

### Technical Risks
- **Clipboard API compatibility**: Implement fallback using document.execCommand
- **Text format parsing**: Leverage existing, tested utilities
- **State management complexity**: Follow existing patterns and conventions
- **Browser security restrictions**: Handle permission errors gracefully

### User Experience Risks
- **Discoverability**: Add keyboard shortcut hints where appropriate
- **Error feedback**: Provide user feedback for failed operations
- **Data loss prevention**: Add confirmation for destructive operations

This implementation plan provides a comprehensive approach to removing drag functionality and implementing copy/paste features while maintaining the application's stability and user experience.

---

# Task 21: AI Content Generation Implementation Plan

## Overview

Task 21 requires implementing AI-powered content generation for the mind map application. This feature will allow users to select a node, ask a question, and receive AI-generated content that is automatically structured as mind map nodes and appended as children to the selected node.

## Design Requirements

### AI Configuration Security
- **Local Command Line Setup**: Users configure AI models through local command-line commands
- **API Key Security**: API keys must not be exposed to the application or stored in plain text
- **Environment Variables**: Use environment variables for configuration management
- **No Data Leakage**: Private data including API keys must remain secure

### AI Prompt Engineering
- **Context Awareness**: AI should receive relevant context from the current mind map
- **Structured Output**: AI responses should be formatted as mind map structure
- **No Chat History**: Each interaction should be independent
- **Flexible Input**: Support various types of questions and content generation requests

### User Interaction Flow
- **Node Selection**: User selects a parent node for AI-generated content
- **Question Input**: User inputs a question or content generation request
- **AI Processing**: Application sends request to AI service with context
- **Response Integration**: AI response is parsed and added as child nodes
- **Error Handling**: Graceful handling of AI service failures

## Implementation Plan

### Phase 1: AI Configuration and Security Setup

#### 1.1 Environment-Based Configuration
```typescript
// src/config/ai.ts
interface AIConfig {
  provider: 'openai' | 'anthropic' | 'local';
  model: string;
  apiKey?: string; // Loaded from environment, not stored in app
  baseUrl?: string;
  maxTokens: number;
  temperature: number;
}

export const getAIConfig = (): AIConfig => {
  return {
    provider: (process.env.REACT_APP_AI_PROVIDER as 'openai' | 'anthropic' | 'local') || 'openai',
    model: process.env.REACT_APP_AI_MODEL || 'gpt-3.5-turbo',
    apiKey: process.env.REACT_APP_AI_API_KEY,
    baseUrl: process.env.REACT_APP_AI_BASE_URL,
    maxTokens: parseInt(process.env.REACT_APP_AI_MAX_TOKENS || '1000'),
    temperature: parseFloat(process.env.REACT_APP_AI_TEMPERATURE || '0.7'),
  };
};
```

#### 1.2 Command-Line Configuration Script
```bash
#!/bin/bash
# scripts/configure-ai.sh

echo "AI Configuration Setup"
echo "======================"

read -p "Enter AI provider (openai/anthropic/local): " provider
read -p "Enter model name: " model
read -s -p "Enter API key (will not be stored): " api_key

# Create .env file with user input
cat > .env << EOF
REACT_APP_AI_PROVIDER=$provider
REACT_APP_AI_MODEL=$model
REACT_APP_AI_API_KEY=$api_key
REACT_APP_AI_MAX_TOKENS=1000
REACT_APP_AI_TEMPERATURE=0.7
EOF

echo "Configuration saved to .env file"
echo "Important: .env file should be added to .gitignore"
```

#### 1.3 Security Utilities
```typescript
// src/utils/ai-security.ts
export const validateAIConfig = (config: AIConfig): boolean => {
  if (!config.provider) return false;
  if (!config.model) return false;
  if (config.provider !== 'local' && !config.apiKey) return false;
  return true;
};

export const sanitizeAIResponse = (response: string): string => {
  // Remove any potentially sensitive information from AI responses
  return response
    .replace(/api[_-]?key/gi, '[API_KEY]')
    .replace(/secret/gi, '[SECRET]')
    .replace(/password/gi, '[PASSWORD]');
};
```

### Phase 2: AI Service Integration

#### 2.1 AI Service Layer
```typescript
// src/services/aiService.ts
interface AIRequest {
  question: string;
  context: {
    selectedNode: string;
    parentNodes: string[];
    mindMapContext: string;
  };
}

interface AIResponse {
  content: string;
  structure: MindNode[];
  error?: string;
}

export class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async generateContent(request: AIRequest): Promise<AIResponse> {
    try {
      const prompt = this.buildPrompt(request);
      const response = await this.callAI(prompt);
      const structure = this.parseResponseToMindMap(response);
      
      return {
        content: response,
        structure,
      };
    } catch (error) {
      return {
        content: '',
        structure: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private buildPrompt(request: AIRequest): string {
    return `
You are an AI assistant that helps create mind maps. Based on the user's question and the current mind map context, generate a structured response that can be organized as a mind map.

Context:
- Selected Node: ${request.context.selectedNode}
- Parent Nodes: ${request.context.parentNodes.join(' → ')}
- Mind Map Structure: ${request.context.mindMapContext}

User Question: ${request.question}

Please provide your response in a hierarchical format that can be parsed into a mind map structure. Use the following format:
Main Topic
    Subtopic 1
        Detail 1
        Detail 2
    Subtopic 2
        Detail 3
    Subtopic 3

Ensure the response is well-structured and directly addresses the user's question within the given context.
`;
  }

  private async callAI(prompt: string): Promise<string> {
    // Implementation depends on the AI provider
    switch (this.config.provider) {
      case 'openai':
        return this.callOpenAI(prompt);
      case 'anthropic':
        return this.callAnthropic(prompt);
      case 'local':
        return this.callLocalAI(prompt);
      default:
        throw new Error(`Unsupported AI provider: ${this.config.provider}`);
    }
  }

  private parseResponseToMindMap(response: string): MindNode[] {
    // Parse the AI response into mind map structure
    // Using existing textToMindMap utility
    const lines = response.split('\n').filter(line => line.trim());
    const mindMap = textToMindMap(lines.join('\n'));
    return mindMap?.root.children || [];
  }
}
```

#### 2.2 OpenAI Integration
```typescript
// src/services/openai.ts
export const callOpenAI = async (prompt: string, config: AIConfig): Promise<string> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'user', content: prompt },
      ],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
};
```

### Phase 3: UI Components and Integration

#### 3.1 AI Prompt Dialog Component
```typescript
// src/components/AIPromptDialog.tsx
interface AIPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string) => void;
  isLoading: boolean;
  error?: string;
}

export const AIPromptDialog: React.FC<AIPromptDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
}) => {
  const [question, setQuestion] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <DialogOverlay>
      <DialogContent>
        <h2>Ask AI</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question or content generation request..."
            rows={4}
            disabled={isLoading}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ButtonGroup>
            <Button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !question.trim()}>
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </ButtonGroup>
        </form>
      </DialogContent>
    </DialogOverlay>
  );
};
```

#### 3.2 Store Integration
```typescript
// src/store/mindmapStore.ts
interface MindMapState {
  // ... existing state
  generateAIContent: (path: number[], question: string) => Promise<void>;
  isAILoading: boolean;
  aiError: string | null;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  // ... existing state
  isAILoading: false,
  aiError: null,
  
  generateAIContent: async (path: number[], question: string) => {
    const { mindmap } = get();
    const aiConfig = getAIConfig();
    
    if (!validateAIConfig(aiConfig)) {
      set({ aiError: 'AI configuration is invalid. Please check your environment variables.' });
      return;
    }

    set({ isAILoading: true, aiError: null });

    try {
      const aiService = new AIService(aiConfig);
      const selectedNode = findNode(mindmap.root, path);
      
      if (!selectedNode) {
        throw new Error('Selected node not found');
      }

      const context = {
        selectedNode: selectedNode.text,
        parentNodes: getNodePath(mindmap.root, path).map(node => node.text),
        mindMapContext: mindMapToText({ root: selectedNode }),
      };

      const response = await aiService.generateContent({
        question,
        context,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Add AI-generated content as children to selected node
      const newMindMap = { ...mindmap };
      const targetNode = findNode(newMindMap.root, path);
      if (targetNode) {
        targetNode.children.push(...response.structure);
        set({ 
          mindmap: newMindMap,
          isAILoading: false,
          aiError: null,
        });
      }
    } catch (error) {
      set({ 
        isAILoading: false,
        aiError: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  },
}));
```

#### 3.3 Toolbar Integration
```typescript
// src/components/Toolbar.tsx
export const Toolbar: React.FC = () => {
  const { generateAIContent, isAILoading, aiError } = useMindMapStore();
  const [isAIDialogOpen, setIsAIDialogOpen] = React.useState(false);
  const [selectedPath, setSelectedPath] = React.useState<number[]>([]);

  const handleAIRequest = async (question: string) => {
    await generateAIContent(selectedPath, question);
    setIsAIDialogOpen(false);
  };

  return (
    <ToolbarContainer>
      {/* ... existing toolbar buttons ... */}
      <Button 
        onClick={() => setIsAIDialogOpen(true)}
        disabled={isAILoading}
      >
        {isAILoading ? 'AI Working...' : 'Ask AI'}
      </Button>
      
      <AIPromptDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        onSubmit={handleAIRequest}
        isLoading={isAILoading}
        error={aiError || undefined}
      />
    </ToolbarContainer>
  );
};
```

### Phase 4: Testing Strategy

#### 4.1 Unit Tests
```typescript
// src/services/aiService.test.ts
describe('AIService', () => {
  it('should build context-aware prompts', () => {
    const aiService = new AIService(mockConfig);
    const request: AIRequest = {
      question: 'What are the benefits of remote work?',
      context: {
        selectedNode: 'Work Models',
        parentNodes: ['Company Strategy'],
        mindMapContext: 'Work Models\n\tRemote Work\n\tOffice Work\n\tHybrid',
      },
    };

    const prompt = aiService['buildPrompt'](request);
    expect(prompt).toContain('Work Models');
    expect(prompt).toContain('Company Strategy');
    expect(prompt).toContain('benefits of remote work');
  });

  it('should parse AI responses to mind map structure', () => {
    const aiService = new AIService(mockConfig);
    const response = `Main Benefits
    Flexibility
    Cost Savings
    Better Work-Life Balance
    Increased Productivity`;

    const structure = aiService['parseResponseToMindMap'](response);
    expect(structure).toHaveLength(4);
    expect(structure[0].text).toBe('Flexibility');
  });

  it('should handle AI service errors gracefully', async () => {
    const aiService = new AIService(mockConfig);
    jest.spyOn(aiService as any, 'callAI').mockRejectedValue(new Error('API Error'));

    const response = await aiService.generateContent(mockRequest);
    expect(response.error).toBe('API Error');
    expect(response.structure).toHaveLength(0);
  });
});
```

#### 4.2 Integration Tests
```typescript
// src/store/mindmapStore.ai.test.ts
describe('AI Integration', () => {
  it('should add AI-generated content to selected node', async () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Setup initial mind map
    await act(async () => {
      result.current.addNode([], 'Parent Node');
    });

    // Mock AI service
    const mockAIResponse = {
      content: 'AI Generated Content\n\tChild 1\n\tChild 2',
      structure: [
        { text: 'Child 1', children: [] },
        { text: 'Child 2', children: [] },
      ],
    };

    jest.spyOn(AIService.prototype, 'generateContent')
      .mockResolvedValue(mockAIResponse);

    // Generate AI content
    await act(async () => {
      await result.current.generateAIContent([0], 'Generate children');
    });

    // Verify AI content was added
    expect(result.current.mindmap.root.children[0].children).toHaveLength(2);
    expect(result.current.mindmap.root.children[0].children[0].text).toBe('Child 1');
  });

  it('should handle AI configuration errors', async () => {
    const { result } = renderHook(() => useMindMapStore());
    
    // Test with invalid configuration
    await act(async () => {
      await result.current.generateAIContent([], 'Test question');
    });

    expect(result.current.aiError).toContain('AI configuration is invalid');
  });
});
```

#### 4.3 End-to-End Tests
```typescript
// cypress/e2e/ai-generation.cy.ts
describe('AI Content Generation', () => {
  it('should allow users to generate content with AI', () => {
    cy.visit('/');
    
    // Add a parent node
    cy.contains('Add Node').click();
    cy.get('input[value="New Node"]').clear().type('Project Planning');
    
    // Select the node
    cy.contains('Project Planning').click();
    
    // Open AI dialog
    cy.contains('Ask AI').click();
    
    // Enter question
    cy.get('textarea').type('What are the key phases of project planning?');
    
    // Submit
    cy.contains('Generate').click();
    
    // Verify loading state
    cy.contains('AI Working...').should('be.visible');
    
    // Verify AI-generated content appears
    cy.contains('Initiation').should('be.visible');
    cy.contains('Planning').should('be.visible');
    cy.contains('Execution').should('be.visible');
  });

  it('should handle AI errors gracefully', () => {
    cy.visit('/');
    
    // Mock AI error
    cy.intercept('POST', '**/ai/generate', {
      statusCode: 500,
      body: { error: 'AI service unavailable' },
    });
    
    // Try to generate content
    cy.contains('Ask AI').click();
    cy.get('textarea').type('Test question');
    cy.contains('Generate').click();
    
    // Verify error message
    cy.contains('AI service unavailable').should('be.visible');
  });
});
```

### Phase 5: Documentation and Deployment

#### 5.1 Environment Setup Documentation
```markdown
# AI Configuration Guide

## Prerequisites
- Node.js 16+
- API key for your chosen AI service

## Setup Instructions

1. **Configure Environment Variables**
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your AI configuration
```

2. **Using the Configuration Script**
```bash
# Run the configuration script
./scripts/configure-ai.sh

# This will create a .env file with your configuration
```

3. **Environment Variables**
```
REACT_APP_AI_PROVIDER=openai|anthropic|local
REACT_APP_AI_MODEL=gpt-3.5-turbo|claude-3-sonnet|custom
REACT_APP_AI_API_KEY=your_api_key_here
REACT_APP_AI_BASE_URL=optional_base_url
REACT_APP_AI_MAX_TOKENS=1000
REACT_APP_AI_TEMPERATURE=0.7
```

## Security Notes
- Never commit .env files to version control
- Use different API keys for development and production
- Regularly rotate your API keys
- Monitor API usage and costs
```

#### 5.2 User Documentation
```markdown
# AI Content Generation Guide

## Overview
The mind map application includes AI-powered content generation that allows you to automatically generate structured content based on your questions and the current mind map context.

## How to Use

1. **Select a Parent Node**
   - Click on the node where you want to add AI-generated content
   - The AI will create child nodes under this selected node

2. **Open AI Dialog**
   - Click the "Ask AI" button in the toolbar
   - A dialog will appear where you can enter your question

3. **Enter Your Question**
   - Type your question or content generation request
   - Be specific about what kind of content you want
   - The AI will consider the current mind map context

4. **Generate Content**
   - Click "Generate" to send your request to the AI
   - Wait for the AI to process and generate content
   - The generated content will be automatically added as child nodes

## Example Questions
- "What are the key components of a business plan?"
- "Generate pros and cons for remote work arrangements"
- "What are the main challenges in software development?"
- "Create a breakdown of marketing strategies"

## Tips for Better Results
- Be specific about the type of content you want
- Consider the context of your selected node
- Use clear, concise language
- Ask for structured, hierarchical information when possible

## Troubleshooting
- If you see configuration errors, check your environment variables
- If content generation fails, ensure your API key is valid
- If responses are not useful, try rephrasing your question
```

## Success Criteria

### Security Requirements
- ✅ API keys never exposed in application code or UI
- ✅ Configuration handled through environment variables
- ✅ No sensitive data logged or stored in application
- ✅ Secure communication with AI services

### Functionality Requirements
- ✅ Users can select nodes and generate AI content
- ✅ AI responses are properly parsed into mind map structure
- ✅ Context-aware prompts include relevant mind map information
- ✅ Error handling for AI service failures

### User Experience Requirements
- ✅ Simple, intuitive interface for AI interactions
- ✅ Clear feedback during AI processing
- ✅ Helpful error messages when issues occur
- ✅ Generated content integrates seamlessly with existing mind map

### Technical Requirements
- ✅ Modular architecture supporting multiple AI providers
- ✅ Comprehensive test coverage for AI functionality
- ✅ Performance optimized for AI API calls
- ✅ Documentation for setup and usage

## Implementation Timeline

### Week 1: Foundation (Days 1-5)
- **Day 1-2:** AI configuration and security setup
- **Day 3:** AI service layer implementation
- **Day 4:** Prompt engineering and response parsing
- **Day 5:** Initial testing and validation

### Week 2: Integration (Days 6-10)
- **Day 6-7:** UI components and dialog implementation
- **Day 8:** Store integration and state management
- **Day 9:** Toolbar integration and user flow
- **Day 10:** End-to-end functionality testing

### Week 3: Refinement (Days 11-15)
- **Day 11-12:** Comprehensive testing and bug fixes
- **Day 13:** Performance optimization and error handling
- **Day 14:** Documentation and user guides
- **Day 15:** Final testing and deployment preparation

## Risk Mitigation

### Technical Risks
- **AI Service Reliability:** Implement fallback mechanisms and error handling
- **API Cost Management:** Add usage monitoring and limits
- **Response Quality:** Implement prompt engineering best practices
- **Performance:** Optimize API calls and response processing

### User Experience Risks
- **Discoverability:** Add clear UI indicators and tooltips
- **Error Recovery:** Provide helpful error messages and retry options
- **Content Quality:** Allow users to edit or regenerate AI content
- **Privacy:** Ensure users understand how their data is used

This comprehensive implementation plan ensures that AI content generation is integrated securely, effectively, and user-friendly into the mind map application while maintaining high standards of code quality and user experience.
