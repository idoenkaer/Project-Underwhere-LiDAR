import React, { useEffect, useState } from 'react';

interface WalkthroughTipProps {
    targetRef: React.RefObject<HTMLElement>;
    onDismiss: () => void;
    title: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const WalkthroughTip: React.FC<WalkthroughTipProps> = ({
    targetRef,
    onDismiss,
    title,
    children,
    position = 'bottom',
}) => {
    const [style, setStyle] = useState({});

    useEffect(() => {
        if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            const tipStyle: React.CSSProperties = {
                position: 'fixed',
                zIndex: 100,
            };

            switch (position) {
                case 'top':
                    tipStyle.bottom = window.innerHeight - rect.top + 8;
                    tipStyle.left = rect.left + rect.width / 2;
                    tipStyle.transform = 'translateX(-50%)';
                    break;
                case 'left':
                    tipStyle.top = rect.top + rect.height / 2;
                    tipStyle.right = window.innerWidth - rect.left + 8;
                    tipStyle.transform = 'translateY(-50%)';
                    break;
                case 'right':
                    tipStyle.top = rect.top + rect.height / 2;
                    tipStyle.left = rect.right + 8;
                    tipStyle.transform = 'translateY(-50%)';
                    break;
                case 'bottom':
                default:
                    tipStyle.top = rect.bottom + 8;
                    tipStyle.left = rect.left + rect.width / 2;
                    tipStyle.transform = 'translateX(-50%)';
                    break;
            }
            setStyle(tipStyle);
        }
    }, [targetRef, position]);
    
    // Create a portal-like element to render the tip at the root level
    const tipElement = (
        <div style={style} className="max-w-xs w-full animate-fadeInUp">
            <div className="bg-green-bright text-bg-primary rounded-sm p-4 shadow-lg relative">
                 <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-green-bright"></div>
                <h3 className="font-bold font-mono text-lg mb-2">{title}</h3>
                <p className="text-sm mb-4">{children}</p>
                <button
                    onClick={onDismiss}
                    className="w-full py-2 bg-bg-secondary text-green-bright rounded-sm font-bold hover:bg-bg-primary"
                >
                    Got it
                </button>
            </div>
        </div>
    );
    
    return tipElement;
};

export default WalkthroughTip;