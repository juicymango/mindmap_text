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

const NodeCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #F3F4F6;
  border-radius: 4px;
  font-size: 11px;
  color: #4B5563;
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
  const hasChildren = mindmap.root.children && mindmap.root.children.length > 0;
  
  const getCurrentFilePath = () => {
    return jsonFilePath || textFilePath || 'No file selected';
  };
  
  const getFileFormat = () => {
    if (jsonFilePath) return 'JSON';
    if (textFilePath) return 'Text';
    return 'None';
  };
  
  return (
    <StatusBarContainer>
      <StatusBarSection>
        <StatusItem title="Save status">
          <StatusIndicator $status={saveStatus} />
          <span>{saveStatus === 'saved' ? 'Saved' : saveStatus === 'unsaved' ? 'Unsaved' : 'Saving'}</span>
        </StatusItem>
        
        <StatusItem title="File path">
          <FileText size={12} />
          <span>{getCurrentFilePath()}</span>
        </StatusItem>
        
        <StatusItem title="File format">
          <span>Format: {getFileFormat()}</span>
        </StatusItem>
      </StatusBarSection>
      
      <StatusBarSection>
        {hasChildren && (
          <NodeCount title="Total nodes in mind map">
            <span>{totalNodes} nodes</span>
          </NodeCount>
        )}
        
        <StatusItem title="Last saved">
          <Clock size={12} />
          <span>Just now</span>
        </StatusItem>
      </StatusBarSection>
    </StatusBarContainer>
  );
};