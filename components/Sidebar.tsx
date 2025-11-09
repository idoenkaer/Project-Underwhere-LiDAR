import React from 'react';
import { Module } from '../types';
import { CubeIcon } from './icons/CubeIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { useUIStateContext } from './contexts/UIStateContext';
import { ClipboardDocumentCheckIcon } from './icons/ClipboardDocumentCheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';

const navItems = [
  { module: Module.ROADMAP, icon: ClipboardListIcon, label: 'Roadmap' },
  { module: Module.MEASUREMENT, icon: CubeIcon, label: 'Measurement' },
  { module: Module.TOPOGRAPHY, icon: GlobeIcon, label: 'Topography' },
  { module: Module.EXPORT_SHARE, icon: DownloadIcon, label: 'Export & Share' },
  { module: Module.VALIDATION, icon: ClipboardDocumentCheckIcon, label: 'Validation' },
];

const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule } = useUIStateContext();
  return (
    <nav className="flex flex-col items-center space-y-2 border-r border-green-dark bg-bg-primary p-2 sm:p-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-green-muted/20 text-green-bright mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      {navItems.map((item) => (
        <button
          key={item.module}
          onClick={() => setActiveModule(item.module)}
          className={`relative flex h-12 w-12 flex-col items-center justify-center rounded-sm transition-colors duration-200
            ${activeModule === item.module
              ? 'bg-green-dark text-green-bright'
              : 'text-green-muted hover:bg-bg-secondary hover:text-green-bright'
            }`}
          title={item.label}
        >
          {activeModule === item.module && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-bright"></div>
          )}
          <item.icon className="h-6 w-6" />
        </button>
      ))}
    </nav>
  );
};

export default React.memo(Sidebar);