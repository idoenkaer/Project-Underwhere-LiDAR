import React, { useState } from 'react';
import { Module } from '../types';
import { useUIStateContext } from './contexts/UIStateContext';

import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { ViewfinderCircleIcon } from './icons/ViewfinderCircleIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { LeafIcon } from './icons/LeafIcon';
import { AtomIcon } from './icons/AtomIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ChipIcon } from './icons/ChipIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ClipboardDocumentCheckIcon } from './icons/ClipboardDocumentCheckIcon';
import { UsersIcon } from './icons/UsersIcon';
import { PuzzlePieceIcon } from './icons/PuzzlePieceIcon';
import { StopwatchIcon } from './icons/StopwatchIcon';
import { BugAntIcon } from './icons/BugAntIcon';
import { CogIcon } from './icons/CogIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import Tooltip from './common/Tooltip';


const NavButton: React.FC<{
  item: { module: Module; icon: React.FC<any>; label: string, shortcut: string };
  activeModule: Module;
  onClick: (module: Module) => void;
}> = ({ item, activeModule, onClick }) => (
  <Tooltip text={`${item.label} (${item.shortcut})`}>
    <button
      onClick={() => onClick(item.module)}
      className={`relative flex h-12 w-full items-center justify-center rounded-sm transition-colors duration-200
        ${activeModule === item.module
          ? 'bg-green-dark text-green-bright'
          : 'text-green-muted hover:bg-bg-secondary hover:text-green-bright'
        }`}
      aria-label={item.label}
    >
      {activeModule === item.module && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-bright"></div>
      )}
      <item.icon className="h-6 w-6" />
    </button>
  </Tooltip>
);

const Section: React.FC<{
  title: string;
  items: { module: Module; icon: React.FC<any>; label: string, shortcut: string }[];
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ title, items, activeModule, setActiveModule, isOpen, onToggle }) => (
  <div className="w-full">
    <button onClick={onToggle} className="w-full flex justify-between items-center px-2 py-1 text-xs font-mono text-green-muted hover:text-green-bright">
      <span>{title}</span>
      {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
    </button>
    {isOpen && (
      <div className="space-y-1 mt-1">
        {items.map((item) => <NavButton key={item.module} item={item} activeModule={activeModule} onClick={setActiveModule} />)}
      </div>
    )}
  </div>
);

const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule, showAdvancedModules } = useUIStateContext();
  const [openSections, setOpenSections] = useState({
    core: true,
    advanced: true,
    platform: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const coreModules = [
    { module: Module.ROADMAP, icon: ClipboardListIcon, label: 'Roadmap', shortcut: 'Alt+R' },
    { module: Module.SCAN_CALIBRATE, icon: ViewfinderCircleIcon, label: 'Scan', shortcut: 'Alt+S' },
    { module: Module.TOPOGRAPHY, icon: GlobeIcon, label: 'Topography', shortcut: 'Alt+T' },
    { module: Module.AI_DISCOVERY, icon: SparklesIcon, label: 'AI Discovery', shortcut: 'Alt+A' },
  ];

  const advancedAnalysisModules = [
    { module: Module.ENVIRONMENTAL, icon: BeakerIcon, label: 'Environmental', shortcut: 'Alt+E' },
    { module: Module.BIOLOGICAL, icon: LeafIcon, label: 'Biological', shortcut: 'Alt+B' },
    { module: Module.PHYSICS, icon: AtomIcon, label: 'Physics', shortcut: 'Alt+Y' },
    { module: Module.SPACETIME, icon: ClockIcon, label: '4D Spacetime', shortcut: 'Alt+4' },
    { module: Module.QUANTUM, icon: ChipIcon, label: 'Quantum Sim', shortcut: 'Alt+Q' },
  ];

  const platformModules = [
    { module: Module.EXPORT_SHARE, icon: DownloadIcon, label: 'Export & Share', shortcut: 'Alt+X' },
    { module: Module.VALIDATION, icon: ClipboardDocumentCheckIcon, label: 'Validation', shortcut: 'Alt+V' },
    { module: Module.ACTIVITY, icon: UsersIcon, label: 'Activity', shortcut: 'Alt+C' },
    { module: Module.PLUGINS, icon: PuzzlePieceIcon, label: 'Plugins', shortcut: 'Alt+L' },
  ];

  return (
    <nav className="flex w-20 flex-col items-center space-y-2 border-r border-green-dark bg-bg-primary p-2 overflow-y-auto">
      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-green-muted/20 text-green-bright mb-3 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      
      <Section title="CORE" items={coreModules} activeModule={activeModule} setActiveModule={setActiveModule} isOpen={openSections.core} onToggle={() => toggleSection('core')} />
      
      {showAdvancedModules && (
        <Section title="ADVANCED" items={advancedAnalysisModules} activeModule={activeModule} setActiveModule={setActiveModule} isOpen={openSections.advanced} onToggle={() => toggleSection('advanced')} />
      )}

      <Section title="PLATFORM" items={platformModules} activeModule={activeModule} setActiveModule={setActiveModule} isOpen={openSections.platform} onToggle={() => toggleSection('platform')} />
      
      <div className="flex-grow"></div>
        
      <NavButton item={{module: Module.FIELD_TEST, icon: StopwatchIcon, label: "Field Test", shortcut: "Alt+F"}} activeModule={activeModule} onClick={setActiveModule} />
      <NavButton item={{module: Module.DEBUG, icon: BugAntIcon, label: "Debug", shortcut: "Alt+D"}} activeModule={activeModule} onClick={setActiveModule} />
      <NavButton item={{module: Module.SETTINGS, icon: CogIcon, label: "Settings", shortcut: "Alt+,"}} activeModule={activeModule} onClick={setActiveModule} />

    </nav>
  );
};

export default React.memo(Sidebar);