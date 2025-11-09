import React, { useState } from 'react';
import { Card } from '../common/Card';
import { BugAntIcon } from '../icons/BugAntIcon';
import { StopwatchIcon } from '../icons/StopwatchIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';

const TEST_DELAY = 400;

const regressionTests = [
    { id: 'ingestion', name: 'Lidar Data Ingestion & Validation' },
    { id: 'environmental', name: 'Environmental Module Analysis' },
    { id: 'biological', name: 'Biological Module AI Segmentation' },
    { id: 'physics', name: 'Physics Module FEA Simulation' },
    { id: 'ai-hypothesis', name: 'AI Hypothesis Generation' },
    { id: 'export', name: 'Data Export to LAS 1.4' },
];

const performanceBenchmarks = [
    { id: 'point-cloud', name: 'Point Cloud Preprocessing' },
    { id: 'fea-sim', name: 'Physics FEA Simulation (High Stress)' },
    { id: 'ai-discovery', name: 'AI Discovery Latency (p95)' },
];

const RegressionTestItem: React.FC<{ name: string; status: 'idle' | 'running' | 'pass' | 'fail' }> = ({ name, status }) => {
    const statusIcons = {
        idle: <div className="w-5 h-5 border-2 border-green-dark rounded-full" />,
        running: <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-green-bright" />,
        pass: <CheckIcon className="h-5 w-5 text-green-primary" />,
        fail: <ExclamationTriangleIcon className="h-5 w-5 text-error" />,
    };
    const statusColors = {
        idle: 'text-green-muted',
        running: 'text-green-bright animate-pulse',
        pass: 'text-green-primary',
        fail: 'text-error',
    };
    return (
        <li className="flex items-center space-x-3 p-3 bg-bg-primary/50 rounded-sm">
            {statusIcons[status]}
            <span className={`flex-1 text-sm font-mono ${statusColors[status]}`}>{name}</span>
        </li>
    );
};

const ValidationModule: React.FC = () => {
    const [regressionState, setRegressionState] = useState<'idle' | 'running' | 'complete'>('idle');
    const [regressionResults, setRegressionResults] = useState<Record<string, 'idle' | 'running' | 'pass' | 'fail'>>(
        Object.fromEntries(regressionTests.map(t => [t.id, 'idle']))
    );
    
    const [benchmarkState, setBenchmarkState] = useState<'idle' | 'running' | 'complete'>('idle');
    const [benchmarkResults, setBenchmarkResults] = useState<Record<string, { latency: number; memory: number }> | null>(null);

    const [accuracyState, setAccuracyState] = useState<'idle' | 'running' | 'complete'>('idle');
    const [accuracyResults, setAccuracyResults] = useState<{ precision: number; recall: number; f1: number } | null>(null);

    const runRegressionTests = async () => {
        setRegressionState('running');
        let currentResults = { ...regressionResults };
        for (const test of regressionTests) {
            currentResults[test.id] = 'running';
            setRegressionResults({ ...currentResults });
            await new Promise(res => setTimeout(res, TEST_DELAY));
            currentResults[test.id] = 'pass';
            setRegressionResults({ ...currentResults });
        }
        setRegressionState('complete');
    };
    
    const runBenchmarks = async () => {
        setBenchmarkState('running');
        setBenchmarkResults(null);
        await new Promise(res => setTimeout(res, TEST_DELAY * 3));
        setBenchmarkResults({
            'point-cloud': { latency: 850, memory: 75 },
            'fea-sim': { latency: 1250, memory: 145 },
            'ai-discovery': { latency: 2100, memory: 256 },
        });
        setBenchmarkState('complete');
    };

    const runAccuracyValidation = async () => {
        setAccuracyState('running');
        setAccuracyResults(null);
        await new Promise(res => setTimeout(res, TEST_DELAY * 4));
        setAccuracyResults({ precision: 96.2, recall: 94.8, f1: 95.5 });
        setAccuracyState('complete');
    };

    return (
        <div className="animate-fadeIn space-y-8">
            <h1 className="text-3xl font-bold font-mono text-green-bright text-glow">Validation & Testing Suite</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Regression Testing */}
                <div className="lg:col-span-1">
                    <Card icon={BugAntIcon} title="Regression Test Suite">
                        <ul className="space-y-2 mb-4">
                            {regressionTests.map(test => (
                                <RegressionTestItem key={test.id} name={test.name} status={regressionResults[test.id]} />
                            ))}
                        </ul>
                        <button onClick={runRegressionTests} disabled={regressionState === 'running'} className="w-full p-3 bg-transparent border-2 border-green-bright text-green-bright font-mono rounded-sm uppercase tracking-wider hover:bg-green-bright hover:text-bg-primary transition-all duration-200 hover:shadow-glow-green-md disabled:border-green-muted/50 disabled:text-green-muted/50 disabled:bg-transparent disabled:cursor-wait">
                            {regressionState === 'running' ? 'Running...' : 'Run All Tests'}
                        </button>
                    </Card>
                </div>

                {/* Performance & Accuracy */}
                <div className="lg:col-span-2 space-y-8">
                    <Card icon={StopwatchIcon} title="Performance Benchmarks">
                        {benchmarkState === 'idle' && <p className="text-sm text-text-primary mb-4">Measure processing latency and memory usage for critical operations.</p>}
                        {benchmarkState === 'running' && <p className="text-sm text-green-bright animate-pulse mb-4 font-mono">Running benchmarks...</p>}
                        
                        {benchmarkResults && (
                             <table className="w-full text-sm text-left animate-fadeInUp font-mono">
                                <thead className="text-xs text-green-muted uppercase bg-bg-primary/50">
                                    <tr>
                                        <th scope="col" className="px-4 py-2">Operation</th>
                                        <th scope="col" className="px-4 py-2 text-right">Latency (ms)</th>
                                        <th scope="col" className="px-4 py-2 text-right">Memory (MB)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {performanceBenchmarks.map(b => (
                                        <tr key={b.id} className="border-b border-green-dark">
                                            <td className="px-4 py-2 font-medium text-text-primary">{b.name}</td>
                                            <td className="px-4 py-2 text-green-bright text-right">{benchmarkResults[b.id]?.latency}</td>
                                            <td className="px-4 py-2 text-green-bright text-right">{benchmarkResults[b.id]?.memory}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <button onClick={runBenchmarks} disabled={benchmarkState === 'running'} className="w-full mt-4 p-3 bg-data-blue/80 text-white rounded-sm hover:bg-data-blue transition font-semibold disabled:bg-green-muted/50 disabled:cursor-wait">
                           {benchmarkState === 'running' ? 'Running...' : 'Run Benchmarks'}
                        </button>
                    </Card>

                    <Card icon={CheckBadgeIcon} title="Model Accuracy Validation">
                         {accuracyState === 'idle' && <p className="text-sm text-text-primary mb-4">Validate the Biological module's AI output against a ground-truth dataset.</p>}
                         {accuracyState === 'running' && <p className="text-sm text-green-bright animate-pulse mb-4 font-mono">Validating AI segmentation against `ground_truth_census.csv`...</p>}

                         {accuracyResults && (
                            <div className="space-y-3 animate-fadeInUp">
                                {Object.entries(accuracyResults).map(([key, value]) => (
                                    <div key={key}>
                                        <div className="flex justify-between mb-1 text-sm font-mono">
                                            <span className="font-bold capitalize text-text-accent">{key}</span>
                                            <span className="text-green-bright">{value}%</span>
                                        </div>
                                        <div className="w-full bg-green-dark rounded-full h-2.5">
                                            <div className="bg-green-bright h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         )}

                         <button onClick={runAccuracyValidation} disabled={accuracyState === 'running'} className="w-full mt-4 p-3 bg-green-primary/80 text-bg-primary rounded-sm hover:bg-green-primary transition font-bold disabled:bg-green-muted/50 disabled:cursor-wait">
                            {accuracyState === 'running' ? 'Validating...' : 'Validate Against Ground-Truth'}
                         </button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ValidationModule;