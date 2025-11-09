import React, { useState } from 'react';
import { DownloadIcon } from '../icons/DownloadIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { CubeIcon } from '../icons/CubeIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { Card } from './Card';

type ExportStatus = 'idle' | 'exporting' | 'success';

const EXPORT_FORMATS = [
    { format: 'CSV', description: 'Annotated Measurements', icon: DocumentTextIcon },
    { format: 'LAS', description: 'Point Cloud Data', icon: CubeIcon },
    { format: 'GeoTIFF', description: 'Geospatial Raster', icon: GlobeIcon },
    { format: 'OBJ', description: '3D Model', icon: CubeIcon },
];

const SingleExportButton: React.FC<{
    format: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    status: ExportStatus;
    onExport: () => void;
}> = ({ format, description, icon: Icon, status, onExport }) => {
    
    const content = {
        idle: <><div className="flex-1 text-left">
                    <p className="font-bold text-gray-200">{format}</p>
                    <p className="text-xs text-gray-400">{description}</p>
                </div>
                <DownloadIcon className="h-6 w-6 text-cyan-400" /></>,
        exporting: <><div className="flex-1 text-left text-yellow-400">Exporting...</div>
                    <svg className="animate-spin h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg></>,
        success: <><div className="flex-1 text-left text-green-400">Success!</div><CheckIcon className="h-6 w-6 text-green-400" /></>
    };

    return (
        <button onClick={onExport} disabled={status !== 'idle'} className="flex items-center justify-between w-full p-3 text-left bg-gray-700/50 hover:bg-gray-700 rounded-lg transition disabled:cursor-not-allowed">
            <Icon className="h-6 w-6 mr-4 text-gray-300" />
            {content[status]}
        </button>
    )
};

export const ExportButton: React.FC<{ onExportRequest: (format: string) => void, statuses: Record<string, ExportStatus> }> = ({ onExportRequest, statuses }) => {
    return (
        <Card icon={DownloadIcon} title="Data Export">
            <div className="space-y-3">
                {EXPORT_FORMATS.map(f => (
                   <SingleExportButton
                        key={f.format}
                        {...f}
                        status={statuses[f.format] || 'idle'}
                        onExport={() => onExportRequest(f.format)}
                    />
                ))}
            </div>
        </Card>
    );
};
