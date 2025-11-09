import React, { createContext, useContext, ReactNode } from 'react';
import { ScientificDatabase, ScanMetadata } from '../../types';
import { db } from '../../infrastructure/data/mockData';

interface DataContextType {
  database: ScientificDatabase;
  scanMeta: ScanMetadata;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = {
    database: db,
    scanMeta: db.scanMeta,
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