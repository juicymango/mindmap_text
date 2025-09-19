import React from 'react';
import styled from 'styled-components';
import { ChevronRight, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { MindNode } from '../../types';
import { useMobileState } from '../../hooks/useMobileState';

interface MobileNodeProps {
  node: MindNode;
  path: number[];
  depth: number;
  isSelected: boolean;
  onNodeSelect: (path: number[]) => void;
  onNodeEdit: (path: number[]) => void;
  onNodeDelete: (path: number[]) => void;
  onAddChild: (path: number[]) => void;
}

const MobileNodeContainer = styled.div<{ $depth: number; $isSelected: boolean; $isExpanded: boolean }>`
  margin-left: ${props => props.$depth * 16}px;
  margin-bottom: 4px;
  border-radius: 8px;
  background: ${props => props.$isSelected ? '#E8F4FD' : '#FFFFFF'};
  border: 1px solid ${props => props.$isSelected ? '#4A90E2' : '#E5E7EB'};
  transition: all 0.2s ease;
  position: relative;
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
  min-width: 0;
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
  flex-shrink: 0;
  
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
  white-space: pre-wrap;
  min-width: 0;
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
  flex-shrink: 0;
`;

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
  flex-shrink: 0;
  
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

const ChildrenContainer = styled.div<{ $isExpanded: boolean }>`
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: ${props => props.$isExpanded ? '5000px' : '0'};
  opacity: ${props => props.$isExpanded ? '1' : '0'};
`;

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

const MenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.$isOpen ? '1' : '0'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
  z-index: 199;
`;

export const MobileNode: React.FC<MobileNodeProps> = ({
  node,
  path,
  depth,
  isSelected,
  onNodeSelect,
  onNodeEdit,
  onNodeDelete,
  onAddChild
}) => {
  const { 
    expandedNodes, 
    toggleExpand, 
    actionMenuPath, 
    setActionMenuPath,
    setEditingPath
  } = useMobileState();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(node.text);
  
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedNodes.has(path.join('-'));
  const isActionMenuOpen = actionMenuPath && path.join('-') === actionMenuPath.join('-');

  
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      toggleExpand(path);
    }
  };

  const handleEditClick = () => {
    setEditingPath(path);
    setIsEditing(true);
    setEditText(node.text);
    setActionMenuPath(null);
  };

  const handleDeleteClick = () => {
    onNodeDelete(path);
    setActionMenuPath(null);
  };

  const handleAddChildClick = () => {
    onAddChild(path);
    setActionMenuPath(null);
  };

  const handleEditSave = () => {
    if (editText.trim()) {
      onNodeEdit(path);
      // The actual text update will be handled by the parent component
    }
    setEditingPath(null);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditingPath(null);
    setIsEditing(false);
  };

  return (
    <>
      <MobileNodeContainer $depth={depth} $isSelected={isSelected} $isExpanded={isExpanded}>
        <MobileNodeContent>
          <MobileNodeMain>
            <ExpandButton 
              $hasChildren={hasChildren}
              onClick={handleExpandClick}
              aria-label={hasChildren ? (isExpanded ? "Collapse" : "Expand") : undefined}
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
              <ChildrenIndicator aria-label={`${node.children.length} children`}>
                {node.children.length}
              </ChildrenIndicator>
            )}
          </MobileNodeMain>
          <div style={{ display: 'flex', gap: '8px' }}>
            <ActionButton 
              onClick={() => onAddChild(path)}
              title="Add Child"
              aria-label="Add Child"
            >
              <Plus size={18} />
            </ActionButton>
            <ActionButton 
              onClick={() => setActionMenuPath(path)}
              title="More Actions"
              aria-label="More Actions"
            >
              <MoreVertical size={18} />
            </ActionButton>
          </div>
        </MobileNodeContent>
      </MobileNodeContainer>
      
      {hasChildren && isExpanded && (
        <ChildrenContainer $isExpanded={isExpanded}>
          {node.children.map((child: MindNode, index: number) => (
            <MobileNode
              key={index}
              node={child}
              path={[...path, index]}
              depth={depth + 1}
              isSelected={false}
              onNodeSelect={onNodeSelect}
              onNodeEdit={onNodeEdit}
              onNodeDelete={onNodeDelete}
              onAddChild={onAddChild}
            />
          ))}
        </ChildrenContainer>
      )}
      
      {/* Mobile Action Menu */}
      <MenuOverlay $isOpen={!!isActionMenuOpen} onClick={() => setActionMenuPath(null)} />
      <MobileMenuSheet $isOpen={!!isActionMenuOpen}>
        <MenuHeader>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Node Actions</h3>
          <button 
            onClick={() => setActionMenuPath(null)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              color: '#6B7280',
              padding: '4px',
              borderRadius: '4px'
            }}
            aria-label="Close menu"
          >
            ×
          </button>
        </MenuHeader>
        <MenuItem onClick={handleEditClick}>
          <Edit size={20} />
          Edit Node
        </MenuItem>
        <MenuItem onClick={handleAddChildClick}>
          <Plus size={20} />
          Add Child
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} $variant="danger">
          <Trash2 size={20} />
          Delete Node
        </MenuItem>
      </MobileMenuSheet>
      
      {/* Edit Modal (if needed) */}
      {isEditing && (
        <MobileMenuSheet $isOpen={isEditing}>
          <MenuHeader>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Edit Node</h3>
            <button 
              onClick={handleEditCancel}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '24px', 
                cursor: 'pointer',
                color: '#6B7280',
                padding: '4px',
                borderRadius: '4px'
              }}
              aria-label="Cancel editing"
            >
              ×
            </button>
          </MenuHeader>
          <div style={{ padding: '16px' }}>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Enter node text..."
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <ActionButton 
                onClick={handleEditSave}
                $variant="primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Save
              </ActionButton>
              <ActionButton 
                onClick={handleEditCancel}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </ActionButton>
            </div>
          </div>
        </MobileMenuSheet>
      )}
    </>
  );
};