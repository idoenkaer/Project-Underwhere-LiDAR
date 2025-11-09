import React, { useState } from 'react';
import { DocumentArrowUpIcon } from '../icons/DocumentArrowUpIcon';
import { SatelliteIcon } from '../icons/SatelliteIcon';
import { MountainIcon } from '../icons/MountainIcon';
import { ExclamationCircleIcon } from '../icons/ExclamationCircleIcon';

type Tab = 'upload' | 'nasa' | 'topo';

interface DataImportModuleProps {
    onUpload: (file: File) => void;
    onLoadMock: () => void;
    onImport: (source: string) => void;
    disabled: boolean;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.FC<any>; label: string }> = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex-1 p-4 text-sm font-bold flex items-center justify-center space-x-2 transition-colors border-b-2 ${
            active ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700/50'
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
    
    return (
        <div className={`p-6 bg-gray-800/50 rounded-lg border-2 border-dashed transition-colors ${dragging ? 'border-cyan-400 bg-cyan-900/30' : 'border-gray-700'}`}>
            <div className="text-center">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-lg font-semibold text-gray-200">Upload Scan Data</h3>
                <p className="mt-1 text-sm text-gray-400">Select a .LAS, .XYZ or .CSV file to begin analysis.</p>
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
        <div className="p-6 bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>
            <div className="space-y-4">
                {formFields}
                <button onClick={handleSearch} disabled={disabled || isSearching} className="w-full px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed">
                    {isSearching ? 'Searching...' : buttonText}
                </button>
            </div>
            {showResults && (
                <div className="mt-6 border-t border-gray-700 pt-4 animate-fadeInUp">
                    <h4 className="font-semibold text-gray-300 mb-2">Found 1 Dataset:</h4>
                    <div className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
                        <div>{results}</div>
                        <button onClick={onImport} disabled={disabled} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-500 transition font-semibold disabled:opacity-50">Import</button>
                    </div>
                </div>
            )}
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
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Dataset</label>
                                    <select className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2">
                                        <option>ICESat-2 Land Ice Height, Version 5</option>
                                        <option>Landsat 9 Collection 2 Level-1</option>
                                        <option>MODIS/Terra Surface Reflectance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Date Range</label>
                                    <div className="flex space-x-2">
                                        <input type="text" value="2023-01-01" readOnly className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 font-mono" />
                                        <input type="text" value="2023-12-31" readOnly className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 font-mono" />
                                    </div>
                                </div>
                            </>
                        }
                        buttonText="Search Datasets"
                        results={<p className="text-sm text-gray-300 font-mono">ATL06_20230515.h5</p>}
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
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Area of Interest</label>
                                     <input type="text" defaultValue="Mount St. Helens, WA" className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Dataset Type</label>
                                    <select className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2">
                                        <option>Point Cloud</option>
                                        <option>DEM</option>
                                    </select>
                                </div>
                             </>
                        }
                        buttonText="Find Datasets"
                        results={<p className="text-sm text-gray-300">USGS Lidar for Mount St. Helens</p>}
                        onImport={() => onImport('OpenTopography')}
                        disabled={disabled}
                    />
                );
            case 'upload':
            default:
                return (
                    <div className="space-y-4">
                        <UploadCard onUpload={onUpload} disabled={disabled} />
                        <p className="text-center text-xs text-gray-500 !mt-2">
                           This is a simulation. You can upload a .LAS, .XYZ, or .CSV file under 10MB.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900/80 p-4 rounded-lg border border-yellow-500/30 mb-6 flex items-start space-x-3">
                <ExclamationCircleIcon className="h-6 w-6 text-yellow-400 flex-shrink-0 animate-pulse" />
                <div className="flex-1">
                    <h3 className="font-bold text-yellow-300">Responsible Scanning Notice</h3>
                    <p className="text-xs text-yellow-400/80">
                        Ensure you have the right to scan the selected area. Respect privacy and environmental sensitivities.
                        Consult the <code className="bg-black/30 px-1 rounded">ETHICS.md</code> guide for more information.
                    </p>
                </div>
            </div>

            <div className="bg-gray-800 rounded-t-lg border border-gray-700 border-b-0 flex">
                <TabButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={DocumentArrowUpIcon} label="File Upload" />
                <TabButton active={activeTab === 'nasa'} onClick={() => setActiveTab('nasa')} icon={SatelliteIcon} label="NASA Earthdata" />
                <TabButton active={activeTab === 'topo'} onClick={() => setActiveTab('topo')} icon={MountainIcon} label="OpenTopography" />
            </div>
            <div className="bg-gray-800 rounded-b-lg border border-gray-700 p-6">
                 {renderTabContent()}
            </div>
             <div className="text-center text-gray-500 text-sm mt-4">
                or, for a quick demonstration:
            </div>
            <button onClick={onLoadMock} disabled={disabled} className="w-full mt-2 py-3 bg-gray-700/50 text-gray-300 rounded-md hover:bg-gray-700 transition font-semibold disabled:opacity-50">
                Load Mock Scan
            </button>
        </div>
    );
};