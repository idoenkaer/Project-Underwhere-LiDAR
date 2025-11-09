import React from 'react';
import { DocumentCheckIcon } from '../icons/DocumentCheckIcon';

interface EthicsSplashScreenProps {
    onClose: () => void;
}

const EthicsSplashScreen: React.FC<EthicsSplashScreenProps> = ({ onClose }) => {
    return (
        <div className="modal-overlay animate-fadeIn flex items-center justify-center p-4">
            <div className="bg-bg-secondary border border-green-dark rounded-sm shadow-2xl max-w-2xl w-full p-8 text-center animate-fadeInUp">
                <DocumentCheckIcon className="h-16 w-16 text-green-bright mb-6 mx-auto" />
                <h1 className="text-3xl font-bold text-text-accent mb-4 font-mono text-glow">Commitment to Responsible Innovation</h1>
                <p className="text-green-muted mb-6">
                    This application is a powerful scientific tool. By proceeding, you acknowledge and agree to uphold its ethical principles.
                </p>

                <div className="bg-bg-primary/50 p-4 rounded-sm text-left text-sm space-y-3 mb-8 border border-green-dark">
                     <p>
                        <span className="font-bold text-green-bright">Data Provenance:</span> All workflows, data sources, and algorithms will be documented to ensure scientific reproducibility.
                    </p>
                    <p>
                        <span className="font-bold text-green-bright">Privacy & Consent:</span> Sensitive data will not be processed or shared without explicit consent. Coordinates for sensitive sites will be masked by default.
                    </p>
                    <p>
                        <span className="font-bold text-green-bright">Community Engagement:</span> We will engage with all stakeholders respectfully and transparently, respecting local and indigenous data governance.
                    </p>
                </div>
                
                <p className="text-xs text-green-muted/80 mb-8 font-mono">
                   A comprehensive `ETHICS.md` document is available in the project for detailed guidelines.
                </p>

                <button
                    onClick={onClose}
                    className="px-8 py-3 bg-transparent border-2 border-green-bright text-green-bright font-mono rounded-sm uppercase tracking-wider hover:bg-green-bright hover:text-bg-primary transition-all duration-200 hover:shadow-glow-green-md"
                >
                    Acknowledge & Continue
                </button>
            </div>
        </div>
    );
};

export default EthicsSplashScreen;