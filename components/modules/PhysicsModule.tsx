import React, { useState, useEffect } from 'react';
import { MetricCard } from '../common/MetricCard';

type SimulationType = 'none' | 'wind' | 'seismic';
type WindDirection = 'N' | 'E' | 'S' | 'W';

interface Results {
    stress: number;
    deformation: number;
    integrity: number;
}

const PhysicsModule: React.FC = () => {
    const [simulation, setSimulation] = useState<SimulationType>('wind');
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<Results | null>(null);
    
    // Interactive Controls State
    const [windSpeed, setWindSpeed] = useState(90);
    const [windDirection, setWindDirection] = useState<WindDirection>('W');

    useEffect(() => {
        let timerId: number | undefined;
        if (isRunning) {
            setResults(null);
            timerId = window.setTimeout(() => {
                // Calculate results based on inputs
                const stress = Math.round(20 * Math.pow(windSpeed / 50, 2));
                const deformation = parseFloat((3 * (windSpeed / 50)).toFixed(1));
                const integrity = Math.max(0, parseFloat((100 - stress / 5).toFixed(1)));

                setResults({ stress, deformation, integrity });
                setIsRunning(false);
            }, 3000); // Simulate a 3-second analysis
        }
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    }, [isRunning, windSpeed, windDirection]);

    const runSimulation = () => {
        if (simulation !== 'none') {
            setIsRunning(true);
        }
    };

    const getStressOverlay = () => {
        if (!results) return null;
        
        const intensity = Math.min(100, results.stress / 3);
        const gradientStops = {
            N: `from-green-500/10 via-yellow-500/${intensity}0 to-red-500/${intensity+20}0`,
            E: `from-red-500/${intensity+20}0 via-yellow-500/${intensity}0 to-green-500/10`,
            S: `from-red-500/${intensity+20}0 via-yellow-500/${intensity}0 to-green-500/10`,
            W: `from-green-500/10 via-yellow-500/${intensity}0 to-red-500/${intensity+20}0`,
        };

        const gradientDirection = {
             N: 'bg-gradient-to-b',
             E: 'bg-gradient-to-l',
             S: 'bg-gradient-to-t',
             W: 'bg-gradient-to-r',
        }
       
        return <div className={`absolute inset-0 ${gradientDirection[windDirection]} ${gradientStops[windDirection]} mix-blend-plus-lighter animate-fadeIn`}></div>;
    }

    const getStatus = (value: number, thresholds: { warn: number, crit: number }): 'good' | 'warning' | 'critical' => {
        if (value >= thresholds.crit) return 'critical';
        if (value >= thresholds.warn) return 'warning';
        return 'good';
    }
    
    const getIntegrityStatus = (value: number): 'good' | 'warning' | 'critical' => {
        if (value < 75) return 'critical';
        if (value < 90) return 'warning';
        return 'good';
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold text-gray-300 mb-4">Structural Analysis Simulation</h2>
                <div className="relative aspect-video w-full rounded-lg bg-black border border-gray-700 overflow-hidden">
                    <img src="https://picsum.photos/seed/bridge/1280/720" alt="Scanned Structure" className="object-cover w-full h-full opacity-60" />
                    {isRunning && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                           <div className="text-center">
                             <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400 mx-auto"></div>
                             <p className="text-cyan-300 text-lg mt-4">Running Finite Element Analysis...</p>
                           </div>
                        </div>
                    )}
                    {getStressOverlay()}
                    {results && (
                         <div className="absolute bottom-4 left-4 bg-black/60 p-3 rounded-lg text-sm backdrop-blur-sm">
                            <h3 className="font-bold text-white mb-2">Stress Legend</h3>
                            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-red-500"></div><span>Critical</span></div>
                            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-yellow-500"></div><span>Moderate</span></div>
                            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-green-500"></div><span>Normal</span></div>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Simulation Parameters</h3>
                    <div className="space-y-4 bg-gray-800/50 p-4 rounded-lg">
                        <div>
                            <label htmlFor="windSpeed" className="block text-sm font-medium text-gray-400 mb-2">Wind Speed: <span className="font-mono text-cyan-300">{windSpeed} km/h</span></label>
                            <input
                                id="windSpeed"
                                type="range"
                                min="10"
                                max="250"
                                value={windSpeed}
                                onChange={(e) => setWindSpeed(parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                disabled={isRunning}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Wind Direction</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['N', 'W', 'E', 'S'] as WindDirection[]).map(dir => (
                                    <button 
                                        key={dir} 
                                        onClick={() => setWindDirection(dir)}
                                        disabled={isRunning}
                                        className={`p-2 rounded-md text-sm font-bold transition ${windDirection === dir ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    >
                                        {dir}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                     <button onClick={runSimulation} disabled={isRunning} className="mt-4 w-full p-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:bg-gray-600 disabled:cursor-wait transition">
                        {isRunning ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </div>
                {results && (
                    <div className="space-y-4 animate-fadeIn">
                        <h3 className="text-lg font-semibold text-gray-300">Analysis Results</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <MetricCard label="Max Stress" value={String(results.stress)} unit="MPa" status={getStatus(results.stress, { warn: 200, crit: 400})} />
                            <MetricCard label="Deformation" value={String(results.deformation)} unit="cm" status={getStatus(results.deformation, { warn: 15, crit: 30})} />
                            <MetricCard label="Integrity" value={String(results.integrity)} unit="%" status={getIntegrityStatus(results.integrity)} />
                        </div>
                         <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                            <p><strong className="text-gray-200">AI Summary:</strong> Based on the simulation with a {windSpeed} km/h wind from the {windDirection}, the structural integrity is {results.integrity}%. {results.stress > 200 ? "Critical stress points are emerging." : "The structure remains stable."}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhysicsModule;