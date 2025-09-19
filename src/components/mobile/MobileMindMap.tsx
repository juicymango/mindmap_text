import React from 'react';
import styled from 'styled-components';
import { MindMap as MindMapType, MindNode } from '../../types';
import { MobileNode } from './MobileNode';

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
  
  // For Firefox
  scrollbar-width: none;
`;

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

interface MobileMindMapProps {
  mindmap: MindMapType;
  selectedPath: number[];
  onNodeSelect: (path: number[]) => void;
  onNodeEdit: (path: number[]) => void;
  onNodeDelete: (path: number[]) => void;
  onAddChild: (path: number[]) => void;
}

// Helper function to get node by path
const getNodeByPath = (root: MindNode, path: number[]): MindNode | null => {
  let current: MindNode = root;
  for (const index of path) {
    if (current.children && current.children[index]) {
      current = current.children[index];
    } else {
      return null;
    }
  }
  return current;
};

// Helper function to get node name by path
const getNodeNameByPath = (root: MindNode, path: number[]): string => {
  const node = getNodeByPath(root, path);
  return node ? node.text : '';
};

export const MobileMindMap: React.FC<MobileMindMapProps> = ({
  mindmap,
  selectedPath,
  onNodeSelect,
  onNodeEdit,
  onNodeDelete,
  onAddChild
}) => {

  const handleBreadcrumbClick = (path: number[]) => {
    onNodeSelect(path);
  };

  const renderBreadcrumbs = () => {
    const breadcrumbs = [];
    
    // Add root
    breadcrumbs.push({
      path: [],
      label: mindmap.root.text,
      isCurrent: selectedPath.length === 0
    });

    // Add path segments
    for (let i = 0; i < selectedPath.length; i++) {
      const pathSegment = selectedPath.slice(0, i + 1);
      const label = getNodeNameByPath(mindmap.root, pathSegment);
      
      if (label) {
        breadcrumbs.push({
          path: pathSegment,
          label,
          isCurrent: i === selectedPath.length - 1
        });
      }
    }

    return (
      <BreadcrumbContainer>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
            <BreadcrumbItem
              onClick={() => handleBreadcrumbClick(crumb.path)}
              disabled={crumb.isCurrent}
            >
              {crumb.label}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbContainer>
    );
  };

  const getCurrentNodeName = () => {
    if (selectedPath.length === 0) {
      return mindmap.root.text;
    }
    return getNodeNameByPath(mindmap.root, selectedPath) || '';
  };

  return (
    <MobileContainer>
      <MobileHeader>
        {renderBreadcrumbs()}
        <CurrentNodeTitle>
          {getCurrentNodeName()}
        </CurrentNodeTitle>
      </MobileHeader>
      
      <MobileContent>
        <MobileNode
          node={mindmap.root}
          path={[]}
          depth={0}
          isSelected={selectedPath.length === 0}
          onNodeSelect={onNodeSelect}
          onNodeEdit={onNodeEdit}
          onNodeDelete={onNodeDelete}
          onAddChild={onAddChild}
        />
      </MobileContent>
    </MobileContainer>
  );
};