import React from 'react';
import Tooltip from './Tooltip';

interface MetricCardProps {
    label: string;
    value: string;
    unit?: string;
    tooltip?: string;
    status?: 'good' | 'warning' | 'critical';
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, tooltip, status }) => {
    const statusColor = {
        good: 'text-green-400',
        warning: 'text-yellow-400',
        critical: 'text-red-400',
    }[status || 'default'] || 'text-cyan-300';

    const Label = <div className="text-sm font-medium text-gray-400">{label}</div>;

    return (
        <div className="rounded-lg bg-gray-800/50 p-4 backdrop-blur-sm">
            {tooltip ? <Tooltip text={tooltip}>{Label}</Tooltip> : Label}
            <div className={`mt-1 text-2xl font-semibold ${statusColor}`}>
                {value} {unit && <span className="text-lg opacity-80">{unit}</span>}
            </div>
        </div>
    );
};
