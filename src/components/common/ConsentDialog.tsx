
import React from 'react';

interface ConsentDialogProps {
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
    children: React.ReactNode;
}

const ConsentDialog: React.FC<ConsentDialogProps> = ({ title, onConfirm, onCancel, children }) => {
    return (
        <div className="modal-overlay animate-fadeIn flex items-center justify-center p-4">
            <div className="bg-bg-secondary border border-green-dark rounded-sm shadow-2xl max-w-lg w-full p-8 animate-fadeInUp">
                <h2 className="text-2xl font-bold text-text-accent mb-4 font-mono">{title}</h2>
                <div className="text-sm text-text-primary mb-8 space-y-4 max-h-60 overflow-y-auto pr-2">
                    {children}
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-bg-primary text-text-primary rounded-sm hover:bg-bg-primary/50 transition font-semibold"
                    >
                        Disagree
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-semibold"
                    >
                        Agree & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsentDialog;
