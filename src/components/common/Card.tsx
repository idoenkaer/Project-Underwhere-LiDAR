
import React from 'react';

interface CardProps {
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    title?: string;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ icon: Icon, title, children }) => {
    return (
        <div className="bg-bg-secondary p-6 rounded-sm border border-green-dark">
            {title && (
                <h3 className="text-lg font-semibold text-green-bright mb-4 flex items-center font-mono uppercase tracking-wider border-b border-green-dark pb-3">
                    {Icon && <Icon className="h-5 w-5 mr-3" />}
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};
