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
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-w-2xl w-full p-8 text-center animate-fadeInUp">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 mb-6 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome to Project Underwhere</h1>
                <p className="text-gray-400 mb-8">An advanced UI concept for a mobile scientific research lab.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10">
                    <div className="flex items-start space-x-3">
                        <CubeIcon className="h-8 w-8 text-cyan-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-gray-200">1. Scan</h3>
                            <p className="text-sm text-gray-400">Simulate Lidar scans and manage multi-sensor data with sub-centimeter accuracy.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <SparklesIcon className="h-8 w-8 text-cyan-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-gray-200">2. Analyze</h3>
                            <p className="text-sm text-gray-400">Leverage AI for material identification, physics simulations, and ecological analysis.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <BookOpenIcon className="h-8 w-8 text-cyan-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-gray-200">3. Collaborate</h3>
                            <p className="text-sm text-gray-400">Export scientific data, draft publications, and share your findings with peers.</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="px-8 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition-transform transform hover:scale-105 font-bold text-lg"
                >
                    Start Demo
                </button>
            </div>
        </div>
    );
};

export default OnboardingModule;
