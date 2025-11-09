import React, { useState, useRef } from 'react';
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import WalkthroughTip from '../common/WalkthroughTip';
import { RulerIcon } from '../icons/RulerIcon';


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
    const { isLiveData, stopTestTimer, walkthroughStep, completeWalkthroughStep, addLog, logAnalysisRun } = useUIStateContext();
    const analysis = database.topography;
    const [overlays, setOverlays] = useState({ faultLines: true, erosion: true, waterFlow: true });
    const [baseLayer, setBaseLayer] = useState<BaseLayer>('terrain');
    const [quickAnalysisState, setQuickAnalysisState] = useState<'idle' | 'running' | 'complete'>('idle');
    const quickAnalysisCardRef = useRef<HTMLDivElement>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [transectStart, setTransectStart] = useState<{ x: number, y: number } | null>(null);
    const [transectEnd, setTransectEnd] = useState<{ x: number, y: number } | null>(null);
    const [elevationData, setElevationData] = useState<any[] | null>(null);
    const [profileAnalysisState, setProfileAnalysisState] = useState<'idle' | 'running' | 'complete'>('idle');
    const mapContainerRef = useRef<HTMLDivElement>(null);
    
    const [isMeasuring, setIsMeasuring] = useState(false);
    // FIX: Changed type to allow for 0, 1, or 2 points to fix measurement logic.
    const [measurePoints, setMeasurePoints] = useState<{x: number, y: number}[]>([]);
    const [distance, setDistance] = useState<number | null>(null);


    const toggleOverlay = (key: keyof typeof overlays) => {
        setOverlays(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            addLog(`Topography: Toggled overlay '${key}' to ${newState[key]}`);
            return newState;
        });
    };
    
    const handleChangeBaseLayer = (layer: BaseLayer) => {
        addLog(`Topography: Changed base layer to '${layer}'`);
        setBaseLayer(layer);
    };

    const runQuickAnalysis = () => {
        addLog('Topography: "In-Situ Quick Analysis" initiated.');
        logAnalysisRun('Topography', { type: 'Quick Analysis' });
        setQuickAnalysisState('running');
        if (walkthroughStep === 'topography-analysis') {
            completeWalkthroughStep();
        }
        setTimeout(() => {
            setQuickAnalysisState('complete');
            stopTestTimer(); // Stop the field test timer upon completion
             addLog('Topography: "In-Situ Quick Analysis" completed.');
        }, 1500);
    };

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMeasuring || !mapContainerRef.current) return;
        const rect = mapContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMeasurePoints(prev => {
            if (prev.length === 0) {
                addLog(`Topography: Started distance measurement at (${x.toFixed(0)}, ${y.toFixed(0)}).`);
                // FIX: Removed `as any` as the state type is now correct.
                return [{x, y}];
            }
            if (prev.length === 1) {
                const start = prev[0];
                const end = {x, y};
                const pixelDist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
                const mockScale = 0.5; // 0.5 meters per pixel
                const realDist = pixelDist * mockScale;
                setDistance(realDist);
                addLog(`Topography: Finished distance measurement at (${x.toFixed(0)}, ${y.toFixed(0)}). Distance: ${realDist.toFixed(2)}m.`);
                logAnalysisRun('Topography', { type: 'Distance Measurement', distance: realDist.toFixed(2) });
                return [start, end];
            }
            return [];
        });
    };
    
    const toggleMeasureMode = () => {
        setIsMeasuring(prev => {
            const newMode = !prev;
            addLog(`Topography: Toggled measure mode ${newMode ? 'ON' : 'OFF'}.`);
            if (!newMode) { // Reset on toggle off
                setMeasurePoints([]);
                setDistance(null);
            }
            return newMode;
        });
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMeasuring || !mapContainerRef.current) return;
        const rect = mapContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setIsDrawing(true);
        setTransectStart({ x, y });
        setTransectEnd({ x, y });
        setElevationData(null);
        setProfileAnalysisState('idle');
        addLog(`Topography: Started drawing elevation transect at (${x.toFixed(0)}, ${y.toFixed(0)}).`);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing || isMeasuring || !mapContainerRef.current) return;
        const rect = mapContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        setTransectEnd({ x, y });
    };
    
    const generateMockElevationData = (start: {x:number, y:number}, end: {x:number, y:number}) => {
        const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const data = [];
        const segments = Math.max(100, Math.floor(distance));
        for (let i = 0; i <= segments; i++) {
            const elevation = 150 + Math.sin(i / 30) * 25 + (Math.random() - 0.5) * 8 * Math.cos(i / (segments/10));
            data.push({ distance: Math.round(i * (distance / segments)), elevation: Math.round(elevation * 10) / 10 });
        }
        return data;
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing || isMeasuring || !transectStart || !transectEnd || !mapContainerRef.current) return;
        
        const rect = mapContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addLog(`Topography: Finished drawing elevation transect at (${x.toFixed(0)}, ${y.toFixed(0)}).`);

        if (transectStart.x === transectEnd.x && transectStart.y === transectEnd.y) {
            setIsDrawing(false);
            setTransectStart(null);
            setTransectEnd(null);
            return;
        }
        setIsDrawing(false);
        setProfileAnalysisState('running');
        logAnalysisRun('Topography', { type: 'Elevation Profile', transect: { start: transectStart, end: transectEnd } });

        setTimeout(() => {
            const data = generateMockElevationData(transectStart, transectEnd);
            setElevationData(data);
            setProfileAnalysisState('complete');
             addLog(`Topography: Elevation profile analysis complete.`);
        }, 1000);
    };

    const handleMouseLeave = () => {
        if (isDrawing) {
            setIsDrawing(false);
            setTransectStart(null);
            setTransectEnd(null);
        }
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
                <div 
                    ref={mapContainerRef}
                    className={`relative aspect-video w-full rounded-sm bg-black border border-green-dark overflow-hidden ${isMeasuring ? 'cursor-crosshair' : 'cursor-grab'}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleMapClick}
                >
                    <img src={baseLayerImages[baseLayer]} alt="Topographical Map" className="object-cover w-full h-full transition-opacity duration-500 opacity-50 select-none pointer-events-none" />
                    
                    {overlays.faultLines && <AnomalyMarker top="30%" left="40%" label="Fault Line" />}
                    {overlays.erosion && <AnomalyMarker top="65%" left="60%" label="Erosion Zone" />}
                    {overlays.waterFlow && <AnomalyMarker top="50%" left="25%" label="Water Flow Path" />}

                    {transectStart && transectEnd && !isMeasuring && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line x1={transectStart.x} y1={transectStart.y} x2={transectEnd.x} y2={transectEnd.y} stroke="var(--color-data-blue)" strokeWidth="2" strokeDasharray="4" />
                            <circle cx={transectStart.x} cy={transectStart.y} r="4" fill="var(--color-bg-primary)" stroke="var(--color-data-blue)" strokeWidth="2" />
                             <text x={transectStart.x + 8} y={transectStart.y - 8} fill="var(--color-data-blue)" className="font-mono font-bold text-sm">A</text>
                            <circle cx={transectEnd.x} cy={transectEnd.y} r="4" fill="var(--color-bg-primary)" stroke="var(--color-data-blue)" strokeWidth="2" />
                            <text x={transectEnd.x + 8} y={transectEnd.y - 8} fill="var(--color-data-blue)" className="font-mono font-bold text-sm">B</text>
                        </svg>
                    )}
                    
                    {measurePoints.map((point, index) => (
                        <div key={index} className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 border-2 border-black rounded-full pointer-events-none" style={{ left: point.x, top: point.y }}></div>
                    ))}
                    {measurePoints.length === 2 && (
                         <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line x1={measurePoints[0].x} y1={measurePoints[0].y} x2={measurePoints[1].x} y2={measurePoints[1].y} stroke="var(--color-warning)" strokeWidth="2" />
                        </svg>
                    )}
                     {distance !== null && measurePoints.length === 2 && (
                        <div className="absolute bg-black/70 text-warning font-mono text-sm p-2 rounded-sm pointer-events-none" style={{ left: (measurePoints[0].x + measurePoints[1].x)/2 + 10, top: (measurePoints[0].y + measurePoints[1].y)/2 - 10 }}>
                            {distance.toFixed(2)}m
                        </div>
                     )}
                </div>
                <Card>
                    <h3 className="text-lg font-mono font-semibold text-text-accent mb-4">Elevation Profile</h3>
                    {profileAnalysisState === 'idle' && (
                        <div className="h-48 flex items-center justify-center text-center text-green-muted">
                            <p>Click and drag on the map above to select a transect for analysis.</p>
                        </div>
                    )}
                    {profileAnalysisState === 'running' && (
                        <div className="h-48 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-green-bright"></div>
                        </div>
                    )}
                    {profileAnalysisState === 'complete' && elevationData && (
                        <div className="w-full h-48 animate-fadeInUp">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={elevationData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid stroke="var(--color-green-dark)" strokeDasharray="3 3" />
                                    <XAxis dataKey="distance" stroke="var(--color-green-muted)" tick={{ fontSize: 10 }} unit="m" name="Distance" label={{ value: 'Distance', position: 'insideBottom', offset: -10, fill: 'var(--color-green-muted)', fontSize: 12 }} />
                                    <YAxis stroke="var(--color-green-muted)" tick={{ fontSize: 10 }} unit="m" name="Elevation" label={{ value: 'Elevation', angle: -90, position: 'insideLeft', fill: 'var(--color-green-muted)', fontSize: 12, dx: -10 }} />
                                    <RechartsTooltip
                                        contentStyle={{ 
                                            backgroundColor: 'var(--color-bg-primary)', 
                                            border: '1px solid var(--color-green-dark)',
                                            color: 'var(--color-text-primary)'
                                        }}
                                        itemStyle={{ color: 'var(--color-green-bright)' }}
                                        labelStyle={{ color: 'var(--color-green-muted)', fontWeight: 'bold' }}
                                        formatter={(value: number, name: string) => [`${value}m`, name.charAt(0).toUpperCase() + name.slice(1)]}
                                        labelFormatter={(label) => `Distance: ${label}m`}
                                    />
                                    <Line type="monotone" dataKey="elevation" stroke="var(--color-green-bright)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                 </Card>
                 <div ref={quickAnalysisCardRef} className="relative">
                    {walkthroughStep === 'topography-analysis' && (
                         <WalkthroughTip
                            targetRef={quickAnalysisCardRef}
                            onDismiss={completeWalkthroughStep}
                            title="Step 2: Instant Analysis"
                        >
                            Now that your scan is visualized, run an "In-Situ Quick Analysis". This simulates a rapid, on-device calculation to give you immediate feedback, a core feature for field work.
                        </WalkthroughTip>
                    )}
                    <Card>
                        <h3 className="text-lg font-mono font-semibold text-text-accent mb-4">In-Situ Quick Analysis</h3>
                        {quickAnalysisState === 'idle' && (
                            <>
                                <p className="text-sm text-text-primary mb-4">Run an instant, on-device analysis to get immediate feedback on key terrain characteristics.</p>
                                <button onClick={runQuickAnalysis} className="w-full p-3 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-bold">
                                    Run Instant Analysis
                                </button>
                            </>
                        )}
                        {quickAnalysisState === 'running' && (
                            <div className="flex items-center justify-center h-24">
                                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-green-bright"></div>
                            </div>
                        )}
                        {quickAnalysisState === 'complete' && <QuickAnalysisResults />}
                    </Card>
                 </div>
            </div>
            <div className="space-y-6">
                <Card>
                    <h3 className="text-lg font-mono font-semibold text-text-accent mb-4">Map Controls</h3>
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-green-muted mb-2">Interactive Tools</label>
                             <button onClick={toggleMeasureMode} className={`w-full p-3 rounded-sm text-sm font-bold transition flex items-center justify-center space-x-2 ${isMeasuring ? 'bg-green-bright text-bg-primary' : 'bg-bg-primary hover:bg-green-dark'}`}>
                                <RulerIcon className="h-5 w-5" />
                                <span>{isMeasuring ? 'Measuring...' : 'Measure Distance'}</span>
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-green-muted mb-2">Base Layer</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['terrain', 'satellite', 'dark'] as BaseLayer[]).map(layer => (
                                    <button key={layer} onClick={() => handleChangeBaseLayer(layer)} className={`p-2 rounded-sm text-sm font-bold uppercase transition ${baseLayer === layer ? 'bg-green-bright text-bg-primary' : 'bg-bg-primary hover:bg-green-dark'}`}>
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
