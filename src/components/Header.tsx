import React from 'react';
import { useUIStateContext } from './contexts/UIStateContext';
import { useDataContext } from './contexts/DataContext';
import { isConfigured, configurationError } from '../infrastructure/ai/GeminiService';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import Tooltip from './common/Tooltip';
import { BellIcon } from './icons/BellIcon';
import UserProfileModal from './common/UserProfileModal';
import NotificationsPanel from './common/NotificationsPanel';

const Header: React.FC = () => {
  const { 
    activeModule, isLiveData, setIsLiveData,
    isProfileModalOpen, toggleProfileModal,
    isNotificationsPanelOpen, toggleNotificationsPanel
  } = useUIStateContext();
  const { database } = useDataContext();
  const { scanMeta, notifications } = database;
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {isProfileModalOpen && <UserProfileModal onClose={toggleProfileModal} />}
      {isNotificationsPanelOpen && <NotificationsPanel onClose={toggleNotificationsPanel} />}
      <header className="flex h-16 w-full flex-shrink-0 items-center border-b border-green-dark bg-bg-secondary/80 px-6 backdrop-blur-sm">
        <h1 className="text-xl font-mono text-green-bright uppercase tracking-widest text-glow hidden md:block">{activeModule}</h1>
        <div className="ml-4 border-l border-green-dark pl-4">
          <p className="text-sm text-green-muted">
            SCAN_ID: <span className="font-mono text-green-primary">{scanMeta.id}</span>
          </p>
        </div>
        <div className="ml-auto flex items-center space-x-6">
          {!isConfigured && (
            <Tooltip text={`Gemini AI Service Error: ${configurationError}`}>
              <ExclamationTriangleIcon className="h-6 w-6 text-error" />
            </Tooltip>
          )}
          <div className="flex items-center space-x-3 hidden md:flex">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveData ? 'bg-green-primary' : 'bg-data-blue'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isLiveData ? 'bg-green-primary' : 'bg-data-blue'}`}></span>
              </span>
              <span className={`text-sm font-mono font-bold tracking-wider ${isLiveData ? 'text-green-primary' : 'text-data-blue'}`}>
                  {isLiveData ? 'LIDAR_ACTIVE' : 'SIMULATION_MODE'}
              </span>
          </div>
          <button onClick={toggleNotificationsPanel} className="relative text-green-muted hover:text-green-bright" aria-label="Toggle Notifications">
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-xs font-bold text-white">{unreadCount}</span>
            )}
          </button>
          <button onClick={toggleProfileModal} className="h-8 w-8 rounded-full bg-green-dark overflow-hidden" aria-label="Toggle User Profile">
            <img src="https://picsum.photos/seed/user-avatar/32/32" alt="User Avatar" />
          </button>
        </div>
      </header>
    </>
  );
};

export default React.memo(Header);