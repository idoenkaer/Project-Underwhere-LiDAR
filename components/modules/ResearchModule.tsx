import React, { useState } from 'react';
import { UsersIcon } from '../icons/UsersIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { LinkIcon } from '../icons/LinkIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { Card } from '../common/Card';
import { ExportButton } from '../common/ExportButton';
import { ShareButton } from '../common/ShareButton';
import { SatelliteIcon } from '../icons/SatelliteIcon';
import { MountainIcon } from '../icons/MountainIcon';
import { ArchiveBoxIcon } from '../icons/ArchiveBoxIcon';
import { IdentificationIcon } from '../icons/IdentificationIcon';
import { TrashIcon } from '../icons/TrashIcon';
import ConsentDialog from '../common/ConsentDialog';
import { FolderOpenIcon } from '../icons/FolderOpenIcon';
import { CubeIcon } from '../icons/CubeIcon';
import { DownloadIcon } from '../icons/DownloadIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { CodeBracketIcon } from '../icons/CodeBracketIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { useUIStateContext } from '../contexts/UIStateContext';
import { useDataContext } from '../contexts/DataContext';
import { PinIcon } from '../icons/PinIcon';

type ExportStatus = 'idle' | 'exporting' | 'success';

const ChecklistItem: React.FC<{ isChecked: boolean, onToggle: () => void, children: React.ReactNode }> = ({ isChecked, onToggle, children }) => (
    <li className="flex items-center space-x-3 cursor-pointer group" onClick={onToggle}>
        <div className={`w-4 h-4 rounded-sm flex items-center justify-center border-2 ${isChecked ? 'border-green-primary bg-green-primary' : 'border-green-muted group-hover:border-green-bright'}`}>
           {isChecked && <CheckIcon className="w-3 h-3 text-bg-primary" />}
        </div>
        <span className={`text-text-primary transition ${isChecked ? 'line-through text-green-muted/80' : 'group-hover:text-text-accent'}`}>{children}</span>
    </li>
);

const IntegrationButton: React.FC<{ label: string; description: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; href: string }> = ({ label, description, icon: Icon, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center w-full p-3 text-left bg-bg-primary/50 hover:bg-bg-primary rounded-sm transition group">
        <Icon className="h-8 w-8 mr-4 text-green-muted flex-shrink-0" />
        <div className="flex-1">
            <p className="font-bold text-text-primary group-hover:text-green-bright transition">{label}</p>
            <p className="text-xs text-green-muted">{description}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-muted group-hover:text-green-bright transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
    </a>
);


const ResearchModule: React.FC = () => {
    const { logs, addLog, snapshots, pinSnapshot } = useUIStateContext();
    const { scanMeta } = useDataContext();
    const [checklist, setChecklist] = useState({
        resources: false,
        methodology: false,
        randomness: false,
        validation: false,
    });
    
    // New states for privacy features
    const [anonymizeData, setAnonymizeData] = useState(true);
    const [optOutSharing, setOptOutSharing] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'deleted'>('idle');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    // States for consent-gated exports
    const [exportStatuses, setExportStatuses] = useState<Record<string, ExportStatus>>({
        CSV: 'idle', LAS: 'idle', GeoTIFF: 'idle', OBJ: 'idle'
    });
    const [showExportConsent, setShowExportConsent] = useState(false);
    const [pendingExportFormat, setPendingExportFormat] = useState<string | null>(null);

    const [packageExportStatus, setPackageExportStatus] = useState<ExportStatus>('idle');
    const [snapshotNote, setSnapshotNote] = useState('');

    const handleToggleChecklist = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const completedChecks = Object.values(checklist).filter(Boolean).length;
    const totalChecks = Object.keys(checklist).length;
    const progress = (completedChecks / totalChecks) * 100;
    
    const handleExportRequest = (format: string) => {
        setPendingExportFormat(format);
        setShowExportConsent(true);
    };

    const handleExportConfirm = () => {
        if (!pendingExportFormat) return;

        const format = pendingExportFormat;
        setExportStatuses(prev => ({ ...prev, [format]: 'exporting' }));
        setShowExportConsent(false);
        setPendingExportFormat(null);

        setTimeout(() => {
            setExportStatuses(prev => ({ ...prev, [format]: 'success' }));
            setTimeout(() => setExportStatuses(prev => ({ ...prev, [format]: 'idle' })), 2500);
        }, 2000 + Math.random() * 1000);
    };
    
    const handleDeleteRequest = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setDeleteStatus('deleting');
        // Simulate deletion process
        setTimeout(() => {
            setDeleteStatus('deleted');
        }, 2000);
    };

    const handlePinSnapshot = () => {
        if (!snapshotNote.trim()) return;
        pinSnapshot(snapshotNote);
        setSnapshotNote('');
    };

    const handleExportPackage = () => {
        setPackageExportStatus('exporting');
        addLog('Reproducibility package export initiated.');

        setTimeout(() => {
            const snapshotString = snapshots.length > 0
                ? snapshots.map(s => `- [${s.timestamp}] ${s.note}`).join('\n')
                : '- No snapshots pinned in this session.';
            
            const fullLog = logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');

            const reportContent = `
ANALYSIS REPRODUCIBILITY PACKAGE
=================================

Export Timestamp: ${new Date().toISOString()}
Project ID: Project Underwhere
Scan ID: ${scanMeta.id}

---------------------------------
1. METADATA
---------------------------------
- Original Scan Timestamp: ${scanMeta.timestamp}
- Location: ${scanMeta.location}
- Coordinate System: WGS 84 / UTM 10N (EPSG:32610)

---------------------------------
2. PINNED SNAPSHOTS (DATA PROVENANCE)
---------------------------------
${snapshotString}

---------------------------------
3. DATA MANIFEST (INCLUDED IN PACKAGE)
---------------------------------
- /raw/${scanMeta.id}.las (Original point cloud)
- /processed/topography_results.json (Topography analysis output)
- /processed/ai_report.md (Semantic report from AI)
- /audits/audit_log.txt (Full event log below)

---------------------------------
4. FULL AUDIT LOG (SESSION EVENTS)
---------------------------------
${fullLog}
`;
            const blob = new Blob([reportContent.trim()], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analysis_package_${scanMeta.id}_${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            setPackageExportStatus('success');
            addLog('Reproducibility package exported successfully.');
            setTimeout(() => setPackageExportStatus('idle'), 3000);
        }, 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn h-full">
            {showExportConsent && (
                <ConsentDialog
                    title="Data Export Consent"
                    onConfirm={handleExportConfirm}
                    onCancel={() => setShowExportConsent(false)}
                >
                    <p>You are about to export scientific data. This may include sensitive geospatial information.</p>
                    <p className="font-bold mt-2">Current Settings:</p>
                    <ul className="list-disc list-inside text-text-primary font-mono">
                        <li>Anonymize Geospatial Data: {anonymizeData ? 'Enabled' : 'Disabled'}</li>
                    </ul>
                    <p className="mt-2">Please ensure you comply with all data sharing and privacy policies before distributing this information.</p>
                </ConsentDialog>
            )}

            {showDeleteConfirm && (
                 <ConsentDialog
                    title="Confirm Data Deletion"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeleteConfirm(false)}
                >
                    <p className="text-error font-bold">This action is irreversible.</p>
                    <p>Are you sure you want to permanently delete all locally processed scan data from this session? This includes the point cloud, analysis results, and metadata.</p>
                </ConsentDialog>
            )}
            {/* Left Panel: Export, Share, and Ethics */}
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
                <ExportButton onExportRequest={handleExportRequest} statuses={exportStatuses} />
                
                <Card icon={FolderOpenIcon} title="Open Data & Interoperability">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold text-green-muted mb-2">Downloadable Demo Datasets</h4>
                            <div className="space-y-2">
                                <a href="#" className="flex items-center w-full p-3 text-left bg-bg-primary/50 hover:bg-bg-primary rounded-sm transition group">
                                    <CubeIcon className="h-6 w-6 mr-3 text-green-muted"/>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-text-primary group-hover:text-green-bright font-mono">scan_dataset_0A4F.las</p>
                                        <p className="text-xs text-green-muted/80">Mock Lidar Scan Data</p>
                                    </div>
                                    <DownloadIcon className="h-5 w-5 text-green-muted"/>
                                </a>
                                <a href="#" className="flex items-center w-full p-3 text-left bg-bg-primary/50 hover:bg-bg-primary rounded-sm transition group">
                                    <DocumentTextIcon className="h-6 w-6 mr-3 text-green-muted"/>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-text-primary group-hover:text-green-bright font-mono">ground_truth_census.csv</p>
                                        <p className="text-xs text-green-muted/80">Validation Ground-Truth Data</p>
                                    </div>
                                    <DownloadIcon className="h-5 w-5 text-green-muted"/>
                                </a>
                            </div>
                        </div>
                        <div className="border-t border-green-dark !my-3"></div>
                        <div>
                            <h4 className="text-sm font-semibold text-green-muted mb-2">Integration Connectors (Examples)</h4>
                            <div className="space-y-2">
                                 <a href="#" className="flex items-center w-full p-3 text-left bg-bg-primary/50 hover:bg-bg-primary rounded-sm transition group">
                                    <CodeBracketIcon className="h-6 w-6 mr-3 text-green-muted"/>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-text-primary group-hover:text-green-bright">QGIS Plugin Connector</p>
                                    </div>
                                 </a>
                                 <a href="#" className="flex items-center w-full p-3 text-left bg-bg-primary/50 hover:bg-bg-primary rounded-sm transition group">
                                    <CodeBracketIcon className="h-6 w-6 mr-3 text-green-muted"/>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-text-primary group-hover:text-green-bright">PDAL Pipeline Script</p>
                                    </div>
                                 </a>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right Panel: Publication Prep, Federation, and Ethics */}
            <div className="lg:col-span-1 space-y-8">
                 <Card icon={CheckBadgeIcon} title="Reproducibility Checklist">
                    <div className="mb-4">
                        <div className="flex justify-between text-sm font-medium text-green-muted mb-1 font-mono">
                            <span>Progress</span>
                            <span>{completedChecks} / {totalChecks} Completed</span>
                        </div>
                        <div className="w-full bg-green-dark rounded-full h-2.5">
                            <div className="bg-green-bright h-2.5 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                        <ChecklistItem isChecked={checklist.resources} onToggle={() => handleToggleChecklist('resources')}>Resource Requirements Documented</ChecklistItem>
                        <ChecklistItem isChecked={checklist.methodology} onToggle={() => handleToggleChecklist('methodology')}>Methodology Clearly Stated</ChecklistItem>
                        <ChecklistItem isChecked={checklist.randomness} onToggle={() => handleToggleChecklist('randomness')}>Randomness Controlled (Seeds, etc.)</ChecklistItem>
                        <ChecklistItem isChecked={checklist.validation} onToggle={() => handleToggleChecklist('validation')}>Statistical Validation Performed</ChecklistItem>
                    </ul>
                 </Card>

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
                            title="Pin Snapshot"
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
                        Export a complete analysis package including metadata, parameters, and a full audit log for peer review and replication.
                    </p>
                    <button onClick={handleExportPackage} disabled={packageExportStatus !== 'idle'} className="w-full p-3 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-bold flex items-center justify-center space-x-2 disabled:bg-green-dark disabled:text-green-muted disabled:cursor-not-allowed">
                        {packageExportStatus === 'idle' && <><DownloadIcon className="h-5 w-5" /><span>Export Analysis Package</span></>}
                        {packageExportStatus === 'exporting' && 'Exporting...'}
                        {packageExportStatus === 'success' && 'Exported!'}
                    </button>
                 </Card>

                 <Card icon={SatelliteIcon} title="Data Federation & Archival">
                    <div className="space-y-3">
                        <IntegrationButton label="NASA Earthdata" description="Search public satellite imagery" icon={SatelliteIcon} href="https://search.earthdata.nasa.gov/" />
                        <IntegrationButton label="OpenTopography" description="Access public Lidar datasets" icon={MountainIcon} href="https://opentopography.org/" />
                        <IntegrationButton label="Zenodo Archive" description="Publish dataset & get a DOI" icon={ArchiveBoxIcon} href="https://zenodo.org/" />
                    </div>
                </Card>
                <Card icon={ShieldCheckIcon} title="Ethics & User Control">
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center justify-between">
                            <label htmlFor="anonymize" className="text-text-primary">Anonymize Geospatial Data</label>
                            <input type="checkbox" id="anonymize" checked={anonymizeData} onChange={() => setAnonymizeData(!anonymizeData)} className="h-4 w-4 rounded-sm bg-bg-primary border-green-muted text-green-bright focus:ring-green-bright" />
                        </div>
                         <div className="flex items-center justify-between">
                            <label htmlFor="optout" className="text-text-primary">Opt-out of Data Sharing</label>
                            <input type="checkbox" id="optout" checked={optOutSharing} onChange={() => setOptOutSharing(!optOutSharing)} className="h-4 w-4 rounded-sm bg-bg-primary border-green-muted text-green-bright focus:ring-green-bright" />
                        </div>
                        <div className="border-t border-green-dark !my-4"></div>
                        <button 
                            onClick={handleDeleteRequest}
                            disabled={deleteStatus !== 'idle'}
                            className="w-full p-3 bg-transparent border-2 border-error rounded-sm transition font-semibold flex items-center justify-center space-x-2 text-error hover:bg-error hover:text-bg-primary disabled:border-green-muted/50 disabled:text-green-muted/50 disabled:bg-transparent disabled:cursor-not-allowed"
                        >
                            <TrashIcon className="h-5 w-5" />
                            <span>
                                {deleteStatus === 'idle' && 'Delete All Scan Data'}
                                {deleteStatus === 'deleting' && 'Deleting...'}
                                {deleteStatus === 'deleted' && 'Data Deleted'}
                            </span>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ResearchModule;