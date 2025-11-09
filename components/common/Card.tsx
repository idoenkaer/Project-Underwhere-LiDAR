import React from 'react';

interface CardProps {
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    title?: string;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ icon: Icon, title, children }) => {
    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            {title && (
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    {Icon && <Icon className="h-6 w-6 mr-3 text-cyan-400" />}
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};
