import React from 'react';
import styled from 'styled-components';
import { MindMap as DesktopMindMap } from './MindMap';
import { MobileMindMap } from './mobile/MobileMindMap';
import { MobileBottomBarComponent } from './mobile/MobileBottomBar';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { useMindMapStore } from '../store/mindmapStore';
import { useSelectedPath } from '../contexts/SelectedPathContext';
import { useMobileState } from '../hooks/useMobileState';

const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #F9FAFB;
`;

const MainContent = styled.div<{ $isMobile: boolean }>`
  flex: 1;
  overflow: hidden;
  position: relative;
  
  ${props => props.$isMobile && `
    padding-bottom: 80px; // Space for bottom bar
  `}
`;

export const ResponsiveMindMap: React.FC = () => {
  const isMobile = useMobileDetection();
  const { 
    mindmap, 
    setMindmap, 
    addNode, 
    deleteNode,
    setSelectedChild,
    setJsonFilePath, 
    setTextFilePath
  } = useMindMapStore();
  
  const { selectedPath, setSelectedPath } = useSelectedPath();
  const { setExpanded, setAllExpanded, setSelectedPath: setMobileSelectedPath } = useMobileState();
  
  const hasSelection = selectedPath.length > 0;
  const canGoHome = selectedPath.length > 0;

  const handleNodeSelect = (path: number[]) => {
    setSelectedPath(path);
    setMobileSelectedPath(path);
    
    // For desktop, also handle the selected child logic
    if (!isMobile && path.length > 0) {
      const parentPath = path.slice(0, -1);
      const childIndex = path[path.length - 1];
      setSelectedChild(parentPath, childIndex);
    }
  };

  const handleNodeEdit = (path: number[]) => {
    // In a real implementation, this would open an edit dialog
    // For now, we'll just log the action
    console.log('Edit node:', path);
  };

  const handleNodeDelete = (path: number[]) => {
    if (path.length > 0) {
      deleteNode(path);
    }
  };

  const handleAddChild = (path: number[]) => {
    addNode(path, 'New Node');
    
    // Auto-expand the parent in mobile view
    if (isMobile) {
      setExpanded(path, true);
    }
  };

  const handleHome = () => {
    setSelectedPath([]);
    setMobileSelectedPath([]);
  };

  const handleAddNode = () => {
    if (hasSelection) {
      handleAddChild(selectedPath);
    }
  };

  const handleLoad = async () => {
    try {
      const response = await fetch('/api/load-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        setMindmap(result.mindmap);
        setSelectedPath([]);
        setMobileSelectedPath([]);
        
        if (result.format === 'json') {
          setJsonFilePath(result.path);
        } else {
          setTextFilePath(result.path);
        }
      }
    } catch (error) {
      console.error('Failed to load file:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/save-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mindmap,
          format: 'json'
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setJsonFilePath(result.path);
      }
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  };

  const handleSaveAsText = async () => {
    try {
      const response = await fetch('/api/save-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mindmap,
          format: 'text'
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setTextFilePath(result.path);
      }
    } catch (error) {
      console.error('Failed to save text file:', error);
    }
  };

  // Auto-expand root in mobile view
  React.useEffect(() => {
    if (isMobile) {
      setAllExpanded(true);
    }
  }, [isMobile, setAllExpanded]);

  return (
    <ResponsiveContainer>
      {/* Toolbar will be handled by the parent App component */}
      <MainContent $isMobile={isMobile}>
        {isMobile ? (
          <MobileMindMap
            mindmap={mindmap}
            selectedPath={selectedPath}
            onNodeSelect={handleNodeSelect}
            onNodeEdit={handleNodeEdit}
            onNodeDelete={handleNodeDelete}
            onAddChild={handleAddChild}
          />
        ) : (
          <DesktopMindMap />
        )}
      </MainContent>
      
      {isMobile && (
        <MobileBottomBarComponent
          onHome={handleHome}
          onAddNode={handleAddNode}
          onLoad={handleLoad}
          onSave={handleSave}
          onSaveAsText={handleSaveAsText}
          hasSelection={hasSelection}
          canGoHome={canGoHome}
        />
      )}
    </ResponsiveContainer>
  );
};