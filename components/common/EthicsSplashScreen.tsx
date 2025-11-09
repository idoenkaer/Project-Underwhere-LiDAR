import React from 'react';
import { DocumentCheckIcon } from '../icons/DocumentCheckIcon';

interface EthicsSplashScreenProps {
    onClose: () => void;
}

const EthicsSplashScreen: React.FC<EthicsSplashScreenProps> = ({ onClose }) => {
    return (
        <div className="modal-overlay animate-fadeIn flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-w-2xl w-full p-8 text-center animate-fadeInUp">
                <DocumentCheckIcon className="h-16 w-16 text-cyan-400 mb-6 mx-auto" />
                <h1 className="text-3xl font-bold text-white mb-4">Commitment to Responsible Innovation</h1>
                <p className="text-gray-400 mb-6">
                    This application is a powerful scientific tool. By proceeding, you acknowledge and agree to uphold its ethical principles.
                </p>

                <div className="bg-gray-900/50 p-4 rounded-lg text-left text-sm space-y-3 mb-8 border border-gray-700">
                     <p>
                        <span className="font-bold text-cyan-300">Data Provenance:</span> All workflows, data sources, and algorithms will be documented to ensure scientific reproducibility.
                    </p>
                    <p>
                        <span className="font-bold text-cyan-300">Privacy & Consent:</span> Sensitive data will not be processed or shared without explicit consent. Coordinates for sensitive sites will be masked by default.
                    </p>
                    <p>
                        <span className="font-bold text-cyan-300">Community Engagement:</span> We will engage with all stakeholders respectfully and transparently, respecting local and indigenous data governance.
                    </p>
                </div>
                
                <p className="text-xs text-gray-500 mb-8">
                   A comprehensive `ETHICS.md` document is available in the project for detailed guidelines.
                </p>

                <button
                    onClick={onClose}
                    className="px-8 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition-transform transform hover:scale-105 font-bold text-lg"
                >
                    Acknowledge & Continue
                </button>
            </div>
        </div>
    );
};

export default EthicsSplashScreen;