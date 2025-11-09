import React from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';
import { CubeIcon } from '../icons/CubeIcon';
import { BookOpenIcon } from '../icons/BookOpenIcon';

interface OnboardingModuleProps {
    onClose: () => void;
}

const OnboardingModule: React.FC<OnboardingModuleProps> = ({ onClose }) => {
    return (
        <div className="modal-overlay animate-fadeIn flex items-center justify-center p-4">
            <div className="bg-bg-secondary border border-green-dark rounded-sm shadow-2xl max-w-2xl w-full p-8 text-center animate-fadeInUp">
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-green-muted/20 text-green-bright mb-6 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-text-accent mb-2 font-mono text-glow">Welcome to Project Underwhere</h1>
                <p className="text-green-muted mb-8">An advanced UI concept for a mobile scientific research lab.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10">
                    <div className="flex items-start space-x-3">
                        <CubeIcon className="h-8 w-8 text-green-bright flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-text-primary">1. Scan</h3>
                            <p className="text-sm text-text-primary/80">Simulate Lidar scans and manage multi-sensor data with sub-centimeter accuracy.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <SparklesIcon className="h-8 w-8 text-green-bright flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-text-primary">2. Analyze</h3>
                            <p className="text-sm text-text-primary/80">Leverage AI for material identification, physics simulations, and ecological analysis.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <BookOpenIcon className="h-8 w-8 text-green-bright flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-text-primary">3. Collaborate</h3>
                            <p className="text-sm text-text-primary/80">Export scientific data, draft publications, and share your findings with peers.</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="px-8 py-3 bg-transparent border-2 border-green-bright text-green-bright font-mono rounded-sm uppercase tracking-wider hover:bg-green-bright hover:text-bg-primary transition-all duration-200 hover:shadow-glow-green-md"
                >
                    Start Demo
                </button>
            </div>
        </div>
    );
};

export default OnboardingModule;