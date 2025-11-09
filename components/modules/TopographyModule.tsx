import React, { useState } from 'react';

const AnomalyMarker: React.FC<{ top: string; left: string; delay?: string; label: string }> = ({ top, left, delay = '0s', label }) => (
    <div className="absolute animate-fadeIn" style={{ top, left, animationDelay: delay }}>
        <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white/80"></div>
            <div className="absolute w-6 h-6 rounded-full bg-red-500/50 animate-ping"></div>
        </div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-900/80 text-white text-xs px-2 py-1 rounded-md">
            {label}
        </div>
    </div>
);

const ControlToggle: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm text-gray-300">{label}</label>
        <button onClick={onChange} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? 'bg-cyan-600' : 'bg-gray-600'}`}>
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

type BaseLayer = 'terrain' | 'satellite' | 'dark';

// FIX: Destructure isLiveData from props to make it available within the component.
const TopographyModule: React.FC<{ isLiveData: boolean }> = ({ isLiveData }) => {
    const [overlays, setOverlays] = useState({ faultLines: true, erosion: true, waterFlow: true });
    const [baseLayer, setBaseLayer] = useState<BaseLayer>('terrain');

    const toggleOverlay = (key: keyof typeof overlays) => {
        setOverlays(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    const baseLayerImages: Record<BaseLayer, string> = {
        terrain: 'https://picsum.photos/seed/map_terrain/1280/720',
        satellite: 'https://picsum.photos/seed/map_satellite/1280/720',
        dark: 'https://picsum.photos/seed/map_dark/1280/720',
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold text-gray-300 mb-4">Interactive Terrain Map</h2>
                <div className="relative aspect-video w-full rounded-lg bg-black border border-gray-700 overflow-hidden">
                    <img src={baseLayerImages[baseLayer]} alt="Topographical Map" className="object-cover w-full h-full transition-opacity duration-500 opacity-50" />
                    
                    {overlays.faultLines && <AnomalyMarker top="30%" left="40%" label="Fault Line" />}
                    {overlays.erosion && <AnomalyMarker top="65%" left="60%" label="Erosion Zone" />}
                    {overlays.waterFlow && <AnomalyMarker top="50%" left="25%" label="Water Flow Path" />}
                </div>
            </div>
            <div className="space-y-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Map Controls</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Base Layer</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['terrain', 'satellite', 'dark'] as BaseLayer[]).map(layer => (
                                    <button key={layer} onClick={() => setBaseLayer(layer)} className={`p-2 rounded-md text-sm font-bold capitalize transition ${baseLayer === layer ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                        {layer}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-400 mb-2">Geological Overlays</label>
                             <div className="space-y-3">
                                <ControlToggle label="Fault Lines" checked={overlays.faultLines} onChange={() => toggleOverlay('faultLines')} />
                                <ControlToggle label="Erosion Zones" checked={overlays.erosion} onChange={() => toggleOverlay('erosion')} />
                                <ControlToggle label="Water Flow Paths" checked={overlays.waterFlow} onChange={() => toggleOverlay('waterFlow')} />
                             </div>
                        </div>
                    </div>
                </div>
                 <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Analysis Details</h3>
                    <p className="font-mono text-cyan-300 text-sm mb-2">{isLiveData ? 'LIVE SCANNING...' : 'SIMULATION LOADED'}</p>
                    <div className="text-xs text-gray-400 space-y-1">
                        <p><span className="text-green-400">✔</span> GIS Data Cross-Validation Complete</p>
                        <p><span className="text-green-400">✔</span> Source: Sentinel-2, USGS Geological Survey</p>
                         <p><span className="text-blue-400">❖</span> Cross-validated using CloudCompare & GRASS GIS</p>
                         <p><span className="text-purple-400">✦</span> Extendable with QGIS plugin hooks</p>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default TopographyModule;