import React, { useState } from 'react';
import { DownloadIcon } from '../icons/DownloadIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { CubeIcon } from '../icons/CubeIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { GoogleDriveIcon } from '../icons/GoogleDriveIcon';
import { GitHubIcon } from '../icons/GitHubIcon';
import { LinkIcon } from '../icons/LinkIcon';

type ExportStatus = 'idle' | 'exporting' | 'success';
type ShareStatus = 'idle' | 'sharing' | 'success';

const EXPORT_FORMATS = [
    { format: 'CSV', description: 'Annotated Measurements', icon: DocumentTextIcon },
    { format: 'LAS', description: 'Point Cloud Data', icon: CubeIcon },
    { format: 'GeoTIFF', description: 'Geospatial Raster', icon: GlobeIcon },
    { format: 'OBJ', description: '3D Model', icon: CubeIcon },
];

const ExportButton: React.FC<{ format: string, description: string, icon: React.FC<React.SVGProps<SVGSVGElement>>, status: ExportStatus, onClick: () => void }> = ({ format, description, icon: Icon, status, onClick }) => {
    
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
    <button onClick={onClick} disabled={status !== 'idle'} className="flex items-center justify-between w-full p-3 text-left bg-gray-700/50 hover:bg-gray-700 rounded-lg transition disabled:cursor-not-allowed">
        <Icon className="h-6 w-6 mr-4 text-gray-300" />
        {content[status]}
    </button>
)};

const ShareButton: React.FC<{
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  status: ShareStatus;
  onClick: () => void;
}> = ({ label, icon: Icon, status, onClick }) => {
  const content = {
    idle: `Share to ${label}`,
    sharing: 'Sharing...',
    success: 'Shared Successfully!',
  };
  const colors = {
    idle: 'bg-gray-700/50 hover:bg-gray-700',
    sharing: 'bg-yellow-600/50 cursor-wait',
    success: 'bg-green-600/50',
  };

  return (
    <button
      onClick={onClick}
      disabled={status !== 'idle'}
      className={`w-full p-3 rounded-lg transition font-semibold flex items-center justify-center space-x-2 ${colors[status]}`}
    >
      <Icon className="h-5 w-5" />
      <span>{content[status]}</span>
      {status === 'success' && <CheckIcon className="h-5 w-5" />}
    </button>
  );
};


const ResearchModule: React.FC = () => {
    const [exportStatus, setExportStatus] = useState<Record<string, ExportStatus>>({ CSV: 'idle', LAS: 'idle', GeoTIFF: 'idle', OBJ: 'idle' });
    const [shareStatus, setShareStatus] = useState<Record<string, ShareStatus>>({ drive: 'idle', github: 'idle' });
    const [comments, setComments] = useState([
        { user: 'Dr. Aris', text: 'The fault line anomaly in the topography scan is significant. We need to cross-reference this with seismic data.', time: '2h ago' },
        { user: 'Dr. Chen', text: 'Agreed. The AI-suggested hypothesis about subsurface water flow seems plausible. I\'ll start drafting the methods section.', time: '1h ago' }
    ]);
    const [newComment, setNewComment] = useState('');
    const [demoLink, setDemoLink] = useState('');
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);


    const handleExport = (format: string) => {
        setExportStatus(prev => ({ ...prev, [format]: 'exporting' }));
        setTimeout(() => {
            setExportStatus(prev => ({ ...prev, [format]: 'success' }));
            // Revert back to idle after a few seconds
            setTimeout(() => {
                setExportStatus(prev => ({ ...prev, [format]: 'idle' }));
            }, 2500);
        }, 2000 + Math.random() * 1000);
    };

    const handleShare = (platform: 'drive' | 'github') => {
        setShareStatus(prev => ({...prev, [platform]: 'sharing'}));
        setTimeout(() => {
            setShareStatus(prev => ({...prev, [platform]: 'success'}));
            // Revert back to idle after a few seconds
             setTimeout(() => {
                setShareStatus(prev => ({ ...prev, [platform]: 'idle' }));
            }, 2500);
        }, 1500);
    };

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
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center"><DownloadIcon className="h-5 w-5 mr-2 text-cyan-400"/>Data Export</h3>
                    <div className="space-y-3">
                        {EXPORT_FORMATS.map(({format, description, icon}) => (
                           <ExportButton key={format} format={format} description={description} icon={icon} status={exportStatus[format]} onClick={() => handleExport(format)} />
                        ))}
                    </div>
                </div>
                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center"><ShareIcon className="h-5 w-5 mr-2 text-cyan-400"/>Sharing & Integration</h3>
                    <div className="space-y-3">
                       <ShareButton label="Google Drive" icon={GoogleDriveIcon} status={shareStatus.drive} onClick={() => handleShare('drive')} />
                       <ShareButton label="GitHub Repo" icon={GitHubIcon} status={shareStatus.github} onClick={() => handleShare('github')} />
                       <div className="border-t border-gray-700 my-4"></div>
                       <button onClick={handleGenerateDemoLink} disabled={isGeneratingLink} className="w-full p-3 rounded-lg transition font-semibold flex items-center justify-center space-x-2 bg-indigo-600/80 hover:bg-indigo-600 disabled:opacity-50">
                            <LinkIcon className="h-5 w-5" />
                            <span>{isGeneratingLink ? 'Generating Link...' : 'Share Demo'}</span>
                       </button>
                       {demoLink && (
                           <div className="flex items-center space-x-2 bg-gray-900/50 p-2 rounded-lg">
                               <input type="text" readOnly value={demoLink} className="flex-1 bg-transparent text-xs text-cyan-300 font-mono focus:outline-none"/>
                               <button onClick={handleCopyLink} className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-xs font-bold">
                                   {linkCopied ? 'Copied!' : 'Copy'}
                               </button>
                           </div>
                       )}
                    </div>
                </div>
                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center"><ShieldCheckIcon className="h-5 w-5 mr-2 text-cyan-400"/>Ethics & Open Science</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="anonymize" className="text-gray-300">Anonymize Scan Data</label>
                            <input type="checkbox" id="anonymize" className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-500 focus:ring-cyan-600" />
                        </div>
                        <button className="w-full p-3 bg-cyan-600/80 hover:bg-cyan-600 rounded-lg transition font-semibold">Generate Compliance Report</button>
                    </div>
                </div>
            </div>

            {/* Center Panel: Publication Draft & Commentary */}
            <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg border border-gray-700 flex flex-col">
                 <h3 className="text-lg font-semibold text-gray-200 mb-4">Publication Draft</h3>
                 <div className="relative flex-1 bg-gray-900/70 rounded-lg p-4 overflow-y-auto">
                    <div className="absolute inset-0 bg-[image:var(--img-report-bg)] bg-cover bg-center opacity-10 blur-sm"></div>
                    <div className="relative prose prose-invert max-w-none text-gray-300">
                        <h1 className="text-cyan-300">Multi-Sensor Lidar Analysis of [Location]</h1>
                        <p className="text-xs italic text-gray-400">[Workflow complete. All modules contributed to this summary.]</p>
                        <h2>Abstract</h2>
                        <p>This study presents a novel approach to environmental analysis using a multi-modal Lidar scanning suite. By integrating infrared, RGB, and spectral sensor data, we identified a previously unmapped geological fault line... [AI-ASSISTED SUMMARY]</p>
                        <h2>1. Introduction</h2>
                        <p>The field of geospatial analysis has been revolutionized by... [LITERATURE CONTEXT]</p>
                        <h2>2. Methods</h2>
                        <p>A high-resolution Lidar scan was conducted... [DATA FROM MEASUREMENT MODULE]</p>
                        <p>Structural simulations were performed under... [DATA FROM PHYSICS MODULE]</p>
                        <h2>3. Results</h2>
                        <p>Topographical analysis revealed... [DATA FROM TOPOGRAPHY MODULE]</p>
                        <p>Ecological assessment identified... [DATA FROM BIOLOGY MODULE]</p>
                    </div>
                 </div>
                 <div className="mt-4 flex-1 flex flex-col">
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