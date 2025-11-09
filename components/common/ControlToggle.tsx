import React from 'react';

export const ControlToggle: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm text-text-primary">{label}</label>
        <button onClick={onChange} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? 'bg-green-bright' : 'bg-bg-primary'}`}>
            <span className={`inline-block h-5 w-5 transform rounded-full bg-bg-secondary shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);