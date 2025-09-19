import React from 'react';
import styled from 'styled-components';
import { MindMap } from './MindMap';

const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #F9FAFB;
`;

const MainContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

export const ResponsiveMindMap: React.FC = () => {
  // Use the enhanced column-based MindMap for both desktop and mobile
  // The MindMap component now handles mobile responsiveness internally
  return (
    <ResponsiveContainer>
      <MainContent>
        <MindMap />
      </MainContent>
    </ResponsiveContainer>
  );
};