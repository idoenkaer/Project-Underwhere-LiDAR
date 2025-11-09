import React from 'react';
import { useUIStateContext } from '../contexts/UIStateContext';
import { useDataContext } from '../contexts/DataContext';
import { Card } from '../common/Card';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { BeakerIcon } from '../icons/BeakerIcon';
import { ControlToggle } from '../common/ControlToggle';

const StateItem: React.FC<{ label: string; value: any }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-1 border-b border-green-dark/50">
        <span className="text-green-muted">{label}:</span>
        <span className="text-green-primary font-mono text-sm">{JSON.stringify(value)}</span>
    </div>
);

const DebugModule: React.FC = () => {
    const { 
        logs, activeModule, isLiveData, showOnboarding, showEthicsSplash, addLog,
        simulateNetworkFailure, setSimulateNetworkFailure,
        simulateStorageFailure, setSimulateStorageFailure
    } = useUIStateContext();
    const { database, setDatabase } = useDataContext();

    const triggerError = () => {
        addLog("Manually triggering a test error for Sentry verification.");
        throw new Error("Sentry Test Error: This is a test exception to verify error reporting.");
    };

    const generateLoad = (count: number) => {
        addLog(`Generating performance load: ${count} items.`);
        const newActivities = [];
        const newNotifications = [];
        for (let i = 0; i < count; i++) {
            newActivities.push({
                id: `act-${Date.now()}-${i}`,
                user: 'Load Test Bot',
                action: `Generated item #${i+1}`,
                timestamp: new Date().toLocaleTimeString(),
            });
            newNotifications.push({
                id: `notif-${Date.now()}-${i}`,
                read: false,
                text: `This is a generated load test notification #${i+1}.`,
                timestamp: `${i}s`,
            });
        }
        setDatabase(prev => ({
            ...prev,
            activity: [...newActivities, ...prev.activity],
            notifications: [...newNotifications, ...prev.notifications],
        }));
        addLog(`Performance load generation complete.`);
    };

    return (
        <div className="animate-fadeIn space-y-8">
            <h1 className="text-3xl font-bold font-mono text-green-bright text-glow">Debug & State Inspector</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <Card title="Context State">
                        <div className="space-y-1 text-xs">
                            <StateItem label="activeModule" value={activeModule} />
                            <StateItem label="isLiveData" value={isLiveData} />
                            <StateItem label="showOnboarding" value={showOnboarding} />
                            <StateItem label="showEthicsSplash" value={showEthicsSplash} />
                            <StateItem label="simulateNetworkFailure" value={simulateNetworkFailure} />
                            <StateItem label="simulateStorageFailure" value={simulateStorageFailure} />
                        </div>
                    </Card>
                     <Card title="Failure Simulation">
                        <p className="text-sm text-text-primary mb-4">
                            Manually trigger failure states to test application resilience and error handling.
                        </p>
                        <div className="space-y-4">
                            <ControlToggle
                                label="Simulate Network Failure"
                                checked={simulateNetworkFailure}
                                onChange={() => setSimulateNetworkFailure(!simulateNetworkFailure)}
                            />
                            <ControlToggle
                                label="Simulate Storage Failure"
                                checked={simulateStorageFailure}
                                onChange={() => setSimulateStorageFailure(!simulateStorageFailure)}
                            />
                            <button onClick={triggerError} className="w-full mt-2 p-3 bg-error/80 hover:bg-error text-white font-bold rounded-sm transition flex items-center justify-center space-x-2">
                                <ExclamationTriangleIcon className="h-5 w-5" />
                                <span>Trigger React Render Error</span>
                            </button>
                        </div>
                    </Card>
                    <Card title="Performance & Load Test">
                        <p className="text-sm text-text-primary mb-4">
                            Generate a large volume of data to stress-test UI rendering performance and identify bottlenecks.
                        </p>
                        <button onClick={() => generateLoad(500)} className="w-full p-3 bg-data-blue/80 hover:bg-data-blue text-white font-bold rounded-sm transition flex items-center justify-center space-x-2">
                            <BeakerIcon className="h-5 w-5" />
                            <span>Generate 500 Items</span>
                        </button>
                    </Card>
                </div>
                
                <div className="lg:col-span-2">
                    <Card title="Event Log">
                        <div className="bg-bg-primary/50 p-2 rounded-sm font-mono text-xs h-[80vh] overflow-y-auto flex flex-col-reverse">
                           <div>
                            {[...logs].reverse().map((log, index) => (
                                <p key={index} className="whitespace-pre-wrap">
                                    <span className="text-green-muted">{log.timestamp}</span>
                                    <span className="text-text-primary ml-2">{log.message}</span>
                                </p>
                            ))}
                           </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DebugModule;
