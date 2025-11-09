import React from 'react';
import { Recommendation, RecommendationPriority } from '../../types';
import { LightBulbIcon } from '../icons/LightBulbIcon';

interface RecommendationsCardProps {
    recommendations: Recommendation[];
}

const priorityConfig: Record<RecommendationPriority, {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
}> = {
    High: {
        label: 'High Priority',
        bgColor: 'bg-error/10',
        textColor: 'text-error',
        borderColor: 'border-error/50'
    },
    Medium: {
        label: 'Medium Priority',
        bgColor: 'bg-warning/10',
        textColor: 'text-warning',
        borderColor: 'border-warning/50'
    },
    Low: {
        label: 'Low Priority',
        bgColor: 'bg-data-blue/10',
        textColor: 'text-data-blue',
        borderColor: 'border-data-blue/50'
    },
};

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <div className="bg-bg-secondary p-4 rounded-sm border border-green-dark animate-fadeInUp">
            <h3 className="text-md font-semibold text-text-accent mb-4 flex items-center font-mono">
                <LightBulbIcon className="h-5 w-5 mr-2 text-warning" />
                Actionable Recommendations
            </h3>
            <div className="space-y-3">
                {recommendations.map((rec, index) => {
                    const config = priorityConfig[rec.priority];
                    return (
                        <div key={index} className={`p-3 rounded-sm border ${config.bgColor} ${config.borderColor}`}>
                            <div className={`text-xs font-bold mb-1 ${config.textColor} font-mono`}>{config.label}</div>
                            <p className="text-sm text-text-primary">{rec.text}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};