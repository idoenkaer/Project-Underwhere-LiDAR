// This module has been renamed to ScanCalibrateModule.tsx and is now deprecated.
// This file is maintained to prevent breaking stale references and will be removed in a future cleanup.
// Please use ScanCalibrateModule.tsx for all new development and imports.

import React from 'react';

const DeprecatedMeasurementModule: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full text-center">
            <div className="max-w-md p-8 bg-error/10 rounded-sm border border-error">
                <h2 className="text-2xl font-bold text-error font-mono">Module Deprecated</h2>
                <p className="mt-4 text-text-primary">
                    This module (`MeasurementModule.tsx`) has been renamed to `ScanCalibrateModule.tsx`. Please update your imports.
                </p>
            </div>
        </div>
    );
};

export default DeprecatedMeasurementModule;