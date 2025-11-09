import React from 'react';
import { BenchmarkResults } from '../../types';
import { StopwatchIcon } from '../icons/StopwatchIcon';
import { MetricCard } from './MetricCard';

interface BenchmarkResultsCardProps {
    benchmark: BenchmarkResults;
}

export const BenchmarkResultsCard: React.FC<BenchmarkResultsCardProps> = ({ benchmark }) => {
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 animate-fadeInUp">
            <h3 className="text-md font-semibold text-gray-200 mb-4 flex items-center">
                <StopwatchIcon className="h-5 w-5 mr-2 text-blue-300" />
                Benchmark Results
            </h3>
            <p className="text-xs text-gray-400 mb-4 font-mono bg-black/30 p-2 rounded-md">Config: {benchmark.config}</p>
            <div className="grid grid-cols-2 gap-3">
                <MetricCard label="Accuracy" value={benchmark.accuracy.toFixed(1)} unit="%" />
                <MetricCard label="Precision" value={benchmark.precision.toFixed(1)} unit="%" />
                <MetricCard label="Latency" value={String(benchmark.latency)} unit="ms" />
                <MetricCard label="Memory" value={String(benchmark.memory)} unit="MB" />
            </div>
        </div>
    );
};