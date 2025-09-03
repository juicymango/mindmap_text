import React from 'react';
import { MindMap } from './MindMap';
import { Toolbar } from './Toolbar';
import { GlobalStyles } from '../styles/GlobalStyles';

export const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <Toolbar />
      <MindMap />
    </>
  );
};
