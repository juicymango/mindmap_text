# Code Structure

This document describes the directory structure, files, and the functions and structures within them based on the current implementation.

## Directory Structure

```
mindmap-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── App.tsx
│   │   ├── MindMap.tsx
│   │   ├── Column.tsx
│   │   ├── Node.tsx
│   │   ├── Toolbar.tsx
│   │   ├── StatusBar.tsx
│   │   ├── MobileToolbar.tsx
│   │   ├── App.test.tsx
│   │   ├── MindMap.test.tsx
│   │   ├── Column.test.tsx
│   │   ├── Node.test.tsx
│   │   ├── NodeColor.test.tsx
│   │   ├── Toolbar.test.tsx
│   │   ├── StatusBar.test.tsx
│   │   └── MobileToolbar.test.tsx
│   ├── contexts/
│   │   └── SelectedPathContext.tsx
│   ├── store/
│   │   ├── mindmapStore.ts
│   │   └── mindmapStore.test.ts
│   ├── styles/
│   │   ├── GlobalStyles.ts
│   │   └── nodeColors.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── file.ts
│   │   ├── textFormat.ts
│   │   ├── nodeUtils.ts
│   │   ├── test-utils.ts
│   │   ├── mobileUtils.ts
│   │   ├── file.test.ts
│   │   ├── textFormat.test.ts
│   │   └── nodeUtils.test.ts
│   ├── index.tsx
│   ├── react-app-env.d.ts
│   └── App.test.tsx
├── docs/
├── package.json
└── tsconfig.json
```

### Directory Functions

-   `public/`: Contains the main HTML file.
-   `src/`: Contains the source code of the application.
-   `src/components/`: Contains the React components including the new StatusBar component.
-   `src/store/`: Contains the Zustand store with file path memory.
-   `src/styles/`: Contains the global styles and node color constants.
-   `src/types/`: Contains the TypeScript types.
-   `src/utils/`: Contains utility functions for file operations, text format conversion, node utilities, and testing utilities.

## File Functions and Structures

### `src/components/App.tsx`

-   **Function:** The main component of the application with enhanced layout structure.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { MindMap } from './MindMap';
    import { Toolbar } from './Toolbar';
    import { StatusBar } from './StatusBar';
    import { GlobalStyles } from '../styles/GlobalStyles';
    import { SelectedPathProvider } from '../contexts/SelectedPathContext';
    import styled from 'styled-components';

    const AppContainer = styled.div`
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    `;

    const MainContent = styled.div`
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;

    export const App: React.FC = () => {
      return (
        <SelectedPathProvider>
          <GlobalStyles />
          <AppContainer>
            <Toolbar />
            <MainContent>
              <MindMap />
            </MainContent>
            <StatusBar />
          </AppContainer>
        </SelectedPathProvider>
      );
    };
    ```

### `src/components/MindMap.tsx`

-   **Function:** Renders the mind map columns based on selected path with automatic expansion and auxiliary root column support.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { useMindMapStore } from '../store/mindmapStore';
    import { Column } from './Column';
    import { useSelectedPath } from '../contexts/SelectedPathContext';
    import styled from 'styled-components';
    import { MindNode } from '../types';

    const MindMapContainer = styled.div`
      display: flex;
      overflow-x: auto;
      overflow-y: hidden; // Prevent vertical scrolling at MindMap level
      flex: 1;
      background: #F9FAFB;
      align-items: flex-start; // Align columns to top when they have different heights
      min-height: 0; // Allow flex container to shrink properly
    `;

    export const MindMap: React.FC = () => {
      const { mindmap, setSelectedChild } = useMindMapStore();
      const { setSelectedPath } = useSelectedPath();

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

      const columns = getColumns();

      const handleNodeSelect = (path: number[]) => {
        setSelectedPath(path);
        if (path.length > 0) {
          const parentPath = path.slice(0, -1);
          const childIndex = path[path.length - 1];
          setSelectedChild(parentPath, childIndex);
        }
      };

      return (
        <MindMapContainer>
          {columns.map((column, index) => (
            <Column
              key={\`\${JSON.stringify(column.path)}-\${index}\`}
              columnPath={column.path}
              nodes={column.nodes}
              index={index}
              onNodeSelect={handleNodeSelect}
            />
          ))}
        </MindMapContainer>
      );
    };
    ```

### `src/components/Column.tsx`

-   **Function:** Renders a single column of nodes with adjustable height, vertical scrolling, and proper root node path assignment.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { Node } from './Node';
    import { MindNode } from '../types';
    import styled from 'styled-components';

    interface ColumnProps {
      nodes: MindNode[];
      columnPath: number[];
      index: number;
      onNodeSelect: (path: number[]) => void;
    }

    const ColumnContainer = styled.div<{ $isRoot?: boolean }>`
      margin: 8px 4px;
      padding: 12px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      width: 240px;
      max-height: calc(100vh - 120px); // Account for toolbar and status bar
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      background: #FFFFFF;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow-y: auto; // Enable vertical scrolling when content exceeds max-height
      
      // Custom scrollbar styling for vertical scroll
      &::-webkit-scrollbar {
        width: 6px;
      }
      
      &::-webkit-scrollbar-track {
        background: #F9FAFB;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #D1D5DB;
        border-radius: 3px;
      }
      
      &::-webkit-scrollbar-thumb:hover {
        background: #9CA3AF;
      }
      
      ${props => props.$isRoot && `
        border-left: 4px solid #4A90E2;
      `}
    `;

    export const Column: React.FC<ColumnProps> = ({ nodes, columnPath, index, onNodeSelect }) => {
      // Special handling for root column: if this is the first column (index 0) 
      // and contains only one node with empty columnPath, it's the root node
      const isRootColumn = index === 0 && columnPath.length === 0 && nodes.length === 1;
      
      return (
        <ColumnContainer $isRoot={isRootColumn} data-testid="column-container">
          {nodes.map((node, nodeIndex) => (
            <Node 
              key={nodeIndex} 
              node={node} 
              path={isRootColumn && nodeIndex === 0 ? [] : [...columnPath, nodeIndex]} 
              index={nodeIndex}
              onSelect={onNodeSelect}
            />
          ))}
        </ColumnContainer>
      );
    };
    ```

**Task 52 Column Height Improvements:**
- **Adjustable Height:** Columns now have `max-height: calc(100vh - 120px)` to account for toolbar and status bar height
- **Vertical Scrolling:** Added `overflow-y: auto` to enable scrolling when content exceeds the maximum height
- **Custom Scrollbar:** Implemented custom vertical scrollbar styling (6px width) for consistent aesthetics
- **Fixed Width:** Maintains fixed width of 240px while allowing flexible height
- **Root Highlighting:** Root columns have a blue left border for visual distinction
- **Test Coverage:** Added comprehensive test cases to validate scrolling behavior and prevent regression

### `src/components/Node.tsx`

-   **Function:** Renders a single node with color-coded styling based on node type, inline editing, selection, and delete functionality.
-   **Structure:**
    ```typescript
    import React, { useState } from 'react';
    import { MindNode } from '../types';
    import { useMindMapStore } from '../store/mindmapStore';
    import { useSelectedPath } from '../contexts/SelectedPathContext';
    import { getNodeType } from '../utils/nodeUtils';
    import { NODE_COLORS } from '../styles/nodeColors';
    import styled from 'styled-components';

    interface NodeProps {
      node: MindNode;
      path: number[];
      index: number;
      onSelect: (path: number[]) => void;
    }

    const NodeContainer = styled.div<{ $nodeType: 'selected' | 'onPath' | 'withChildren' | 'withoutChildren' }>`
      padding: 8px;
      border: 1px solid ${(props) => NODE_COLORS[props.$nodeType].border};
      border-radius: 4px;
      margin-bottom: 8px;
      background-color: ${(props) => NODE_COLORS[props.$nodeType].background};
      color: ${(props) => NODE_COLORS[props.$nodeType].text};
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: ${(props) => NODE_COLORS[props.$nodeType].hover};
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      &:focus {
        outline: 2px solid ${(props) => NODE_COLORS.selected.border};
        outline-offset: 2px;
      }
    `;

    export const Node: React.FC<NodeProps> = ({ node, path, index, onSelect }) => {
      const { mindmap, updateNodeText, setSelectedChild, addNode, deleteNode } = useMindMapStore();
      const { selectedPath } = useSelectedPath();
      const [isEditing, setIsEditing] = useState(false);
      const [text, setText] = useState(node.text);

      const handleDoubleClick = () => {
        setIsEditing(true);
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
      };

      const handleBlur = () => {
        updateNodeText(path, text);
        setIsEditing(false);
      };

      const handleClick = () => {
        const parentPath = path.slice(0, -1);
        setSelectedChild(parentPath, index);
        onSelect(path);
      };

      const handleAddChild = (e: React.MouseEvent) => {
        e.stopPropagation();
        addNode(path, 'New Node');
      };

      const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteNode(path);
      };

      const nodeType = getNodeType(node, path, selectedPath, mindmap.root);

      return (
        <NodeContainer
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
          $nodeType={nodeType}
          tabIndex={0} // Make focusable for accessibility
        >
          {isEditing ? (
            <input
              type="text"
              value={text}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              style={{
                backgroundColor: 'transparent',
                border: '1px solid currentColor',
                color: 'inherit',
                padding: '2px',
                borderRadius: '2px'
              }}
            />
          ) : (
            node.text
          )}
          <div>
            <button 
              onClick={handleAddChild}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid currentColor',
                color: 'inherit',
                padding: '2px 6px',
                borderRadius: '2px',
                cursor: 'pointer'
              }}
            >
              +
            </button>
            <button 
              onClick={handleDelete}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid currentColor',
                color: 'inherit',
                padding: '2px 6px',
                borderRadius: '2px',
                cursor: 'pointer'
              }}
            >
              x
            </button>
          </div>
        </NodeContainer>
      );
    };
    ```

### `src/components/Toolbar.tsx`

-   **Function:** Renders the enhanced toolbar with comprehensive node operation buttons (Add Child, Delete, Move Up, Move Down), copy/paste operations (Copy JSON, Copy Text, Paste JSON, Paste Text), and file operations (Save As JSON, Save As Text, Load File). Implements styled-components with transient props to prevent DOM warnings and includes icon integration for better visual communication.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { useMindMapStore } from '../store/mindmapStore';
    import { useSelectedPath } from '../contexts/SelectedPathContext';
    import { saveAsFile, loadFromFile } from '../utils/file';
    import { FileFormat } from '../types';
    import styled from 'styled-components';
    import { Plus, Trash2, ChevronUp, ChevronDown, Copy, Save, Upload } from 'lucide-react';

    const ToolbarContainer = styled.div`
      padding: 12px;
      border-bottom: 1px solid #E5E7EB;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    `;

    const ToolbarButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      background: ${props => 
        props.$variant === 'primary' ? '#4A90E2' :
        props.$variant === 'danger' ? '#EF4444' :
        '#FFFFFF'
      };
      color: ${props => 
        props.$variant === 'primary' ? '#FFFFFF' :
        props.$variant === 'danger' ? '#FFFFFF' :
        '#374151'
      };
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      
      &:hover {
        background: ${props => 
          props.$variant === 'primary' ? '#357ABD' :
          props.$variant === 'danger' ? '#DC2626' :
          '#F9FAFB'
        };
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
    `;

    const ButtonGroup = styled.div`
      display: flex;
      gap: 4px;
      padding: 0 8px;
      border-right: 1px solid #E5E7EB;
      
      &:last-child {
        border-right: none;
      }
    `;

    export const Toolbar: React.FC = () => {
      const { 
        mindmap, 
        setMindmap, 
        addNode, 
        deleteNode,
        moveNodeUp,
        moveNodeDown,
        copyNodeAsJson,
        copyNodeAsText,
        pasteNodeAsJson,
        pasteNodeAsText,
        jsonFilePath, 
        textFilePath, 
        setJsonFilePath, 
        setTextFilePath
      } = useMindMapStore();
      
      const { selectedPath, setSelectedPath } = useSelectedPath();
      const hasSelection = selectedPath.length > 0;
      const hasRootSelection = selectedPath.length === 0;

      // Button handlers remain the same as above

      return (
        <ToolbarContainer>
          <ButtonGroup>
            <ToolbarButton $variant="primary" onClick={handleAddChild} disabled={!(hasSelection || hasRootSelection)}>
              <Plus size={16} />
              Add Child
            </ToolbarButton>
            <ToolbarButton $variant="danger" onClick={handleDelete} disabled={!hasSelection}>
              <Trash2 size={16} />
              Delete
            </ToolbarButton>
            <ToolbarButton onClick={handleMoveUp} disabled={!hasSelection}>
              <ChevronUp size={16} />
              Move Up
            </ToolbarButton>
            <ToolbarButton onClick={handleMoveDown} disabled={!hasSelection}>
              <ChevronDown size={16} />
              Move Down
            </ToolbarButton>
          </ButtonGroup>
          
          <ButtonGroup>
            <ToolbarButton onClick={handleCopyJson} disabled={!(hasSelection || hasRootSelection)}>
              <Copy size={16} />
              Copy JSON
            </ToolbarButton>
            <ToolbarButton onClick={handleCopyText} disabled={!(hasSelection || hasRootSelection)}>
              <Copy size={16} />
              Copy Text
            </ToolbarButton>
            <ToolbarButton onClick={handlePasteJson} disabled={!(hasSelection || hasRootSelection)}>
              <Copy size={16} />
              Paste JSON
            </ToolbarButton>
            <ToolbarButton onClick={handlePasteText} disabled={!(hasSelection || hasRootSelection)}>
              <Copy size={16} />
              Paste Text
            </ToolbarButton>
          </ButtonGroup>
          
          <ButtonGroup>
            <ToolbarButton onClick={() => handleSaveAs('json')}>
              <Save size={16} />
              Save JSON
            </ToolbarButton>
            <ToolbarButton onClick={() => handleSaveAs('text')}>
              <Save size={16} />
              Save Text
            </ToolbarButton>
            <ToolbarButton onClick={handleLoad}>
              <Upload size={16} />
              Load File
            </ToolbarButton>
          </ButtonGroup>
        </ToolbarContainer>
      );
    };
    ```

**Task 55 Styled-Components Fix:**
- **Transient Props:** Changed `variant` prop to `$variant` to prevent DOM attribute warnings
- **Enhanced Styling:** Added modern button design with icons, improved spacing, and hover effects
- **Button Groups:** Organized buttons into logical groups with visual separators
- **Icon Integration:** Added Lucide React icons for better visual communication
- **Test Coverage:** Added test cases to verify no console warnings are generated

**Task 56 Mobile UI Improvements:**
- **Complete Feature Parity:** Added move up/down and copy/paste functionality to mobile More menu
- **Enhanced Text Editing:** Implemented long-press (500ms) text editing for mobile devices with move cancellation
- **Improved Home Button:** Added scroll-to-top functionality alongside selection clearing for better navigation
- **Gesture Optimization:** Adjusted swipe sensitivity (80px min, 30px max vertical) for better scrolling experience
- **Enhanced Accessibility:** Added proper disabled state handling for all mobile menu items with visual feedback
- **Menu Organization:** Removed duplicate "Load File" from More menu for cleaner UI and better UX
- **Touch Optimization:** All mobile buttons maintain 44px minimum touch target size for accessibility
- **Safe Area Support:** Added proper handling for notched devices with env(safe-area-inset-bottom)

**Task 56 Node Component Enhancements:**
- **Long-Press Text Editing:** Mobile-specific text editing with 500ms timer and 10px move cancellation
- **Touch Event Handling:** Comprehensive touch event management with proper cleanup
- **Platform Detection:** Automatic detection of mobile devices to enable/disable touch features
- **State Management:** Proper handling of editing state with timers and cleanup on unmount

### `src/components/MobileToolbar.tsx`

-   **Function:** Enhanced touch-optimized mobile toolbar component with complete functionality parity, gesture navigation, and comprehensive action menu. Implements Task 56 mobile UI improvements including long-press text editing, enhanced home button, and full feature accessibility.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { useMindMapStore } from '../store/mindmapStore';
    import { useSelectedPath } from '../contexts/SelectedPathContext';
    import { useMobileDetection } from '../hooks/useMobileDetection';
    import { saveAsFile, loadFromFile } from '../utils/file';
    import { FileFormat } from '../types';
    import styled from 'styled-components';
    import { Plus, Trash2, Save, FolderOpen, MoreVertical, Home, Edit, ChevronUp, ChevronDown, Copy, FileText } from 'lucide-react';

    const MobileToolbarContainer = styled.div`
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #FFFFFF;
      border-top: 1px solid #E5E7EB;
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
      z-index: 100;
      padding-bottom: max(8px, env(safe-area-inset-bottom));
    `;

    const MenuItem = styled.div<{ $disabled?: boolean }>`
      width: 100%;
      padding: 16px;
      color: ${props => props.$disabled ? '#9CA3AF' : '#374151'};
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
      opacity: ${props => props.$disabled ? 0.5 : 1};
      border-bottom: 1px solid #F3F4F6;
    `;

    export const MobileToolbar: React.FC = () => {
      const { isMobile } = useMobileDetection();
      const { 
        mindmap, 
        setMindmap, 
        addNode, 
        deleteNode,
        moveNodeUp,
        moveNodeDown,
        copyNodeAsJson,
        copyNodeAsText,
        pasteNodeAsJson,
        pasteNodeAsText,
        setJsonFilePath, 
        setTextFilePath
      } = useMindMapStore();

      const handleGoHome = () => {
        setSelectedPath([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      const handleAddChild = () => {
        addNode(selectedPath, 'New Node');
      };

      const handleDelete = () => {
        deleteNode(selectedPath);
        setIsMenuOpen(false);
      };

      const handleEdit = () => {
        setIsMenuOpen(false);
      };

      const handleCopy = (format: 'json' | 'text') => {
        if (format === 'json') {
          copyNodeAsJson(selectedPath);
        } else {
          copyNodeAsText(selectedPath);
        }
        setIsMenuOpen(false);
      };

      const handlePaste = (format: 'json' | 'text') => {
        if (format === 'json') {
          pasteNodeAsJson(selectedPath);
        } else {
          pasteNodeAsText(selectedPath);
        }
        setIsMenuOpen(false);
      };

      const toggleNodeExpansion = (nodePath: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodePath)) {
          newExpanded.delete(nodePath);
        } else {
          newExpanded.add(nodePath);
        }
        setExpandedNodes(newExpanded);
      };

      if (!isMobile) {
        return null;
      }

      return (
        <>
          <MobileToolbarContainer>
            <button onClick={handleHome} aria-label="Home">
              <Home size={24} />
            </button>
            <button onClick={handleAddChild} aria-label="Add Child">
              <Plus size={24} />
            </button>
            <button onClick={() => setIsMenuOpen(true)} aria-label="More Options">
              <MoreVertical size={24} />
            </button>
          </MobileToolbarContainer>

          <MenuOverlay 
            $isOpen={isMenuOpen} 
            onClick={() => setIsMenuOpen(false)}
            data-testid="menu-overlay"
          />
          <MobileActionMenu $isOpen={isMenuOpen}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Actions</h3>
              <button onClick={() => setIsMenuOpen(false)} aria-label="Close Menu">
                <X size={24} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={handleEdit} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <Edit size={20} />
                Edit Node
              </button>
              <button onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <Trash2 size={20} />
                Delete Node
              </button>
              <button onClick={() => handleCopy('json')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <Copy size={20} />
                Copy JSON
              </button>
              <button onClick={() => handleCopy('text')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <Copy size={20} />
                Copy Text
              </button>
              <button onClick={() => handlePaste('json')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <Copy size={20} />
                Paste JSON
              </button>
              <button onClick={() => handlePaste('text')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <Copy size={20} />
                Paste Text
              </button>
            </div>
          </MobileActionMenu>
        </>
      );
    };
    ```

**Task 55 Mobile Menu Fix:**
- **Menu Positioning:** Fixed mobile menu positioning from `translateY(100%)` to `translateY(100vh)` to ensure proper off-screen hiding
- **Safe Area Support:** Added `env(safe-area-inset-bottom)` for proper handling of notched devices
- **Test Coverage:** Added comprehensive tests for menu visibility, positioning, and user interactions

### `src/components/StatusBar.tsx`

-   **Function:** New component that displays system status information including save status, file path, format, and node count statistics.
-   **Structure:**
    ```typescript
    import React from 'react';
    import { useMindMapStore } from '../store/mindmapStore';
    import styled from 'styled-components';
    import { Clock, FileText } from 'lucide-react';

    const StatusBarContainer = styled.div`
      height: 32px;
      background: #F9FAFB;
      border-top: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      font-size: 12px;
      color: #6B7280;
    `;

    const StatusIndicator = styled.div<{ $status: 'saved' | 'unsaved' | 'saving' }>`
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${props => 
        props.$status === 'saved' ? '#10B981' :
        props.$status === 'unsaved' ? '#F59E0B' :
        '#6B7280'
      };
    `;

    export const StatusBar: React.FC = () => {
      const { mindmap, jsonFilePath, textFilePath } = useMindMapStore();
      const [saveStatus] = React.useState<'saved' | 'unsaved' | 'saving'>('saved');
      
      const countNodes = (node: any): number => {
        if (!node.children || node.children.length === 0) {
          return 1;
        }
        return 1 + node.children.reduce((sum: number, child: any) => sum + countNodes(child), 0);
      };
      
      const totalNodes = countNodes(mindmap.root);
      const getCurrentFilePath = () => {
        return jsonFilePath || textFilePath || 'No file selected';
      };
      
      return (
        <StatusBarContainer>
          <div>
            <StatusIndicator $status={saveStatus} />
            <span>{saveStatus === 'saved' ? 'Saved' : 'Unsaved'}</span>
          </div>
          <div>
            <FileText size={12} />
            <span>{getCurrentFilePath()}</span>
          </div>
          <div>
            <span>Format: {jsonFilePath ? 'JSON' : textFilePath ? 'Text' : 'None'}</span>
          </div>
          <div>
            <span>{totalNodes} nodes</span>
          </div>
        </StatusBarContainer>
      );
    };
    ```


### `src/store/mindmapStore.ts`

-   **Function:** Zustand store for the mind map with file path memory, localStorage persistence, and enhanced clipboard operations.
-   **Structure:**
    ```typescript
    import { create, StoreApi, UseBoundStore } from 'zustand';
    import { MindMap, MindNode } from '../types';
    import { DropResult } from 'react-beautiful-dnd';
    import { mindMapToText, textToMindMap } from '../utils/textFormat';

    interface MindMapState {
      mindmap: MindMap;
      setMindmap: (mindmap: MindMap) => void;
      addNode: (parentPath: number[], text: string) => void;
      deleteNode: (path: number[]) => void;
      updateNodeText: (path: number[], text: string) => void;
      copyNode: (path: number[]) => Promise<void>;
      pasteNode: (path: number[]) => Promise<void>;
      onDragEnd: (result: DropResult) => void;
      setSelectedChild: (parentPath: number[], childIndex: number | undefined) => void;
      // File path memory state
      jsonFilePath: string | null;
      textFilePath: string | null;
      setJsonFilePath: (path: string | null) => void;
      setTextFilePath: (path: string | null) => void;
      clearFilePaths: () => void;
    }

    const findNode = (root: MindNode, path: number[]): MindNode | null => {
      if (path.length === 0) {
        return root;
      }
      let currentNode: MindNode | null = root;
      for (const index of path) {
        if (currentNode && currentNode.children && currentNode.children[index]) {
          currentNode = currentNode.children[index];
        } else {
          return null;
        }
      }
      return currentNode;
    };

    const findParent = (root: MindNode, path: number[]): MindNode | null => {
      if (path.length === 0) {
        return null;
      }
      const parentPath = path.slice(0, -1);
      return findNode(root, parentPath);
    };

    // Initialize from localStorage
    const getInitialFilePaths = () => {
      if (typeof window !== 'undefined') {
        return {
          jsonFilePath: localStorage.getItem('jsonFilePath') || null,
          textFilePath: localStorage.getItem('textFilePath') || null,
        };
      }
      return {
        jsonFilePath: null,
        textFilePath: null,
      };
    };

    export const useMindMapStore: UseBoundStore<StoreApi<MindMapState>> = create<MindMapState>((set, get) => ({
      mindmap: { root: { text: 'Root', children: [] } },
      ...getInitialFilePaths(),
      setMindmap: (mindmap: MindMap) => set({ mindmap }),
      addNode: (parentPath: number[], text: string) => {
        const { mindmap } = get();
        const newMindMap = { ...mindmap };
        const parent = findNode(newMindMap.root, parentPath);
        if (parent) {
          const newNode: MindNode = { text, children: [] };
          parent.children.push(newNode);
          set({ mindmap: newMindMap });
        }
      },
      deleteNode: (path: number[]) => {
        const { mindmap } = get();
        const newMindMap = { ...mindmap };
        const parent = findParent(newMindMap.root, path);
        const nodeIndex = path[path.length - 1];
        if (parent && parent.children[nodeIndex] !== undefined) {
          parent.children.splice(nodeIndex, 1);
          set({ mindmap: newMindMap });
        }
      },
      updateNodeText: (path: number[], text: string) => {
        const { mindmap } = get();
        const newMindMap = { ...mindmap };
        const node = findNode(newMindMap.root, path);
        if (node) {
          node.text = text;
          set({ mindmap: newMindMap });
        }
      },
      onDragEnd: (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) {
          return;
        }

        const { mindmap } = get();
        const newMindMap = { ...mindmap };

        const sourceParent = findNode(newMindMap.root, JSON.parse(source.droppableId));
        const destParent = findNode(newMindMap.root, JSON.parse(destination.droppableId));

        if (sourceParent && destParent) {
          const [removed] = sourceParent.children.splice(source.index, 1);
          destParent.children.splice(destination.index, 0, removed);
          set({ mindmap: newMindMap });
        }
      },
      copyNode: async (path: number[]) => {
        const { mindmap } = get();
        const node = findNode(mindmap.root, path);
        if (!node) return;
        
        // For copy operation, we need to include the node being copied as content
        // Create a temporary structure where the copied node becomes a child of auxiliary root
        const tempMindMap: MindMap = { 
          root: { 
            text: 'Root', 
            children: [node] 
          } 
        };
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
      },
      pasteNode: async (path: number[]) => {
        const { mindmap } = get();
        
        try {
          let clipboardContent: string;
          
          // Try modern clipboard API first
          if (navigator.clipboard && navigator.clipboard.readText) {
            clipboardContent = await navigator.clipboard.readText();
          } else {
            // Fallback to older method
            clipboardContent = await new Promise<string>((resolve, reject) => {
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
          const targetNode = findNode(newMindMap.root, path);
          
          if (targetNode && parsedMindMap?.root) {
            // Handle auxiliary root logic for compatibility with tests
            if (path.length === 0) {
              // Pasting to root node - update root text and add children from auxiliary root
              if (parsedMindMap.root.children.length > 0) {
                targetNode.text = parsedMindMap.root.children[0].text;
                targetNode.children.push(...parsedMindMap.root.children[0].children);
              }
            } else {
              // Pasting to non-root node - add the auxiliary root's children directly
              // This matches the test expectations for adding nodes
              targetNode.children.push(...parsedMindMap.root.children);
            }
            
            get().setSelectedChild(path, targetNode.children.length - 1);
            set({ mindmap: newMindMap });
          }
        } catch (error) {
          console.error('Failed to paste from clipboard:', error);
          // Optionally show error to user
        }
      },
      setSelectedChild: (parentPath: number[], childIndex: number | undefined) => {
        const { mindmap } = get();
        const newMindMap = { ...mindmap };
        const parent = findNode(newMindMap.root, parentPath);
        if (parent) {
          parent.selected_child_idx = childIndex;
          set({ mindmap: newMindMap });
        }
      },
      setJsonFilePath: (path: string | null) => {
        set({ jsonFilePath: path });
        if (typeof window !== 'undefined') {
          localStorage.setItem('jsonFilePath', path || '');
        }
      },
      setTextFilePath: (path: string | null) => {
        set({ textFilePath: path });
        if (typeof window !== 'undefined') {
          localStorage.setItem('textFilePath', path || '');
        }
      },
      clearFilePaths: () => {
        set({ jsonFilePath: null, textFilePath: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jsonFilePath');
          localStorage.removeItem('textFilePath');
        }
      },
    }));
    ```

### `src/styles/GlobalStyles.ts`

-   **Function:** Contains global styles for the application.
-   **Structure:**
    ```typescript
    import { createGlobalStyle } from 'styled-components';

    export const GlobalStyles = createGlobalStyle`
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
      }
    `;
    ```

### `src/types/index.ts`

-   **Function:** Contains TypeScript types for the application including mind map structures and file formats.
-   **Structure:**
    ```typescript
    export interface MindNode {
      text: string;
      children: MindNode[];
      selected_child_idx?: number;
    }

    export interface MindMap {
      root: MindNode;
    }

    export type FileFormat = 'json' | 'text';
    ```

### `src/utils/file.ts`

-   **Function:** Contains utility functions for file operations with path memory and format detection.
-   **Structure:**
    ```typescript
    import { MindMap, FileFormat } from '../types';
    import { mindMapToText, textToMindMap } from './textFormat';

    export const detectFormat = (filePath: string): FileFormat => {
      return filePath.toLowerCase().endsWith('.txt') ? 'text' : 'json';
    };

    export const saveToFile = (mindmap: MindMap, filePath?: string) => {
      const path = filePath || 'mindmap.json';
      const format = detectFormat(path);
      
      if (format === 'text') {
        const data = mindMapToText(mindmap);
        const blob = new Blob([data], { type: 'text/plain' });
        downloadFile(blob, path);
      } else {
        const data = JSON.stringify(mindmap, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        downloadFile(blob, path);
      }
    };

    export const saveAsFile = async (mindmap: MindMap, format: FileFormat = 'json'): Promise<string> => {
      const defaultFileName = `mindmap.${format === 'text' ? 'txt' : 'json'}`;
      saveToFile(mindmap, defaultFileName);
      return defaultFileName;
    };

    export const loadFromFile = async (filePath?: string): Promise<{ mindmap: MindMap | null, path: string }> => {
      if (filePath) {
        // For browser environment, we can't directly load from file path
        // This would require Node.js fs API or similar
        return { mindmap: null, path: filePath };
      }
      
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.txt';
        
        input.onchange = (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const format = detectFormat(file.name);
                let mindmap: MindMap;
                
                if (format === 'text') {
                  const text = e.target?.result as string;
                  mindmap = textToMindMap(text);
                } else {
                  mindmap = JSON.parse(e.target?.result as string);
                }
                
                resolve({ mindmap, path: file.name });
              } catch (error) {
                console.error('Error parsing file', error);
                resolve({ mindmap: null, path: '' });
              }
            };
            reader.readAsText(file);
          } else {
            resolve({ mindmap: null, path: '' });
          }
        };
        input.click();
      });
    };

    // Legacy functions for backward compatibility
    export const saveAsText = (mindmap: MindMap) => {
      saveToFile(mindmap, 'mindmap.txt');
    };

    export const loadFromText = async (): Promise<MindMap | null> => {
      const result = await loadFromFile();
      return result.mindmap;
    };

    const downloadFile = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    };
    ```

### `src/utils/textFormat.ts`

-   **Function:** Contains utility functions for converting between mind map and text format with auxiliary root node handling.
-   **Structure:**
    ```typescript
    import { MindMap, MindNode } from '../types';

    export const mindMapToText = (mindMap: MindMap): string => {
      const lines: string[] = [];
      // Skip the root node (auxiliary node) and start from its children
      mindMap.root.children.forEach(child => traverse(child, 0));
      
      function traverse(node: MindNode, depth: number) {
        lines.push('\t'.repeat(depth) + node.text);
        node.children.forEach(child => traverse(child, depth + 1));
      }
      
      return lines.join('\n');
    };

    export const textToMindMap = (text: string): MindMap | null => {
      if (text.trim() === '') {
        return null;
      }
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) {
        return null;
      }

      const getDepth = (line: string) => {
          let depth = 0;
          for (let i = 0; i < line.length; i++) {
              if (line[i] === '\t') {
                  depth++;
              } else {
                  break;
              }
          }
          return depth;
      }

      // Check if first line has depth > 0 (invalid text format)
      const firstLine = lines[0];
      if (getDepth(firstLine) !== 0) {
          return null;
      }

      // Create auxiliary root node that won't appear in the text output
      const root: MindNode = { text: 'Root', children: [] };
      const parentStack: MindNode[] = [root];

      lines.forEach(line => {
        const depth = getDepth(line);
        const text = line.trim();
        const newNode: MindNode = { text, children: [] };

        // All lines in the text should be children of the auxiliary root
        // So we adjust the depth accordingly
        const adjustedDepth = depth + 1;

        while (parentStack.length > adjustedDepth) {
          parentStack.pop();
        }

        if (parentStack.length > 0) {
            parentStack[parentStack.length - 1].children.push(newNode);
        }
        parentStack.push(newNode);
      });

      return { root };
    };
    ```

**Key Features:**
- **Auxiliary Root Node:** The "Root" node is treated as an auxiliary node that's automatically added in `textToMindMap` and removed in `mindMapToText`
- **Text Format:** Uses tab-indented hierarchical structure where the first line becomes the first child of the auxiliary root
- **Validation:** Returns null for invalid input (empty text or text starting with tabs)
- **Consistency:** Ensures round-trip conversion between mind map and text formats

### `src/styles/nodeColors.ts`

-   **Function:** Contains color constants for the node color coding system.
-   **Structure:**
    ```typescript
    export const NODE_COLORS = {
      selected: {
        background: '#4A90E2',
        border: '#357ABD',
        text: '#FFFFFF',
        hover: '#357ABD'
      },
      onPath: {
        background: '#E8F4FD',
        border: '#B8D4F1',
        text: '#333333',
        hover: '#D1E7FC'
      },
      withChildren: {
        background: '#F8F9FA',
        border: '#DEE2E6',
        text: '#333333',
        hover: '#E9ECEF'
      },
      withoutChildren: {
        background: '#FFFFFF',
        border: '#DEE2E6',
        text: '#333333',
        hover: '#F8F9FA'
      }
    } as const;

    export type NodeType = keyof typeof NODE_COLORS;
    ```

### `src/utils/nodeUtils.ts`

-   **Function:** Contains utility functions for node operations and color coding logic.
-   **Structure:**
    ```typescript
    import { MindNode } from '../types';

    /**
     * Checks if a node is part of the selected path hierarchy
     * Returns true only if nodePath is a prefix of selectedPath (node is an ancestor)
     * Updated to fix bug where descendants were incorrectly considered "on path"
     */
    export const isNodeOnSelectedPath = (
      nodePath: number[], 
      selectedPath: number[]
    ): boolean => {
      // Empty path (root) is ancestor of any non-empty selected path
      if (nodePath.length === 0) {
        return selectedPath.length > 0;
      }
      
      if (selectedPath.length === 0) {
        return false;
      }
      
      // Node must be shorter than or equal to selected path to be an ancestor
      if (nodePath.length > selectedPath.length) {
        return false;
      }
      
      // Check if nodePath is a prefix of selectedPath
      for (let i = 0; i < nodePath.length; i++) {
        if (nodePath[i] !== selectedPath[i]) {
          return false;
        }
      }
      return true;
    };

    /**
     * Checks if a node is part of the selected path hierarchy including selected_child_idx chain
     * Returns true if node is on the path determined by following selected_child_idx from selected node
     */
    export const isNodeOnSelectedPathWithChildIndex = (
      nodePath: number[],
      selectedPath: number[],
      rootNode: MindNode
    ): boolean => {
      // First check if it's a regular ancestor
      if (isNodeOnSelectedPath(nodePath, selectedPath)) {
        return true;
      }
      
      // If not, check if it's part of the selected_child_idx chain extending from the selected node
      if (nodePath.length > selectedPath.length) {
        // Check if nodePath extends selectedPath
        for (let i = 0; i < selectedPath.length; i++) {
          if (nodePath[i] !== selectedPath[i]) {
            return false;
          }
        }
        
        // Now check if each subsequent index matches the selected_child_idx
        let currentNode = rootNode;
        for (let i = 0; i < selectedPath.length; i++) {
          if (currentNode.children && selectedPath[i] < currentNode.children.length) {
            currentNode = currentNode.children[selectedPath[i]];
          } else {
            return false;
          }
        }
        
        // Check the extension part
        for (let i = selectedPath.length; i < nodePath.length; i++) {
          const expectedChildIndex = currentNode.selected_child_idx ?? 0;
          if (nodePath[i] !== expectedChildIndex) {
            return false;
          }
          
          if (currentNode.children && expectedChildIndex < currentNode.children.length) {
            currentNode = currentNode.children[expectedChildIndex];
          } else {
            return false;
          }
        }
        
        return true;
      }
      
      return false;
    };

    /**
     * Checks if a node is the currently selected node
     * Returns true only if paths match exactly
     */
    export const isNodeSelected = (
      nodePath: number[], 
      selectedPath: number[]
    ): boolean => {
      if (nodePath.length !== selectedPath.length) {
        return false;
      }
      
      return nodePath.every((val, idx) => val === selectedPath[idx]);
    };

    /**
     * Determines if a node has children
     */
    export const hasChildren = (node: MindNode): boolean => {
      return Array.isArray(node.children) && node.children.length > 0;
    };

    /**
     * Determines the node type for styling purposes
     * Returns the most specific type that applies to the node
     * Updated to support selected_child_idx chain coloring
     */
    export const getNodeType = (
      node: MindNode,
      nodePath: number[],
      selectedPath: number[],
      rootNode?: MindNode
    ): 'selected' | 'onPath' | 'withChildren' | 'withoutChildren' => {
      if (isNodeSelected(nodePath, selectedPath)) {
        return 'selected';
      }
      
      if (isNodeOnSelectedPath(nodePath, selectedPath)) {
        return 'onPath';
      }
      
      // Check if it's part of the selected_child_idx chain (if root node is provided)
      if (rootNode && isNodeOnSelectedPathWithChildIndex(nodePath, selectedPath, rootNode)) {
        return 'onPath';
      }
      
      if (hasChildren(node)) {
        return 'withChildren';
      }
      
      return 'withoutChildren';
    };
    ```

### `src/utils/mobileUtils.ts`

-   **Function:** Comprehensive mobile detection utilities with responsive breakpoints, gesture navigation support, and Task 56 optimizations for better user experience.
-   **Structure:**
    ```typescript
    import { useState, useEffect, useRef } from 'react';

    export const useMobileDetection = () => {
      const [isMobile, setIsMobile] = useState(false);
      const [isTablet, setIsTablet] = useState(false);
      const [isDesktop, setIsDesktop] = useState(false);
      const [screenWidth, setScreenWidth] = useState(0);
      const [columnWidth, setColumnWidth] = useState(240);

      useEffect(() => {
        const checkMobile = () => {
          const width = window.innerWidth;
          setScreenWidth(width);
          
          const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          const isSmallScreen = width <= 768;
          const isMediumScreen = width > 768 && width <= 1024;
          const isLargeScreen = width > 1024;
          const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          setIsMobile(hasTouchSupport && (isSmallScreen || isMobileDevice));
          setIsTablet(isMediumScreen);
          setIsDesktop(isLargeScreen);
          setColumnWidth(hasTouchSupport && (isSmallScreen || isMobileDevice) ? 180 : 240);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
      }, []);

      return { 
        isMobile, 
        isTablet, 
        isDesktop, 
        screenWidth, 
        columnWidth 
      };
    };

    export const useGestureNavigation = ({ 
      onSwipeLeft, 
      onSwipeRight, 
      minSwipeDistance = 80,  // Increased from 50 for better UX
      maxVerticalDeviation = 30  // Decreased from 50 for stricter horizontal detection
    }: {
      onSwipeLeft: () => void;
      onSwipeRight: () => void;
      minSwipeDistance?: number;
      maxVerticalDeviation?: number;
    }) => {
      const touchStartRef = useRef({ x: 0, y: 0 });
      const touchEndRef = useRef({ x: 0, y: 0 });
      const [indicators, setIndicators] = useState({
        showLeft: false,
        showRight: false,
      });

      const onTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        touchEndRef.current = { x: touch.clientX, y: touch.clientY };
      };

      const onTouchMove = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchEndRef.current = { x: touch.clientX, y: touch.clientY };
        
        // Calculate current distance and deviation
        const deltaX = touchStartRef.current.x - touchEndRef.current.x;
        const deltaY = Math.abs(touchStartRef.current.y - touchEndRef.current.y);
        
        // Update indicators based on swipe progress
        if (Math.abs(deltaX) > minSwipeDistance * 0.7 && deltaY <= maxVerticalDeviation) {
          setIndicators({
            showLeft: deltaX > 0,
            showRight: deltaX < 0,
          });
        } else {
          setIndicators({ showLeft: false, showRight: false });
        }
      };

      const onTouchEnd = () => {
        const deltaX = touchStartRef.current.x - touchEndRef.current.x;
        const deltaY = Math.abs(touchStartRef.current.y - touchEndRef.current.y);
        
        // Check if swipe meets criteria
        if (Math.abs(deltaX) >= minSwipeDistance && deltaY <= maxVerticalDeviation) {
          if (deltaX > 0) {
            onSwipeLeft();
          } else {
            onSwipeRight();
          }
        }
        
        // Reset indicators
        setIndicators({ showLeft: false, showRight: false });
      };

      return {
        touchHandlers: {
          onTouchStart,
          onTouchMove,
          onTouchEnd,
        },
        indicators,
      };
    };

    export const getResponsiveColumnWidth = (isMobile: boolean) => {
      return isMobile ? 180 : 240;
    };

    export const getResponsiveFontSize = (isMobile: boolean) => {
      return isMobile ? '14px' : '16px';
    };

    export const isTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };
    ```

**Task 56 Mobile Utils Enhancements:**
- **Enhanced Mobile Detection:** Added tablet and desktop detection with screen width tracking
- **Improved Gesture Navigation:** Configurable gesture parameters with visual feedback indicators
- **Optimized Sensitivity:** Increased minSwipeDistance to 80px and decreased maxVerticalDeviation to 30px
- **Visual Feedback:** Added swipe indicators that appear during gesture progression
- **Responsive Column Width:** Dynamic column width adjustment based on device detection
- **Touch Device Detection:** Utility function for reliable touch capability detection

### `src/utils/test-utils.ts`

-   **Function:** Provides type-safe testing utilities and mocks for the application.
-   **Structure:**
    ```typescript
    import { MindMapState, useMindMapStore } from '../store/mindmapStore';
    import { MindMap, MindNode } from '../types';
    import { DropResult } from 'react-beautiful-dnd';
    import React from 'react';

    export const createMockMindMapStore = (overrides: Partial<MindMapState> = {}) => {
      // Type-safe mock for the Zustand store
      const baseState: MindMapState = {
        mindmap: { root: { text: 'Root', children: [] } },
        setMindmap: jest.fn(),
        addNode: jest.fn(),
        deleteNode: jest.fn(),
        updateNodeText: jest.fn(),
        copyNode: jest.fn(),
        pasteNode: jest.fn(),
        setSelectedChild: jest.fn(),
        jsonFilePath: null,
        textFilePath: null,
        setJsonFilePath: jest.fn(),
        setTextFilePath: jest.fn(),
        clearFilePaths: jest.fn(),
      };
      
      const mockStore = { ...baseState, ...overrides };
      
      // Mock the actual store hook
      const mockedUseMindMapStore = useMindMapStore as jest.MockedFunction<typeof useMindMapStore>;
      mockedUseMindMapStore.mockReturnValue(mockStore);
      
      return mockStore;
    };

    export const createTestMindMap = (structure: any): MindMap => {
      // Helper function to create a test mind map with specified structure
      return {
        root: structure
      };
    };

    export const createTestNode = (text: string, children: MindNode[] = [], selected_child_idx?: number): MindNode => {
      // Helper function to create a test node with children
      return {
        text,
        children,
        selected_child_idx
      };
    };

    export const isNonNullString = (value: string | null | undefined): value is string => {
      // Type guard for checking if a value is a non-null string
      return typeof value === 'string' && value.length > 0;
    };

    export const isValidMindMap = (mindmap: MindMap | null): mindmap is MindMap => {
      // Type guard for checking if a mind map is valid
      return mindmap !== null && mindmap.root !== undefined;
    };

    export const mockDragDropContext = ({ children }: { children: React.ReactNode }) => {
      // Mock for react-beautiful-dnd DragDropContext
      return React.createElement('div', null, children);
    };

    export const mockDroppable = ({ children }: { children: (provided: any) => React.ReactNode }) => {
      // Mock for react-beautiful-dnd Droppable
      return children({
        droppableProps: {},
        innerRef: jest.fn(),
        placeholder: null
      });
    };

    export const mockDraggable = ({ children }: { children: (provided: any) => React.ReactNode }) => {
      // Mock for react-beautiful-dnd Draggable
      return children({
        draggableProps: { style: {} },
        dragHandleProps: {},
        innerRef: jest.fn(),
      });
    };
    ```
