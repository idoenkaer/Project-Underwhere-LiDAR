
import React, { useState } from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { ViewfinderCircleIcon } from '../icons/ViewfinderCircleIcon';

interface OnboardingModuleProps {
    onClose: () => void;
}

const steps = [
    {
        icon: ViewfinderCircleIcon,
        title: "Step 1: Scan & Calibrate",
        description: "Your journey starts here. Simulate scanning a new area by loading our mock dataset. This calibrates all virtual sensors and prepares the data for analysis."
    },
    {
        icon: GlobeIcon,
        title: "Step 2: Topographical Analysis",
        description: "Once a scan is processed, you can explore it in the Topography module. Visualize terrain, identify geological anomalies, and run instant in-field analyses."
    },
    {
        icon: SparklesIcon,
        title: "Step 3: AI Discovery",
        description: "Go beyond raw data. Use the AI Discovery engine to ask complex questions, generate scientific hypotheses, and create publication-ready reports from your scan."
    }
];

const OnboardingModule: React.FC<OnboardingModuleProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            onClose();
        } else {
            setCurrentStep(s => s + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(s => s - 1);
        }
    };
    
    const { icon: Icon, title, description } = steps[currentStep];

    return (
        <div className="modal-overlay animate-fadeIn flex items-center justify-center p-4">
            <div className="bg-bg-secondary border border-green-dark rounded-sm shadow-2xl max-w-lg w-full p-8 text-center animate-fadeInUp">
                {currentStep === 0 && (
                    <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-green-muted/20 text-green-bright mb-6 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-text-accent mb-2 font-mono text-glow">Welcome to Project Underwhere</h1>
                        <p className="text-green-muted mb-8">A guided tour of our field-ready analysis workflow.</p>
                    </>
                )}
                
                <div className="text-left mb-8 min-h-[120px]">
                    <Icon className="h-12 w-12 text-green-bright mb-4" />
                    <h2 className="text-xl font-bold font-mono text-text-accent mb-2">{title}</h2>
                    <p className="text-sm text-text-primary/80">{description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                     <div className="flex space-x-2">
                        {steps.map((_, index) => (
                             <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentStep ? 'bg-green-bright' : 'bg-green-dark'}`}></div>
                        ))}
                     </div>
                     <div className="flex items-center space-x-4">
                        {currentStep > 0 && (
                            <button onClick={handlePrev} className="text-sm font-semibold text-green-muted hover:text-green-bright transition">
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-transparent border-2 border-green-bright text-green-bright font-mono rounded-sm uppercase tracking-wider hover:bg-green-bright hover:text-bg-primary transition-all duration-200 hover:shadow-glow-green-md"
                        >
                            {isLastStep ? "Start Demo" : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModule;
