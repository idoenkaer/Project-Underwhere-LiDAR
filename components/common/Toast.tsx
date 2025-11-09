import React from 'react';
import { Alert } from '../../types';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { ShieldAlertIcon } from '../icons/ShieldAlertIcon';
import { InfoIcon } from '../icons/InfoIcon';

interface ToastProps {
  alert: Alert;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ alert, onDismiss }) => {
  const { id, message, type } = alert;

  const config = {
    error: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-error/20',
      borderColor: 'border-error',
      textColor: 'text-error',
    },
    warning: {
      icon: ShieldAlertIcon,
      bgColor: 'bg-warning/20',
      borderColor: 'border-warning',
      textColor: 'text-warning',
    },
    info: {
      icon: InfoIcon,
      bgColor: 'bg-data-blue/20',
      borderColor: 'border-data-blue',
      textColor: 'text-data-blue',
    },
  }[type];

  const Icon = config.icon;

  return (
    <div
      className={`relative w-full max-w-sm p-4 pr-10 rounded-sm border-l-4 shadow-lg animate-fadeInUp ${config.bgColor} ${config.borderColor}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${config.textColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 pt-0.5">
          <p className={`text-sm font-semibold ${config.textColor}`}>{message}</p>
        </div>
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="absolute top-2 right-2 p-1 rounded-full text-green-muted hover:bg-bg-secondary"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;