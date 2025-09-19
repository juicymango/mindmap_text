# UI Component Design Specifications

## Overview

This document provides detailed design specifications for the current UI components and proposed enhancements. Each component is analyzed with current implementation details, visual specifications, and improvement recommendations.

## Mobile UI Design Specifications

### Overview
The mobile UI design transforms the column-based desktop interface into a touch-friendly single-column view with expandable nodes. This design addresses mobile constraints while maintaining functionality and usability.

### Mobile Layout Structure

#### Mobile Container
```typescript
const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F9FAFB;
  position: relative;
`;

const MobileContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  
  // Hide scrollbar for cleaner look
  &::-webkit-scrollbar {
    display: none;
  }
`;
```

#### Mobile Header with Breadcrumb Navigation
```typescript
const MobileHeader = styled.div`
  background: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const BreadcrumbItem = styled.button`
  background: none;
  border: none;
  color: #4A90E2;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #F3F4F6;
  }
  
  &:disabled {
    color: #6B7280;
    cursor: default;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: #9CA3AF;
  font-size: 14px;
`;

const CurrentNodeTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-top: 8px;
`;
```

#### Mobile Node Component (Expandable Tree View)
```typescript
const MobileNodeContainer = styled.div<{ $depth: number; $isSelected: boolean; $isExpanded: boolean }>`
  margin-left: ${props => props.$depth * 16}px;
  margin-bottom: 4px;
  border-radius: 8px;
  background: ${props => props.$isSelected ? '#E8F4FD' : '#FFFFFF'};
  border: 1px solid ${props => props.$isSelected ? '#4A90E2' : '#E5E7EB'};
  transition: all 0.2s ease;
`;

const MobileNodeContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  min-height: 48px;
`;

const MobileNodeMain = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const ExpandButton = styled.button<{ $hasChildren: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: none;
  background: ${props => props.$hasChildren ? '#F3F4F6' : 'transparent'};
  color: ${props => props.$hasChildren ? '#6B7280' : 'transparent'};
  cursor: ${props => props.$hasChildren ? 'pointer' : 'default'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  ${props => props.$hasChildren && `
    &:hover {
      background: #E5E7EB;
    }
  `}
`;

const MobileNodeText = styled.div<{ $isSelected: boolean }>`
  font-size: 16px;
  color: ${props => props.$isSelected ? '#1F2937' : '#374151'};
  font-weight: ${props => props.$isSelected ? '600' : '400'};
  flex: 1;
  word-break: break-word;
`;

const ChildrenContainer = styled.div<{ $isExpanded: boolean }>`
  overflow: hidden;
  max-height: ${props => props.$isExpanded ? 'none' : '0'};
  transition: max-height 0.3s ease;
  margin-top: ${props => props.$isExpanded ? '8px' : '0'};
`;

const ChildrenIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  color: #6B7280;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  margin-left: 8px;
`;
```

#### Mobile Action Buttons
```typescript
const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: none;
  background: ${props => 
    props.$variant === 'primary' ? '#4A90E2' :
    props.$variant === 'danger' ? '#FEE2E2' :
    '#F3F4F6'
  };
  color: ${props => 
    props.$variant === 'primary' ? '#FFFFFF' :
    props.$variant === 'danger' ? '#EF4444' :
    '#6B7280'
  };
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => 
      props.$variant === 'primary' ? '#357ABD' :
      props.$variant === 'danger' ? '#FECACA' :
      '#E5E7EB'
    };
  }
  
  &:active {
    transform: scale(0.95);
  }
`;
```

#### Mobile Bottom Navigation Bar
```typescript
const MobileBottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-top: 1px solid #E5E7EB;
  padding: 8px 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const NavButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: ${props => props.$isActive ? '#4A90E2' : '#6B7280'};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F9FAFB;
  }
`;

const NavButtonText = styled.span`
  font-size: 11px;
  font-weight: 500;
`;
```

#### Mobile Search Bar
```typescript
const MobileSearchContainer = styled.div`
  position: sticky;
  top: 80px;
  background: #FFFFFF;
  padding: 12px 16px;
  border-bottom: 1px solid #E5E7EB;
  z-index: 90;
`;

const MobileSearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #D1D5DB;
  border-radius: 12px;
  font-size: 16px;
  background: #F9FAFB;
  
  &:focus {
    outline: none;
    border-color: #4A90E2;
    background: #FFFFFF;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
`;
```

#### Mobile Menu/Context Sheet
```typescript
const MobileMenuSheet = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  z-index: 200;
  max-height: 70vh;
  overflow-y: auto;
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
`;

const MenuItem = styled.button<{ $variant?: 'danger' }>`
  width: 100%;
  padding: 16px;
  background: none;
  border: none;
  color: ${props => props.$variant === 'danger' ? '#EF4444' : '#374151'};
  font-size: 16px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #F9FAFB;
  }
  
  &:active {
    background: #F3F4F6;
  }
`;
```

### Mobile Component Implementation

#### Mobile Node Component
```typescript
interface MobileNodeProps {
  node: MindNode;
  path: number[];
  depth: number;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleExpand: (path: number[]) => void;
  onSelect: (path: number[]) => void;
  onEdit: (path: number[]) => void;
  onDelete: (path: number[]) => void;
  onAddChild: (path: number[]) => void;
}

export const MobileNode: React.FC<MobileNodeProps> = ({
  node,
  path,
  depth,
  isSelected,
  isExpanded,
  onToggleExpand,
  onSelect,
  onEdit,
  onDelete,
  onAddChild
}) => {
  const [showActions, setShowActions] = useState(false);
  const hasChildren = node.children.length > 0;

  const handleNodeClick = () => {
    onSelect(path);
    if (hasChildren) {
      onToggleExpand(path);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(path);
    }
  };

  return (
    <>
      <MobileNodeContainer $depth={depth} $isSelected={isSelected} $isExpanded={isExpanded}>
        <MobileNodeContent>
          <MobileNodeMain>
            <ExpandButton 
              $hasChildren={hasChildren}
              onClick={handleExpandClick}
            >
              {hasChildren && (
                <ChevronRight 
                  size={20} 
                  style={{ 
                    transform: isExpanded ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s ease'
                  }} 
                />
              )}
            </ExpandButton>
            <MobileNodeText $isSelected={isSelected}>
              {node.text}
            </MobileNodeText>
            {hasChildren && (
              <ChildrenIndicator>
                {node.children.length}
              </ChildrenIndicator>
            )}
          </MobileNodeMain>
          <div style={{ display: 'flex', gap: '8px' }}>
            <ActionButton onClick={() => onAddChild(path)}>
              <Plus size={18} />
            </ActionButton>
            <ActionButton onClick={() => setShowActions(true)}>
              <MoreVertical size={18} />
            </ActionButton>
          </div>
        </MobileNodeContent>
      </MobileNodeContainer>
      
      {hasChildren && isExpanded && (
        <ChildrenContainer $isExpanded={isExpanded}>
          {node.children.map((child, index) => (
            <MobileNode
              key={index}
              node={child}
              path={[...path, index]}
              depth={depth + 1}
              isSelected={false}
              isExpanded={false}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </ChildrenContainer>
      )}
      
      {/* Mobile Action Menu */}
      {showActions && (
        <MobileMenuSheet $isOpen={showActions}>
          <MenuHeader>
            <h3 style={{ margin: 0 }}>Node Actions</h3>
            <button 
              onClick={() => setShowActions(false)}
              style={{ background: 'none', border: 'none', fontSize: '20px' }}
            >
              ×
            </button>
          </MenuHeader>
          <MenuItem onClick={() => { onEdit(path); setShowActions(false); }}>
            <Edit size={20} />
            Edit Node
          </MenuItem>
          <MenuItem onClick={() => { onAddChild(path); setShowActions(false); }}>
            <Plus size={20} />
            Add Child
          </MenuItem>
          <MenuItem onClick={() => { onDelete(path); setShowActions(false); }} $variant="danger">
            <Trash2 size={20} />
            Delete Node
          </MenuItem>
        </MobileMenuSheet>
      )}
    </>
  );
};
```

#### Mobile Mind Map Component
```typescript
interface MobileMindMapProps {
  mindmap: MindMap;
  selectedPath: number[];
  onNodeSelect: (path: number[]) => void;
  onNodeEdit: (path: number[]) => void;
  onNodeDelete: (path: number[]) => void;
  onAddChild: (path: number[]) => void;
}

export const MobileMindMap: React.FC<MobileMindMapProps> = ({
  mindmap,
  selectedPath,
  onNodeSelect,
  onNodeEdit,
  onNodeDelete,
  onAddChild
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const getNodeKey = (path: number[]) => path.join('-');

  const handleToggleExpand = (path: number[]) => {
    const key = getNodeKey(path);
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedNodes(newExpanded);
  };

  const isNodeExpanded = (path: number[]) => {
    return expandedNodes.has(getNodeKey(path));
  };

  return (
    <MobileContent>
      <MobileNode
        node={mindmap.root}
        path={[]}
        depth={0}
        isSelected={selectedPath.length === 0}
        isExpanded={isNodeExpanded([])}
        onToggleExpand={handleToggleExpand}
        onSelect={onNodeSelect}
        onEdit={onNodeEdit}
        onDelete={onNodeDelete}
        onAddChild={onAddChild}
      />
    </MobileContent>
  );
};
```

### Responsive Design Implementation

#### Responsive Container Component
```typescript
const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

export const ResponsiveMindMap: React.FC = () => {
  const { mindmap } = useMindMapStore();
  const { selectedPath, setSelectedPath } = useSelectedPath();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <ResponsiveContainer>
      <Toolbar />
      {isMobile ? (
        <MobileMindMap
          mindmap={mindmap}
          selectedPath={selectedPath}
          onNodeSelect={setSelectedPath}
          onNodeEdit={(path) => { /* handle edit */ }}
          onNodeDelete={(path) => { /* handle delete */ }}
          onAddChild={(path) => { /* handle add child */ }}
        />
      ) : (
        <MindMap />
      )}
      <StatusBar />
    </ResponsiveContainer>
  );
};
```

## 1. Toolbar Component

### Current Implementation
```typescript
// Location: src/components/Toolbar.tsx
const ToolbarContainer = styled.div`
  padding: 8px;
  border-bottom: 1px solid lightgrey;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;
```

### Visual Specifications
- **Height**: 48px minimum
- **Background**: White (#FFFFFF)
- **Border**: 1px solid #DEE2E6 at bottom
- **Padding**: 8px horizontal and vertical
- **Gap**: 8px between elements

### Button Groups
```typescript
// Current button groups structure
<ButtonGroup>
  <button>Add Child</button>
  <button>Delete</button>
  <button>Move Up</button>
  <button>Move Down</button>
</ButtonGroup>

<ButtonGroup>
  <button>Copy JSON</button>
  <button>Copy Text</button>
  <button>Paste JSON</button>
  <button>Paste Text</button>
</ButtonGroup>

<ButtonGroup>
  <button>Save As JSON</button>
  <button>Save As Text</button>
  <button>Load File</button>
</ButtonGroup>
```

### Enhancement Specifications
```typescript
// Enhanced Toolbar Container
const ToolbarContainer = styled.div`
  height: 48px;
  background: #FFFFFF;
  border-bottom: 1px solid #DEE2E6;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// Enhanced Button Group
const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 8px;
  border-right: 1px solid #E5E7EB;
  
  &:last-child {
    border-right: none;
  }
`;

// Enhanced Button
const ToolbarButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  background: #FFFFFF;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F9FAFB;
    border-color: #9CA3AF;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.variant === 'primary' && `
    background: #4A90E2;
    border-color: #4A90E2;
    color: white;
    
    &:hover {
      background: #357ABD;
      border-color: #357ABD;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    border-color: #EF4444;
    color: #EF4444;
    
    &:hover {
      background: #FEE2E2;
      border-color: #DC2626;
    }
  `}
`;
```

### Icon Integration
```typescript
// Button with icon structure
<ToolbarButton>
  <PlusIcon size={16} />
  <span>Add Child</span>
</ToolbarButton>
```

## 2. MindMap Container Component

### Current Implementation
```typescript
// Location: src/components/MindMap.tsx
const MindMapContainer = styled.div`
  display: flex;
  overflow-x: auto;
`;
```

### Enhancement Specifications
```typescript
const MindMapContainer = styled.div`
  display: flex;
  overflow-x: auto;
  height: calc(100vh - 48px); // Subtract toolbar height
  background: #F9FAFB;
  
  // Custom scrollbar styling
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F3F4F6;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
  }
`;
```

## 3. Column Component

### Current Implementation
```typescript
// Location: src/components/Column.tsx
const ColumnContainer = styled.div`
  margin: 8px;
  padding: 8px;
  border: 1px solid lightgrey;
  border-radius: 4px;
  width: 220px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;
```

### Enhancement Specifications
```typescript
const ColumnContainer = styled.div<{ $isRoot?: boolean }>`
  margin: 8px 4px;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  width: 240px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  ${props => props.$isRoot && `
    border-left: 4px solid #4A90E2;
  `}
  
  // Column header
  &::before {
    content: '';
    height: 1px;
    background: #E5E7EB;
    margin-bottom: 8px;
  }
`;
```

### Column Header Enhancement
```typescript
const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #E5E7EB;
`;

const ColumnTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ColumnActions = styled.div`
  display: flex;
  gap: 4px;
`;
```

## 4. Node Component

### Current Implementation
```typescript
// Location: src/components/Node.tsx
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
```

### Enhancement Specifications
```typescript
const NodeContainer = styled.div<{ $nodeType: NodeType; $isDragging?: boolean }>`
  position: relative;
  padding: 12px;
  border: 2px solid ${(props) => NODE_COLORS[props.$nodeType].border};
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => NODE_COLORS[props.$nodeType].background};
  color: ${(props) => NODE_COLORS[props.$nodeType].text};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  
  // Drag handle
  &::before {
    content: '⋮⋮';
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    color: ${(props) => NODE_COLORS[props.$nodeType].text};
    opacity: 0.3;
    font-size: 12px;
    line-height: 1;
  }
  
  &:hover {
    background-color: ${(props) => NODE_COLORS[props.$nodeType].hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-color: ${(props) => NODE_COLORS[props.$nodeType].border};
    
    &::before {
      opacity: 0.6;
    }
  }
  
  &:focus {
    outline: 2px solid ${(props) => NODE_COLORS.selected.border};
    outline-offset: 2px;
  }
  
  ${props => props.$isDragging && `
    opacity: 0.5;
    transform: rotate(2deg);
  `}
`;

// Node content container
const NodeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 16px; // Space for drag handle
  min-width: 0;
`;

// Node text
const NodeText = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  word-wrap: break-word;
`;

// Node metadata
const NodeMeta = styled.div`
  font-size: 12px;
  color: inherit;
  opacity: 0.7;
  margin-top: 2px;
`;

// Node actions
const NodeActions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${NodeContainer}:hover & {
    opacity: 1;
  }
`;
```

### Node Enhancement Features
```typescript
// Enhanced node with actions
const Node: React.FC<NodeProps> = ({ node, path, index, onSelect }) => {
  // ... existing logic
  
  return (
    <NodeContainer
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      $nodeType={nodeType}
      tabIndex={0}
      draggable
    >
      <NodeContent>
        <NodeText>{node.text}</NodeText>
        {node.children.length > 0 && (
          <NodeMeta>{node.children.length} children</NodeMeta>
        )}
      </NodeContent>
      
      <NodeActions>
        <ActionButton onClick={handleAddChild} title="Add Child">
          <PlusIcon size={14} />
        </ActionButton>
        <ActionButton onClick={handleEdit} title="Edit">
          <EditIcon size={14} />
        </ActionButton>
        <ActionButton onClick={handleDelete} title="Delete">
          <TrashIcon size={14} />
        </ActionButton>
      </NodeActions>
      
      {isEditing && (
        <NodeEditor
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      )}
    </NodeContainer>
  );
};
```

## 5. Status Bar Component (New)

### Specifications
```typescript
const StatusBar = styled.div`
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

const StatusBarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
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
```

## 6. Search Component (New)

### Specifications
```typescript
const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4A90E2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
`;
```

## 7. Context Menu Component (New)

### Specifications
```typescript
const ContextMenu = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
`;

const ContextMenuItem = styled.div<{ $danger?: boolean }>`
  padding: 8px 16px;
  font-size: 14px;
  color: ${props => props.$danger ? '#EF4444' : '#374151'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #F9FAFB;
  }
  
  ${props => props.$danger && `
    &:hover {
      background: #FEE2E2;
    }
  `}
`;

const ContextMenuSeparator = styled.div`
  height: 1px;
  background: #E5E7EB;
  margin: 4px 0;
`;
```

## Design Tokens

### Colors
```typescript
export const COLORS = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;
```

### Spacing
```typescript
export const SPACING = {
  px: '1px',
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem',  // 8px
  3: '0.75rem', // 12px
  4: '1rem',    // 16px
  5: '1.25rem', // 20px
  6: '1.5rem',  // 24px
  8: '2rem',    // 32px
  10: '2.5rem', // 40px
  12: '3rem',   // 48px
  16: '4rem',   // 64px
} as const;
```

### Typography
```typescript
export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
```

## Implementation Guidelines

### 1. Component Structure
- Maintain existing component hierarchy
- Add new components as extensions
- Use composition over inheritance
- Implement proper TypeScript interfaces

### 2. Styling Approach
- Use styled-components for component styling
- Implement design tokens for consistency
- Use CSS variables for theming
- Maintain responsive design principles

### 3. Accessibility
- Implement proper ARIA labels
- Ensure keyboard navigation
- Provide sufficient color contrast
- Add screen reader support

### 4. Performance
- Use React.memo for expensive components
- Implement virtual scrolling where needed
- Optimize re-renders with proper dependencies
- Use lazy loading for non-critical components

This design specification provides a comprehensive guide for enhancing the UI components while maintaining the existing functionality and architectural patterns.