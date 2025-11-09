
import React from 'react';
import Tooltip from './Tooltip';

interface MetricCardProps {
    label: string;
    value: string;
    unit?: string;
    tooltip?: string;
    status?: 'good' | 'warning' | 'critical';
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, tooltip, status, icon: Icon }) => {
    const statusColor = {
        good: 'text-green-primary',
        warning: 'text-warning',
        critical: 'text-error',
    }[status || 'default'] || 'text-green-bright';

    const LabelContent = (
      <div className="flex items-center space-x-2 text-sm font-medium text-green-muted font-mono uppercase text-xs">
          {Icon && <Icon className={`h-4 w-4 ${status ? statusColor : 'text-green-muted'}`} />}
          <span>{label}</span>
      </div>
    );

    const Label = tooltip ? <Tooltip text={tooltip}>{LabelContent}</Tooltip> : LabelContent;

    return (
        <div className="rounded-sm bg-bg-primary/50 p-4">
            {Label}
            <div className={`mt-1 text-2xl font-semibold font-mono ${statusColor}`}>
                {value} {unit && <span className="text-lg text-green-muted">{unit}</span>}
            </div>
        </div>
    );
};
