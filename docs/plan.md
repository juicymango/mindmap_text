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

---

# Task 25: AI Process Transparency and User Configuration Implementation Plan

## Overview

Task 25 focuses on making the AI process completely transparent to users, allowing them to configure AI settings, see exactly what input and output the AI model receives, and providing clear error information. This enhances user trust and control over the AI functionality.

## Current State Analysis

### Existing AI Implementation
- **Configuration**: Hard-coded environment variables with no user interface
- **Process**: Black-box AI interaction with no visibility into prompts/responses
- **Error Handling**: Basic error messages without detailed context
- **User Control**: Limited to question input only

### Areas for Improvement
1. **Configuration Transparency**: Users cannot see or modify AI settings
2. **Process Visibility**: No insight into what is sent to/received from AI
3. **Error Detailing**: Insufficient error information for troubleshooting
4. **User Control**: No ability to fine-tune AI behavior

## Implementation Plan

### Phase 1: AI Configuration UI

#### 1.1 Configuration Dialog Component
```typescript
// src/components/AIConfigDialog.tsx
interface AIConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AIConfig) => void;
  currentConfig: AIConfig;
}

export const AIConfigDialog: React.FC<AIConfigDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentConfig,
}) => {
  const [config, setConfig] = React.useState(currentConfig);
  const [testStatus, setTestStatus] = React.useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testError, setTestError] = React.useState('');

  const handleTest = async () => {
    setTestStatus('testing');
    try {
      const testService = new AIService(config);
      await testService.generateContent({
        question: 'Test',
        context: { selectedNode: 'Test', parentNodes: [], mindMapContext: 'Test' },
      });
      setTestStatus('success');
    } catch (error) {
      setTestStatus('error');
      setTestError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <DialogOverlay>
      <DialogContent>
        <h2>AI Configuration</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(config);
        }}>
          <ConfigSection>
            <label>Provider</label>
            <select 
              value={config.provider} 
              onChange={(e) => setConfig({...config, provider: e.target.value as any})}
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="local">Local AI</option>
            </select>
          </ConfigSection>

          <ConfigSection>
            <label>Model</label>
            <input 
              type="text" 
              value={config.model} 
              onChange={(e) => setConfig({...config, model: e.target.value})}
              placeholder="e.g., gpt-3.5-turbo"
            />
          </ConfigSection>

          <ConfigSection>
            <label>API Key</label>
            <input 
              type="password" 
              value={config.apiKey || ''} 
              onChange={(e) => setConfig({...config, apiKey: e.target.value})}
              placeholder="Enter your API key"
            />
          </ConfigSection>

          <ConfigSection>
            <label>Max Tokens</label>
            <input 
              type="number" 
              value={config.maxTokens} 
              onChange={(e) => setConfig({...config, maxTokens: parseInt(e.target.value)})}
              min="1"
              max="8000"
            />
          </ConfigSection>

          <ConfigSection>
            <label>Temperature ({config.temperature})</label>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1"
              value={config.temperature} 
              onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
            />
            <TemperatureDisplay>{config.temperature}</TemperatureDisplay>
          </ConfigSection>

          <TestSection>
            <Button type="button" onClick={handleTest} disabled={testStatus === 'testing'}>
              {testStatus === 'testing' ? 'Testing...' : 'Test Configuration'}
            </Button>
            {testStatus === 'success' && <TestSuccess>✓ Configuration works!</TestSuccess>}
            {testStatus === 'error' && <TestError>{testError}</TestError>}
          </TestSection>

          <ButtonGroup>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Configuration</Button>
          </ButtonGroup>
        </form>
      </DialogContent>
    </DialogOverlay>
  );
};
```

#### 1.2 Local Storage Integration
```typescript
// src/utils/aiConfigStorage.ts
export interface StoredAIConfig extends AIConfig {
  lastUpdated: string;
  version: string;
}

export const saveAIConfig = (config: AIConfig): void => {
  const storedConfig: StoredAIConfig = {
    ...config,
    lastUpdated: new Date().toISOString(),
    version: '1.0',
  };
  localStorage.setItem('aiConfig', JSON.stringify(storedConfig));
};

export const loadAIConfig = (): AIConfig | null => {
  try {
    const stored = localStorage.getItem('aiConfig');
    if (stored) {
      const parsed: StoredAIConfig = JSON.parse(stored);
      // Validate required fields
      if (parsed.provider && parsed.model) {
        const { lastUpdated, version, ...config } = parsed;
        return config;
      }
    }
  } catch (error) {
    console.error('Failed to load AI config:', error);
  }
  return null;
};

export const clearAIConfig = (): void => {
  localStorage.removeItem('aiConfig');
};
```

### Phase 2: AI Process Transparency

#### 2.1 Enhanced AI Prompt Dialog with Process Visibility
```typescript
// src/components/AIPromptDialog.tsx (Enhanced)
interface AIPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string) => void;
  isLoading: boolean;
  error?: string;
  aiConfig?: AIConfig;
  showProcessDetails?: boolean;
  lastRequest?: {
    question: string;
    prompt: string;
    response: string;
    timestamp: string;
  };
}

export const AIPromptDialog: React.FC<AIPromptDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  aiConfig,
  showProcessDetails = false,
  lastRequest,
}) => {
  const [question, setQuestion] = React.useState('');
  const [showDetails, setShowDetails] = React.useState(showProcessDetails);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
    }
  };

  return (
    <DialogOverlay>
      <DialogContent>
        <DialogHeader>
          <h2>Ask AI</h2>
          {aiConfig && (
            <ConfigBadge onClick={() => setShowDetails(!showDetails)}>
              {aiConfig.provider} ({aiConfig.model})
              {showDetails ? ' ▲' : ' ▼'}
            </ConfigBadge>
          )}
        </DialogHeader>

        {showDetails && aiConfig && (
          <ConfigDetails>
            <h4>Current AI Configuration</h4>
            <ConfigGrid>
              <div><strong>Provider:</strong></div><div>{aiConfig.provider}</div>
              <div><strong>Model:</strong></div><div>{aiConfig.model}</div>
              <div><strong>Max Tokens:</strong></div><div>{aiConfig.maxTokens}</div>
              <div><strong>Temperature:</strong></div><div>{aiConfig.temperature}</div>
            </ConfigGrid>
          </ConfigDetails>
        )}

        {lastRequest && (
          <ProcessDetails>
            <h4>Last AI Interaction</h4>
            <DetailSection>
              <label>Your Question:</label>
              <QuestionDisplay>{lastRequest.question}</QuestionDisplay>
            </DetailSection>
            <DetailSection>
              <label>Sent to AI:</label>
              <PromptDisplay>{lastRequest.prompt}</PromptDisplay>
            </DetailSection>
            <DetailSection>
              <label>AI Response:</label>
              <ResponseDisplay>{lastRequest.response}</ResponseDisplay>
            </DetailSection>
            <Timestamp>
              Generated: {new Date(lastRequest.timestamp).toLocaleString()}
            </Timestamp>
          </ProcessDetails>
        )}

        <form onSubmit={handleSubmit}>
          <TextArea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question or content generation request..."
            disabled={isLoading}
            autoFocus
          />
          
          <HelperText>
            The AI will consider the selected node context and generate structured content as child nodes.
            {showDetails && ' Click the config badge above to see AI settings.'}
          </HelperText>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {isLoading && (
            <LoadingSection>
              <LoadingSpinner />
              <LoadingText>Generating content with AI...</LoadingText>
            </LoadingSection>
          )}

          <ButtonGroup>
            <Button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </ButtonGroup>
        </form>
      </DialogContent>
    </DialogOverlay>
  );
};
```

#### 2.2 Enhanced Store with Process Tracking
```typescript
// src/store/mindmapStore.ts (Enhanced)
interface MindMapState {
  // ... existing state
  aiConfig: AIConfig;
  lastAIRequest?: {
    question: string;
    prompt: string;
    response: string;
    timestamp: string;
  };
  setAIConfig: (config: AIConfig) => void;
  clearLastAIRequest: () => void;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  // ... existing state
  aiConfig: getAIConfig(),
  
  setAIConfig: (config: AIConfig) => {
    set({ aiConfig: config });
    saveAIConfig(config);
  },

  generateAIContent: async (path: number[], question: string) => {
    const { mindmap, aiConfig } = get();
    
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

      const request = { question, context };
      const prompt = aiService['buildPrompt'](request);
      
      const response = await aiService.generateContent(request);

      if (response.error) {
        throw new Error(response.error);
      }

      // Store the complete AI interaction for transparency
      set({
        lastAIRequest: {
          question,
          prompt,
          response: response.content,
          timestamp: new Date().toISOString(),
        },
      });

      // Add AI-generated content as children to selected node
      const newMindMap = { ...mindmap };
      const targetNode = findNode(newMindMap.root, path);
      if (targetNode) {
        targetNode.children.push(...response.structure);
        get().setSelectedChild(path, targetNode.children.length - 1);
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

  clearLastAIRequest: () => {
    set({ lastAIRequest: undefined });
  },
}));
```

### Phase 3: Enhanced Error Handling

#### 3.1 Detailed Error Messages
```typescript
// src/utils/aiErrorHandling.ts
export interface AIErrorDetails {
  type: 'config' | 'network' | 'api' | 'parse' | 'unknown';
  message: string;
  details?: string;
  suggestions?: string[];
  retryable: boolean;
}

export const analyzeAIError = (error: unknown): AIErrorDetails => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Configuration errors
    if (message.includes('api key') || message.includes('configuration')) {
      return {
        type: 'config',
        message: 'AI Configuration Error',
        details: error.message,
        suggestions: [
          'Check your AI API key in settings',
          'Verify your AI provider configuration',
          'Ensure your account has sufficient credits'
        ],
        retryable: false,
      };
    }
    
    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return {
        type: 'network',
        message: 'Network Connection Error',
        details: error.message,
        suggestions: [
          'Check your internet connection',
          'Verify firewall settings',
          'Try again in a few moments'
        ],
        retryable: true,
      };
    }
    
    // API errors
    if (message.includes('api') || message.includes('401') || message.includes('403')) {
      return {
        type: 'api',
        message: 'AI Service Error',
        details: error.message,
        suggestions: [
          'Verify your API key is valid',
          'Check your API usage limits',
          'Contact AI provider support if issue persists'
        ],
        retryable: false,
      };
    }
  }
  
  // Unknown errors
  return {
    type: 'unknown',
    message: 'Unexpected AI Error',
    details: error instanceof Error ? error.message : 'Unknown error occurred',
    suggestions: [
      'Try refreshing the application',
      'Check your AI configuration',
      'Contact support if the issue persists'
    ],
    retryable: true,
  };
};

export const getAIErrorMessage = (error: unknown): string => {
  const errorDetails = analyzeAIError(error);
  return `${errorDetails.message}: ${errorDetails.details}`;
};

export const shouldRetryAIError = (error: unknown): boolean => {
  const errorDetails = analyzeAIError(error);
  return errorDetails.retryable;
};
```

#### 3.2 Enhanced Error Display Component
```typescript
// src/components/AIErrorDisplay.tsx
interface AIErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onConfigure?: () => void;
}

export const AIErrorDisplay: React.FC<AIErrorDisplayProps> = ({
  error,
  onRetry,
  onConfigure,
}) => {
  const errorDetails = analyzeAIError(error);
  
  return (
    <ErrorContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorContent>
        <ErrorTitle>{errorDetails.message}</ErrorTitle>
        <ErrorDetails>{errorDetails.details}</ErrorDetails>
        
        {errorDetails.suggestions && (
          <Suggestions>
            <SuggestionsTitle>Suggestions:</SuggestionsTitle>
            <ul>
              {errorDetails.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </Suggestions>
        )}
        
        <ErrorActions>
          {errorDetails.retryable && onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          )}
          {errorDetails.type === 'config' && onConfigure && (
            <Button onClick={onConfigure} variant="primary">
              Configure AI Settings
            </Button>
          )}
        </ErrorActions>
      </ErrorContent>
    </ErrorContainer>
  );
};
```

### Phase 4: Toolbar Integration

#### 4.1 Enhanced Toolbar with AI Configuration
```typescript
// src/components/Toolbar.tsx (Enhanced)
export const Toolbar: React.FC = () => {
  const { 
    generateAIContent, 
    isAILoading, 
    aiError, 
    aiConfig,
    setAIConfig,
    clearAIError,
    clearLastAIRequest,
    lastAIRequest,
  } = useMindMapStore();
  
  const [isAIDialogOpen, setIsAIDialogOpen] = React.useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = React.useState(false);

  const handleAIRequest = async (question: string) => {
    await generateAIContent([], question);
    setIsAIDialogOpen(false);
  };

  const handleConfigSave = (config: AIConfig) => {
    setAIConfig(config);
    setIsConfigDialogOpen(false);
    clearAIError();
  };

  const handleRetry = () => {
    clearAIError();
    // User would need to re-enter their question
    setIsAIDialogOpen(true);
  };

  return (
    <ToolbarContainer>
      {/* ... existing toolbar buttons ... */}
      
      <AIButtonGroup>
        <AIConfigButton 
          onClick={() => setIsConfigDialogOpen(true)}
          title={`AI: ${aiConfig.provider} (${aiConfig.model})`}
        >
          ⚙️
        </AIConfigButton>
        
        <Button 
          onClick={() => setIsAIDialogOpen(true)}
          disabled={isAILoading}
        >
          {isAILoading ? 'AI Working...' : 'Ask AI'}
        </Button>
      </AIButtonGroup>
      
      <AIPromptDialog
        isOpen={isAIDialogOpen}
        onClose={() => {
          setIsAIDialogOpen(false);
          clearAIError();
        }}
        onSubmit={handleAIRequest}
        isLoading={isAILoading}
        error={aiError}
        aiConfig={aiConfig}
        lastRequest={lastAIRequest}
      />
      
      <AIConfigDialog
        isOpen={isConfigDialogOpen}
        onClose={() => setIsConfigDialogOpen(false)}
        onSave={handleConfigSave}
        currentConfig={aiConfig}
      />
      
      {aiError && (
        <AIErrorDisplay
          error={aiError}
          onRetry={handleRetry}
          onConfigure={() => setIsConfigDialogOpen(true)}
        />
      )}
    </ToolbarContainer>
  );
};
```

### Phase 5: Testing Strategy

#### 5.1 Configuration Tests
```typescript
// src/components/AIConfigDialog.test.tsx
describe('AIConfigDialog', () => {
  it('should allow users to modify AI configuration', () => {
    const mockOnSave = jest.fn();
    const mockConfig: AIConfig = {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      apiKey: 'test-key',
      maxTokens: 1000,
      temperature: 0.7,
    };

    render(
      <AIConfigDialog
        isOpen={true}
        onClose={jest.fn()}
        onSave={mockOnSave}
        currentConfig={mockConfig}
      />
    );

    // Change provider
    fireEvent.change(screen.getByLabelText('Provider'), {
      target: { value: 'anthropic' },
    });

    // Change model
    fireEvent.change(screen.getByLabelText('Model'), {
      target: { value: 'claude-3-sonnet' },
    });

    // Save configuration
    fireEvent.click(screen.getByText('Save Configuration'));

    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockConfig,
      provider: 'anthropic',
      model: 'claude-3-sonnet',
    });
  });

  it('should test AI configuration and show results', async () => {
    const mockConfig: AIConfig = {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      apiKey: 'test-key',
      maxTokens: 1000,
      temperature: 0.7,
    };

    render(
      <AIConfigDialog
        isOpen={true}
        onClose={jest.fn()}
        onSave={jest.fn()}
        currentConfig={mockConfig}
      />
    );

    // Mock successful test
    jest.spyOn(AIService.prototype, 'generateContent')
      .mockResolvedValue({
        content: 'Test response',
        structure: [],
      });

    fireEvent.click(screen.getByText('Test Configuration'));

    expect(screen.getByText('Testing...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('✓ Configuration works!')).toBeInTheDocument();
    });
  });
});
```

#### 5.2 Process Transparency Tests
```typescript
// src/components/AIPromptDialog.test.tsx (Enhanced)
describe('AIPromptDialog Process Transparency', () => {
  it('should show AI configuration details when expanded', () => {
    const mockConfig: AIConfig = {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      apiKey: 'test-key',
      maxTokens: 1000,
      temperature: 0.7,
    };

    render(
      <AIPromptDialog
        isOpen={true}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        isLoading={false}
        aiConfig={mockConfig}
        showProcessDetails={true}
      />
    );

    expect(screen.getByText('Current AI Configuration')).toBeInTheDocument();
    expect(screen.getByText('openai')).toBeInTheDocument();
    expect(screen.getByText('gpt-3.5-turbo')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('0.7')).toBeInTheDocument();
  });

  it('should display last AI interaction details', () => {
    const mockLastRequest = {
      question: 'What are the benefits of remote work?',
      prompt: 'You are an AI assistant... [full prompt]',
      response: 'Flexibility\nCost Savings\nWork-Life Balance',
      timestamp: '2024-01-01T12:00:00Z',
    };

    render(
      <AIPromptDialog
        isOpen={true}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        isLoading={false}
        lastRequest={mockLastRequest}
      />
    );

    expect(screen.getByText('Last AI Interaction')).toBeInTheDocument();
    expect(screen.getByText('What are the benefits of remote work?')).toBeInTheDocument();
    expect(screen.getByText('Flexibility')).toBeInTheDocument();
    expect(screen.getByText('Generated:')).toBeInTheDocument();
  });
});
```

#### 5.3 Error Handling Tests
```typescript
// src/utils/aiErrorHandling.test.ts
describe('AI Error Handling', () => {
  it('should analyze configuration errors correctly', () => {
    const configError = new Error('Invalid API key provided');
    const errorDetails = analyzeAIError(configError);

    expect(errorDetails.type).toBe('config');
    expect(errorDetails.retryable).toBe(false);
    expect(errorDetails.suggestions).toContain('Check your AI API key in settings');
  });

  it('should analyze network errors correctly', () => {
    const networkError = new Error('Network request failed');
    const errorDetails = analyzeAIError(networkError);

    expect(errorDetails.type).toBe('network');
    expect(errorDetails.retryable).toBe(true);
    expect(errorDetails.suggestions).toContain('Check your internet connection');
  });

  it('should provide actionable error messages', () => {
    const error = new Error('API key invalid');
    const errorMessage = getAIErrorMessage(error);

    expect(errorMessage).toContain('AI Configuration Error');
    expect(errorMessage).toContain('API key invalid');
  });
});
```

### Phase 6: Documentation Updates

#### 6.1 User Guide Updates
```markdown
# AI Configuration and Usage Guide

## AI Configuration

### Accessing AI Settings
1. Click the gear icon (⚙️) next to the "Ask AI" button in the toolbar
2. The AI Configuration dialog will open

### Configuration Options
- **Provider**: Choose your AI service (OpenAI, Anthropic, Local)
- **Model**: Enter the specific model name (e.g., gpt-3.5-turbo, claude-3-sonnet)
- **API Key**: Your service API key (stored locally, never shared)
- **Max Tokens**: Maximum response length (100-8000)
- **Temperature**: Creativity level (0.0-2.0, where 2.0 is most creative)

### Testing Configuration
- Click "Test Configuration" to verify your settings work
- Success: Green checkmark appears
- Error: Detailed error message with suggestions

## AI Process Transparency

### Viewing AI Interactions
1. Open the "Ask AI" dialog
2. Click the configuration badge to see current settings
3. After generating content, view the last interaction details

### Understanding AI Input/Output
- **Your Question**: Exactly what you typed
- **Sent to AI**: The complete prompt including mind map context
- **AI Response**: The raw response from the AI service

## Error Resolution

### Common Issues and Solutions
1. **Configuration Errors**
   - Check API key validity
   - Verify account credits/limits
   - Ensure correct model name

2. **Network Errors**
   - Check internet connection
   - Verify firewall settings
   - Try again later

3. **API Errors**
   - Verify API key permissions
   - Check usage limits
   - Contact provider support

### Getting Help
- Use the "Configure AI Settings" button in error messages
- Review the detailed error suggestions
- Check your AI provider's documentation
```

## Success Criteria

### Transparency Requirements
- ✅ Users can view and modify all AI configuration settings
- ✅ Complete AI interaction history is available for inspection
- ✅ Detailed error messages with actionable suggestions
- ✅ Real-time configuration testing and validation

### Usability Requirements
- ✅ Intuitive configuration interface with clear labels
- ✅ One-click access to AI settings and process details
- ✅ Contextual help and error resolution guidance
- ✅ Persistent configuration storage with user control

### Technical Requirements
- ✅ Local storage for user preferences (no server dependency)
- ✅ Comprehensive error analysis and handling
- ✅ Modular components for easy maintenance
- ✅ Full test coverage for new transparency features

### Security Requirements
- ✅ API keys stored locally with user control
- ✅ No sensitive data logged or exposed
- ✅ Clear privacy indicators for AI interactions
- ✅ User control over data retention

## Implementation Timeline

### Week 1: Foundation (Days 1-5)
- **Day 1-2**: Configuration dialog and storage implementation
- **Day 3**: Enhanced prompt dialog with transparency features
- **Day 4**: Error handling and analysis system
- **Day 5**: Store integration and state management

### Week 2: Integration (Days 6-10)
- **Day 6-7**: Toolbar integration and UI updates
- **Day 8**: Process visibility and interaction tracking
- **Day 9**: Enhanced error display and user guidance
- **Day 10**: Initial testing and refinement

### Week 3: Polish (Days 11-15)
- **Day 11-12**: Comprehensive testing and bug fixes
- **Day 13**: Performance optimization and user experience refinement
- **Day 14**: Documentation updates and user guides
- **Day 15**: Final testing, deployment preparation, and release

## Risk Mitigation

### Technical Risks
- **Configuration Complexity**: Provide clear defaults and validation
- **Performance Impact**: Optimize storage and rendering of process details
- **Browser Compatibility**: Test across different browsers and devices
- **Data Storage**: Implement robust local storage with fallbacks

### User Experience Risks
- **Information Overload**: Make transparency features optional and progressive
- **Configuration Confusion**: Provide clear guidance and validation
- **Error Anxiety**: Offer helpful suggestions and easy resolution paths
- **Privacy Concerns**: Be transparent about data usage and storage

This implementation plan ensures that users have complete visibility and control over the AI process while maintaining a clean, intuitive interface that doesn't overwhelm with technical details. The phased approach allows for incremental improvement while preserving the existing functionality.

---

# Task 27: AI Provider Expansion and UI Improvements Implementation Plan

## Overview

Task 27 focuses on expanding AI provider support, fixing critical bugs, and streamlining the user interface by removing redundant functionality. This enhancement will improve the versatility and usability of the mind map application.

## Current State Analysis

### Existing AI Implementation
- **Supported Providers**: OpenAI, Anthropic, Local AI
- **Configuration**: User-friendly dialog with localStorage persistence
- **Process**: Transparent AI interaction with input/output visibility
- **Error Handling**: Comprehensive error analysis with actionable suggestions

### Areas for Improvement
1. **Provider Limitation**: Missing support for popular Chinese AI models
2. **Paste Bug**: Root node content is discarded during paste operations
3. **UI Clutter**: Save/Load buttons are redundant with Save As/Load As functionality

## Implementation Plan

### Phase 1: AI Provider Expansion

#### 1.1 New AI Provider Integration
```typescript
// src/config/ai.ts (Enhanced)
export type AIProvider = 'openai' | 'anthropic' | 'local' | 'deepseek' | 'glm' | 'kimi' | 'qwen';

export interface AIProviderConfig {
  name: string;
  baseUrl?: string;
  models: string[];
  defaultModel: string;
  maxTokens: {
    min: number;
    max: number;
    default: number;
  };
  temperature: {
    min: number;
    max: number;
    default: number;
  };
  supportsApiKey: boolean;
  documentation: string;
}

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o'],
    defaultModel: 'gpt-3.5-turbo',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 2, default: 0.7 },
    supportsApiKey: true,
    documentation: 'https://platform.openai.com/docs/api-reference'
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-3-sonnet-20240229', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    defaultModel: 'claude-3-sonnet-20240229',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 1, default: 0.7 },
    supportsApiKey: true,
    documentation: 'https://docs.anthropic.com/claude/docs'
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    models: ['deepseek-chat', 'deepseek-coder'],
    defaultModel: 'deepseek-chat',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 2, default: 0.7 },
    supportsApiKey: true,
    documentation: 'https://platform.deepseek.com/'
  },
  glm: {
    name: 'GLM',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: ['glm-4', 'glm-3-turbo', 'glm-4v'],
    defaultModel: 'glm-4',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 1, default: 0.7 },
    supportsApiKey: true,
    documentation: 'https://open.bigmodel.cn/'
  },
  kimi: {
    name: 'Kimi',
    baseUrl: 'https://api.moonshot.cn/v1',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    defaultModel: 'moonshot-v1-8k',
    maxTokens: { min: 1, max: 128000, default: 1000 },
    temperature: { min: 0, max: 1, default: 0.3 },
    supportsApiKey: true,
    documentation: 'https://platform.moonshot.cn/docs/'
  },
  qwen: {
    name: 'Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-max-longcontext'],
    defaultModel: 'qwen-turbo',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 2, default: 0.7 },
    supportsApiKey: true,
    documentation: 'https://help.aliyun.com/zh/dashscope/'
  },
  local: {
    name: 'Local AI',
    models: [],
    defaultModel: '',
    maxTokens: { min: 1, max: 8000, default: 1000 },
    temperature: { min: 0, max: 2, default: 0.7 },
    supportsApiKey: false,
    documentation: ''
  }
};
```

#### 1.2 Enhanced AI Service
```typescript
// src/services/aiService.ts (Enhanced)
export class AIService {
  private config: AIConfig;
  private providerConfig: AIProviderConfig;

  constructor(config: AIConfig) {
    this.config = config;
    this.providerConfig = AI_PROVIDERS[config.provider];
  }

  async generateContent(request: AIRequest): Promise<AIResponse> {
    const prompt = this.buildPrompt(request);
    
    try {
      let response;
      switch (this.config.provider) {
        case 'openai':
          response = await this.callOpenAI(prompt);
          break;
        case 'anthropic':
          response = await this.callAnthropic(prompt);
          break;
        case 'deepseek':
          response = await this.callDeepSeek(prompt);
          break;
        case 'glm':
          response = await this.callGLM(prompt);
          break;
        case 'kimi':
          response = await this.callKimi(prompt);
          break;
        case 'qwen':
          response = await this.callQwen(prompt);
          break;
        case 'local':
          response = await this.callLocal(prompt);
          break;
        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }

      return this.parseResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async callDeepSeek(prompt: string): Promise<any> {
    const response = await fetch(`${this.providerConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async callGLM(prompt: string): Promise<any> {
    const response = await fetch(`${this.providerConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`GLM API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async callKimi(prompt: string): Promise<any> {
    const response = await fetch(`${this.providerConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async callQwen(prompt: string): Promise<any> {
    const response = await fetch(this.providerConfig.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        input: {
          messages: [{ role: 'user', content: prompt }],
        },
        parameters: {
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
```

#### 1.3 Updated AI Configuration Dialog
```typescript
// src/components/AIConfigDialog.tsx (Enhanced)
export const AIConfigDialog: React.FC<AIConfigDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentConfig,
}) => {
  const [config, setConfig] = React.useState(currentConfig);
  const [testStatus, setTestStatus] = React.useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testError, setTestError] = React.useState('');
  
  const providerConfig = AI_PROVIDERS[config.provider];

  const handleProviderChange = (provider: AIProvider) => {
    const newProviderConfig = AI_PROVIDERS[provider];
    setConfig({
      ...config,
      provider,
      model: newProviderConfig.defaultModel,
      maxTokens: newProviderConfig.maxTokens.default,
      temperature: newProviderConfig.temperature.default,
      baseUrl: provider === 'local' ? config.baseUrl : undefined,
    });
  };

  return (
    <DialogOverlay>
      <DialogContent>
        <h2>AI Configuration</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(config);
        }}>
          <ConfigSection>
            <label>Provider</label>
            <select 
              value={config.provider} 
              onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
            >
              {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                <option key={key} value={key}>
                  {provider.name}
                </option>
              ))}
            </select>
          </ConfigSection>

          <ConfigSection>
            <label>Model</label>
            {providerConfig.models.length > 0 ? (
              <select 
                value={config.model} 
                onChange={(e) => setConfig({...config, model: e.target.value})}
              >
                {providerConfig.models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            ) : (
              <input 
                type="text" 
                value={config.model} 
                onChange={(e) => setConfig({...config, model: e.target.value})}
                placeholder="Enter model name"
              />
            )}
          </ConfigSection>

          {providerConfig.supportsApiKey && (
            <ConfigSection>
              <label>API Key</label>
              <input 
                type="password" 
                value={config.apiKey || ''} 
                onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                placeholder="Enter your API key"
              />
            </ConfigSection>
          )}

          {config.provider === 'local' && (
            <ConfigSection>
              <label>Base URL</label>
              <input 
                type="text" 
                value={config.baseUrl || ''} 
                onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
                placeholder="http://localhost:8000"
              />
            </ConfigSection>
          )}

          <ConfigSection>
            <label>Max Tokens ({config.maxTokens})</label>
            <input 
              type="range" 
              min={providerConfig.maxTokens.min}
              max={providerConfig.maxTokens.max}
              value={config.maxTokens} 
              onChange={(e) => setConfig({...config, maxTokens: parseInt(e.target.value)})}
            />
            <TokenDisplay>{config.maxTokens}</TokenDisplay>
          </ConfigSection>

          <ConfigSection>
            <label>Temperature ({config.temperature})</label>
            <input 
              type="range" 
              min={providerConfig.temperature.min}
              max={providerConfig.temperature.max}
              step="0.1"
              value={config.temperature} 
              onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
            />
            <TemperatureDisplay>{config.temperature}</TemperatureDisplay>
          </ConfigSection>

          <HelperText>
            Models available for {providerConfig.name}: {providerConfig.models.join(', ') || 'Custom models'}
          </HelperText>

          <TestSection>
            <Button type="button" onClick={handleTest} disabled={testStatus === 'testing'}>
              {testStatus === 'testing' ? 'Testing...' : 'Test Configuration'}
            </Button>
            {testStatus === 'success' && <TestSuccess>✓ Configuration works!</TestSuccess>}
            {testStatus === 'error' && <TestError>{testError}</TestError>}
          </TestSection>

          <ButtonGroup>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Configuration</Button>
          </ButtonGroup>
        </form>
      </DialogContent>
    </DialogOverlay>
  );
};
```

### Phase 2: Paste Bug Fix

#### 2.1 Root Node Preservation in Paste
```typescript
// src/store/mindmapStore.ts (Enhanced)
export const useMindMapStore = create<MindMapState>((set, get) => ({
  // ... existing state
  
  pasteNode: async (path: number[]) => {
    const { mindmap } = get();
    
    try {
      let clipboardContent;
      
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.readText) {
        clipboardContent = await navigator.clipboard.readText();
      } else {
        // Fallback to older method
        clipboardContent = await new Promise((resolve, reject) => {
          const textarea = document.createElement('textarea');
          textarea.value = '';
          document.body.appendChild(textarea);
          textarea.select();
          
          const success = document.execCommand('paste');
          document.body.removeChild(textarea);
          
          if (success) {
            resolve(textarea.value);
          } else {
            reject(new Error('Failed to paste from clipboard'));
          }
        });
      }
      
      if (!clipboardContent.trim()) {
        return; // Empty clipboard
      }
      
      // Parse clipboard content as mind map structure
      const parsedMindMap = textToMindMap(clipboardContent);
      
      // Create new mind map with updated structure
      const newMindMap = { ...mindmap };
      const targetNode = findNode([newMindMap.root], path);
      
      if (targetNode) {
        // Handle root node preservation
        if (parsedMindMap.root) {
          // If clipboard has a single root node, add its children as siblings
          if (parsedMindMap.root.children && parsedMindMap.root.children.length > 0) {
            targetNode.children.push(...parsedMindMap.root.children);
            
            // If this is the actual root node being pasted, also copy the root text
            if (path.length === 0 && parsedMindMap.root.text !== 'Root') {
              targetNode.text = parsedMindMap.root.text;
            }
          } else {
            // If root has no children, create a new node with the root text
            if (parsedMindMap.root.text && parsedMindMap.root.text !== 'Root') {
              targetNode.children.push({
                text: parsedMindMap.root.text,
                children: []
              });
            }
          }
        } else {
          // Fallback: treat entire content as a single node
          targetNode.children.push({
            text: clipboardContent.trim(),
            children: []
          });
        }
        
        get().setSelectedChild(path, targetNode.children.length - 1);
        set({ mindmap: newMindMap });
      }
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
      // Optionally show error to user
    }
  },
}));
```

### Phase 3: UI Streamlining

#### 3.1 Remove Save/Load Buttons
```typescript
// src/components/Toolbar.tsx (Enhanced)
export const Toolbar: React.FC = () => {
  // ... existing state
  
  return (
    <ToolbarContainer>
      <ButtonGroup>
        <Button onClick={handleSaveAsJSON}>
          Save As JSON
        </Button>
        <Button onClick={handleSaveAsText}>
          Save As Text
        </Button>
        <Button onClick={handleLoadAs}>
          Load As
        </Button>
      </ButtonGroup>
      
      {/* ... existing AI buttons and other UI */}
      
      <CurrentFilePath>
        {jsonFilePath || textFilePath || 'No file selected'}
      </CurrentFilePath>
    </ToolbarContainer>
  );
};
```

### Phase 4: Testing Strategy

#### 4.1 AI Provider Tests
```typescript
// src/components/AIConfigDialog.test.tsx (Enhanced)
describe('AIConfigDialog with new providers', () => {
  const providers = ['openai', 'anthropic', 'deepseek', 'glm', 'kimi', 'qwen', 'local'];
  
  providers.forEach(provider => {
    it(`should handle ${provider} provider configuration`, () => {
      const mockOnSave = jest.fn();
      const mockConfig: AIConfig = {
        provider: provider as any,
        model: 'test-model',
        apiKey: 'test-key',
        maxTokens: 1000,
        temperature: 0.7,
      };

      render(
        <AIConfigDialog
          isOpen={true}
          onClose={jest.fn()}
          onSave={mockOnSave}
          currentConfig={mockConfig}
        />
      );

      expect(screen.getByText(AI_PROVIDERS[provider as any].name)).toBeInTheDocument();
    });
  });

  it('should show correct models for each provider', () => {
    const mockOnSave = jest.fn();
    const mockConfig: AIConfig = {
      provider: 'deepseek',
      model: 'deepseek-chat',
      apiKey: 'test-key',
      maxTokens: 1000,
      temperature: 0.7,
    };

    render(
      <AIConfigDialog
        isOpen={true}
        onClose={jest.fn()}
        onSave={mockOnSave}
        currentConfig={mockConfig}
      />
    );

    expect(screen.getByText('deepseek-chat')).toBeInTheDocument();
    expect(screen.getByText('deepseek-coder')).toBeInTheDocument();
  });
});
```

#### 4.2 Paste Bug Tests
```typescript
// src/store/mindmapStore.test.ts (Enhanced)
describe('MindMapStore paste functionality', () => {
  it('should preserve root node content when pasting', async () => {
    const { result } = renderHook(() => useMindMapStore(), {
      wrapper: StoreProvider,
    });

    // Mock clipboard with root content
    const clipboardContent = 'Root Node\n\tChild 1\n\tChild 2';
    Object.assign(navigator, {
      clipboard: {
        readText: jest.fn().mockResolvedValue(clipboardContent),
      },
    });

    // Setup initial mindmap
    act(() => {
      result.current.setMindmap({
        root: { text: 'Original Root', children: [] },
      });
    });

    // Paste at root level
    await act(async () => {
      await result.current.pasteNode([]);
    });

    expect(result.current.mindmap.root.text).toBe('Root Node'); // Root text preserved
    expect(result.current.mindmap.root.children).toHaveLength(2); // Children added
  });

  it('should handle empty clipboard gracefully', async () => {
    const { result } = renderHook(() => useMindMapStore(), {
      wrapper: StoreProvider,
    });

    // Mock empty clipboard
    Object.assign(navigator, {
      clipboard: {
        readText: jest.fn().mockResolvedValue(''),
      },
    });

    // Setup initial mindmap
    act(() => {
      result.current.setMindmap({
        root: { text: 'Root', children: [] },
      });
    });

    // Attempt paste
    await act(async () => {
      await result.current.pasteNode([]);
    });

    // Mindmap should remain unchanged
    expect(result.current.mindmap.root.children).toHaveLength(0);
  });
});
```

### Phase 5: Implementation Timeline

#### Week 1: Foundation (Days 1-3)
- **Day 1**: AI provider expansion and configuration updates
- **Day 2**: Enhanced AI service with new provider support
- **Day 3**: Paste bug fixing and testing

#### Week 1: Integration (Days 4-5)
- **Day 4**: UI streamlining and button removal
- **Day 5**: Comprehensive testing and documentation updates

## Success Criteria

### Functional Requirements
- ✅ Support for DeepSeek, GLM, Kimi, and Qwen AI providers
- ✅ Root node preservation during paste operations
- ✅ Clean UI with only Save As/Load As buttons
- ✅ Comprehensive test coverage for new features

### Technical Requirements
- ✅ TypeScript compilation without errors
- ✅ All tests passing
- ✅ Backward compatibility maintained
- ✅ Performance optimizations for new providers

### User Experience Requirements
- ✅ Intuitive provider selection with model suggestions
- ✅ Seamless paste functionality with root preservation
- ✅ Streamlined interface without redundant controls
- ✅ Clear documentation for new features

This implementation plan ensures that the mind map application becomes more versatile with expanded AI provider support while fixing critical usability issues and streamlining the user interface.

---

## Task 28: Paste Bug Fix and AI Config Custom Model Input

### Overview
Task 28 addresses two critical issues:
1. **Paste Bug Fix**: Root content in clipboard is currently discarded - should be added as last child of chosen node
2. **AI Config Enhancement**: Allow custom model name input instead of limiting to dropdown selection

### Phase 1: Paste Bug Fix

#### 1.1 Current Problem Analysis
The current paste implementation in `mindmapStore.ts` has a logic flaw where root content from clipboard is being discarded instead of being preserved and added as a child node.

#### 1.2 Solution Design
```typescript
// src/store/mindmapStore.ts (Enhanced pasteNode method)
pasteNode: async (path: number[]) => {
  try {
    let clipboardContent = '';
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.readText) {
      clipboardContent = await navigator.clipboard.readText();
    } else {
      // Fallback to document.execCommand
      const textArea = document.createElement('textarea');
      textArea.value = '';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      if (document.execCommand('paste')) {
        clipboardContent = textArea.value;
      }
      
      document.body.removeChild(textArea);
    }

    if (!clipboardContent.trim()) {
      return; // Empty clipboard
    }

    const parsedMindMap = textToMindMap(clipboardContent);
    if (!parsedMindMap) {
      return; // Invalid content
    }

    const newMindMap = { ...get().mindmap };
    const targetNode = findNode(newMindMap.root, path);
    
    if (!targetNode) {
      return; // Target not found
    }

    // FIXED: Always preserve root content and add as child
    if (path.length === 0) {
      // Pasting to root node - preserve root text, add children
      if (parsedMindMap.root.children.length > 0) {
        targetNode.children.push(...parsedMindMap.root.children);
      } else {
        // If clipboard has only root with no children, add root as child
        targetNode.children.push({
          text: parsedMindMap.root.text,
          children: []
        });
      }
    } else {
      // Pasting to non-root node - add all content as children
      if (parsedMindMap.root.children.length > 0) {
        targetNode.children.push(...parsedMindMap.root.children);
      } else {
        // If clipboard has only root with no children, add root as child
        targetNode.children.push({
          text: parsedMindMap.root.text,
          children: []
        });
      }
    }
    
    get().setSelectedChild(path, targetNode.children.length - 1);
    set({ mindmap: newMindMap });
  } catch (error) {
    console.error('Failed to paste from clipboard:', error);
  }
},
```

#### 1.3 Test Cases for Paste Bug Fix
```typescript
// src/store/mindmapStore.test.ts (Enhanced tests)
describe('Enhanced paste functionality', () => {
  it('should preserve root content when pasting to root node', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Mock clipboard with root and children
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Root Content\n\tChild 1\n\tChild 2');

    await act(async () => {
      await result.current.pasteNode([]);
    });

    expect(result.current.mindmap.root.text).toBe('Root'); // Original root preserved
    expect(result.current.mindmap.root.children).toHaveLength(2); // Children added
    expect(result.current.mindmap.root.children[0].text).toBe('Child 1');
    expect(result.current.mindmap.root.children[1].text).toBe('Child 2');
  });

  it('should add standalone root as child when pasting to root', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Mock clipboard with standalone root (no children)
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Standalone Root');

    await act(async () => {
      await result.current.pasteNode([]);
    });

    expect(result.current.mindmap.root.text).toBe('Root'); // Original root preserved
    expect(result.current.mindmap.root.children).toHaveLength(1); // Added as child
    expect(result.current.mindmap.root.children[0].text).toBe('Standalone Root');
  });

  it('should add root content as children when pasting to non-root node', async () => {
    const { result } = renderHook(() => useMindMapStore());

    // Setup target node
    act(() => {
      result.current.addNode([], 'Target Node');
    });

    // Mock clipboard with root and children
    (navigator.clipboard.readText as jest.Mock).mockResolvedValue('Root Content\n\tChild 1\n\tChild 2');

    await act(async () => {
      await result.current.pasteNode([0]);
    });

    expect(result.current.mindmap.root.children[0].text).toBe('Target Node'); // Target preserved
    expect(result.current.mindmap.root.children[0].children).toHaveLength(2); // Children added
    expect(result.current.mindmap.root.children[0].children[0].text).toBe('Child 1');
    expect(result.current.mindmap.root.children[0].children[1].text).toBe('Child 2');
  });
});
```

### Phase 2: AI Config Custom Model Input

#### 2.1 Current Problem Analysis
The current AI configuration dialog only allows model selection from a predefined dropdown, limiting users to the models we've explicitly configured.

#### 2.2 Solution Design
```typescript
// src/components/AIConfigDialog.tsx (Enhanced with custom model input)
export const AIConfigDialog: React.FC<AIConfigDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentConfig,
}) => {
  const [config, setConfig] = useState<AIConfig>(currentConfig);
  const [useCustomModel, setUseCustomModel] = useState(false);

  const selectedProvider = AI_PROVIDERS[config.provider];
  const models = selectedProvider?.models || [];

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogTitle>AI Configuration</DialogTitle>
      <DialogContent>
        <FormGroup>
          <Label>Provider</Label>
          <Select
            value={config.provider}
            onChange={(e) => {
              const provider = e.target.value as AIProvider;
              const selectedProvider = AI_PROVIDERS[provider];
              setConfig({
                ...config,
                provider,
                model: selectedProvider?.models[0] || '',
              });
              setUseCustomModel(false);
            }}
          >
            {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
              <option key={key} value={key}>
                {provider.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Model</Label>
          {!useCustomModel && models.length > 0 && (
            <Select
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
            >
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </Select>
          )}
          {useCustomModel || models.length === 0 ? (
            <Input
              type="text"
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              placeholder="Enter custom model name"
            />
          ) : null}
          {models.length > 0 && (
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                checked={useCustomModel}
                onChange={(e) => setUseCustomModel(e.target.checked)}
              />
              <CheckboxLabel>Use custom model name</CheckboxLabel>
            </CheckboxContainer>
          )}
        </FormGroup>

        {/* ... existing fields for apiKey, maxTokens, temperature */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} primary>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

#### 2.3 Test Cases for Custom Model Input
```typescript
// src/components/AIConfigDialog.test.tsx (Enhanced tests)
describe('AIConfigDialog with custom model input', () => {
  it('should allow custom model input when checkbox is checked', () => {
    const mockOnSave = jest.fn();
    const mockConfig: AIConfig = {
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'test-key',
      maxTokens: 1000,
      temperature: 0.7,
    };

    render(
      <AIConfigDialog
        isOpen={true}
        onClose={jest.fn()}
        onSave={mockOnSave}
        currentConfig={mockConfig}
      />
    );

    // Enable custom model input
    const checkbox = screen.getByLabelText('Use custom model name');
    fireEvent.click(checkbox);

    // Should show text input instead of select
    expect(screen.getByPlaceholderText('Enter custom model name')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('gpt-4')).not.toBeInTheDocument();

    // Should be able to enter custom model name
    const input = screen.getByPlaceholderText('Enter custom model name');
    fireEvent.change(input, { target: { value: 'gpt-4-turbo-preview' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockConfig,
      model: 'gpt-4-turbo-preview',
    });
  });

  it('should show custom input by default for providers with no predefined models', () => {
    const mockOnSave = jest.fn();
    const mockConfig: AIConfig = {
      provider: 'local',
      model: 'custom-model',
      apiKey: '',
      maxTokens: 1000,
      temperature: 0.7,
    };

    render(
      <AIConfigDialog
        isOpen={true}
        onClose={jest.fn()}
        onSave={mockOnSave}
        currentConfig={mockConfig}
      />
    );

    // Should show text input directly for providers with no models
    expect(screen.getByPlaceholderText('Enter custom model name')).toBeInTheDocument();
    expect(screen.queryByLabelText('Use custom model name')).not.toBeInTheDocument();
  });
});
```

### Phase 3: Implementation Strategy

#### 3.1 Implementation Order
1. **Priority 1**: Fix paste bug (critical usability issue)
2. **Priority 2**: Add custom model input (feature enhancement)
3. **Priority 3**: Update tests and documentation

#### 3.2 Risk Assessment
- **Low Risk**: Paste bug fix is well-contained and has clear test cases
- **Medium Risk**: Custom model input requires UI changes but maintains backward compatibility
- **No Breaking Changes**: Both changes enhance existing functionality without removing features

### Phase 4: Testing Strategy

#### 4.1 Paste Functionality Tests
- Test root content preservation when pasting to root
- Test standalone root addition as child
- Test root content addition as children to non-root nodes
- Test edge cases (empty clipboard, invalid content)

#### 4.2 AI Config Tests
- Test custom model input functionality
- Test checkbox toggle behavior
- Test provider switching with custom models
- Test validation and error handling

#### 4.3 Integration Tests
- Test complete paste workflow with clipboard operations
- Test AI configuration with custom models
- Test backward compatibility with existing configurations

### Phase 5: Implementation Timeline

#### Day 1: Paste Bug Fix
- **Morning**: Analyze current paste implementation and identify root cause
- **Afternoon**: Implement fix and write comprehensive tests
- **Evening**: Verify fix works with all clipboard scenarios

#### Day 2: AI Config Enhancement
- **Morning**: Design custom model input UI
- **Afternoon**: Implement custom model functionality
- **Evening**: Test with all providers and edge cases

#### Day 3: Finalization
- **Morning**: Update documentation files
- **Afternoon**: Run comprehensive test suite
- **Evening**: Final verification and commit

## Success Criteria

### Functional Requirements
- ✅ Root content from clipboard is preserved and added as last child
- ✅ Custom model names can be entered for any AI provider
- ✅ All existing functionality remains intact
- ✅ Comprehensive test coverage for new features

### Technical Requirements
- ✅ TypeScript compilation without errors
- ✅ All tests passing
- ✅ No breaking changes to existing API
- ✅ Proper error handling and user feedback

### User Experience Requirements
- ✅ Intuitive paste behavior that preserves user content
- ✅ Flexible AI configuration with custom model support
- ✅ Clear UI indicators for custom model input
- ✅ Seamless integration with existing workflow

This implementation plan addresses both critical issues in Task 28 while maintaining backward compatibility and providing enhanced functionality for users.

# Node Color Coding Implementation Plan - Task 42

## Overview
This plan outlines the implementation of color-coded nodes to enhance visual hierarchy and user experience in the mind map application. The feature will use different colors to distinguish between:

1. **Selected Node** - The currently focused/active node
2. **Nodes on Selected Path** - Ancestor nodes in the selection hierarchy  
3. **Nodes with Children** - Parent nodes that can be expanded
4. **Nodes without Children** - Leaf nodes

## Color Scheme Design

### Visual Design Strategy
- **Accessibility**: Ensure color contrast ratios meet WCAG 2.1 AA standards
- **Consistency**: Use a cohesive color palette that maintains visual hierarchy
- **Intuitiveness**: Colors should communicate node state at a glance

### Proposed Color Palette

| Node Type | Background Color | Border Color | Text Color | Usage |
|-----------|------------------|--------------|------------|--------|
| **Selected Node** | `#4A90E2` (Blue) | `#357ABD` (Dark Blue) | White | Active/focused node |
| **On Selected Path** | `#E8F4FD` (Light Blue) | `#B8D4F1` (Medium Blue) | `#333333` | Ancestor nodes |
| **With Children** | `#F8F9FA` (Light Gray) | `#DEE2E6` (Gray) | `#333333` | Parent nodes |
| **Without Children** | `FFFFFF` (White) | `#DEE2E6` (Gray) | `#333333` | Leaf nodes |

### Visual Hierarchy
1. **Selected Node** - Strongest visual emphasis (high contrast)
2. **On Selected Path** - Subtle blue tint to show relationship
3. **With Children** - Slightly different background to indicate expandability
4. **Without Children** - Clean white background for leaf nodes

## Implementation Strategy

### Phase 1: Node State Detection
1. **Enhance Node Props Interface**
   - Add prop to indicate if node is on selected path
   - Add prop to indicate if node has children
   - Maintain backward compatibility

2. **Create Node State Utilities**
   - `isNodeOnSelectedPath(path: number[], selectedPath: number[]): boolean`
   - `hasChildren(node: MindNode): boolean`
   - `isNodeSelected(path: number[], selectedPath: number[]): boolean`

### Phase 2: Styling System
1. **Enhanced Styled Components**
   - Update `NodeContainer` to accept multiple state props
   - Create dynamic styling based on node states
   - Ensure responsive design

2. **Color Theme System**
   - Define color constants for easy maintenance
   - Add hover states for better interactivity
   - Ensure dark mode compatibility (future-proofing)

### Phase 3: Integration
1. **Update Node Component**
   - Import and use new utilities
   - Pass state props to styled component
   - Maintain existing functionality

2. **Update Column Component**
   - Calculate node states for each node
   - Pass state information to Node components
   - Optimize performance with memoization

### Phase 4: Testing
1. **Unit Tests**
   - Test node state detection utilities
   - Test color rendering based on different states
   - Test edge cases (empty paths, root nodes, etc.)

2. **Integration Tests**
   - Test visual appearance in different scenarios
   - Test interaction with existing features
   - Test performance with large mind maps

## Technical Implementation Details

### File Structure Changes
```
src/
├── components/
│   ├── Node.tsx                    # Enhanced with color coding
│   └── Column.tsx                  # Updated to calculate node states
├── utils/
│   └── nodeUtils.ts                # New utilities for node state detection
├── styles/
│   └── nodeColors.ts               # Color constants and theme
└── types/
    └── index.ts                   # Updated type definitions
```

### Key Technical Components

#### New Utility Functions (`src/utils/nodeUtils.ts`)
- `isNodeOnSelectedPath()` - Checks if node is part of selection hierarchy
- `isNodeSelected()` - Checks if node is currently selected
- `hasChildren()` - Determines if node has children
- `getNodeType()` - Returns node type for styling

#### Color Constants (`src/styles/nodeColors.ts`)
- Centralized color palette definition
- Consistent theming across components
- Easy maintenance and updates

#### Enhanced Node Component
- Accepts additional props for node state
- Dynamic styling based on computed node type
- Maintains all existing functionality

#### Enhanced Column Component
- Calculates node states for each rendered node
- Passes state information to Node components
- Performance optimized with memoization

## Testing Strategy

### Test Categories
1. **Unit Tests**: Node state utilities, color rendering
2. **Integration Tests**: Visual consistency, performance
3. **Accessibility Tests**: Color contrast, keyboard navigation
4. **Edge Case Tests**: Deep nesting, empty paths, root nodes

### Performance Considerations
- Memoization to prevent unnecessary re-renders
- Efficient path comparison algorithms
- Minimal runtime style calculations

## Success Criteria

### Functional Requirements
- ✅ All four node types have distinct visual appearance
- ✅ Colors update dynamically based on selection changes
- ✅ Existing functionality remains intact
- ✅ Performance impact is minimal (<5% slowdown)

### Quality Requirements
- ✅ All tests pass (unit and integration)
- ✅ No accessibility regressions
- ✅ Code follows existing patterns and conventions
- ✅ Documentation is updated

## Timeline Estimate
- **Phase 1 (State Detection)**: 2-3 hours
- **Phase 2 (Styling System)**: 3-4 hours  
- **Phase 3 (Integration)**: 2-3 hours
- **Phase 4 (Testing)**: 2-3 hours
- **Documentation & Polish**: 1-2 hours

**Total Estimated Time**: 10-15 hours

## Next Steps
1. ✅ Create implementation plan
2. ⏳ Implement node state utilities (Phase 1)
3. ⏳ Create styling system (Phase 2)
4. ⏳ Integrate with existing components (Phase 3)
5. ⏳ Comprehensive testing (Phase 4)
6. ⏳ Update documentation
7. ⏳ Final review and deployment

---

# Task 46: Node Operations Refactoring Implementation Plan

## Overview
Major refactoring to centralize node operations in the toolbar, add auxiliary root column, and remove inline node buttons. This will improve UI consistency and provide better user experience.

## Implementation Phases

### Phase 1: Auxiliary Root Column Implementation
**Timeline: 3-4 hours**

#### 1.1 Update MindMap Component Logic
- **File**: `src/components/MindMap.tsx`
- **Changes**: Modify `getColumns()` function to always include auxiliary root column
- **Implementation**:
  ```typescript
  const getColumns = () => {
    const columns: { path: number[]; nodes: MindNode[] }[] = [];
    
    // Add auxiliary root column first (always present)
    columns.push({ path: [], nodes: [mindmap.root] });
    
    // Continue with existing column logic
    let currentNode = mindmap.root;
    let currentPath: number[] = [];
    columns.push({ path: currentPath, nodes: currentNode.children });

    while (true) {
      const selectedChildIndex = currentNode.selected_child_idx ?? 0;
      const selectedChild = currentNode.children[selectedChildIndex];
      if (selectedChild) {
        currentPath = [...currentPath, selectedChildIndex];
        columns.push({ path: currentPath, nodes: selectedChild.children });
        currentNode = selectedChild;
      } else {
        break;
      }
    }
    return columns;
  };
  ```

#### 1.2 Update Column Component for Root Node
- **File**: `src/components/Column.tsx`
- **Changes**: Handle special case for auxiliary root column (single node display)
- **Implementation**: Modify rendering logic to handle single node columns differently

#### 1.3 Update Node Component for Root Display
- **File**: `src/components/Node.tsx`
- **Changes**: Remove + and × buttons for auxiliary root node
- **Implementation**: Conditional rendering based on path length

### Phase 2: Toolbar Operations Implementation
**Timeline: 4-5 hours**

#### 2.1 Update Store Interface
- **File**: `src/store/mindmapStore.ts`
- **Changes**: Add new methods for move operations and format-specific copy/paste
- **New Methods**:
  ```typescript
  moveNodeUp: (path: number[]) => void;
  moveNodeDown: (path: number[]) => void;
  copyNodeAsJson: (path: number[]) => Promise<void>;
  copyNodeAsText: (path: number[]) => Promise<void>;
  pasteNodeAsJson: (path: number[]) => Promise<void>;
  pasteNodeAsText: (path: number[]) => Promise<void>;
  ```

#### 2.2 Implement Move Operations
- **File**: `src/store/mindmapStore.ts`
- **Logic**: 
  - `moveNodeUp`: Swap with previous sibling, update parent's `selected_child_idx`
  - `moveNodeDown`: Swap with next sibling, update parent's `selected_child_idx`
- **Edge Cases**: Handle boundary conditions (first/last child)

#### 2.3 Implement Format-Specific Copy/Paste
- **File**: `src/store/mindmapStore.ts`
- **Changes**: 
  - `copyNodeAsJson`: Copy node as JSON string
  - `copyNodeAsText`: Copy node as text format using `mindMapToText`
  - `pasteNodeAsJson`: Parse JSON clipboard content and merge
  - `pasteNodeAsText`: Parse text clipboard content and merge

#### 2.4 Update Toolbar Component
- **File**: `src/components/Toolbar.tsx`
- **Changes**: 
  - Remove "Add Node" button
  - Add node operation buttons (disabled when no selection)
  - Add button grouping and styling
- **Implementation**:
  ```typescript
  const { selectedPath } = useSelectedPath();
  const hasSelection = selectedPath.length > 0;
  
  // Button handlers
  const handleAddChild = () => { /* add to selected node */ };
  const handleDelete = () => { /* delete selected node */ };
  const handleMoveUp = () => { /* move selected node up */ };
  const handleMoveDown = () => { /* move selected node down */ };
  const handleCopyJson = () => { /* copy as JSON */ };
  const handleCopyText = () => { /* copy as text */ };
  const handlePasteJson = () => { /* paste JSON */ };
  const handlePasteText = () => { /* paste text */ };
  ```

### Phase 3: UI Cleanup and Keyboard Handler Removal
**Timeline: 2-3 hours**

#### 3.1 Remove Node Buttons
- **File**: `src/components/Node.tsx`
- **Changes**: Remove + and × button rendering and handlers
- **Implementation**: Simplify Node component to display only text

#### 3.2 Remove Keyboard Shortcuts
- **File**: `src/components/MindMap.tsx`
- **Changes**: Remove copy/paste keyboard event handlers
- **Implementation**: Remove `handleKeyDown` function

#### 3.3 Update SelectedPath Context
- **File**: `src/contexts/SelectedPathContext.tsx`
- **Changes**: Ensure proper selection state management
- **Implementation**: Verify selection works with new auxiliary root column

### Phase 4: Testing Implementation
**Timeline: 4-5 hours**

#### 4.1 Auxiliary Root Column Tests
- **File**: `src/components/MindMap.test.tsx`
- **Test Cases**:
  - Auxiliary root column always present
  - Single node display in auxiliary column
  - Selection behavior with auxiliary root

#### 4.2 Move Operation Tests
- **File**: `src/store/mindmapStore.test.ts`
- **Test Cases**:
  - Move up/down functionality
  - `selected_child_idx` updates
  - Boundary conditions (first/last child)
  - Edge cases (single child, empty children)

#### 4.3 Format-Specific Copy/Paste Tests
- **File**: `src/store/mindmapStore.test.ts`
- **Test Cases**:
  - JSON copy/paste functionality
  - Text copy/paste functionality
  - Error handling for invalid clipboard content
  - Compatibility with existing copy/paste

#### 4.4 Toolbar Operation Tests
- **File**: `src/components/Toolbar.test.tsx`
- **Test Cases**:
  - Button state management (disabled/enabled)
  - Operation button functionality
  - Integration with store operations

#### 4.5 Node Component Tests
- **File**: `src/components/Node.test.tsx`
- **Test Cases**:
  - Node rendering without buttons
  - Selection behavior
  - Auxiliary root node special handling

### Phase 5: Documentation Updates
**Timeline: 2-3 hours**

#### 5.1 Update UI Design Documentation
- **File**: `docs/ui_and_interaction_design.md`
- **Updates**: 
  - New auxiliary root column design
  - Toolbar-based operations
  - Updated interaction patterns

#### 5.2 Update Code Structure Documentation
- **File**: `docs/code_structure.md`
- **Updates**:
  - New store methods
  - Updated component interfaces
  - Removed functionality documentation

#### 5.3 Update Test Documentation
- **File**: `docs/test.md`
- **Updates**:
  - New test cases
  - Updated test coverage metrics
  - Testing strategy for new features

## Technical Implementation Details

### Store Method Implementations

#### Move Node Up
```typescript
moveNodeUp: (path: number[]) => {
  const { mindmap } = get();
  if (path.length === 0) return; // Can't move root
  
  const newMindMap = { ...mindmap };
  const parent = findParent(newMindMap.root, path);
  const nodeIndex = path[path.length - 1];
  
  if (parent && nodeIndex > 0) {
    // Swap with previous sibling
    [parent.children[nodeIndex], parent.children[nodeIndex - 1]] = 
    [parent.children[nodeIndex - 1], parent.children[nodeIndex]];
    
    // Update selected_child_idx
    parent.selected_child_idx = nodeIndex - 1;
    set({ mindmap: newMindMap });
  }
}
```

#### Copy Node as JSON
```typescript
copyNodeAsJson: async (path: number[]) => {
  const { mindmap } = get();
  const node = findNode(mindmap.root, path);
  if (!node) return;
  
  const jsonString = JSON.stringify(node, null, 2);
  await navigator.clipboard.writeText(jsonString);
}
```

#### Paste Node as JSON
```typescript
pasteNodeAsJson: async (path: number[]) => {
  try {
    const clipboardContent = await navigator.clipboard.readText();
    const parsedNode = JSON.parse(clipboardContent);
    
    // Validate parsed node structure
    if (parsedNode.text && Array.isArray(parsedNode.children)) {
      const { mindmap } = get();
      const newMindMap = { ...mindmap };
      const targetNode = findNode(newMindMap.root, path);
      
      if (targetNode) {
        targetNode.children.push(parsedNode);
        get().setSelectedChild(path, targetNode.children.length - 1);
        set({ mindmap: newMindMap });
      }
    }
  } catch (error) {
    console.error('Failed to paste JSON:', error);
  }
}
```

## Testing Strategy

### Test Coverage Goals
- **Unit Tests**: 95%+ coverage for new store methods
- **Component Tests**: All new UI functionality tested
- **Integration Tests**: End-to-end workflows tested
- **Edge Cases**: Boundary conditions, error scenarios

### Key Test Scenarios
1. **Auxiliary Root Column**: Always visible, contains root node
2. **Move Operations**: Correct swapping, `selected_child_idx` updates
3. **Copy/Paste**: Format-specific functionality, error handling
4. **Button States**: Disabled when no selection, enabled with selection
5. **Selection Management**: Consistent state across components

## Risk Assessment and Mitigation

### High Risk Areas
1. **Move Operations**: Complex index management and state updates
   - **Mitigation**: Comprehensive testing, clear algorithm documentation
2. **Format-Specific Paste**: JSON parsing validation and error handling
   - **Mitigation**: Robust error handling, user feedback for invalid content
3. **Selection State**: Consistency across auxiliary root and regular columns
   - **Mitigation**: Centralized selection management, clear state flow

### Medium Risk Areas
1. **UI Responsiveness**: Toolbar button state management
   - **Mitigation**: Reactive state updates, clear visual feedback
2. **Browser Compatibility**: Clipboard API variations
   - **Mitigation**: Fallback implementations, feature detection

## Success Criteria

### Functional Requirements
- ✅ Auxiliary root column always visible on the left
- ✅ Node operations moved to toolbar buttons
- ✅ + and × buttons removed from nodes
- ✅ Move up/down functionality with proper `selected_child_idx` updates
- ✅ Format-specific copy/paste operations working
- ✅ Keyboard shortcuts for copy/paste removed
- ✅ All existing functionality preserved

### Quality Requirements
- ✅ All tests passing (100+ new test cases)
- ✅ TypeScript compilation successful
- ✅ No ESLint errors
- ✅ Documentation updated and accurate
- ✅ User experience improved and consistent

## Timeline Estimate
- **Phase 1 (Auxiliary Root)**: 3-4 hours
- **Phase 2 (Toolbar Operations)**: 4-5 hours
- **Phase 3 (UI Cleanup)**: 2-3 hours
- **Phase 4 (Testing)**: 4-5 hours
- **Phase 5 (Documentation)**: 2-3 hours

**Total Estimated Time**: 15-20 hours

## Implementation Order
1. Start with auxiliary root column (foundational change)
2. Implement new store methods (backend logic)
3. Update toolbar with new operations (UI changes)
4. Remove old UI elements (cleanup)
5. Comprehensive testing (quality assurance)
6. Documentation updates (knowledge transfer)

This plan provides a comprehensive approach to refactoring node operations while maintaining functionality and improving user experience.
