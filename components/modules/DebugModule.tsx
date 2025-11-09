import React from 'react';
import { useUIStateContext } from '../contexts/UIStateContext';
import { useDataContext } from '../contexts/DataContext';
import { Card } from '../common/Card';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';

const StateItem: React.FC<{ label: string; value: any }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-1 border-b border-green-dark/50">
        <span className="text-green-muted">{label}:</span>
        <span className="text-green-primary font-mono text-sm">{JSON.stringify(value)}</span>
    </div>
);

const DebugModule: React.FC = () => {
    const { logs, activeModule, isLiveData, showOnboarding, showEthicsSplash, addLog } = useUIStateContext();
    const { scanMeta } = useDataContext();

    const triggerError = () => {
        addLog("Manually triggering a test error for Sentry verification.");
        throw new Error("Sentry Test Error: This is a test exception to verify error reporting.");
    };

    return (
        <div className="animate-fadeIn space-y-8">
            <h1 className="text-3xl font-bold font-mono text-green-bright text-glow">Debug & State Inspector</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <Card title="UI Context State">
                        <div className="space-y-1 text-xs">
                            <StateItem label="activeModule" value={activeModule} />
                            <StateItem label="isLiveData" value={isLiveData} />
                            <StateItem label="showOnboarding" value={showOnboarding} />
                            <StateItem label="showEthicsSplash" value={showEthicsSplash} />
                        </div>
                    </Card>
                    <Card title="Data Context State">
                        <div className="space-y-1 text-xs">
                            <StateItem label="scanID" value={scanMeta.id} />
                            <StateItem label="location" value={scanMeta.location} />
                        </div>
                    </Card>
                     <Card title="Error Reporting Test">
                        <p className="text-sm text-text-primary mb-4">
                            Click the button below to throw a test error. This will be caught by our error boundary and reported to our monitoring service (Sentry).
                        </p>
                        <button onClick={triggerError} className="w-full p-3 bg-error/80 hover:bg-error text-white font-bold rounded-sm transition flex items-center justify-center space-x-2">
                            <ExclamationTriangleIcon className="h-5 w-5" />
                            <span>Trigger Test Error</span>
                        </button>
                    </Card>
                </div>
                
                <div className="lg:col-span-2">
                    <Card title="Event Log">
                        <div className="bg-bg-primary/50 p-2 rounded-sm font-mono text-xs h-[60vh] overflow-y-auto flex flex-col-reverse">
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