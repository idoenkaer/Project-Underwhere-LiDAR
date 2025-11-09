import React from 'react';
import { useUIStateContext } from '../contexts/UIStateContext';
import { Card } from '../common/Card';
import { ControlToggle } from '../common/ControlToggle';
import { EyeIcon } from '../icons/EyeIcon';
import { PaintBrushIcon } from '../icons/PaintBrushIcon';

const SettingsModule: React.FC = () => {
    const { isHighContrast, setIsHighContrast, reduceMotion, setReduceMotion } = useUIStateContext();

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

            <Card icon={PaintBrushIcon} title="Theme Information">
                <p className="text-sm text-text-primary">
                    The default "Vintage Green Terminal" aesthetic is designed for high-focus work in low-light conditions. High Contrast mode provides an alternative for bright environments or for users who prefer standard color schemes.
                </p>
            </Card>
        </div>
    );
};

export default SettingsModule;