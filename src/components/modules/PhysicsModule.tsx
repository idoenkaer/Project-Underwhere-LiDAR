import React, { useState, useEffect, useRef } from 'react';
import { MetricCard } from '../common/MetricCard';
import { PhysicsScenario } from '../../types';
import { RecommendationsCard } from '../common/RecommendationsCard';
import { useDataContext } from '../contexts/DataContext';
import { BenchmarkResultsCard } from '../common/BenchmarkResultsCard';
import { runPhysicsSimulation } from '../../application/use-cases/runPhysicsSimulation';
import { MockDataRepository } from '../../infrastructure/data/MockDataRepository';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { useUIStateContext } from '../contexts/UIStateContext';
import { Card } from '../common/Card';
import { ArrowsRightLeftIcon } from '../icons/ArrowsRightLeftIcon';

const PhysicsModule: React.FC = () => {
    const { database } = useDataContext();
    const { addAlert, addLog, logAnalysisRun } = useUIStateContext();
    const analysis = database.physics;

    const [selectedScenarioId, setSelectedScenarioId] = useState<string>(analysis.scenarios[0].id);
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<PhysicsScenario | null>(null);
    const [error, setError] = useState<string | null>(null);
    const repoRef = useRef(new MockDataRepository());

    const [compareMode, setCompareMode] = useState(false);
    const [compareScenarioIds, setCompareScenarioIds] = useState<[string, string]>([analysis.scenarios[0].id, analysis.scenarios[1].id]);
    const [compareResults, setCompareResults] = useState<[PhysicsScenario, PhysicsScenario] | null>(null);

    useEffect(() => {
        setResults(null);
        setError(null);
        addLog(`Physics: Switched to scenario '${selectedScenarioId}'.`);
    }, [selectedScenarioId, addLog]);

    const runSimulation = async () => {
        if (selectedScenarioId) {
            setIsRunning(true);
            setResults(null);
            setError(null);
            addLog(`Physics: Simulation started for scenario '${selectedScenarioId}'.`);
            
            const scenario = analysis.scenarios.find(s => s.id === selectedScenarioId);
            if (scenario) {
                 logAnalysisRun('Physics', { 
                    scenario: { 
                        id: selectedScenarioId, 
                        windSpeed: scenario.windSpeed, 
                        windDirection: scenario.windDirection 
                    } 
                });
            }

            try {
                const scenarioResult = await runPhysicsSimulation(repoRef.current, selectedScenarioId);
                setResults(scenarioResult);
                addLog(`Physics: Simulation for scenario '${selectedScenarioId}' completed successfully.`);
            } catch (error) {
                const err = error as Error;
                console.error("Simulation failed:", err);
                const errorMessage = `Simulation failed: ${err.message}`;
                setError(errorMessage);
                addAlert(errorMessage, 'error');
                addLog(`Physics: Simulation for scenario '${selectedScenarioId}' failed. Error: ${err.message}`);
            } finally {
                setIsRunning(false);
            }
        }
    };
    
    const getStressOverlay = () => {
        if (!results || compareMode) return null;
        
        const intensity = Math.min(100, results.results.stress / 5);
        const gradientStops = {
            N: `from-green-primary/10 via-warning/${intensity}0 to-error/${intensity+20}0`,
            E: `from-error/${intensity+20}0 via-warning/${intensity}0 to-green-primary/10`,
            S: `from-error/${intensity+20}0 via-warning/${intensity}0 to-green-primary/10`,
            W: `from-green-primary/10 via-warning/${intensity}0 to-error/${intensity+20}0`,
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
                <h2 className="text-lg font-mono font-semibold text-text-primary mb-4">Structural Analysis Simulation</h2>
                <div className="relative aspect-video w-full rounded-sm bg-black border border-green-dark overflow-hidden">
                    <img src="https://picsum.photos/seed/bridge/1280/720" alt="Scanned Structure" className="object-cover w-full h-full opacity-60" />
                    {isRunning && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                           <div className="text-center">
                             <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-data-blue mx-auto"></div>
                             <p className="text-data-blue text-lg mt-4 font-mono">Running Finite Element Analysis...</p>
                           </div>
                        </div>
                    )}
                    {getStressOverlay()}
                    {results && !compareMode && (
                         <div className="absolute bottom-4 left-4 bg-black/60 p-3 rounded-sm text-sm backdrop-blur-sm">
                            <h3 className="font-bold text-text-accent mb-2">Stress Legend</h3>
                            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-error"></div><span>Critical</span></div>
                            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-warning"></div><span>Moderate</span></div>
                            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-green-primary"></div><span>Normal</span></div>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-6">
                <Card title="Simulation Parameters">
                     <div className="flex items-center justify-between mb-4">
                        <label htmlFor="compareMode" className="text-sm font-medium text-green-muted flex items-center space-x-2">
                            <ArrowsRightLeftIcon className="h-5 w-5" />
                            <span>Compare Scenarios</span>
                        </label>
                        <button onClick={() => setCompareMode(p => !p)} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${compareMode ? 'bg-green-bright' : 'bg-bg-primary'}`}>
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-bg-secondary shadow ring-0 transition duration-200 ease-in-out ${compareMode ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {compareMode ? (
                        <div className="space-y-4">
                             {/* Comparison parameter selection can be added here */}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="scenario" className="block text-sm font-medium text-green-muted mb-2">Select Scenario</label>
                                <select
                                    id="scenario"
                                    value={selectedScenarioId}
                                    onChange={(e) => setSelectedScenarioId(e.target.value)}
                                    className="w-full bg-bg-primary border border-green-dark rounded-sm px-3 py-2 focus:ring-data-blue focus:border-data-blue font-mono"
                                    disabled={isRunning}
                                >
                                    {analysis.scenarios.map(s => (
                                        <option key={s.id} value={s.id} className="font-mono">
                                            {s.windSpeed} km/h Wind from {s.windDirection}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                     <button onClick={runSimulation} disabled={isRunning} className="mt-4 w-full p-4 bg-data-blue/80 hover:bg-data-blue text-white font-bold rounded-sm disabled:opacity-50 disabled:bg-green-dark disabled:cursor-wait transition">
                        {isRunning ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </Card>
                {error && (
                    <div className="mt-4 bg-error/10 border border-error text-error p-4 rounded-sm flex items-center space-x-3 animate-fadeIn">
                        <ExclamationTriangleIcon className="h-6 w-6 flex-shrink-0 text-error" />
                        <p>{error}</p>
                    </div>
                )}
                {results && !compareMode && (
                    <div className="space-y-4 animate-fadeIn">
                        <h3 className="text-lg font-mono font-semibold text-text-primary">Analysis Results</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <MetricCard label="Max Stress" value={String(results.results.stress)} unit="MPa" status={getStatus(results.results.stress, { warn: 200, crit: 400})} />
                            <MetricCard label="Deformation" value={String(results.results.deformation)} unit="cm" status={getStatus(results.results.deformation, { warn: 15, crit: 30})} />
                            <MetricCard label="Integrity" value={String(results.results.integrity)} unit="%" status={getIntegrityStatus(results.results.integrity)} />
                        </div>
                         <div className="text-xs text-text-primary bg-bg-secondary p-3 rounded-sm">
                            <p><strong className="text-text-accent">AI Summary:</strong> Based on the simulation with a {results.windSpeed} km/h wind from the {results.windDirection}, the structural integrity is {results.results.integrity}%. {results.results.stress > 200 ? "Critical stress points are emerging." : "The structure remains stable."}</p>
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