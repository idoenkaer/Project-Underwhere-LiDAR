import React from 'react';
import { useUIStateContext } from '../contexts/UIStateContext';
import { Card } from '../common/Card';
import { ControlToggle } from '../common/ControlToggle';
import { EyeIcon } from '../icons/EyeIcon';
import { PaintBrushIcon } from '../icons/PaintBrushIcon';
import { FontSize } from '../../types';
import { AdjustmentsHorizontalIcon } from '../icons/AdjustmentsHorizontalIcon';
import { AdjustmentsVerticalIcon } from '../icons/AdjustmentsVerticalIcon';

const SettingsModule: React.FC = () => {
    const { 
        isHighContrast, setIsHighContrast, 
        reduceMotion, setReduceMotion, 
        fontSize, setFontSize,
        showAdvancedModules, setShowAdvancedModules
    } = useUIStateContext();

    const fontSizes: { label: string; size: FontSize }[] = [
        { label: 'Small', size: 'sm' },
        { label: 'Default', size: 'base' },
        { label: 'Large', size: 'lg' },
    ];

    return (
        <div className="animate-fadeIn space-y-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold font-mono text-green-bright text-glow">Settings</h1>
            
            <Card icon={EyeIcon} title="Accessibility">
                <p className="text-sm text-text-primary mb-6">
                    Adjust visual settings to improve clarity and reduce distractions. Your preferences are saved locally in your browser.
                </p>
                <div className="space-y-4">
                    <ControlToggle
                        label="High Contrast Mode"
                        checked={isHighContrast}
                        onChange={() => setIsHighContrast(!isHighContrast)}
                    />
                    <ControlToggle
                        label="Reduce Motion & Effects"
                        checked={reduceMotion}
                        onChange={() => setReduceMotion(!reduceMotion)}
                    />
                </div>
            </Card>

            <Card icon={AdjustmentsVerticalIcon} title="Interface">
                <p className="text-sm text-text-primary mb-6">
                    Customize the user interface complexity to match your workflow.
                </p>
                <div className="space-y-4">
                    <ControlToggle
                        label="Show Advanced Analysis Modules"
                        checked={showAdvancedModules}
                        onChange={() => setShowAdvancedModules(!showAdvancedModules)}
                    />
                </div>
            </Card>

            <Card icon={AdjustmentsHorizontalIcon} title="Typography">
                <p className="text-sm text-text-primary mb-6">
                    Adjust the global font size for better readability across the application.
                </p>
                <div className="flex items-center justify-center space-x-2 bg-bg-primary p-2 rounded-sm">
                    {fontSizes.map(({ label, size }) => (
                        <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            className={`flex-1 p-3 rounded-sm text-sm font-bold uppercase transition ${
                                fontSize === size ? 'bg-green-bright text-bg-primary' : 'hover:bg-green-dark'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </Card>

            <Card icon={PaintBrushIcon} title="Theme Information">
                <p className="text-sm text-text-primary">
                    The default "Vintage Green Terminal" aesthetic is designed for high-focus work in low-light conditions. High Contrast mode provides an alternative for bright environments or for users who prefer standard color schemes.
                </p>
            </Card>
        </div>
    );
};

export default SettingsModule;