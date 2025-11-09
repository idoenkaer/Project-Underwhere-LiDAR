import React, { useState, useRef, useEffect } from 'react';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { MetricCard } from '../common/MetricCard';
import { CheckIcon } from '../icons/CheckIcon';
import { processScanFile, loadMockScan } from '../../application/use-cases/processScanFile';

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
        </div>
    );
};

const UploadCard: React.FC<{ onUpload: (file: File) => void, disabled: boolean }> = ({ onUpload, disabled }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };
    
    return (
        <div className={`p-6 bg-gray-800/50 rounded-lg border-2 border-dashed transition-colors ${dragging ? 'border-cyan-400 bg-cyan-900/30' : 'border-gray-700'}`}>
            <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <h3 className="mt-2 text-lg font-semibold text-gray-200">Upload Scan Data</h3>
                <p className="mt-1 text-sm text-gray-400">Select a .LAS or .CSV file to begin analysis.</p>
                <div className="mt-6">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="sr-only" accept=".las,.csv,.xyz" />
                    <button onClick={() => fileInputRef.current?.click()} disabled={disabled} className="px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Select File
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProcessingVisualizer: React.FC = () => {
    const steps = ['Noise Removal', 'Data Normalization', 'Density Harmonization', 'Sensor Calibration'];
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < steps.length) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 750);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn flex-1">
            <h2 className="text-2xl font-bold text-cyan-300 mb-6">Preprocessing Scan...</h2>
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

    const handleUpload = async (file: File) => {
        setState('validating');
        setError(null);

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
    
    const handleLoadMock = async () => {
        setState('processing');
        setError(null);
        const result = await loadMockScan();
        setState(result);
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
                return <ProcessingVisualizer />;
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
                     <div className="space-y-4">
                        <UploadCard onUpload={handleUpload} disabled={state !== 'idle'} />
                        <p className="text-center text-xs text-gray-500 !mt-2">
                           Future versions will support direct API imports from USGS and OpenTopography.
                        </p>
                        <div className="text-center text-gray-500 text-sm">
                            or, for a quick demonstration:
                        </div>
                        <button onClick={handleLoadMock} disabled={state !== 'idle'} className="w-full py-3 bg-gray-700/50 text-gray-300 rounded-md hover:bg-gray-700 transition font-semibold disabled:opacity-50">
                            Load Mock Scan
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
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