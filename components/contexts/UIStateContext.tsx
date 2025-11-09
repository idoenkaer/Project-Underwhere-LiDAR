import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Module, Alert } from '../../types';

export interface LogEntry {
  timestamp: string;
  message: string;
}

export interface Snapshot {
  timestamp: string;
  note: string;
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
  testStartTime: number | null;
  testEndTime: number | null;
  stopTestTimer: () => void;
  isHighContrast: boolean;
  setIsHighContrast: (value: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  snapshots: Snapshot[];
  pinSnapshot: (note: string) => void;
  walkthroughStep: string | null;
  completeWalkthroughStep: () => void;
  isFeedbackModalOpen: boolean;
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;
  alerts: Alert[];
  addAlert: (message: string, type?: Alert['type'], timeout?: number) => void;
  dismissAlert: (id: number) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const UIStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModuleInternal] = useState<Module>(Module.ROADMAP);
  const [isLiveData, setIsLiveData] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEthicsSplash, setShowEthicsSplash] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [testEndTime, setTestEndTime] = useState<number | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [isHighContrast, setHighContrast] = useState<boolean>(() => typeof localStorage !== 'undefined' && localStorage.getItem('isHighContrast') === 'true');
  const [reduceMotion, setReduceMotionState] = useState<boolean>(() => typeof localStorage !== 'undefined' && localStorage.getItem('reduceMotion') === 'true');
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  
  const [walkthroughStep, setWalkthroughStep] = useState<string | null>(null);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const newLog = { timestamp, message };
    setLogs(prevLogs => [...prevLogs.slice(-100), newLog]); // Keep last 100 logs
  }, []);
  
  const startTestTimer = useCallback(() => {
    if (testStartTime === null) {
        setTestStartTime(Date.now());
        addLog("Field test timer started.");
    }
  }, [addLog, testStartTime]);

  const stopTestTimer = useCallback(() => {
      if (testStartTime !== null && testEndTime === null) {
          setTestEndTime(Date.now());
          addLog("Field test timer stopped (analysis complete).");
      }
  }, [addLog, testStartTime, testEndTime]);

  const setActiveModule = (module: Module) => {
      if (module !== activeModule) {
        addLog(`Navigated to module: ${module}`);
      }
      setActiveModuleInternal(module);
  };

  const dismissAlert = useCallback((id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const addAlert = useCallback((message: string, type: Alert['type'] = 'info', timeout = 5000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    addLog(`[${type.toUpperCase()}_ALERT] ${message}`);
    if (timeout) {
      setTimeout(() => dismissAlert(id), timeout);
    }
  }, [addLog, dismissAlert]);

  const setIsHighContrast = useCallback((value: boolean) => {
      localStorage.setItem('isHighContrast', String(value));
      setHighContrast(value);
      addLog(`High contrast mode ${value ? 'enabled' : 'disabled'}.`);
  }, [addLog]);

  const setReduceMotion = useCallback((value: boolean) => {
      localStorage.setItem('reduceMotion', String(value));
      setReduceMotionState(value);
      addLog(`Reduce motion ${value ? 'enabled' : 'disabled'}.`);
  }, [addLog]);

  const pinSnapshot = useCallback((note: string) => {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
      const newSnapshot = { timestamp, note };
      setSnapshots(prev => [...prev, newSnapshot]);
      addLog(`Snapshot pinned: "${note}"`);
  }, [addLog]);
  
  useEffect(() => {
    startTestTimer(); // Start timer on initial app load
    if (!sessionStorage.getItem('ethicsAcknowledged')) {
      setShowEthicsSplash(true);
    } else if (!sessionStorage.getItem('onboardingComplete')) {
      setShowOnboarding(true);
    }
  }, [startTestTimer]);

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
    setWalkthroughStep('scan-calibrate-load');
    addLog("Initial onboarding complete. Starting guided walkthrough.");
  };

  const completeWalkthroughStep = useCallback(() => {
    setWalkthroughStep(prev => {
        if (prev === 'scan-calibrate-load') {
            setActiveModuleInternal(Module.TOPOGRAPHY);
            addLog("Walkthrough: advancing to Topography analysis.");
            return 'topography-analysis';
        }
        addLog("Guided walkthrough complete.");
        return null;
    });
  }, [addLog]);

  const openFeedbackModal = () => {
    addLog("Feedback modal opened.");
    setFeedbackModalOpen(true);
  };
  const closeFeedbackModal = () => {
    addLog("Feedback modal closed.");
    setFeedbackModalOpen(false);
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
    testStartTime,
    testEndTime,
    stopTestTimer,
    isHighContrast,
    setIsHighContrast,
    reduceMotion,
    setReduceMotion,
    snapshots,
    pinSnapshot,
    walkthroughStep,
    completeWalkthroughStep,
    isFeedbackModalOpen,
    openFeedbackModal,
    closeFeedbackModal,
    alerts,
    addAlert,
    dismissAlert,
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