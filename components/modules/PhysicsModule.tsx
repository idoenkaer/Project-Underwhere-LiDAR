import React, { useState, useEffect, useRef } from 'react';
import { MetricCard } from '../common/MetricCard';
import { PhysicsScenario } from '../../types';
import { RecommendationsCard } from '../common/RecommendationsCard';
import { useDataContext } from '../contexts/DataContext';
import { BenchmarkResultsCard } from '../common/BenchmarkResultsCard';
import { runPhysicsSimulation } from '../../application/use-cases/runPhysicsSimulation';
import { MockDataRepository } from '../../infrastructure/data/MockDataRepository';

const PhysicsModule: React.FC = () => {
    const { database } = useDataContext();
    const analysis = database.physics;

    const [selectedScenarioId, setSelectedScenarioId] = useState<string>(analysis.scenarios[0].id);
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<PhysicsScenario | null>(null);
    const repoRef = useRef(new MockDataRepository());

    useEffect(() => {
        // Reset results if scenario changes
        setResults(null);
    }, [selectedScenarioId]);

    const runSimulation = async () => {
        if (selectedScenarioId) {
            setIsRunning(true);
            setResults(null);
            try {
                const scenario = await runPhysicsSimulation(repoRef.current, selectedScenarioId);
                setResults(scenario);
            } catch (error) {
                console.error("Simulation failed:", error);
                // Optionally set an error state here to show in the UI
            } finally {
                setIsRunning(false);
            }
        }
    };
    
    const getStressOverlay = () => {
        if (!results) return null;
        
        const intensity = Math.min(100, results.results.stress / 5);
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
       
        return <div className={`absolute inset-0 ${gradientDirection[results.windDirection]} ${gradientStops[results.windDirection]} mix-blend-plus-lighter animate-fadeIn`}></div>;
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
                            <label htmlFor="scenario" className="block text-sm font-medium text-gray-400 mb-2">Select Scenario</label>
                            <select
                                id="scenario"
                                value={selectedScenarioId}
                                onChange={(e) => setSelectedScenarioId(e.target.value)}
                                className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500"
                                disabled={isRunning}
                            >
                                {analysis.scenarios.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.windSpeed} km/h Wind from {s.windDirection}
                                    </option>
                                ))}
                            </select>
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
                            <MetricCard label="Max Stress" value={String(results.results.stress)} unit="MPa" status={getStatus(results.results.stress, { warn: 200, crit: 400})} />
                            <MetricCard label="Deformation" value={String(results.results.deformation)} unit="cm" status={getStatus(results.results.deformation, { warn: 15, crit: 30})} />
                            <MetricCard label="Integrity" value={String(results.results.integrity)} unit="%" status={getIntegrityStatus(results.results.integrity)} />
                        </div>
                         <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                            <p><strong className="text-gray-200">AI Summary:</strong> Based on the simulation with a {results.windSpeed} km/h wind from the {results.windDirection}, the structural integrity is {results.results.integrity}%. {results.results.stress > 200 ? "Critical stress points are emerging." : "The structure remains stable."}</p>
                        </div>
                        <RecommendationsCard recommendations={results.recommendations} />
                        {results.benchmark && <BenchmarkResultsCard benchmark={results.benchmark} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhysicsModule;