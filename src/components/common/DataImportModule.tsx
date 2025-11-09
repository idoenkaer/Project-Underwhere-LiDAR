
import React, { useState } from 'react';
import { DocumentArrowUpIcon } from '../icons/DocumentArrowUpIcon';
import { SatelliteIcon } from '../icons/SatelliteIcon';
import { MountainIcon } from '../icons/MountainIcon';
import { InfoIcon } from '../icons/InfoIcon';
import { GoogleDriveIcon } from '../icons/GoogleDriveIcon';
import { CloudArrowUpIcon } from '../icons/CloudArrowUpIcon';
import { CubeIcon } from '../icons/CubeIcon';
import { BeakerIcon } from '../icons/BeakerIcon';

type Tab = 'upload' | 'nasa' | 'topo' | 'cloud';

interface DataImportModuleProps {
    onUpload: (file: File) => void;
    onLoadMock: (scenario: string) => void;
    onImport: (source: string) => void;
    disabled: boolean;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.FC<any>; label: string }> = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex-1 p-4 text-sm font-bold flex items-center justify-center space-x-2 transition-colors border-b-2 ${
            active ? 'border-green-bright text-green-bright' : 'border-transparent text-green-muted hover:text-text-accent hover:bg-bg-secondary/50'
        }`}
    >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
    </button>
);

const UploadCard: React.FC<{ onUpload: (file: File) => void; disabled: boolean }> = ({ onUpload, disabled }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (disabled) return;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    return (
        <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`p-6 bg-bg-secondary/50 rounded-sm border-2 border-dashed transition-colors ${dragging ? 'border-green-bright bg-green-dark/30' : 'border-green-dark'}`}
        >
            <div className="text-center pointer-events-none">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-green-muted" />
                <h3 className="mt-2 text-lg font-semibold text-text-primary">Drag & Drop or Upload Scan Data</h3>
                <p className="mt-1 text-sm text-green-muted font-mono">Select a .LAS, .XYZ or .CSV file to begin analysis.</p>
                <div className="mt-6">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="sr-only" accept=".las,.csv,.xyz" />
                    <button onClick={() => fileInputRef.current?.click()} disabled={disabled} className="px-6 py-3 bg-transparent border-2 border-green-bright text-green-bright font-mono rounded-sm uppercase tracking-wider hover:bg-green-bright hover:text-bg-primary transition-all duration-200 hover:shadow-glow-green-md disabled:border-green-muted/50 disabled:text-green-muted/50 disabled:bg-transparent disabled:cursor-not-allowed pointer-events-auto">
                        Select File
                    </button>
                </div>
            </div>
        </div>
    );
};

const ExternalSourceCard: React.FC<{
    title: string;
    formFields: React.ReactNode;
    buttonText: string;
    results: React.ReactNode;
    onImport: () => void;
    disabled: boolean;
}> = ({ title, formFields, buttonText, results, onImport, disabled }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    
    const handleSearch = () => {
        setIsSearching(true);
        setShowResults(false);
        setTimeout(() => {
            setIsSearching(false);
            setShowResults(true);
        }, 1500);
    };

    return (
        <div className="p-6 bg-bg-secondary/50 rounded-sm">
            <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
            <div className="space-y-4">
                {formFields}
                <button onClick={handleSearch} disabled={disabled || isSearching} className="w-full px-6 py-3 bg-transparent border-2 border-green-bright text-green-bright font-mono rounded-sm uppercase tracking-wider hover:bg-green-bright hover:text-bg-primary transition-all duration-200 hover:shadow-glow-green-md disabled:border-green-muted/50 disabled:text-green-muted/50 disabled:bg-transparent disabled:cursor-not-allowed">
                    {isSearching ? 'Searching...' : buttonText}
                </button>
            </div>
            {showResults && (
                <div className="mt-6 border-t border-green-dark pt-4 animate-fadeInUp">
                    <h4 className="font-semibold text-green-muted mb-2 font-mono">Found 1 Dataset:</h4>
                    <div className="bg-bg-primary/50 p-3 rounded-sm flex items-center justify-between">
                        {/* FIX: The `results` prop was used here but not destructured from the component's props. */}
                        <div>{results}</div>
                        <button onClick={onImport} disabled={disabled} className="px-4 py-2 bg-data-blue/80 text-white text-sm rounded-sm hover:bg-data-blue transition font-semibold disabled:opacity-50">Import</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CloudSourceCard: React.FC<{
    onImport: () => void;
    disabled: boolean;
}> = ({ onImport, disabled }) => {
    const [authState, setAuthState] = useState<'idle' | 'authenticating' | 'authenticated'>('idle');
    
    const handleConnect = () => {
        setAuthState('authenticating');
        setTimeout(() => {
            setAuthState('authenticated');
        }, 1500);
    };

    if (authState !== 'authenticated') {
        return (
            <div className="p-6 bg-bg-secondary/50 rounded-sm text-center">
                 <h3 className="text-lg font-semibold text-text-primary mb-4">Connect to Cloud Storage</h3>
                 <p className="text-sm text-green-muted mb-6">Import datasets directly from your cloud provider.</p>
                 <button onClick={handleConnect} disabled={disabled || authState === 'authenticating'} className="w-full px-6 py-3 bg-data-blue/90 text-white rounded-sm hover:bg-data-blue transition font-semibold disabled:bg-green-muted disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                    <GoogleDriveIcon className="h-5 w-5" />
                    <span>{authState === 'authenticating' ? 'Connecting...' : 'Connect to Google Drive'}</span>
                </button>
            </div>
        );
    }
    
    return (
        <div className="p-6 bg-bg-secondary/50 rounded-sm animate-fadeInUp">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Select a file from Google Drive</h3>
            <div className="bg-bg-primary/50 p-3 rounded-sm flex items-center justify-between">
                <div>
                    <p className="text-sm text-text-primary font-mono flex items-center"><CubeIcon className="h-4 w-4 mr-2" /> field_scan_2024.laz</p>
                </div>
                <button onClick={onImport} disabled={disabled} className="px-4 py-2 bg-data-blue/80 text-white text-sm rounded-sm hover:bg-data-blue transition font-semibold disabled:opacity-50">Import</button>
            </div>
             <p className="text-xs text-green-muted/50 text-center mt-3 font-mono">Showing a mock file for demonstration.</p>
        </div>
    );
};


export const DataImportModule: React.FC<DataImportModuleProps> = ({ onUpload, onLoadMock, onImport, disabled }) => {
    const [activeTab, setActiveTab] = useState<Tab>('upload');
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'nasa':
                return (
                    <ExternalSourceCard
                        title="Import from NASA Earthdata"
                        formFields={
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-green-muted mb-1">Dataset</label>
                                    <select className="w-full bg-bg-primary border border-green-dark rounded-sm px-3 py-2 focus:ring-green-bright focus:border-green-bright text-green-bright font-mono">
                                        <option>ICESat-2 Land Ice Height, Version 5</option>
                                        <option>Landsat 9 Collection 2 Level-1</option>
                                        <option>MODIS/Terra Surface Reflectance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-green-muted mb-1">Date Range</label>
                                    <div className="flex space-x-2">
                                        <input type="text" value="2023-01-01" readOnly className="w-full bg-bg-primary border border-green-dark rounded-sm px-3 py-2 font-mono text-green-bright" />
                                        <input type="text" value="2023-12-31" readOnly className="w-full bg-bg-primary border border-green-dark rounded-sm px-3 py-2 font-mono text-green-bright" />
                                    </div>
                                </div>
                            </>
                        }
                        buttonText="Search Datasets"
                        results={<p className="text-sm text-text-primary font-mono">ATL06_20230515.h5</p>}
                        onImport={() => onImport('NASA Earthdata')}
                        disabled={disabled}
                    />
                );
            case 'topo':
                 return (
                    <ExternalSourceCard
                        title="Import from OpenTopography"
                        formFields={
                             <>
                                <div>
                                    <label className="block text-sm font-medium text-green-muted mb-1">Area of Interest</label>
                                     <input type="text" defaultValue="Mount St. Helens, WA" className="w-full bg-bg-primary border border-green-dark rounded-sm px-3 py-2 focus:ring-green-bright focus:border-green-bright text-green-bright font-mono" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-green-muted mb-1">Dataset Type</label>
                                    <select className="w-full bg-bg-primary border border-green-dark rounded-sm px-3 py-2 focus:ring-green-bright focus:border-green-bright text-green-bright font-mono">
                                        <option>Point Cloud</option>
                                        <option>DEM</option>
                                    </select>
                                </div>
                             </>
                        }
                        buttonText="Find Datasets"
                        results={<p className="text-sm text-text-primary">USGS Lidar for Mount St. Helens</p>}
                        onImport={() => onImport('OpenTopography')}
                        disabled={disabled}
                    />
                );
            case 'cloud':
                return <CloudSourceCard onImport={() => onImport('Google Drive')} disabled={disabled} />;
            case 'upload':
            default:
                return (
                    <div className="space-y-4">
                        <UploadCard onUpload={onUpload} disabled={disabled} />
                        <p className="text-center text-xs text-green-muted/80 !mt-2 font-mono">
                           This is a simulation. You can upload a .LAS, .XYZ, or .CSV file under 10MB.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-bg-secondary p-4 rounded-sm border-l-4 border-green-bright mb-6 flex items-start space-x-3">
                <InfoIcon className="h-6 w-6 text-green-bright flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="font-bold text-green-bright">Responsible Scanning Notice</h3>
                    <p className="text-xs text-green-muted">
                        Ensure you have the right to scan the selected area. Respect privacy and environmental sensitivities.
                        Consult the <code className="bg-black/30 px-1 rounded font-mono">ETHICS.md</code> guide for more information.
                    </p>
                </div>
            </div>

            <div className="bg-bg-secondary rounded-t-sm border border-green-dark border-b-0 flex">
                <TabButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={DocumentArrowUpIcon} label="File Upload" />
                <TabButton active={activeTab === 'cloud'} onClick={() => setActiveTab('cloud')} icon={CloudArrowUpIcon} label="Cloud Storage" />
                <TabButton active={activeTab === 'nasa'} onClick={() => setActiveTab('nasa')} icon={SatelliteIcon} label="NASA Earthdata" />
                <TabButton active={activeTab === 'topo'} onClick={() => setActiveTab('topo')} icon={MountainIcon} label="OpenTopography" />
            </div>
            <div className="bg-bg-secondary rounded-b-sm border border-green-dark p-6">
                 {renderTabContent()}
            </div>
             <div className="text-center text-green-muted text-sm my-4 font-mono relative">
                <span className="bg-bg-primary px-2">or, for a guided demonstration</span>
                <div className="absolute left-0 top-1/2 w-full h-px bg-green-dark -z-10"></div>
            </div>

            <div className="bg-bg-secondary p-6 rounded-sm border border-green-dark">
                <h3 className="text-lg font-mono font-semibold text-text-accent mb-4 flex items-center">
                    <BeakerIcon className="h-5 w-5 mr-3 text-green-bright" />
                    Load Use-Case Template
                </h3>
                <p className="text-sm text-text-primary mb-4">
                    Select a pre-configured scientific scenario to begin a guided analysis workflow.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button onClick={() => onLoadMock('archaeology')} disabled={disabled} className="p-4 bg-bg-primary text-green-muted rounded-sm hover:bg-bg-primary/50 hover:text-green-bright transition font-semibold disabled:opacity-50 text-left">
                        <p className="font-bold">Archaeological Survey</p>
                        <p className="text-xs mt-1">Identify subtle terrain variations for excavation planning.</p>
                    </button>
                    <button onClick={() => onLoadMock('forestry')} disabled={disabled} className="p-4 bg-bg-primary text-green-muted rounded-sm hover:bg-bg-primary/50 hover:text-green-bright transition font-semibold disabled:opacity-50 text-left">
                        <p className="font-bold">Forest Canopy Analysis</p>
                        <p className="text-xs mt-1">Measure canopy height and density for ecological studies.</p>
                    </button>
                    <button onClick={() => onLoadMock('geotechnical')} disabled={disabled} className="p-4 bg-bg-primary text-green-muted rounded-sm hover:bg-bg-primary/50 hover:text-green-bright transition font-semibold disabled:opacity-50 text-left">
                        <p className="font-bold">Geotechnical Slope Stability</p>
                        <p className="text-xs mt-1">Analyze slope angles and identify potential erosion zones.</p>
                    </button>
                    <button onClick={() => onLoadMock('default')} disabled={disabled} className="p-4 bg-bg-primary text-green-muted rounded-sm hover:bg-bg-primary/50 hover:text-green-bright transition font-semibold disabled:opacity-50 text-left">
                        <p className="font-bold">Default Lidar Scan</p>
                        <p className="text-xs mt-1">A general-purpose scan for exploratory analysis.</p>
                    </button>
                </div>
            </div>
        </div>
    );
};
