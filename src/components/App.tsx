import React from 'react';
import { MindMap } from './MindMap';
import { Toolbar } from './Toolbar';
import { GlobalStyles } from '../styles/GlobalStyles';
import { SelectedPathProvider } from '../contexts/SelectedPathContext';
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
  return (
    <SelectedPathProvider>
      <GlobalStyles />
      <AppContainer>
        <Toolbar />
        <MainContent>
          <MindMap />
        </MainContent>
      </AppContainer>
    </SelectedPathProvider>
  );
};
