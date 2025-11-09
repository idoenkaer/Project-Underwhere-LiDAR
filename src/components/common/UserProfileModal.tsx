import React from 'react';
import { IdentificationIcon } from '../icons/IdentificationIcon';

interface UserProfileModalProps {
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
    return (
        <div className="modal-overlay animate-fadeIn flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-bg-secondary border border-green-dark rounded-sm shadow-2xl max-w-sm w-full p-8 text-center animate-fadeInUp"
                onClick={(e) => e.stopPropagation()}
            >
                <img src="https://picsum.photos/seed/user-avatar/128/128" alt="User Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-green-bright" />
                <h2 className="text-2xl font-bold text-text-accent mb-1 font-mono">Dr. Evelyn Reed</h2>
                <p className="text-sm text-green-muted mb-6">Lead Scientist</p>
                <div className="text-left space-y-3 text-sm">
                    <p><strong className="text-green-muted w-24 inline-block">Email:</strong> <span className="font-mono text-green-bright">e.reed@example.com</span></p>
                    <p><strong className="text-green-muted w-24 inline-block">Status:</strong> <span className="text-green-primary font-mono">ONLINE</span></p>
                    <p><strong className="text-green-muted w-24 inline-block">Project Role:</strong> <span className="font-mono">Owner</span></p>
                </div>
                <button onClick={onClose} className="mt-8 w-full px-6 py-2 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-semibold">
                    Close
                </button>
            </div>
        </div>
    );
};

export default UserProfileModal;