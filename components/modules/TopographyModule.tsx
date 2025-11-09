import React, { useState } from 'react';
import { RecommendationsCard } from '../common/RecommendationsCard';
import { useDataContext } from '../contexts/DataContext';
import { useUIStateContext } from '../contexts/UIStateContext';
import { ControlToggle } from '../common/ControlToggle';
import { Card } from '../common/Card';
import { MetricCard } from '../common/MetricCard';
import { ChartTrendingUpIcon } from '../icons/ChartTrendingUpIcon';
import { CompassIcon } from '../icons/CompassIcon';
import { LeafIcon } from '../icons/LeafIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';

const AnomalyMarker: React.FC<{ top: string; left: string; delay?: string; label: string }> = ({ top, left, delay = '0s', label }) => (
    <div className="absolute animate-fadeIn" style={{ top, left, animationDelay: delay }}>
        <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-error border-2 border-white/80"></div>
            <div className="absolute w-6 h-6 rounded-full bg-error/50 animate-ping"></div>
        </div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-bg-primary/80 text-white text-xs px-2 py-1 rounded-sm font-mono">
            {label}
        </div>
    </div>
);

type BaseLayer = 'terrain' | 'satellite' | 'dark';

const QuickAnalysisResults: React.FC = () => (
    <div className="grid grid-cols-2 gap-4 animate-fadeInUp">
        <MetricCard label="Max Slope" value="34.2" unit="°" icon={ChartTrendingUpIcon} />
        <MetricCard label="Dominant Aspect" value="NW" unit="295°" icon={CompassIcon} />
        <MetricCard label="Vegetation Density" value="68" unit="%" icon={LeafIcon} />
        <MetricCard label="Anomaly Confidence" value="82" unit="%" status="warning" icon={ExclamationTriangleIcon} />
    </div>
);

const TopographyModule: React.FC = () => {
    const { database } = useDataContext();
    const { isLiveData } = useUIStateContext();
    const analysis = database.topography;
    const [overlays, setOverlays] = useState({ faultLines: true, erosion: true, waterFlow: true });
    const [baseLayer, setBaseLayer] = useState<BaseLayer>('terrain');
    const [analysisState, setAnalysisState] = useState<'idle' | 'running' | 'complete'>('idle');

    const toggleOverlay = (key: keyof typeof overlays) => {
        setOverlays(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const runQuickAnalysis = () => {
        setAnalysisState('running');
        setTimeout(() => {
            setAnalysisState('complete');
        }, 1500);
    };
    
    const baseLayerImages: Record<BaseLayer, string> = {
        terrain: 'https://picsum.photos/seed/map_terrain/1280/720',
        satellite: 'https://picsum.photos/seed/map_satellite/1280/720',
        dark: 'https://picsum.photos/seed/map_dark/1280/720',
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-lg font-mono font-semibold text-text-primary">Interactive Terrain Map</h2>
                <div className="relative aspect-video w-full rounded-sm bg-black border border-green-dark overflow-hidden">
                    <img src={baseLayerImages[baseLayer]} alt="Topographical Map" className="object-cover w-full h-full transition-opacity duration-500 opacity-50" />
                    
                    {overlays.faultLines && <AnomalyMarker top="30%" left="40%" label="Fault Line" />}
                    {overlays.erosion && <AnomalyMarker top="65%" left="60%" label="Erosion Zone" />}
                    {overlays.waterFlow && <AnomalyMarker top="50%" left="25%" label="Water Flow Path" />}
                </div>
                 <Card>
                    <h3 className="text-lg font-mono font-semibold text-text-accent mb-4">In-Situ Quick Analysis</h3>
                    {analysisState === 'idle' && (
                        <>
                            <p className="text-sm text-text-primary mb-4">Run an instant, on-device analysis to get immediate feedback on key terrain characteristics.</p>
                            <button onClick={runQuickAnalysis} className="w-full p-3 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-bold">
                                Run Instant Analysis
                            </button>
                        </>
                    )}
                    {analysisState === 'running' && (
                        <div className="flex items-center justify-center h-24">
                            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-green-bright"></div>
                        </div>
                    )}
                    {analysisState === 'complete' && <QuickAnalysisResults />}
                 </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <h3 className="text-lg font-mono font-semibold text-text-accent mb-4">Map Controls</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-green-muted mb-2">Base Layer</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['terrain', 'satellite', 'dark'] as BaseLayer[]).map(layer => (
                                    <button key={layer} onClick={() => setBaseLayer(layer)} className={`p-2 rounded-sm text-sm font-bold uppercase transition ${baseLayer === layer ? 'bg-green-bright text-bg-primary' : 'bg-bg-primary hover:bg-green-dark'}`}>
                                        {layer}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-green-muted mb-2">Geological Overlays</label>
                             <div className="space-y-3">
                                <ControlToggle label="Fault Lines" checked={overlays.faultLines} onChange={() => toggleOverlay('faultLines')} />
                                <ControlToggle label="Erosion Zones" checked={overlays.erosion} onChange={() => toggleOverlay('erosion')} />
                                <ControlToggle label="Water Flow Paths" checked={overlays.waterFlow} onChange={() => toggleOverlay('waterFlow')} />
                             </div>
                        </div>
                    </div>
                </Card>
                 <div className="space-y-4">
                    <Card>
                        <h3 className="text-md font-mono font-semibold text-text-accent mb-2">Analysis Details</h3>
                        <p className="font-mono text-green-primary text-sm mb-2">{isLiveData ? 'LIVE_SCANNING...' : 'SIMULATION_LOADED'}</p>
                        <div className="text-xs text-green-muted space-y-1 font-mono">
                            <p><span className="text-green-primary">✔</span> GIS Data Cross-Validation Complete</p>
                            <p><span className="text-green-primary">✔</span> Source: Sentinel-2, USGS Geological Survey</p>
                             <p><span className="text-data-blue">❖</span> Cross-validated using CloudCompare & GRASS GIS</p>
                             <p className="text-green-muted">✦ Extendable with QGIS plugin hooks</p>
                        </div>
                    </Card>
                    <RecommendationsCard recommendations={analysis.recommendations} />
                 </div>
            </div>
        </div>
    );
};

export default TopographyModule;