import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Module, Alert, AnalysisRun, FontSize, Command, ModulePayload, Snapshot } from '../../types';

export interface LogEntry {
  timestamp: string;
  message: string;
}

interface UIStateContextType {
  activeModule: Module;
  activeModulePayload: ModulePayload | null;
  setActiveModule: (module: Module, payload?: ModulePayload) => void;
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
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  showAdvancedModules: boolean;
  setShowAdvancedModules: (value: boolean) => void;
  snapshots: Snapshot[];
  // FIX: Use specific type for snapshot state to fix type error.
  pinSnapshot: (note: string, state: Snapshot['state']) => void;
  walkthroughStep: string | null;
  completeWalkthroughStep: () => void;
  isFeedbackModalOpen: boolean;
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;
  alerts: Alert[];
  addAlert: (message: string, type?: Alert['type'], timeout?: number) => void;
  dismissAlert: (id: number) => void;
  analysisRuns: AnalysisRun[];
  logAnalysisRun: (module: string, parameters: object) => void;
  isCommandPaletteOpen: boolean;
  toggleCommandPalette: () => void;
  
  // FIX: Add missing properties for profile modal and notifications panel.
  isProfileModalOpen: boolean;
  toggleProfileModal: () => void;
  isNotificationsPanelOpen: boolean;
  toggleNotificationsPanel: () => void;

  // New failure simulation states
  simulateNetworkFailure: boolean;
  setSimulateNetworkFailure: (value: boolean) => void;
  simulateStorageFailure: boolean;
  setSimulateStorageFailure: (value: boolean) => void;
  simulateMalformedResponse: boolean;
  setSimulateMalformedResponse: (value: boolean) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const UIStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModuleInternal] = useState<Module>(Module.ROADMAP);
  const [activeModulePayload, setActiveModulePayload] = useState<ModulePayload | null>(null);
  const [isLiveData, setIsLiveData] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEthicsSplash, setShowEthicsSplash] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [testEndTime, setTestEndTime] = useState<number | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [analysisRuns, setAnalysisRuns] = useState<AnalysisRun[]>([]);

  const [isHighContrast, setHighContrast] = useState<boolean>(() => typeof localStorage !== 'undefined' && localStorage.getItem('isHighContrast') === 'true');
  const [reduceMotion, setReduceMotionState] = useState<boolean>(() => typeof localStorage !== 'undefined' && localStorage.getItem('reduceMotion') === 'true');
  const [fontSize, setFontSizeState] = useState<FontSize>(() => (localStorage.getItem('fontSize') as FontSize) || 'base');
  const [showAdvancedModules, setShowAdvancedModulesState] = useState<boolean>(() => typeof localStorage !== 'undefined' && localStorage.getItem('showAdvancedModules') === 'true');
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  
  const [walkthroughStep, setWalkthroughStep] = useState<string | null>(null);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  // FIX: Add state for profile modal and notifications panel.
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isNotificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  const [simulateNetworkFailure, setSimulateNetworkFailure] = useState(false);
  const [simulateStorageFailure, setSimulateStorageFailure] = useState(false);
  const [simulateMalformedResponse, setSimulateMalformedResponse] = useState(false);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const newLog = { timestamp, message };
    setLogs(prevLogs => [...prevLogs.slice(-200), newLog]); // Keep last 200 logs
  }, []);

  const logAnalysisRun = useCallback((module: string, parameters: object) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const newRun = { timestamp, module, parameters };
    setAnalysisRuns(prev => [...prev, newRun]);
    addLog(`Analysis Run in ${module} with params: ${JSON.stringify(parameters)}`);
  }, [addLog]);
  
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

  const setActiveModule = (module: Module, payload: ModulePayload | null = null) => {
      if (module !== activeModule) {
        addLog(`Navigated to module: ${module}`);
      }
      setActiveModuleInternal(module);
      setActiveModulePayload(payload);
  };

  const dismissAlert = useCallback((id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const addAlert = useCallback((message: string, type: Alert['type'] = 'info', timeout = 5000) => {
    const id = Date.now() + Math.random();
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

  const setFontSize = useCallback((size: FontSize) => {
    localStorage.setItem('fontSize', size);
    setFontSizeState(size);
    addLog(`Font size set to: ${size}`);
  }, [addLog]);

  const setShowAdvancedModules = useCallback((value: boolean) => {
    localStorage.setItem('showAdvancedModules', String(value));
    setShowAdvancedModulesState(value);
    addLog(`Show advanced modules ${value ? 'enabled' : 'disabled'}.`);
  }, [addLog]);

  // FIX: Use specific type for snapshot state to fix type error.
  const pinSnapshot = useCallback((note: string, state: Snapshot['state']) => {
      if(simulateStorageFailure) {
          addAlert('Storage Failure: Could not pin snapshot.', 'error');
          addLog('Snapshot pin failed due to simulated storage failure.');
          return;
      }
      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
      const newSnapshot: Snapshot = { timestamp, note, state };
      setSnapshots(prev => [...prev, newSnapshot]);
      addLog(`Snapshot pinned: "${note}"`);
  }, [addLog, addAlert, simulateStorageFailure]);
  
 useEffect(() => {
    const hasAcknowledged = sessionStorage.getItem('ethicsAcknowledged') === 'true';
    if (!hasAcknowledged) {
        setShowEthicsSplash(true);
    } else {
        setShowEthicsSplash(false);
        const hasOnboarded = sessionStorage.getItem('onboardingComplete') === 'true';
        if (!hasOnboarded) {
            setShowOnboarding(true);
        } else {
            setShowOnboarding(false);
        }
    }
    startTestTimer();
  }, [startTestTimer]);


  const handleCloseEthicsSplash = () => {
    sessionStorage.setItem('ethicsAcknowledged', 'true');
    setShowEthicsSplash(false);
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
        if (prev === 'topography-analysis') {
            setActiveModuleInternal(Module.AI_DISCOVERY);
            addLog("Walkthrough: advancing to AI Discovery.");
            return 'ai-discovery-query';
        }
        if (prev === 'ai-discovery-query') {
            addLog("Walkthrough: AI query complete.");
            return 'tour-complete';
        }
        if (prev === 'tour-complete') {
            addLog("Guided walkthrough complete.");
            return null;
        }
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

  const toggleCommandPalette = useCallback(() => {
      setCommandPaletteOpen(prev => {
          addLog(`Command palette ${!prev ? 'opened' : 'closed'}.`);
          return !prev;
      });
  }, [addLog]);

  // FIX: Add toggle handlers for profile modal and notifications panel.
  const toggleProfileModal = useCallback(() => {
    setProfileModalOpen(prev => {
        addLog(`Profile modal ${!prev ? 'opened' : 'closed'}.`);
        return !prev;
    });
  }, [addLog]);

  const toggleNotificationsPanel = useCallback(() => {
    setNotificationsPanelOpen(prev => {
        addLog(`Notifications panel ${!prev ? 'opened' : 'closed'}.`);
        return !prev;
    });
  }, [addLog]);


  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommandPaletteOpen) return;
      
      if (!e.altKey) return;

      const keyMap: { [key: string]: Module } = {
        'r': Module.ROADMAP, 's': Module.SCAN_CALIBRATE, 't': Module.TOPOGRAPHY,
        'a': Module.AI_DISCOVERY, 'e': Module.ENVIRONMENTAL, 'b': Module.BIOLOGICAL,
        'y': Module.PHYSICS, '4': Module.SPACETIME, 'q': Module.QUANTUM,
        'x': Module.EXPORT_SHARE, 'v': Module.VALIDATION, 'c': Module.ACTIVITY,
        'l': Module.PLUGINS, 'f': Module.FIELD_TEST, 'd': Module.DEBUG,
        ',': Module.SETTINGS
      };
      
      const targetModule = keyMap[e.key.toLowerCase()];
      if (targetModule) {
        e.preventDefault();
        setActiveModule(targetModule);
      }

      if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          const noteInput = document.querySelector('input[placeholder="Note for this snapshot..."]');
          if (noteInput) {
            (noteInput as HTMLElement).focus();
          } else {
             addAlert("Pin snapshot input not found on this screen.", "info");
          }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, addAlert, setActiveModule, toggleCommandPalette]);

  const value = {
    activeModule,
    activeModulePayload,
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
    fontSize,
    setFontSize,
    showAdvancedModules,
    setShowAdvancedModules,
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
    analysisRuns,
    logAnalysisRun,
    isCommandPaletteOpen,
    toggleCommandPalette,
    // FIX: Add new state and handlers to context value.
    isProfileModalOpen,
    toggleProfileModal,
    isNotificationsPanelOpen,
    toggleNotificationsPanel,
    simulateNetworkFailure,
    setSimulateNetworkFailure,
    simulateStorageFailure,
    setSimulateStorageFailure,
    simulateMalformedResponse,
    setSimulateMalformedResponse,
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
