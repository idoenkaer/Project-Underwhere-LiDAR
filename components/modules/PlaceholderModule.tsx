import React from 'react';
import { Card } from '../common/Card';

interface PlaceholderModuleProps {
    title: string;
    description: string;
    comingSoon?: boolean;
}

const PlaceholderModule: React.FC<PlaceholderModuleProps> = ({ title, description, comingSoon }) => {
    return (
        <div className="flex items-center justify-center h-full animate-fadeIn text-center">
            <Card>
                <h2 className="text-2xl font-bold text-green-bright font-mono">{title}</h2>
                <p className="mt-4 text-text-primary max-w-md mx-auto">{description}</p>
                {comingSoon && (
                     <div className="mt-6 inline-block bg-warning/20 text-warning font-semibold py-1 px-3 rounded-full text-sm font-mono">
                        FUTURE CONCEPT
                    </div>
                )}
            </Card>
        </div>
    );
};

export default React.memo(PlaceholderModule);