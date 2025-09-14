import React from 'react';
import { MindMap } from './MindMap';
import { Toolbar } from './Toolbar';
import { GlobalStyles } from '../styles/GlobalStyles';
import { SelectedPathProvider } from '../contexts/SelectedPathContext';

export const App: React.FC = () => {
  return (
    <SelectedPathProvider>
      <GlobalStyles />
      <Toolbar />
      <MindMap />
    </SelectedPathProvider>
  );
};
