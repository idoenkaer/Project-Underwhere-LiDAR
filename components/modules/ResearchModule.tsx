import React, { useState } from 'react';
import { UsersIcon } from '../icons/UsersIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { LinkIcon } from '../icons/LinkIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { Card } from '../common/Card';
import { ExportButton } from '../common/ExportButton';
import { ShareButton } from '../common/ShareButton';

const ChecklistItem: React.FC<{ isChecked: boolean, onToggle: () => void, children: React.ReactNode }> = ({ isChecked, onToggle, children }) => (
    <li className="flex items-center space-x-3 cursor-pointer" onClick={onToggle}>
        <input type="checkbox" readOnly checked={isChecked} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-500 focus:ring-cyan-600 pointer-events-none" />
        <span className={`text-gray-300 transition ${isChecked ? 'line-through text-gray-500' : ''}`}>{children}</span>
    </li>
);

const ResearchModule: React.FC = () => {
    const [comments, setComments] = useState([
        { user: 'Dr. Aris', text: 'The fault line anomaly in the topography scan is significant. We need to cross-reference this with seismic data.', time: '2h ago' },
        { user: 'Dr. Chen', text: 'Agreed. The AI-suggested hypothesis about subsurface water flow seems plausible. I\'ll start drafting the methods section.', time: '1h ago' }
    ]);
    const [newComment, setNewComment] = useState('');
    const [demoLink, setDemoLink] = useState('');
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    
    const [checklist, setChecklist] = useState({
        resources: false,
        methodology: false,
        randomness: false,
        validation: false,
    });

    const handleToggleChecklist = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const completedChecks = Object.values(checklist).filter(Boolean).length;
    const totalChecks = Object.keys(checklist).length;
    const progress = (completedChecks / totalChecks) * 100;

    const handleGenerateDemoLink = () => {
        setIsGeneratingLink(true);
        setDemoLink('');
        setTimeout(() => {
            const uniqueId = Math.random().toString(36).substring(2, 10);
            setDemoLink(`https://sci-research-suite.dev/demo/${uniqueId}`);
            setIsGeneratingLink(false);
        }, 1500);
    };

    const handleCopyLink = () => {
        if (!demoLink) return;
        navigator.clipboard.writeText(demoLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        setComments([...comments, { user: 'You', text: newComment, time: 'Just now' }]);
        setNewComment('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn h-full">
            {/* Left Panel: Export, Share, and Ethics */}
            <div className="lg:col-span-1 space-y-8">
                <ExportButton />
                <ShareButton onGenerateDemoLink={handleGenerateDemoLink} isGeneratingLink={isGeneratingLink} demoLink={demoLink} onCopyLink={handleCopyLink} linkCopied={linkCopied} />
                <Card icon={ShieldCheckIcon} title="Ethics & Open Science">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="anonymize" className="text-gray-300">Anonymize Scan Data</label>
                            <input type="checkbox" id="anonymize" className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-500 focus:ring-cyan-600" />
                        </div>
                        <button className="w-full p-3 bg-cyan-600/80 hover:bg-cyan-600 rounded-lg transition font-semibold">Generate Compliance Report</button>
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