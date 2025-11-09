import React, { useState } from 'react';
import { UsersIcon } from '../icons/UsersIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { Card } from '../common/Card';
import { ArchiveBoxIcon } from '../icons/ArchiveBoxIcon';
import { IdentificationIcon } from '../icons/IdentificationIcon';
import { TrashIcon } from '../icons/TrashIcon';
import ConsentDialog from '../common/ConsentDialog';
import { DownloadIcon } from '../icons/DownloadIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { useUIStateContext } from '../contexts/UIStateContext';
import { useDataContext } from '../contexts/DataContext';
import { PinIcon } from '../icons/PinIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { exportData } from '../../application/use-cases/exportData';
import { DocumentChartBarIcon } from '../icons/DocumentChartBarIcon';
import { CubeTransparentIcon } from '../icons/CubeTransparentIcon';
import { MapIcon } from '../icons/MapIcon';
import { CubeIcon } from '../icons/CubeIcon';


const ChecklistItem: React.FC<{ isChecked: boolean, onToggle: () => void, children: React.ReactNode }> = ({ isChecked, onToggle, children }) => (
    <li className="flex items-center space-x-3 cursor-pointer group" onClick={onToggle}>
        <div className={`w-4 h-4 rounded-sm flex items-center justify-center border-2 ${isChecked ? 'border-green-primary bg-green-primary' : 'border-green-muted group-hover:border-green-bright'}`}>
           {isChecked && <CheckIcon className="w-3 h-3 text-bg-primary" />}
        </div>
        <span className={`text-text-primary transition ${isChecked ? 'line-through text-green-muted/80' : 'group-hover:text-text-accent'}`}>{children}</span>
    </li>
);

const AuditTrailCard: React.FC = () => {
    const { logs } = useUIStateContext();
    const recentLogs = logs.slice(-5);
    return (
        <Card icon={EyeIcon} title="Live Audit Trail">
            <p className="text-sm text-text-primary mb-4">
                A real-time log of every significant user action and system event is recorded for full traceability.
            </p>
            <div className="bg-bg-primary/50 p-3 rounded-sm font-mono text-xs h-36 overflow-y-auto flex flex-col-reverse">
                <div>
                    {[...recentLogs].reverse().map((log, index) => (
                        <p key={index} className="whitespace-pre-wrap">
                            <span className="text-green-muted/80">{log.timestamp}</span>
                            <span className="text-text-primary ml-2">{log.message}</span>
                        </p>
                    ))}
                </div>
            </div>
            <p className="text-xs text-center text-green-muted/50 mt-2">Full log is included in the Reproducibility Package.</p>
        </Card>
    );
};


const ResearchModule: React.FC = () => {
    const { logs, addLog, snapshots, pinSnapshot, analysisRuns } = useUIStateContext();
    const { database } = useDataContext();
    const { scanMeta } = database;
    const [checklist, setChecklist] = useState({
        resources: false,
        methodology: false,
        randomness: false,
        validation: false,
    });
    
    const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'deleted'>('idle');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const [packageExportStatus, setPackageExportStatus] = useState<'idle' | 'exporting' | 'success'>('idle');
    const [snapshotNote, setSnapshotNote] = useState('');

    const handleToggleChecklist = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const completedChecks = Object.values(checklist).filter(Boolean).length;
    const totalChecks = Object.keys(checklist).length;
    const progress = (completedChecks / totalChecks) * 100;
    
    const handleDeleteRequest = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setDeleteStatus('deleting');
        setTimeout(() => {
            setDeleteStatus('deleted');
        }, 2000);
    };

    const handlePinSnapshot = () => {
        if (!snapshotNote.trim()) return;
        pinSnapshot(snapshotNote, { 
            database: JSON.parse(JSON.stringify(database)),
            analysisRuns: JSON.parse(JSON.stringify(analysisRuns)),
        });
        setSnapshotNote('');
    };

    const handleExportPackage = () => {
        setPackageExportStatus('exporting');
        addLog('Reproducibility package export initiated.');

        setTimeout(() => {
            const snapshotString = snapshots.length > 0
                ? snapshots.map(s => `- [${s.timestamp}] ${s.note}\n  - State Snapshot: ${JSON.stringify(s.state, null, 2)}`).join('\n\n')
                : '- No snapshots pinned in this session.';
            
            const analysisRunString = analysisRuns.length > 0
                ? analysisRuns.map(run => `- [${run.timestamp}] ${run.module}: ${JSON.stringify(run.parameters)}`).join('\n')
                : '- No analyses were run in this session.';

            const fullLog = logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');

            const reportContent = `
ANALYSIS REPRODUCIBILITY PACKAGE
=================================

Export Timestamp: ${new Date().toISOString()}
Session ID: session_${Date.now()}
Application Version: 1.0.0

---------------------------------
1. ENVIRONMENT & METADATA
---------------------------------
- Scan ID: ${scanMeta.id}
- Original Scan Timestamp: ${scanMeta.timestamp}
- Location: ${scanMeta.location}
- Coordinate System: WGS 84 / UTM 10N (EPSG:32610)

---------------------------------
2. ANALYSIS RUN LOG (PARAMETERS)
---------------------------------
${analysisRunString}

---------------------------------
3. PINNED SNAPSHOTS (DATA PROVENANCE)
---------------------------------
${snapshotString}

---------------------------------
4. FULL AUDIT LOG (SESSION EVENTS)
---------------------------------
${fullLog}
`;
            exportData('txt', `reproducibility_package_${scanMeta.id}`, reportContent.trim());
            
            setPackageExportStatus('success');
            addLog('Reproducibility package exported successfully.');
            setTimeout(() => setPackageExportStatus('idle'), 3000);
        }, 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn h-full">
            {showDeleteConfirm && (
                 <ConsentDialog
                    title="Confirm Data Deletion"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeleteConfirm(false)}
                >
                    <p className="text-error font-bold">This action is irreversible.</p>
                    <p>Are you sure you want to permanently delete all locally processed scan data from this session?</p>
                </ConsentDialog>
            )}

            <div className="lg:col-span-1 space-y-8">
                <Card icon={IdentificationIcon} title="Authorship & Credentials">
                    <div className="text-sm space-y-2">
                        <p className="font-bold text-text-accent">Dr. Evelyn Reed</p>
                        <p className="text-xs text-green-bright font-mono">Lead Scientist & UI Architect</p>
                        <p className="mt-2 text-text-primary text-xs">
                            Specializing in advanced Lidar data visualization and applied AI for geospatial analysis.
                        </p>
                    </div>
                </Card>
                <Card icon={DownloadIcon} title="Data Export">
                    <div className="space-y-3">
                        <button onClick={() => exportData('csv', 'measurements')} className="w-full flex items-center p-3 bg-bg-primary/50 hover:bg-bg-primary rounded-sm transition"><DocumentChartBarIcon className="h-6 w-6 mr-4 text-green-muted" /><span className="font-bold font-mono">CSV</span></button>
                        <button onClick={() => exportData('las', 'point_cloud')} className="w-full flex items-center p-3 bg-bg-primary/50 hover:bg-bg-primary rounded-sm transition"><CubeIcon className="h-6 w-6 mr-4 text-green-muted" /><span className="font-bold font-mono">LAS</span></button>
                        <button onClick={() => exportData('geotiff', 'raster')} className="w-full flex items-center p-3 bg-bg-primary/50 hover:bg-bg-primary rounded-sm transition"><MapIcon className="h-6 w-6 mr-4 text-green-muted" /><span className="font-bold font-mono">GeoTIFF</span></button>
                        <button onClick={() => exportData('obj', 'model')} className="w-full flex items-center p-3 bg-bg-primary/50 hover:bg-bg-primary rounded-sm transition"><CubeTransparentIcon className="h-6 w-6 mr-4 text-green-muted" /><span className="font-bold font-mono">OBJ</span></button>
                    </div>
                </Card>
                <Card icon={UsersIcon} title="Team Management">
                    <p className="text-sm text-text-primary mb-4">Invite and manage team members for this project.</p>
                    <button className="w-full p-3 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-bold flex items-center justify-center space-x-2">
                        <PlusCircleIcon className="h-5 w-5" />
                        <span>Invite Member</span>
                    </button>
                </Card>
            </div>

            <div className="lg:col-span-1 space-y-8">
                 <AuditTrailCard />
                 <Card icon={PinIcon} title="Data Provenance & Snapshots">
                    <p className="text-sm text-text-primary mb-4">
                        Create immutable, timestamped records of your workflow for compliance and audit trails.
                    </p>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={snapshotNote}
                            onChange={(e) => setSnapshotNote(e.target.value)}
                            placeholder="Note for this snapshot..."
                            className="flex-1 bg-bg-primary border border-green-dark rounded-sm px-4 py-2 focus:ring-2 focus:ring-green-bright focus:outline-none transition font-mono text-green-bright placeholder:text-green-muted text-sm"
                        />
                        <button
                            onClick={handlePinSnapshot}
                            disabled={!snapshotNote.trim()}
                            className="px-4 py-2 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright disabled:bg-green-dark disabled:cursor-not-allowed transition font-semibold"
                            title="Pin Snapshot (Alt+P)"
                        >
                            <PinIcon className="h-5 w-5" />
                        </button>
                    </div>
                    {snapshots.length > 0 && (
                        <div className="mt-4 border-t border-green-dark pt-3">
                            <h4 className="text-xs font-bold text-green-muted uppercase mb-2 font-mono">Session Snapshots</h4>
                            <ul className="text-sm text-text-primary space-y-1 font-mono text-xs max-h-24 overflow-y-auto">
                                {[...snapshots].reverse().map((s, i) => (
                                    <li key={i}><span className="text-green-muted/80">[{s.timestamp}]</span> {s.note}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card>
                 <Card icon={ArchiveBoxIcon} title="Reproducibility Package">
                    <p className="text-sm text-text-primary mb-4">
                        Export a complete analysis package including environment, parameters, and a full audit log for peer review.
                    </p>
                    <button onClick={handleExportPackage} disabled={packageExportStatus !== 'idle'} className="w-full p-3 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-bold flex items-center justify-center space-x-2 disabled:bg-green-dark disabled:text-green-muted disabled:cursor-not-allowed">
                        {packageExportStatus === 'idle' && <><DownloadIcon className="h-5 w-5" /><span>Export Analysis Package</span></>}
                        {packageExportStatus === 'exporting' && 'Exporting...'}
                        {packageExportStatus === 'success' && 'Exported!'}
                    </button>
                 </Card>
            </div>
        </div>
    );
};

export default ResearchModule;