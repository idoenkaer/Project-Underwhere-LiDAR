import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Module } from '../../types';

export interface LogEntry {
  timestamp: string;
  message: string;
}

interface UIStateContextType {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  isLiveData: boolean;
  setIsLiveData: (isLive: boolean) => void;
  showOnboarding: boolean;
  handleCloseOnboarding: () => void;
  showEthicsSplash: boolean;
  handleCloseEthicsSplash: () => void;
  logs: LogEntry[];
  addLog: (message: string) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const UIStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModuleInternal] = useState<Module>(Module.ROADMAP);
  const [isLiveData, setIsLiveData] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEthicsSplash, setShowEthicsSplash] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const newLog = { timestamp, message };
    setLogs(prevLogs => [...prevLogs.slice(-100), newLog]); // Keep last 100 logs
  }, []);

  const setActiveModule = (module: Module) => {
      if (module !== activeModule) {
        addLog(`Navigated to module: ${module}`);
      }
      setActiveModuleInternal(module);
  };
  
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
    setActiveModule(Module.SCAN_CALIBRATE);
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
    logs,
    addLog,
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