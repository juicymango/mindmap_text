import React from 'react';
import { ResponsiveMindMap } from './ResponsiveMindMap';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { MobileToolbar } from './MobileToolbar';
import { GlobalStyles } from '../styles/GlobalStyles';
import { SelectedPathProvider } from '../contexts/SelectedPathContext';
import { useMobileDetection } from '../hooks/useMobileDetection';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const App: React.FC = () => {
  const { isMobile } = useMobileDetection();
  
  return (
    <SelectedPathProvider>
      <GlobalStyles />
      <AppContainer>
        {!isMobile && <Toolbar />}
        <MainContent>
          <ResponsiveMindMap />
        </MainContent>
        {!isMobile && <StatusBar />}
        {isMobile && <MobileToolbar />}
      </AppContainer>
    </SelectedPathProvider>
  );
};
