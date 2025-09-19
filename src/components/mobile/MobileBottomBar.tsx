import React from 'react';
import styled from 'styled-components';
import { Home, Plus, FolderOpen, Save, FileText, Menu } from 'lucide-react';

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
  min-width: 60px;
  
  &:hover {
    background: #F9FAFB;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NavButtonText = styled.span`
  font-size: 11px;
  font-weight: 500;
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

const MenuItem = styled.div`
  width: 100%;
  padding: 16px;
  color: #374151;
  font-size: 16px;
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

interface MobileBottomBarProps {
  onHome: () => void;
  onAddNode: () => void;
  onLoad: () => void;
  onSave: () => void;
  onSaveAsText: () => void;
  hasSelection: boolean;
  canGoHome: boolean;
}

export const MobileBottomBarComponent: React.FC<MobileBottomBarProps> = ({
  onHome,
  onAddNode,
  onLoad,
  onSave,
  onSaveAsText,
  hasSelection,
  canGoHome
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleMenuClick = () => {
    setShowMenu(true);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setShowMenu(false);
  };

  return (
    <>
      <MobileBottomBar>
        <NavButton onClick={onHome} disabled={!canGoHome} title="Go to Root">
          <Home size={20} />
          <NavButtonText>Home</NavButtonText>
        </NavButton>
        
        <NavButton onClick={onAddNode} disabled={!hasSelection} title="Add Child Node">
          <Plus size={20} />
          <NavButtonText>Add</NavButtonText>
        </NavButton>
        
        <NavButton onClick={onLoad} title="Load File">
          <FolderOpen size={20} />
          <NavButtonText>Load</NavButtonText>
        </NavButton>
        
        <NavButton onClick={onSave} title="Save as JSON">
          <Save size={20} />
          <NavButtonText>Save</NavButtonText>
        </NavButton>
        
        <NavButton onClick={handleMenuClick} title="More Options">
          <Menu size={20} />
          <NavButtonText>More</NavButtonText>
        </NavButton>
      </MobileBottomBar>
      
      <MenuOverlay $isOpen={showMenu} onClick={() => setShowMenu(false)} />
      <MobileMenuSheet $isOpen={showMenu}>
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
            ×
          </button>
        </MenuHeader>
        
        <MenuItem onClick={() => handleMenuItemClick(onSaveAsText)}>
          <FileText size={20} />
          Save as Text
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuItemClick(onSave)}>
          <Save size={20} />
          Save as JSON
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuItemClick(onLoad)}>
          <FolderOpen size={20} />
          Load File
        </MenuItem>
      </MobileMenuSheet>
    </>
  );
};