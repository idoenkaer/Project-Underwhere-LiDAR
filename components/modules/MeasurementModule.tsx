import React, { useState, useRef } from 'react';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { MetricCard } from '../common/MetricCard';
import { CheckIcon } from '../icons/CheckIcon';
import { processScanFile, loadMockScan, importExternalDataset } from '../../application/use-cases/processScanFile';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { TagIcon } from '../icons/TagIcon';
import { CircleStackIcon } from '../icons/CircleStackIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { DataImportModule } from '../common/DataImportModule';
import { CogIcon } from '../icons/CogIcon';
import { CodeFileIcon } from '../icons/CodeFileIcon';
import { MapPinCheckIcon } from '../icons/MapPinCheckIcon';
import ConsentDialog from '../common/ConsentDialog';
import { ExclamationCircleIcon } from '../icons/ExclamationCircleIcon';

const SensorFeedCard: React.FC<{ title: string; imageUrl: string; details: string; imageFilter?: string }> = ({ title, imageUrl, details, imageFilter = '' }) => {
    return (
        <div>
            <h3 className="text-md font-semibold text-gray-400 mb-3">{title}</h3>
            <div className="relative aspect-video w-full rounded-lg bg-black border border-gray-700 overflow-hidden">
                <img src={imageUrl} alt={title} className={`object-cover w-full h-full opacity-70 ${imageFilter}`} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-2 left-2 bg-black/50 p-1 px-2 rounded-md text-xs">
                    <p><span className='bg-blue-500 inline-block w-2 h-2 rounded-full mr-1'></span> <span className='text-blue-400'>SIMULATED</span></p>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/50 p-1 px-2 rounded-md text-xs font-mono">
                    <p>{details}</p>
                </div>
            </div>
        </div>
    );
};

const ProcessedView: React.FC = () => {
    return (
        <div className="space-y-8 animate-fadeInUp">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-300 mb-4">Simulated Lidar Point Cloud</h2>
                    <div className="relative aspect-video w-full rounded-lg bg-black border border-gray-700 overflow-hidden">
                        <img src="https://picsum.photos/seed/lidar/1280/720" alt="Lidar Point Cloud" className="object-cover w-full h-full opacity-30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-gray-400 text-lg">Dataset: `scan_dataset_0A4F.las` Processed</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-300">Calibration & Sensor Status</h2>
                    <MetricCard label="Resolution" value="< 1" unit="cm" />
                    <div className="space-y-2 text-sm bg-gray-800/50 p-4 rounded-lg">
                        <p className="flex justify-between items-center"><span>Infrared (IR)</span><span className="text-cyan-300 font-mono">CALIBRATED</span></p>
                        <p className="flex justify-between items-center"><span>RGB</span><span className="text-cyan-300 font-mono">CALIBRATED</span></p>
                        <p className="flex justify-between items-center"><span>Time-of-Flight (ToF)</span><span className="text-cyan-300 font-mono">CALIBRATED</span></p>
                    </div>
                </div>
            </div>
            <div>
                 <h2 className="text-lg font-semibold text-gray-300 mb-4">Simulated Sensor Feeds</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SensorFeedCard title="Infrared Feed" imageUrl="https://picsum.photos/seed/infrared/800/450" details="LWIR 7.5-13.5μm" imageFilter="grayscale contrast-200" />
                    <SensorFeedCard title="RGB Camera" imageUrl="https://picsum.photos/seed/rgb/800/450" details="4K UHD @ 30FPS" />
                    <SensorFeedCard title="Time-of-Flight Feed" imageUrl="https://picsum.photos/seed/tof/800/450" details="DEPTH MAPPING" imageFilter="grayscale" />
                 </div>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-lg font-semibold text-gray-300 mb-4">Geospatial Referencing & Metadata</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 flex items-center mb-2"><CheckBadgeIcon className="h-5 w-5 mr-2 text-cyan-400" /> Geolocation Precision</h3>
                        <p className="font-mono text-lg text-green-400">RTK LOCK ACQUIRED</p>
                        <p className="text-xs text-gray-500 mt-1">Survey-Grade Accuracy (&lt;2cm)</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 flex items-center mb-2"><MapPinCheckIcon className="h-5 w-5 mr-2 text-cyan-400" /> Ground-Truth Validation</h3>
                        <p className="font-mono text-lg text-green-400">VALIDATED VS GCPS</p>
                        <p className="text-xs text-gray-500 mt-1">Cross-referenced with 12 GCPs</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 flex items-center mb-2"><GlobeIcon className="h-5 w-5 mr-2 text-cyan-400" /> Coordinate System</h3>
                        <p className="font-mono text-lg text-cyan-300">WGS 84 / UTM 10N</p>
                        <p className="text-xs text-gray-500 mt-1">EPSG:32610</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 flex items-center mb-2"><CodeFileIcon className="h-5 w-5 mr-2 text-cyan-400" /> Output Format</h3>
                        <p className="font-mono text-lg text-cyan-300">LAS 1.4 / LAZ</p>
                        <p className="text-xs text-gray-500 mt-1">ASPRS Standard Compliant</p>
                    </div>
                     <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 flex items-center mb-2"><CogIcon className="h-5 w-5 mr-2 text-cyan-400" /> Instrument & Versioning</h3>
                        <p className="font-mono text-lg text-cyan-300">INST-04B / v2.1.3</p>
                        <p className="text-xs text-gray-500 mt-1">Dataset Version: 1.0.2</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 flex items-center mb-2"><TagIcon className="h-5 w-5 mr-2 text-cyan-400" /> Embedded Metadata</h3>
                        <p className="font-mono text-lg text-cyan-300">3 Tags Embedded</p>
                        <p className="text-xs text-gray-500 mt-1">MissionID, Operator, Platform</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 flex items-center mb-2"><CircleStackIcon className="h-5 w-5 mr-2 text-cyan-400" /> Archival Status</h3>
                        <p className="font-mono text-lg text-cyan-300">Ready for Archive</p>
                        <p className="text-xs text-gray-500 mt-1">STANAG 4545 Compliant</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 flex items-center mb-2"><ShieldCheckIcon className="h-5 w-5 mr-2 text-cyan-400" /> Data Provenance</h3>
                        <p className="font-mono text-lg text-cyan-300">CHAIN OF CUSTODY</p>
                        <p className="text-xs text-gray-500 mt-1">NIST RFI Compliant</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProcessingVisualizer: React.FC<{ title?: string }> = ({ title = "Preprocessing Scan..." }) => {
    const steps = ['Noise Removal', 'Data Normalization', 'Density Harmonization', 'Sensor Calibration'];
    const [currentStep, setCurrentStep] = React.useState(0);

    React.useEffect(() => {
        if (currentStep < steps.length) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 750);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn flex-1">
            <h2 className="text-2xl font-bold text-cyan-300 mb-6">{title}</h2>
            <div className="w-full max-w-md space-y-4">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isInProgress = index === currentStep;
                    
                    return (
                        <div key={step} className="flex items-center space-x-4 bg-gray-800/50 p-4 rounded-lg">
                            <div className="flex-shrink-0">
                                {isCompleted ? (
                                    <CheckIcon className="h-6 w-6 text-green-400 animate-fadeIn" />
                                ) : isInProgress ? (
                                    <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-cyan-400"></div>
                                ) : (
                                    <div className="w-6 h-6 border-2 border-gray-600 rounded-full"></div>
                                )}
                            </div>
                            <div className={`flex-1 text-left ${isCompleted ? 'text-green-400' : isInProgress ? 'text-cyan-300 animate-pulse' : 'text-gray-500'}`}>
                                <p className="font-semibold">{step}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
             <p className="text-sm text-gray-500 mt-6">Removing noise, normalizing data, and harmonizing point density...</p>
        </div>
    );
};


const MeasurementModule: React.FC = () => {
    const [state, setState] = useState<'idle' | 'validating' | 'processing' | 'processed' | 'error'>('idle');
    const [error, setError] = useState<{title: string, message: string} | null>(null);
    const [processingTitle, setProcessingTitle] = useState("Preprocessing Scan...");
    const [showConsent, setShowConsent] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);


    const handleUploadRequest = async (file: File) => {
        const action = async () => {
            setState('validating');
            setError(null);
            setProcessingTitle("Preprocessing Scan...");

            try {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate validation delay
                setState('processing');
                const result = await processScanFile(file);
                setState(result);
            } catch (e) {
                const message = (e as Error).message;
                if (message === 'Invalid File Format') {
                     setError({ title: 'Invalid File Format', message: 'Please upload a valid .LAS, .XYZ or .CSV point cloud file.'});
                } else if (message === 'Data Out of Range') {
                     setError({ title: 'Data Out of Range', message: 'File size exceeds 10MB. Scan may contain points outside the expected geophysical area.'});
                } else {
                     setError({ title: 'Processing Error', message: 'An unknown error occurred.'});
                }
                setState('error');
            }
        };
        setPendingAction(() => action);
        setShowConsent(true);
    };
    
    const handleLoadMockRequest = async () => {
        const action = async () => {
            setProcessingTitle("Loading Mock Scan...");
            setState('processing');
            setError(null);
            const result = await loadMockScan();
            setState(result);
        };
        setPendingAction(() => action);
        setShowConsent(true);
    };
    
    const handleImportRequest = async (source: string) => {
        const action = async () => {
            setProcessingTitle(`Importing from ${source}...`);
            setState('processing');
            setError(null);
            const result = await importExternalDataset();
            setState(result);
        };
        setPendingAction(() => action);
        setShowConsent(true);
    };

    const handleConsentConfirm = () => {
        if (pendingAction) {
            pendingAction();
        }
        setShowConsent(false);
        setPendingAction(null);
    };

    const handleConsentCancel = () => {
        setShowConsent(false);
        setPendingAction(null);
    };


    const handleReset = () => {
        setState('idle');
        setError(null);
    };

    const renderContent = () => {
        switch (state) {
            case 'validating':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn flex-1">
                         <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400 mx-auto"></div>
                         <h2 className="text-2xl font-bold text-cyan-300 mt-6">Validating scan data integrity...</h2>
                    </div>
                );
            case 'processing':
                return <ProcessingVisualizer title={processingTitle} />;
            case 'processed':
                return <ProcessedView />;
            case 'error':
                 return (
                    <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn flex-1">
                        <div className="bg-red-900/50 border border-red-500/50 text-red-300 p-8 rounded-lg max-w-md">
                            <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-red-400" />
                            <h2 className="text-2xl font-bold text-red-300 mt-4">{error?.title}</h2>
                            <p className="mt-2">{error?.message}</p>
                            <button onClick={handleReset} className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition font-semibold">
                                Try Again
                            </button>
                        </div>
                    </div>
                 );
            case 'idle':
            default:
                return (
                    <DataImportModule
                        onUpload={handleUploadRequest}
                        onLoadMock={handleLoadMockRequest}
                        onImport={handleImportRequest}
                        disabled={state !== 'idle'}
                    />
                );
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {showConsent && (
                <ConsentDialog
                    title="Data Processing Consent"
                    onConfirm={handleConsentConfirm}
                    onCancel={handleConsentCancel}
                >
                    <p>By proceeding, you consent to the local processing of the uploaded or imported data on this device for scientific analysis.</p>
                    <p>No data will be transmitted to external servers without your explicit permission. You can manage data privacy settings in the Collaboration module.</p>
                </ConsentDialog>
            )}
            {state === 'processed' && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                     <p className="text-sm text-green-400">Scan processed successfully. All sensors calibrated.</p>
                     <button onClick={handleReset} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition font-semibold">
                        Start New Scan
                    </button>
                </div>
            )}
            <div className="min-h-[60vh] flex flex-col justify-center">
                {renderContent()}
            </div>
        </div>
    );
};

export default MeasurementModule;