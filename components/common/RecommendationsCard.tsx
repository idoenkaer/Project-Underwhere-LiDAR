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
        bgColor: 'bg-red-900/50',
        textColor: 'text-red-300',
        borderColor: 'border-red-500/50'
    },
    Medium: {
        label: 'Medium Priority',
        bgColor: 'bg-yellow-800/50',
        textColor: 'text-yellow-300',
        borderColor: 'border-yellow-500/50'
    },
    Low: {
        label: 'Low Priority',
        bgColor: 'bg-blue-900/50',
        textColor: 'text-blue-300',
        borderColor: 'border-blue-500/50'
    },
};

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 animate-fadeInUp">
            <h3 className="text-md font-semibold text-gray-200 mb-4 flex items-center">
                <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-300" />
                Actionable Recommendations
            </h3>
            <div className="space-y-3">
                {recommendations.map((rec, index) => {
                    const config = priorityConfig[rec.priority];
                    return (
                        <div key={index} className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
                            <div className={`text-xs font-bold mb-1 ${config.textColor}`}>{config.label}</div>
                            <p className="text-sm text-gray-300">{rec.text}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};