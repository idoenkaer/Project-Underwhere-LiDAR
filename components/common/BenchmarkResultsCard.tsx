import React from 'react';
import { BenchmarkResults } from '../../types';
import { StopwatchIcon } from '../icons/StopwatchIcon';
import { MetricCard } from './MetricCard';
import { Card } from './Card';

interface BenchmarkResultsCardProps {
    benchmark: BenchmarkResults;
}

export const BenchmarkResultsCard: React.FC<BenchmarkResultsCardProps> = ({ benchmark }) => {
    return (
        <Card>
            <h3 className="text-md font-semibold text-text-accent mb-4 flex items-center font-mono">
                <StopwatchIcon className="h-5 w-5 mr-2 text-data-blue" />
                Benchmark Results
            </h3>
            <p className="text-xs text-green-muted mb-4 font-mono bg-bg-primary/50 p-2 rounded-sm">Config: {benchmark.config}</p>
            <div className="grid grid-cols-2 gap-3">
                <MetricCard label="Accuracy" value={benchmark.accuracy.toFixed(1)} unit="%" />
                <MetricCard label="Precision" value={benchmark.precision.toFixed(1)} unit="%" />
                <MetricCard label="Latency" value={String(benchmark.latency)} unit="ms" />
                <MetricCard label="Memory" value={String(benchmark.memory)} unit="MB" />
            </div>
        </Card>
    );
};