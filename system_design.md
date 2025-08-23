# Mind Map System Design

## Overview
A web-based mind mapping application that supports node operations and text-based data persistence.

## Architecture

### Data Model
```javascript
class Node {
  id: string
  text: string
  expanded: boolean
  children: Node[]
  parent: Node | null
}

class MindMap {
  root: Node
  nodes: Map<string, Node>
}
```

### Text Data Format
Indentation-based format with state markers and multi-line support:
```
- Central Topic
  - Main Idea 1 [expanded]
    - Subpoint 1.1
      This is a multi-line node
      with detailed description
      spanning multiple lines
    - Subpoint 1.2 [collapsed]
  - Main Idea 2
    - Subpoint 2.1
```

**Format Specification:**
- Each node starts with `- ` prefix at appropriate indentation level
- Indentation level determines hierarchy (2 spaces per level)
- `[expanded]` or `[collapsed]` markers indicate node state (default: expanded)
- **Multi-line nodes**: Subsequent lines without `- ` prefix belong to previous node
- Multi-line content indented to same level as node text
- Empty lines separate nodes for readability

### Component Architecture

1. **Tree Model** - Manages node hierarchy and relationships
2. **Renderer** - Handles visual representation (Canvas/SVG)
3. **Operations Manager** - Coordinates user interactions
4. **Serializer** - Handles text format conversion

### UI Components
- Canvas/SVG container for mind map visualization
- Context menu for node operations
- Toolbar for global actions
- Import/export file controls

### Operations Implementation
- **Create Node**: Right-click context menu or keyboard shortcut
- **Edit Node**: Double-click or context menu
- **Expand/Collapse**: Click expander icon or keyboard shortcut
- **Move Node**: Drag-and-drop with visual feedback
- **Remove Node**: Delete key or context menu option (removes node and all children)

### Serialization Protocol
**To Text:**
- Recursive depth-first traversal
- Indentation based on node depth
- Append state markers when not default
- **Multi-line handling**: Split node text by newlines, indent subsequent lines

**From Text:**
- Parse lines with regex pattern to identify node starters (`- `)
- Track indentation levels to build hierarchy
- Extract state markers from node text
- **Multi-line handling**: Collect subsequent non-node lines into current node text
- Join multi-line content with newline characters

### File Structure
```
index.html          # Main application
styles.css          # Styling
app.js             # Main application logic
mindmap.js         # Core mind map classes
renderer.js        # Visualization engine
serializer.js      # Text format handling
```