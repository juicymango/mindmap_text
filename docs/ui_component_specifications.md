# UI Component Design Specifications

## Overview

This document provides detailed design specifications for the current UI components and proposed enhancements. Each component is analyzed with current implementation details, visual specifications, and improvement recommendations.

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