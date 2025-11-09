import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Module, ScientificDatabase, ScanMetadata } from '../../types';
import { db } from '../../infrastructure/data/mockData';

interface AppContextType {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  isLiveData: boolean;
  setIsLiveData: (isLive: boolean) => void;
  showOnboarding: boolean;
  handleCloseOnboarding: () => void;
  database: ScientificDatabase;
  scanMeta: ScanMetadata;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<Module>(Module.ROADMAP);
  const [isLiveData, setIsLiveData] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    if (!sessionStorage.getItem('onboardingComplete')) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    sessionStorage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
    // FIX: Replaced Module.MEASUREMENT with Module.SCAN_CALIBRATE, as MEASUREMENT is not a valid module.
    setActiveModule(Module.SCAN_CALIBRATE);
  };

  const value = {
    activeModule,
    setActiveModule,
    isLiveData,
    setIsLiveData,
    showOnboarding,
    handleCloseOnboarding,
    database: db,
    scanMeta: db.scanMeta,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};