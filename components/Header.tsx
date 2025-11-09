import React from 'react';
import { useUIStateContext } from './contexts/UIStateContext';
import { useDataContext } from './contexts/DataContext';

const Header: React.FC = () => {
  const { activeModule, isLiveData, setIsLiveData } = useUIStateContext();
  const { scanMeta } = useDataContext();

  return (
    <header className="flex h-16 w-full flex-shrink-0 items-center border-b border-green-dark bg-bg-secondary/80 px-6 backdrop-blur-sm">
      <h1 className="text-xl font-mono text-green-bright uppercase tracking-widest text-glow">{activeModule}</h1>
      <div className="ml-4 border-l border-green-dark pl-4">
        <p className="text-sm text-green-muted">
          SCAN_ID: <span className="font-mono text-green-primary">{scanMeta.id}</span>
        </p>
      </div>
      <div className="ml-auto flex items-center space-x-6">
         <div className="flex items-center space-x-3">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveData ? 'bg-green-primary' : 'bg-data-blue'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isLiveData ? 'bg-green-primary' : 'bg-data-blue'}`}></span>
            </span>
            <span className={`text-sm font-mono font-bold tracking-wider ${isLiveData ? 'text-green-primary' : 'text-data-blue'}`}>
                {isLiveData ? 'LIDAR_ACTIVE' : 'SIMULATION_MODE'}
            </span>
         </div>
         <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-green-muted">Data Source:</span>
            <button
                onClick={() => setIsLiveData(!isLiveData)}
                className="relative inline-flex h-6 w-20 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-bright focus:ring-offset-2 focus:ring-offset-bg-secondary"
            >
                <span className={`absolute inset-0 rounded-full transition-colors ${isLiveData ? 'bg-green-primary/30' : 'bg-data-blue/30'}`}></span>
                <span
                    className={`absolute left-0 inline-block h-5 w-10 transform rounded-full bg-bg-primary shadow ring-0 transition-transform duration-200 ease-in-out ${
                    isLiveData ? 'translate-x-9' : 'translate-x-0'
                    }`}
                >
                    <span
                        className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-opacity duration-100 ease-out ${
                        isLiveData ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                       <span className="text-data-blue">SIM</span>
                    </span>
                    <span
                         className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-opacity duration-100 ease-in ${
                        isLiveData ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <span className="text-green-primary">LIVE</span>
                    </span>
                </span>
            </button>
         </div>
      </div>
    </header>
  );
};

export default React.memo(Header);