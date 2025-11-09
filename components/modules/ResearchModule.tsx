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

type ExportStatus = 'idle' | 'exporting' | 'success';

const ChecklistItem: React.FC<{ isChecked: boolean, onToggle: () => void, children: React.ReactNode }> = ({ isChecked, onToggle, children }) => (
    <li className="flex items-center space-x-3 cursor-pointer" onClick={onToggle}>
        <input type="checkbox" readOnly checked={isChecked} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-500 focus:ring-cyan-600 pointer-events-none" />
        <span className={`text-gray-300 transition ${isChecked ? 'line-through text-gray-500' : ''}`}>{children}</span>
    </li>
);

const IntegrationButton: React.FC<{ label: string; description: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; href: string }> = ({ label, description, icon: Icon, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center w-full p-3 text-left bg-gray-700/50 hover:bg-gray-700 rounded-lg transition group">
        <Icon className="h-8 w-8 mr-4 text-gray-300 flex-shrink-0" />
        <div className="flex-1">
            <p className="font-bold text-gray-200 group-hover:text-cyan-300 transition">{label}</p>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover:text-cyan-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
    </a>
);


const ResearchModule: React.FC = () => {
    const [comments, setComments] = useState([
        { user: 'Dr. Aris', text: 'The fault line anomaly in the topography scan is significant. We need to cross-reference this with seismic data.', time: '2h ago' },
        { user: 'Dr. Chen', text: 'Agreed. The AI-suggested hypothesis about subsurface water flow seems plausible. I\'ll start drafting the methods section.', time: '1h ago' }
    ]);
    const [newComment, setNewComment] = useState('');
    const [demoLink, setDemoLink] = useState('');
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
    
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

    const handleToggleChecklist = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const completedChecks = Object.values(checklist).filter(Boolean).length;
    const totalChecks = Object.keys(checklist).length;
    const progress = (completedChecks / totalChecks) * 100;

    const handleGenerateDemoLink = () => {
        setIsGeneratingLink(true);
        setDemoLink('');
        setCopyStatus('idle');
        setTimeout(() => {
            const uniqueId = Math.random().toString(36).substring(2, 10);
            setDemoLink(`https://sci-research-suite.dev/demo/${uniqueId}`);
            setIsGeneratingLink(false);
        }, 1500);
    };

    const handleCopyLink = async () => {
        if (!demoLink || copyStatus !== 'idle') return;
        try {
            await navigator.clipboard.writeText(demoLink);
            setCopyStatus('success');
        } catch (err) {
            console.error('Failed to copy link:', err);
            setCopyStatus('error');
        } finally {
            setTimeout(() => setCopyStatus('idle'), 2500);
        }
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        setComments([...comments, { user: 'You', text: newComment, time: 'Just now' }]);
        setNewComment('');
    };
    
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
            // In a real app, this would trigger a global state reset.
            // For this demo, we just show the status change.
            // The user would see the effect upon navigating back to Measurement.
        }, 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn h-full">
            {showExportConsent && (
                <ConsentDialog
                    title="Data Export Consent"
                    onConfirm={handleExportConfirm}
                    onCancel={() => setShowExportConsent(false)}
                >
                    <p>You are about to export scientific data. This may include sensitive geospatial information.</p>
                    <p className="font-bold mt-2">Current Settings:</p>
                    <ul className="list-disc list-inside text-gray-300">
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
                    <p className="text-red-300 font-bold">This action is irreversible.</p>
                    <p>Are you sure you want to permanently delete all locally processed scan data from this session? This includes the point cloud, analysis results, and metadata.</p>
                </ConsentDialog>
            )}
            {/* Left Panel: Export, Share, and Ethics */}
            <div className="lg:col-span-1 space-y-8">
                <Card icon={IdentificationIcon} title="Authorship & Credentials">
                    <div className="text-sm space-y-2">
                        <p className="font-bold text-gray-200">Dr. Evelyn Reed</p>
                        <p className="text-xs text-cyan-400">Lead Scientist & UI Architect</p>
                        <p className="mt-2 text-gray-400 text-xs">
                            Specializing in advanced Lidar data visualization and applied AI for geospatial analysis.
                        </p>
                    </div>
                </Card>
                <ExportButton onExportRequest={handleExportRequest} statuses={exportStatuses} />
                <ShareButton onGenerateDemoLink={handleGenerateDemoLink} isGeneratingLink={isGeneratingLink} demoLink={demoLink} onCopyLink={handleCopyLink} copyStatus={copyStatus} />
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
                            <label htmlFor="anonymize" className="text-gray-300">Anonymize Geospatial Data</label>
                            <input type="checkbox" id="anonymize" checked={anonymizeData} onChange={() => setAnonymizeData(!anonymizeData)} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-500 focus:ring-cyan-600" />
                        </div>
                         <div className="flex items-center justify-between">
                            <label htmlFor="optout" className="text-gray-300">Opt-out of Data Sharing</label>
                            <input type="checkbox" id="optout" checked={optOutSharing} onChange={() => setOptOutSharing(!optOutSharing)} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-500 focus:ring-cyan-600" />
                        </div>
                        <div className="border-t border-gray-700 !my-4"></div>
                        <button 
                            onClick={handleDeleteRequest}
                            disabled={deleteStatus !== 'idle'}
                            className="w-full p-3 bg-red-800/80 hover:bg-red-700 rounded-lg transition font-semibold flex items-center justify-center space-x-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
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

            {/* Center Panel: Publication Draft & Commentary */}
            <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg border border-gray-700 flex flex-col">
                 <div className="flex-1 flex flex-col mb-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Publication Draft</h3>
                    <div className="relative flex-1 bg-gray-900/70 rounded-lg p-4 overflow-y-auto">
                        <div className="absolute inset-0 bg-[image:var(--img-report-bg)] bg-cover bg-center opacity-10 blur-sm"></div>
                        <div className="relative prose prose-invert max-w-none text-gray-300">
                            <h1 className="text-cyan-300">Multi-Sensor Lidar Analysis of [Location]</h1>
                            <p className="text-xs italic text-gray-400">[Workflow complete. All modules contributed to this summary.]</p>
                            <h2>Abstract</h2>
                            <p>This study presents a novel approach to environmental analysis using a multi-modal Lidar scanning suite. By integrating infrared, RGB, and spectral sensor data, we identified a previously unmapped geological fault line... [AI-ASSISTED SUMMARY]</p>
                        </div>
                    </div>
                 </div>
                 <Card icon={CheckBadgeIcon} title="Reproducibility Checklist">
                    <div className="mb-4">
                        <div className="flex justify-between text-sm font-medium text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{completedChecks} / {totalChecks} Completed</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                        <ChecklistItem isChecked={checklist.resources} onToggle={() => handleToggleChecklist('resources')}>Resource Requirements Documented</ChecklistItem>
                        <ChecklistItem isChecked={checklist.methodology} onToggle={() => handleToggleChecklist('methodology')}>Methodology Clearly Stated</ChecklistItem>
                        <ChecklistItem isChecked={checklist.randomness} onToggle={() => handleToggleChecklist('randomness')}>Randomness Controlled (Seeds, etc.)</ChecklistItem>
                        <ChecklistItem isChecked={checklist.validation} onToggle={() => handleToggleChecklist('validation')}>Statistical Validation Performed</ChecklistItem>
                    </ul>
                 </Card>
                 <div className="flex-1 flex flex-col mt-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center"><UsersIcon className="h-5 w-5 mr-2 text-cyan-400"/>Collaborator Commentary</h3>
                    <div className="flex-1 bg-gray-900/70 rounded-lg p-4 space-y-4 overflow-y-auto">
                        {comments.map((comment, index) => (
                             <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <p className="font-bold text-cyan-300">{comment.user}</p>
                                    <p className="text-gray-400">{comment.time}</p>
                                </div>
                                <p className="text-sm text-gray-300">{comment.text}</p>
                            </div>
                        ))}
                    </div>
                     <div className="mt-4 flex space-x-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            placeholder="Add a comment..."
                             className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                        />
                        <button onClick={handleAddComment} className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition">Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResearchModule;
