import React from 'react';
import { Module } from '../types';
import { CubeIcon } from './icons/CubeIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { LeafIcon } from './icons/LeafIcon';
import { LayersIcon } from './icons/LayersIcon';
import { AtomIcon } from './icons/AtomIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';

interface SidebarProps {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
}

const navItems = [
  { module: Module.ROADMAP, icon: ClipboardListIcon, label: 'Roadmap' },
  { module: Module.MEASUREMENT, icon: CubeIcon, label: 'Measurement' },
  { module: Module.ENVIRONMENTAL, icon: BeakerIcon, label: 'Environment' },
  { module: Module.TOPOGRAPHY, icon: GlobeIcon, label: 'Topography' },
  { module: Module.BIOLOGICAL, icon: LeafIcon, label: 'Biology' },
  { module: Module.PHYSICS, icon: LayersIcon, label: 'Physics Sims' },
  { module: Module.SPACETIME, icon: ChartBarIcon, label: 'Space-Time' },
  { module: Module.AI_DISCOVERY, icon: SparklesIcon, label: 'AI Discovery' },
  { module: Module.RESEARCH, icon: BookOpenIcon, label: 'Collaboration' },
  { module: Module.QUANTUM, icon: AtomIcon, label: 'Quantum' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  return (
    <nav className="flex flex-col items-center space-y-2 border-r border-gray-700 bg-gray-900 p-2 sm:p-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      {navItems.map((item) => (
        <button
          key={item.module}
          onClick={() => setActiveModule(item.module)}
          className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg transition-colors duration-200
            ${activeModule === item.module
              ? 'bg-cyan-500/20 text-cyan-300'
              : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
            }`}
          title={item.label}
        >
          <item.icon className="h-6 w-6" />
        </button>
      ))}
    </nav>
  );
};

export default React.memo(Sidebar);