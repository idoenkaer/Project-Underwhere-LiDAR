import React from 'react';
import { Module } from '../types';
import { CubeIcon } from './icons/CubeIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { useUIStateContext } from './contexts/UIStateContext';
import { ClipboardDocumentCheckIcon } from './icons/ClipboardDocumentCheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ViewfinderCircleIcon } from './icons/ViewfinderCircleIcon';
import { BugAntIcon } from './icons/BugAntIcon';
import { StopwatchIcon } from './icons/StopwatchIcon';
import { CogIcon } from './icons/CogIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { LeafIcon } from './icons/LeafIcon';
import { AtomIcon } from './icons/AtomIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ChipIcon } from './icons/ChipIcon';
import { UsersIcon } from './icons/UsersIcon';
import { PuzzlePieceIcon } from './icons/PuzzlePieceIcon';

const coreModules = [
  { module: Module.ROADMAP, icon: ClipboardListIcon, label: 'Roadmap' },
  { module: Module.SCAN_CALIBRATE, icon: ViewfinderCircleIcon, label: 'Scan & Calibrate' },
  { module: Module.TOPOGRAPHY, icon: GlobeIcon, label: 'Topography' },
];

const analysisModules = [
  { module: Module.ENVIRONMENTAL, icon: BeakerIcon, label: 'Environmental' },
  { module: Module.BIOLOGICAL, icon: LeafIcon, label: 'Biological' },
  { module: Module.PHYSICS, icon: AtomIcon, label: 'Physics' },
  { module: Module.SPACETIME, icon: ClockIcon, label: '4D Spacetime' },
  { module: Module.QUANTUM, icon: ChipIcon, label: 'Quantum Sim' },
  { module: Module.AI_DISCOVERY, icon: SparklesIcon, label: 'AI Discovery' },
];

const platformModules = [
  { module: Module.EXPORT_SHARE, icon: DownloadIcon, label: 'Export & Share' },
  { module: Module.VALIDATION, icon: ClipboardDocumentCheckIcon, label: 'Validation' },
  { module: Module.ACTIVITY, icon: UsersIcon, label: 'Activity' },
  { module: Module.PLUGINS, icon: PuzzlePieceIcon, label: 'Plugins' },
];


const NavButton: React.FC<{
  item: { module: Module; icon: React.FC<any>; label: string };
  activeModule: Module;
  onClick: (module: Module) => void;
}> = ({ item, activeModule, onClick }) => (
  <button
    key={item.module}
    onClick={() => onClick(item.module)}
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
);


const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule } = useUIStateContext();
  return (
    <nav className="flex flex-col items-center space-y-1 border-r border-green-dark bg-bg-primary p-2 sm:p-3 overflow-y-auto">
      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-green-muted/20 text-green-bright mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      
      {coreModules.map((item) => <NavButton key={item.module} item={item} activeModule={activeModule} onClick={setActiveModule} />)}
      
      <div className="w-full h-px bg-green-dark my-2"></div>
      
      {analysisModules.map((item) => <NavButton key={item.module} item={item} activeModule={activeModule} onClick={setActiveModule} />)}

      <div className="w-full h-px bg-green-dark my-2"></div>

      {platformModules.map((item) => <NavButton key={item.module} item={item} activeModule={activeModule} onClick={setActiveModule} />)}
      
      <div className="flex-grow"></div>
        
      <NavButton item={{module: Module.FIELD_TEST, icon: StopwatchIcon, label: "Field Test"}} activeModule={activeModule} onClick={setActiveModule} />
      <NavButton item={{module: Module.DEBUG, icon: BugAntIcon, label: "Debug"}} activeModule={activeModule} onClick={setActiveModule} />
      <NavButton item={{module: Module.SETTINGS, icon: CogIcon, label: "Settings"}} activeModule={activeModule} onClick={setActiveModule} />

    </nav>
  );
};

export default React.memo(Sidebar);