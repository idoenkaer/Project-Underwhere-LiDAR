import React from 'react';
import { useDataContext } from '../contexts/DataContext';
import { BellIcon } from '../icons/BellIcon';
import { useUIStateContext } from '../contexts/UIStateContext';

interface NotificationsPanelProps {
    onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
    const { database } = useDataContext();
    const { notifications } = database;
    const { addLog } = useUIStateContext();

    const handleMarkAllRead = () => {
        addLog("Marked all notifications as read.");
        // In a real app, this would update the state.
    };
    
    return (
        <div className="fixed inset-0 z-40" onClick={onClose}>
            <div 
                className="absolute top-16 right-6 w-80 bg-bg-secondary border border-green-dark rounded-sm shadow-2xl animate-fadeInUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-green-dark flex justify-between items-center">
                    <h3 className="font-bold text-text-accent font-mono flex items-center"><BellIcon className="h-5 w-5 mr-2"/>Notifications</h3>
                    <button onClick={handleMarkAllRead} className="text-xs font-semibold text-data-blue hover:text-green-bright">Mark all as read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-green-dark/50 ${!notif.read ? 'bg-data-blue/10' : ''}`}>
                            <p className="text-sm text-text-primary">{notif.text}</p>
                            <p className="text-xs text-green-muted mt-1 font-mono">{notif.timestamp} ago</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPanel;