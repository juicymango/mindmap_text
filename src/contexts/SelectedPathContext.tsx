import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedPathContextType {
  selectedPath: number[];
  setSelectedPath: (path: number[]) => void;
}

const SelectedPathContext = createContext<SelectedPathContextType | undefined>(undefined);

export const SelectedPathProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPath, setSelectedPath] = useState<number[]>([]);

  return (
    <SelectedPathContext.Provider value={{ selectedPath, setSelectedPath }}>
      {children}
    </SelectedPathContext.Provider>
  );
};

export const useSelectedPath = () => {
  const context = useContext(SelectedPathContext);
  if (context === undefined) {
    throw new Error('useSelectedPath must be used within a SelectedPathProvider');
  }
  return context;
};