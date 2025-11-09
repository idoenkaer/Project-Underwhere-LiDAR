
import React from 'react';
import { useUIStateContext } from '../contexts/UIStateContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { alerts, dismissAlert } = useUIStateContext();

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {alerts.map((alert) => (
          <Toast key={alert.id} alert={alert} onDismiss={dismissAlert} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
