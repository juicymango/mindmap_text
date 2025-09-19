import React from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { Column } from './Column';
import { useSelectedPath } from '../contexts/SelectedPathContext';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { useGestureNavigation } from '../hooks/useGestureNavigation';
import styled from 'styled-components';
import { MindNode } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MindMapContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden; // Prevent vertical scrolling at MindMap level
  flex: 1;
  background: #F9FAFB;
  align-items: flex-start; // Align columns to top when they have different heights
  min-height: 0; // Allow flex container to shrink properly
  
  // Mobile-optimized scrolling and styling
  ${props => props.$isMobile && `
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 16px;
    padding: 0 8px;
    padding-bottom: 80px; // Space for bottom toolbar
    
    // Mobile scrollbar
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #F3F4F6;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #D1D5DB;
      border-radius: 3px;
    }
  `}
  
  // Desktop scrollbar styling
  ${props => !props.$isMobile && `
    // Custom scrollbar styling for horizontal scroll
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
  `}
`;

const SwipeIndicator = styled.div<{ $direction: 'left' | 'right'; $show: boolean }>`
  position: fixed;
  top: 50%;
  ${props => props.$direction === 'left' ? 'left: 16px;' : 'right: 16px;'}
  transform: translateY(-50%);
  background: rgba(74, 144, 226, 0.9);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.2s ease;
  z-index: 50;
  pointer-events: none;
`;

export const MindMap: React.FC = () => {
  const { mindmap, setSelectedChild } = useMindMapStore();
  const { selectedPath, setSelectedPath } = useSelectedPath();
  const { isMobile, columnWidth } = useMobileDetection();
  
  // Gesture navigation for mobile
  const handleSwipeLeft = () => {
    // Navigate to next column (expand selection)
    const selectedChildIndex = mindmap.root.selected_child_idx ?? 0;
    if (selectedChildIndex < mindmap.root.children.length - 1) {
      setSelectedChild([], selectedChildIndex + 1);
      setSelectedPath([selectedChildIndex + 1]);
    }
  };
  
  const handleSwipeRight = () => {
    // Navigate to previous column (collapse selection)
    if (selectedPath.length > 0) {
      const parentPath = selectedPath.slice(0, -1);
      const newSelectedIndex = Math.max(0, selectedPath[selectedPath.length - 1] - 1);
      setSelectedChild(parentPath, newSelectedIndex);
      setSelectedPath([...parentPath, newSelectedIndex]);
    }
  };
  
  const { touchHandlers, indicators } = useGestureNavigation({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    minSwipeDistance: 50,
    maxVerticalDeviation: 50,
  });

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
    <>
      <MindMapContainer 
        $isMobile={isMobile}
        {...touchHandlers}
      >
        {columns.map((column, index) => (
          <Column
            key={`${JSON.stringify(column.path)}-${index}`}
            columnPath={column.path}
            nodes={column.nodes}
            index={index}
            onNodeSelect={handleNodeSelect}
            isMobile={isMobile}
            columnWidth={columnWidth}
          />
        ))}
      </MindMapContainer>
      
      {/* Swipe indicators for mobile */}
      {isMobile && (
        <>
          <SwipeIndicator 
            $direction="left" 
            $show={indicators.showLeft}
          >
            <ChevronLeft size={20} />
          </SwipeIndicator>
          <SwipeIndicator 
            $direction="right" 
            $show={indicators.showRight}
          >
            <ChevronRight size={20} />
          </SwipeIndicator>
        </>
      )}
    </>
  );
};