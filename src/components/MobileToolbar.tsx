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
  
  // Safe area handling for notched devices
  padding-bottom: max(8px, env(safe-area-inset-bottom));
`;

const MobileToolbarButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: none;
  border: none;
  color: ${props => {
    if (props.$variant === 'primary') return '#4A90E2';
    if (props.$variant === 'danger') return '#EF4444';
    return '#6B7280';
  }};
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-width: 60px;
  min-height: 44px; // Minimum touch target
  
  &:hover {
    background: #F9FAFB;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MobileButtonLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  text-align: center;
`;

const MobileActionMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 70px; // Above bottom toolbar
  left: 16px;
  right: 16px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(${props => props.$isOpen ? '0' : '100vh'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 200;
  max-height: 50vh;
  overflow-y: auto;
  
  // Safe area handling
  padding-bottom: max(16px, env(safe-area-inset-bottom));
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

const MenuItem = styled.div<{ $disabled?: boolean }>`
  width: 100%;
  padding: 16px;
  color: ${props => props.$disabled ? '#9CA3AF' : '#374151'};
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #F3F4F6;
  opacity: ${props => props.$disabled ? 0.5 : 1};
  
  &:hover {
    background: ${props => props.$disabled ? 'transparent' : '#F9FAFB'};
  }
  
  &:active {
    background: ${props => props.$disabled ? 'transparent' : '#F3F4F6'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MenuHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  const { selectedPath, setSelectedPath } = useSelectedPath();
  const [showMenu, setShowMenu] = React.useState(false);

  const hasSelection = selectedPath.length > 0;
  const hasRootSelection = selectedPath.length === 0;

  const handleSaveAs = async (format: FileFormat) => {
    const path = await saveAsFile(mindmap, format);
    if (path) {
      if (format === 'json') {
        setJsonFilePath(path);
      } else {
        setTextFilePath(path);
      }
    }
    setShowMenu(false);
  };

  const handleLoad = async () => {
    const { mindmap: newMindMap, path } = await loadFromFile();
    
    if (newMindMap) {
      setMindmap(newMindMap);
      const format = path.endsWith('.txt') ? 'text' : 'json';
      if (format === 'json') {
        setJsonFilePath(path);
      } else {
        setTextFilePath(path);
      }
    }
    setShowMenu(false);
  };

  const handleAddChild = () => {
    if (hasSelection || hasRootSelection) {
      addNode(selectedPath, 'New Node');
    }
  };

  const handleDelete = () => {
    if (hasSelection) {
      deleteNode(selectedPath);
    }
  };

  const handleGoHome = () => {
    setSelectedPath([]);
    // Scroll to top when going home
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMoveUp = () => {
    if (hasSelection) {
      const newPath = moveNodeUp(selectedPath);
      if (newPath !== selectedPath) {
        setSelectedPath(newPath);
      }
    }
  };

  const handleMoveDown = () => {
    if (hasSelection) {
      const newPath = moveNodeDown(selectedPath);
      if (newPath !== selectedPath) {
        setSelectedPath(newPath);
      }
    }
  };

  const handleCopyJson = () => {
    if (hasSelection || hasRootSelection) {
      copyNodeAsJson(selectedPath);
    }
  };

  const handleCopyText = () => {
    if (hasSelection || hasRootSelection) {
      copyNodeAsText(selectedPath);
    }
  };

  const handlePasteJson = () => {
    if (hasSelection || hasRootSelection) {
      pasteNodeAsJson(selectedPath);
    }
  };

  const handlePasteText = () => {
    if (hasSelection || hasRootSelection) {
      pasteNodeAsText(selectedPath);
    }
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setShowMenu(false);
  };

  // Only show on mobile devices
  if (!isMobile) return null;

  return (
    <>
      <MobileToolbarContainer data-testid="mobile-toolbar">
        <MobileToolbarButton onClick={handleGoHome} title="Go to Root and Scroll to Top">
          <Home size={20} />
          <MobileButtonLabel>Home</MobileButtonLabel>
        </MobileToolbarButton>
        
        <MobileToolbarButton 
          onClick={handleAddChild} 
          disabled={!(hasSelection || hasRootSelection)} 
          title="Add Child Node"
          $variant="primary"
        >
          <Plus size={20} />
          <MobileButtonLabel>Add</MobileButtonLabel>
        </MobileToolbarButton>
        
        <MobileToolbarButton 
          onClick={handleDelete} 
          disabled={!hasSelection} 
          title="Delete Node"
          $variant="danger"
        >
          <Trash2 size={20} />
          <MobileButtonLabel>Delete</MobileButtonLabel>
        </MobileToolbarButton>
        
        <MobileToolbarButton onClick={handleLoad} title="Load File">
          <FolderOpen size={20} />
          <MobileButtonLabel>Load</MobileButtonLabel>
        </MobileToolbarButton>
        
        <MobileToolbarButton 
          onClick={() => setShowMenu(true)} 
          title="More Options"
        >
          <MoreVertical size={20} />
          <MobileButtonLabel>More</MobileButtonLabel>
        </MobileToolbarButton>
      </MobileToolbarContainer>
      
      <MenuOverlay $isOpen={showMenu} onClick={() => setShowMenu(false)} data-testid="menu-overlay" />
      <MobileActionMenu $isOpen={showMenu}>
        <MenuHeader>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>More Options</h3>
          <button 
            onClick={() => setShowMenu(false)}
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
            �
          </button>
        </MenuHeader>
        
        <MenuItem onClick={() => handleMenuItemClick(() => handleSaveAs('json'))}>
          <Save size={20} />
          Save as JSON
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuItemClick(() => handleSaveAs('text'))}>
          <Edit size={20} />
          Save as Text
        </MenuItem>
        
        <MenuItem 
          onClick={() => !hasSelection || handleMenuItemClick(handleMoveUp)} 
          $disabled={!hasSelection}
        >
          <ChevronUp size={20} />
          Move Up
        </MenuItem>
        
        <MenuItem 
          onClick={() => !hasSelection || handleMenuItemClick(handleMoveDown)} 
          $disabled={!hasSelection}
        >
          <ChevronDown size={20} />
          Move Down
        </MenuItem>
        
        <MenuItem 
          onClick={() => !(hasSelection || hasRootSelection) || handleMenuItemClick(handleCopyJson)} 
          $disabled={!(hasSelection || hasRootSelection)}
        >
          <Copy size={20} />
          Copy as JSON
        </MenuItem>
        
        <MenuItem 
          onClick={() => !(hasSelection || hasRootSelection) || handleMenuItemClick(handleCopyText)} 
          $disabled={!(hasSelection || hasRootSelection)}
        >
          <FileText size={20} />
          Copy as Text
        </MenuItem>
        
        <MenuItem 
          onClick={() => !(hasSelection || hasRootSelection) || handleMenuItemClick(handlePasteJson)} 
          $disabled={!(hasSelection || hasRootSelection)}
        >
          <Copy size={20} />
          Paste JSON
        </MenuItem>
        
        <MenuItem 
          onClick={() => !(hasSelection || hasRootSelection) || handleMenuItemClick(handlePasteText)} 
          $disabled={!(hasSelection || hasRootSelection)}
        >
          <FileText size={20} />
          Paste Text
        </MenuItem>
      </MobileActionMenu>
    </>
  );
};