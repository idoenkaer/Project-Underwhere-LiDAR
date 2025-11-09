import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Module } from '../../types';

interface UIStateContextType {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  isLiveData: boolean;
  setIsLiveData: (isLive: boolean) => void;
  showOnboarding: boolean;
  handleCloseOnboarding: () => void;
  showEthicsSplash: boolean;
  handleCloseEthicsSplash: () => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const UIStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<Module>(Module.ROADMAP);
  const [isLiveData, setIsLiveData] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEthicsSplash, setShowEthicsSplash] = useState(false);
  
  useEffect(() => {
    if (!sessionStorage.getItem('ethicsAcknowledged')) {
      setShowEthicsSplash(true);
    } else if (!sessionStorage.getItem('onboardingComplete')) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseEthicsSplash = () => {
    sessionStorage.setItem('ethicsAcknowledged', 'true');
    setShowEthicsSplash(false);
    // After acknowledging ethics, check if onboarding is needed
    if (!sessionStorage.getItem('onboardingComplete')) {
      setShowOnboarding(true);
    }
  };

  const handleCloseOnboarding = () => {
    sessionStorage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
    setActiveModule(Module.MEASUREMENT);
  };

  const value = {
    activeModule,
    setActiveModule,
    isLiveData,
    setIsLiveData,
    showOnboarding,
    handleCloseOnboarding,
    showEthicsSplash,
    handleCloseEthicsSplash,
  };

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
};

export const useUIStateContext = (): UIStateContextType => {
  const context = useContext(UIStateContext);
  if (context === undefined) {
    throw new Error('useUIStateContext must be used within a UIStateProvider');
  }
  return context;
};