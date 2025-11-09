import React, { useState } from 'react';
import { Card } from '../common/Card';
import { BugAntIcon } from '../icons/BugAntIcon';
import { StopwatchIcon } from '../icons/StopwatchIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Dot } from 'recharts';
import { useUIStateContext } from '../contexts/UIStateContext';

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

interface AccuracyBenchmark {
    version: string;
    date: string;
    precision: number;
    recall: number;
    f1: number;
    matrix: { tp: number, fp: number, fn: number, tn: number };
}

const benchmarkHistory: AccuracyBenchmark[] = [
    { version: 'v2.0.1', date: '2024-06-01', precision: 94.5, recall: 92.1, f1: 93.3, matrix: { tp: 1220, fp: 70, fn: 104, tn: 8368 } },
    { version: 'v2.1.0', date: '2024-06-15', precision: 95.8, recall: 93.5, f1: 94.6, matrix: { tp: 1242, fp: 54, fn: 82, tn: 8384 } },
    { version: 'v2.1.3', date: '2024-07-01', precision: 96.2, recall: 94.8, f1: 95.5, matrix: { tp: 1256, fp: 48, fn: 68, tn: 8390 } },
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

const ConfusionMatrix: React.FC<{ data: { tp: number, fp: number, fn: number, tn: number } }> = ({ data }) => (
    <div className="grid grid-cols-2 gap-px bg-green-dark border border-green-dark">
        <div className="bg-bg-secondary p-3">
            <p className="text-xs text-green-muted">True Positive</p>
            <p className="text-xl font-mono text-green-primary">{data.tp}</p>
        </div>
        <div className="bg-bg-secondary p-3">
            <p className="text-xs text-green-muted">False Positive</p>
            <p className="text-xl font-mono text-warning">{data.fp}</p>
        </div>
        <div className="bg-bg-secondary p-3">
            <p className="text-xs text-green-muted">False Negative</p>
            <p className="text-xl font-mono text-warning">{data.fn}</p>
        </div>
        <div className="bg-bg-secondary p-3">
            <p className="text-xs text-green-muted">True Negative</p>
            <p className="text-xl font-mono text-green-primary">{data.tn}</p>
        </div>
    </div>
);


const ValidationModule: React.FC = () => {
    const { activeModulePayload } = useUIStateContext();
    const highlightedVersion = activeModulePayload?.modelVersion;

    const [regressionState, setRegressionState] = useState<'idle' | 'running' | 'complete'>('idle');
    const [regressionResults, setRegressionResults] = useState<Record<string, 'idle' | 'running' | 'pass' | 'fail'>>(
        Object.fromEntries(regressionTests.map(t => [t.id, 'idle']))
    );
    
    const [benchmarkState, setBenchmarkState] = useState<'idle' | 'running' | 'complete'>('idle');
    const [benchmarkResults, setBenchmarkResults] = useState<Record<string, { latency: number; memory: number }> | null>(null);

    const [accuracyState, setAccuracyState] = useState<'idle' | 'running' | 'complete'>('idle');
    const [accuracyResults, setAccuracyResults] = useState<AccuracyBenchmark[] | null>(benchmarkHistory);

    const runRegressionTests = async () => {
        setRegressionState('running');
        let currentResults = { ...regressionResults };
        for (const test of regressionTests) {
            currentResults[test.id] = 'running';
            setRegressionResults({ ...currentResults });
            await new Promise(res => setTimeout(res, TEST_DELAY));
            // Simulate a random failure for demonstration
            currentResults[test.id] = Math.random() > 0.1 ? 'pass' : 'fail';
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
        await new Promise(res => setTimeout(res, TEST_DELAY * 4));

        const newBenchmarkRun: AccuracyBenchmark = {
            version: 'v2.2.0',
            date: new Date().toISOString().split('T')[0],
            precision: 96.8,
            recall: 95.2,
            f1: 96.0,
            matrix: { tp: 1261, fp: 42, fn: 63, tn: 8396 }
        };

        setAccuracyResults(prev => prev ? [...prev, newBenchmarkRun] : [newBenchmarkRun]);
        setAccuracyState('complete');
    };
    
    const latestAccuracyResult = accuracyResults ? accuracyResults[accuracyResults.length - 1] : null;

    const CustomDot: React.FC<any> = (props) => {
        const { cx, cy, stroke, payload } = props;
        if (payload.version === highlightedVersion) {
            return (
                <g>
                    <Dot {...props} r={8} fill={stroke} stroke="var(--color-green-bright)" strokeWidth={2} />
                    <Dot {...props} r={12} fill="transparent" stroke="var(--color-green-bright)" strokeWidth={2} className="animate-ping" />
                </g>
            );
        }
        return <Dot {...props} />;
    };

    return (
        <div className="animate-fadeIn space-y-8">
            <h1 className="text-3xl font-bold font-mono text-green-bright text-glow">Validation & Testing Suite</h1>
            {highlightedVersion && (
                <div className="p-4 bg-data-blue/20 border-l-4 border-data-blue text-data-blue rounded-r-sm animate-fadeIn">
                    <p className="font-bold">Showing benchmark for model version: <span className="font-mono">{highlightedVersion}</span></p>
                    <p className="text-sm">This benchmark was requested from the AI Discovery module.</p>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Internal QA */}
                <div className="lg:col-span-1 space-y-8">
                    <Card icon={BugAntIcon} title="Internal QA Suite">
                        <ul className="space-y-2 mb-4">
                            {regressionTests.map(test => (
                                <RegressionTestItem key={test.id} name={test.name} status={regressionResults[test.id]} />
                            ))}
                        </ul>
                        <button onClick={runRegressionTests} disabled={regressionState === 'running'} className="w-full p-3 bg-transparent border-2 border-green-bright text-green-bright font-mono rounded-sm uppercase tracking-wider hover:bg-green-bright hover:text-bg-primary transition-all duration-200 hover:shadow-glow-green-md disabled:border-green-muted/50 disabled:text-green-muted/50 disabled:bg-transparent disabled:cursor-wait">
                            {regressionState === 'running' ? 'Running Tests...' : 'Run Regression Suite'}
                        </button>
                    </Card>
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
                </div>

                {/* Scientific Validation */}
                <div className="lg:col-span-2 space-y-8">
                    <Card icon={CheckBadgeIcon} title="Algorithm Benchmark Dashboard">
                         {accuracyState === 'idle' && <p className="text-sm text-text-primary mb-4">Run routine validation of the AI segmentation algorithm against an expert-reviewed ground-truth dataset (`ground_truth_census.csv`) to track performance over time.</p>}
                         {accuracyState === 'running' && <p className="text-sm text-green-bright animate-pulse mb-4 font-mono">Validating AI segmentation against ground-truth...</p>}

                         {latestAccuracyResult && accuracyResults && (
                            <div className="space-y-6 animate-fadeInUp">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-green-muted mb-2 font-mono">CONFUSION MATRIX (LATEST: {latestAccuracyResult.version})</h4>
                                        <ConfusionMatrix data={latestAccuracyResult.matrix} />
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-green-muted mb-2 font-mono">CLASSIFICATION METRICS (LATEST: {latestAccuracyResult.version})</h4>
                                        {Object.entries({ precision: latestAccuracyResult.precision, recall: latestAccuracyResult.recall, f1: latestAccuracyResult.f1 }).map(([key, value]) => (
                                            <div key={key}>
                                                <div className="flex justify-between mb-1 text-sm font-mono">
                                                    <span className="font-bold capitalize text-text-accent">{key} Score</span>
                                                    <span className="text-green-bright">{value}%</span>
                                                </div>
                                                <div className="w-full bg-green-dark rounded-full h-2.5">
                                                    <div className="bg-green-bright h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-green-muted mb-4 font-mono">BENCHMARK HISTORY</h4>
                                    <div className="w-full h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={accuracyResults} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                                <CartesianGrid stroke="var(--color-green-dark)" strokeDasharray="3 3" />
                                                <XAxis dataKey="version" stroke="var(--color-green-muted)" tick={{ fontSize: 10 }} />
                                                <YAxis stroke="var(--color-green-muted)" tick={{ fontSize: 10 }} domain={[90, 100]} unit="%" />
                                                <RechartsTooltip
                                                    contentStyle={{ 
                                                        backgroundColor: 'var(--color-bg-primary)', 
                                                        border: '1px solid var(--color-green-dark)',
                                                        color: 'var(--color-text-primary)'
                                                    }}
                                                    itemStyle={{ fontWeight: 'bold' }}
                                                    labelStyle={{ color: 'var(--color-green-muted)', fontWeight: 'bold' }}
                                                />
                                                <Legend wrapperStyle={{fontSize: "12px"}}/>
                                                <Line type="monotone" dataKey="precision" stroke="var(--color-green-bright)" strokeWidth={2} dot={<CustomDot />}/>
                                                <Line type="monotone" dataKey="recall" stroke="var(--color-data-blue)" strokeWidth={2} dot={<CustomDot />} />
                                                <Line type="monotone" dataKey="f1" stroke="var(--color-warning)" strokeWidth={2} dot={<CustomDot />} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                         )}

                         <button onClick={runAccuracyValidation} disabled={accuracyState === 'running'} className="w-full mt-4 p-3 bg-green-primary/80 text-bg-primary rounded-sm hover:bg-green-primary transition font-bold disabled:bg-green-muted/50 disabled:cursor-wait">
                            {accuracyState === 'running' ? 'Validating...' : 'Run Latest Benchmark'}
                         </button>
                    </Card>
                    
                     <Card icon={AcademicCapIcon} title="Peer Review & Benchmarking">
                        <p className="text-sm text-text-primary mb-4">
                            We are committed to scientific transparency. We invite academic and industry experts to independently audit our results and contribute to our open benchmarking standards.
                        </p>
                         <div className="flex flex-col md:flex-row gap-4">
                            <a href="#" className="flex-1 p-3 bg-bg-primary text-green-bright font-mono rounded-sm border-2 border-green-dark hover:border-green-bright transition text-center flex items-center justify-center space-x-2">
                                <DocumentTextIcon className="h-5 w-5" />
                                <span>View Published Reports</span>
                            </a>
                            <a href="#" className="flex-1 p-3 bg-bg-primary text-green-bright font-mono rounded-sm border-2 border-green-dark hover:border-green-bright transition text-center flex items-center justify-center space-x-2">
                                <AcademicCapIcon className="h-5 w-5" />
                                <span>Join Academic Review Program</span>
                            </a>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ValidationModule;