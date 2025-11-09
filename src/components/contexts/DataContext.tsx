import React, { createContext, useContext, ReactNode, useState } from 'react';
import { ScientificDatabase } from '../../types';
import { db as initialDb } from '../../infrastructure/data/mockData';

interface DataContextType {
  database: ScientificDatabase;
  setDatabase: React.Dispatch<React.SetStateAction<ScientificDatabase>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [database, setDatabase] = useState<ScientificDatabase>(initialDb);

  const value = {
    database,
    setDatabase,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
