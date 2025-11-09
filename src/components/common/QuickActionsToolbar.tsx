import React from 'react';
import { useUIStateContext } from '../contexts/UIStateContext';
import { Module } from '../../types';
import { ViewfinderCircleIcon } from '../icons/ViewfinderCircleIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { DownloadIcon } from '../icons/DownloadIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';

const ActionButton: React.FC<{
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  isActive: boolean;
}> = ({ label, icon: Icon, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center p-2 rounded-sm transition-colors ${
      isActive ? 'text-green-bright' : 'text-green-muted hover:text-text-accent'
    }`}
    aria-label={label}
  >
    <Icon className="h-6 w-6 mb-1" />
    <span className="text-xs font-mono">{label}</span>
  </button>
);

export const QuickActionsToolbar: React.FC = () => {
  const { activeModule, setActiveModule, openFeedbackModal } = useUIStateContext();

  const actions = [
    { label: 'Scan', icon: ViewfinderCircleIcon, module: Module.SCAN_CALIBRATE },
    { label: 'Analyze', icon: GlobeIcon, module: Module.TOPOGRAPHY },
    { label: 'Export', icon: DownloadIcon, module: Module.EXPORT_SHARE },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary/90 border-t border-green-dark backdrop-blur-sm p-1 flex items-center justify-around md:hidden">
      {actions.map((action) => (
        <ActionButton
          key={action.label}
          label={action.label}
          icon={action.icon}
          onClick={() => setActiveModule(action.module)}
          isActive={activeModule === action.module}
        />
      ))}
      <ActionButton
        label="Feedback"
        icon={ChatBubbleLeftRightIcon}
        onClick={openFeedbackModal}
        isActive={false}
      />
    </div>
  );
};
