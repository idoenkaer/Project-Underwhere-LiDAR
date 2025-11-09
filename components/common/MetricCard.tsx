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
        good: 'text-green-primary',
        warning: 'text-warning',
        critical: 'text-error',
    }[status || 'default'] || 'text-green-bright';

    const Label = <div className="text-sm font-medium text-green-muted font-mono uppercase text-xs">{label}</div>;

    return (
        <div className="rounded-sm bg-bg-primary/50 p-4">
            {tooltip ? <Tooltip text={tooltip}>{Label}</Tooltip> : Label}
            <div className={`mt-1 text-2xl font-semibold font-mono ${statusColor}`}>
                {value} {unit && <span className="text-lg text-green-muted">{unit}</span>}
            </div>
        </div>
    );
};