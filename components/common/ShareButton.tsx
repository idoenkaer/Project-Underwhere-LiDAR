import React, { useState } from 'react';
import { ShareIcon } from '../icons/ShareIcon';
import { GoogleDriveIcon } from '../icons/GoogleDriveIcon';
import { GitHubIcon } from '../icons/GitHubIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { Card } from './Card';

type ShareStatus = 'idle' | 'sharing' | 'success';

interface SingleShareButtonProps {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const SingleShareButton: React.FC<SingleShareButtonProps> = ({ label, icon: Icon }) => {
    const [status, setStatus] = useState<ShareStatus>('idle');

    const handleShare = () => {
        setStatus('sharing');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 2500);
        }, 1500);
    };

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
        onClick={handleShare}
        disabled={status !== 'idle'}
        className={`w-full p-3 rounded-lg transition font-semibold flex items-center justify-center space-x-2 ${colors[status]}`}
        >
        <Icon className="h-5 w-5" />
        <span>{content[status]}</span>
        {status === 'success' && <CheckIcon className="h-5 w-5" />}
        </button>
    );
};

interface ShareButtonContainerProps {
    onGenerateDemoLink: () => void;
    isGeneratingLink: boolean;
    demoLink: string;
    onCopyLink: () => void;
    linkCopied: boolean;
}

export const ShareButton: React.FC<ShareButtonContainerProps> = (props) => {
    return (
        <Card icon={ShareIcon} title="Sharing & Integration">
            <div className="space-y-3">
               <SingleShareButton label="Google Drive" icon={GoogleDriveIcon} />
               <SingleShareButton label="GitHub Repo" icon={GitHubIcon} />
               <div className="border-t border-gray-700 my-4 !mt-4 !mb-4"></div>
               <button onClick={props.onGenerateDemoLink} disabled={props.isGeneratingLink} className="w-full p-3 rounded-lg transition font-semibold flex items-center justify-center space-x-2 bg-indigo-600/80 hover:bg-indigo-600 disabled:opacity-50">
                    <ShareIcon className="h-5 w-5" />
                    <span>{props.isGeneratingLink ? 'Generating Link...' : 'Share Demo'}</span>
               </button>
               {props.demoLink && (
                   <div className="flex items-center space-x-2 bg-gray-900/50 p-2 rounded-lg">
                       <input type="text" readOnly value={props.demoLink} className="flex-1 bg-transparent text-xs text-cyan-300 font-mono focus:outline-none"/>
                       <button onClick={props.onCopyLink} className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-xs font-bold">
                           {props.linkCopied ? 'Copied!' : 'Copy'}
                       </button>
                   </div>
               )}
            </div>
        </Card>
    );
};
