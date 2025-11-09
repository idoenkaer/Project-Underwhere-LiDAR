import React from 'react';

interface PlaceholderModuleProps {
    title: string;
    description: string;
    comingSoon?: boolean;
}

const PlaceholderModule: React.FC<PlaceholderModuleProps> = ({ title, description, comingSoon }) => {
    return (
        <div className="flex items-center justify-center h-full animate-fadeIn text-center">
            <div className="max-w-md p-8 bg-gray-800/50 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-cyan-300">{title}</h2>
                <p className="mt-4 text-gray-400">{description}</p>
                {comingSoon && (
                     <div className="mt-6 inline-block bg-yellow-500/20 text-yellow-300 font-semibold py-1 px-3 rounded-full text-sm">
                        Future Concept
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(PlaceholderModule);