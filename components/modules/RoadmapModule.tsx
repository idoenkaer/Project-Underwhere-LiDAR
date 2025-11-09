import React from 'react';
import { CompassIcon } from '../icons/CompassIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { ViewfinderCircleIcon } from '../icons/ViewfinderCircleIcon';
import { WrenchScrewdriverIcon } from '../icons/WrenchScrewdriverIcon';
import { RocketIcon } from '../icons/RocketIcon';
import { DocumentSparklesIcon } from '../icons/DocumentSparklesIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { CodeBracketIcon } from '../icons/CodeBracketIcon';
import { StopwatchIcon } from '../icons/StopwatchIcon';
import { GlobeAmericasIcon } from '../icons/GlobeAmericasIcon';
import { ChatBubbleIcon } from '../icons/ChatBubbleIcon';
import { BuildingLibraryIcon } from '../icons/BuildingLibraryIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { ServerStackIcon } from '../icons/ServerStackIcon';

const FeatureListItem: React.FC<{ children: React.ReactNode; inScope: boolean }> = ({ children, inScope }) => (
    <li className="flex items-center space-x-3">
        <div className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center ${inScope ? 'bg-green-primary' : 'bg-bg-secondary'}`}>
            {inScope ? (
                <svg className="w-3 h-3 text-bg-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            ) : (
                <svg className="w-3 h-3 text-green-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            )}
        </div>
        <span className={`text-text-primary ${!inScope && 'line-through text-green-muted/50'}`}>{children}</span>
    </li>
);

const BenefitCard: React.FC<{ icon: React.FC<any>; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-bg-secondary p-6 rounded-sm border border-green-dark h-full">
        <Icon className="h-8 w-8 mb-4 text-green-bright" />
        <h3 className="text-lg font-semibold font-mono text-text-accent mb-2">{title}</h3>
        <p className="text-sm text-text-primary">{children}</p>
    </div>
);

const StrategyCard: React.FC<{ icon: React.FC<any>; title: string; description: string; targets: string[] }> = ({ icon: Icon, title, description, targets }) => (
    <div className="bg-bg-secondary p-6 rounded-sm border border-green-dark h-full flex flex-col">
        <Icon className="h-8 w-8 mb-4 text-green-bright" />
        <h3 className="text-lg font-semibold font-mono text-text-accent mb-2">{title}</h3>
        <p className="text-sm text-text-primary flex-grow">{description}</p>
        <div className="mt-4 border-t border-green-dark pt-3">
            <h4 className="text-xs font-bold text-green-muted uppercase mb-2 font-mono">TARGETS</h4>
            <ul className="text-sm text-text-primary space-y-1 font-mono">
                {targets.map(target => <li key={target}>- {target}</li>)}
            </ul>
        </div>
    </div>
);


const RoadmapModule: React.FC = () => {
    return (
        <div className="animate-fadeIn p-4 md:p-6 lg:p-8 space-y-12 max-w-5xl mx-auto">
            
            <div>
                <h2 className="text-3xl font-bold text-center font-mono text-green-bright mb-4 text-glow">Competitive Advantage: Beyond the Basics</h2>
                <p className="text-center text-text-primary mb-8 max-w-3xl mx-auto">While tools like QGIS and ArcGIS handle fundamentals, our focus is on a seamless, intelligent, and accessible workflow that accelerates science from scan to discovery.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BenefitCard icon={StopwatchIcon} title="Real-Time, In-Situ Analysis">
                        Process and visualize data directly in the field, enabling immediate decision-making and hypothesis validation without returning to the lab.
                    </BenefitCard>
                    <BenefitCard icon={DocumentSparklesIcon} title="AI-Powered Semantic Reporting">
                        Go beyond raw data. Our AI automatically identifies features, detects anomalies, and generates structured, human-readable reports and hypotheses.
                    </BenefitCard>
                    <BenefitCard icon={GlobeAmericasIcon} title="Seamless Cloud/Mobile Access">
                        A unified platform that works frictionlessly across mobile devices for field collection and cloud-powered desktops for intensive analysis.
                    </BenefitCard>
                    <BenefitCard icon={RocketIcon} title="Zero-Setup, Instant Onboarding">
                        No complex installation or configuration. Our web-native platform provides a powerful toolset accessible instantly from any modern browser.
                    </BenefitCard>
                    <BenefitCard icon={ShieldCheckIcon} title="Automatic Privacy & Compliance">
                        Ethical workflows are built-in, not bolted on. Automatic data anonymization and consent management ensure compliance from day one.
                    </BenefitCard>
                    <BenefitCard icon={CodeBracketIcon} title="Open API for Extension">
                        Built for the community. A robust API allows for custom plugins, integrations with existing tools, and community-driven feature development.
                    </BenefitCard>
                </div>
            </div>

            <div className="bg-gradient-to-br from-bg-secondary to-bg-secondary/50 p-6 rounded-sm border border-green-bright/30">
                <h3 className="text-xl font-semibold font-mono text-text-accent mb-4 flex items-center">
                    <CompassIcon className="h-6 w-6 mr-3 text-green-bright" />
                    Core Strategy: Launch in 3 Months
                </h3>
                <p className="text-text-primary">
                    To accelerate delivery and validate the core value proposition, we are pivoting to a lean MVP (Minimum Viable Product) strategy. The scope has been radically simplified to focus exclusively on the end-to-end workflow of data ingestion, basic analysis, and export.
                </p>
                <div className="mt-4 bg-green-dark/50 border-l-4 border-green-bright text-green-bright p-4 rounded-r-sm">
                    <p className="font-bold">Guiding Principle: Launch a stable, valuable tool quickly, then expand based on real user demand.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-bg-secondary p-6 rounded-sm border border-green-dark">
                    <h2 className="text-xl font-semibold font-mono text-text-accent mb-4">MVP Feature Set (3-Month Target)</h2>
                    <ul className="space-y-3">
                        <FeatureListItem inScope={true}>Multi-Sensor Data Upload & Validation</FeatureListItem>
                        <FeatureListItem inScope={true}>Core Measurement & Calibration</FeatureListItem>
                        <FeatureListItem inScope={true}>Topographical Analysis & Visualization</FeatureListItem>
                        <FeatureListItem inScope={true}>Standard Format Data Export (LAS, CSV, GeoTIFF)</FeatureListItem>
                        <FeatureListItem inScope={true}>Comprehensive Validation & Testing Suite</FeatureListItem>
                        <FeatureListItem inScope={true}>Robust Ethical Controls & User Consent</FeatureListItem>
                    </ul>
                </div>
                <div className="bg-bg-secondary p-6 rounded-sm border border-green-dark">
                    <h2 className="text-xl font-semibold font-mono text-text-accent mb-4">Post-MVP Expansion (Demand-Driven)</h2>
                    <ul className="space-y-3">
                        <FeatureListItem inScope={false}>Advanced Biological/Ecological Analysis</FeatureListItem>
                        <FeatureListItem inScope={false}>AI-Powered Discovery & Hypothesis Generation</FeatureListItem>
                        <FeatureListItem inScope={false}>Complex Physics & Structural Simulations</FeatureListItem>
                        <FeatureListItem inScope={false}>4D Space-Time Change Detection</FeatureListItem>
                        <FeatureListItem inScope={false}>Real-Time Collaboration & Annotation</FeatureListItem>
                        <FeatureListItem inScope={false}>Quantum Computing Simulations</FeatureListItem>
                    </ul>
                </div>
            </div>
            
            <div className="bg-bg-secondary p-6 rounded-sm border border-green-bright/30">
                <h3 className="text-xl font-semibold font-mono text-text-accent mb-4 flex items-center">
                    <UserGroupIcon className="h-6 w-6 mr-3 text-green-bright" />
                    Community-Led Development
                </h3>
                <p className="text-text-primary mb-4">
                    This project is a community-driven, open-source initiative. Our success depends on contributions from scientists, engineers, and designers like you. We are building in the open and invite you to help shape the future of field-ready scientific tools.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                    <a href="CONTRIBUTING.md" target="_blank" className="flex-1 p-3 bg-bg-primary text-green-bright font-mono rounded-sm border-2 border-green-dark hover:border-green-bright transition text-center flex items-center justify-center space-x-2">
                        <CodeBracketIcon className="h-5 w-5" />
                        <span>Contribution Guide</span>
                    </a>
                    <a href="#" className="flex-1 p-3 bg-bg-primary text-green-bright font-mono rounded-sm border-2 border-green-dark hover:border-green-bright transition text-center flex items-center justify-center space-x-2">
                        <ChatBubbleIcon className="h-5 w-5" />
                        <span>Join the Community</span>
                    </a>
                </div>
                <div className="mt-4 bg-green-dark/50 border-l-4 border-green-bright text-green-bright p-4 rounded-r-sm">
                    <p className="font-bold">Your expertise is our most valuable resource. Help us build the future of scientific intelligence.</p>
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-center font-mono text-green-bright mb-4 text-glow">Ecosystem & Partnership Strategy</h2>
                <p className="text-center text-text-primary mb-8 max-w-3xl mx-auto">To ensure long-term viability and accelerate development, we are actively seeking partnerships with organizations that share our open-source vision.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StrategyCard
                        icon={BuildingLibraryIcon}
                        title="Open Source Incubation"
                        description="Seeking mentorship and support from established foundations to grow our community and ensure project longevity."
                        targets={['OSGeo', 'Apache Foundation', 'Linux Foundation']}
                    />
                    <StrategyCard
                        icon={AcademicCapIcon}
                        title="Academic Collaboration"
                        description="Collaborating with university labs and research institutions to drive adoption, validate our science, and gather expert feedback."
                        targets={['Stanford University', 'MIT Media Lab', 'ETH Zürich']}
                    />
                    <StrategyCard
                        icon={ServerStackIcon}
                        title="Grants & Sponsorship"
                        description="Applying for grants and seeking corporate sponsorship to support infrastructure costs, bounties, and community events."
                        targets={['Sloan Foundation', 'CZI Science', 'Planet Labs']}
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-bg-secondary p-6 rounded-sm border border-green-dark">
                    <h3 className="text-lg font-semibold font-mono text-text-accent mb-4 flex items-center">
                        <ViewfinderCircleIcon className="h-6 w-6 mr-3 text-green-bright" />
                        Seamless End-to-End Workflow
                    </h3>
                    <p className="text-sm text-text-primary">
                        The MVP will deliver a frictionless, guided workflow from scan to export, eliminating the need for users to switch tools for core tasks. This provides immediate, tangible value.
                    </p>
                </div>
                <div className="bg-bg-secondary p-6 rounded-sm border border-green-dark">
                    <h3 className="text-lg font-semibold font-mono text-text-accent mb-4 flex items-center">
                        <WrenchScrewdriverIcon className="h-6 w-6 mr-3 text-green-bright" />
                        Backend & Interoperability
                    </h3>
                    <p className="text-sm text-text-primary">
                       Integration with backend tools like PDAL and standards like OGC will be foundational to the MVP architecture, ensuring the platform is both powerful and interoperable from day one.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoadmapModule;