import React from 'react';
import { FlagIcon } from '../icons/FlagIcon';
import { WorkflowIcon } from '../icons/WorkflowIcon';
import { CodeBracketIcon } from '../icons/CodeBracketIcon';
import { DatabaseIcon } from '../icons/DatabaseIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { ChatBubbleIcon } from '../icons/ChatBubbleIcon';
import { PresentationChartBarIcon } from '../icons/PresentationChartBarIcon';
import { ServerStackIcon } from '../icons/ServerStackIcon';
import { CodeFileIcon } from '../icons/CodeFileIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { PuzzlePieceIcon } from '../icons/PuzzlePieceIcon';
import { ChartPieIcon } from '../icons/ChartPieIcon';
import { ChipIcon } from '../icons/ChipIcon';
import { ArrowPathIcon } from '../icons/ArrowPathIcon';
import { CircleStackIcon } from '../icons/CircleStackIcon';
import { RocketIcon } from '../icons/RocketIcon';
import { DocumentDuplicateIcon } from '../icons/DocumentDuplicateIcon';
import { PaintBrushIcon } from '../icons/PaintBrushIcon';
import { InfoIcon } from '../icons/InfoIcon';
import { ArrowDownOnSquareIcon } from '../icons/ArrowDownOnSquareIcon';
import { SquaresPlusIcon } from '../icons/SquaresPlusIcon';
import { ScaleIcon } from '../icons/ScaleIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { MagnifyingGlassIcon } from '../icons/MagnifyingGlassIcon';
import { FunnelIcon } from '../icons/FunnelIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';


enum Status {
    COMPLETED = 'Completed',
    IN_PROGRESS = 'In Progress',
    PLANNED = 'Planned',
    TESTING = 'Testing',
    READY_FOR_REVIEW = 'Ready for Review',
    REQUIRES_DATA = 'Requires Data',
    DEMOED = 'Demoed',
    BACKEND_FINALIZATION = 'Backend Finalization',
}

interface ChecklistItemProps {
    status: Status;
    children: React.ReactNode;
}

const StatusIndicator: React.FC<{ status: Status }> = ({ status }) => {
    const statusConfig = {
        [Status.COMPLETED]: {
            icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: 'text-green-400'
        },
        [Status.IN_PROGRESS]: {
            icon: <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span></span>,
            color: 'text-yellow-400'
        },
        [Status.PLANNED]: {
            icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: 'text-gray-500'
        },
        [Status.TESTING]: {
            icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>,
            color: 'text-blue-400'
        },
        [Status.READY_FOR_REVIEW]: {
            icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
            color: 'text-purple-400'
        },
        [Status.REQUIRES_DATA]: {
            icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
            color: 'text-orange-400'
        },
        [Status.DEMOED]: {
            icon: <PresentationChartBarIcon className="h-5 w-5" />,
            color: 'text-indigo-400'
        },
        [Status.BACKEND_FINALIZATION]: {
            icon: <ServerStackIcon className="h-5 w-5" />,
            color: 'text-rose-400'
        }
    };
    
    const config = statusConfig[status];

    if (!config) return null;

    return (
        <div className="flex items-center space-x-2">
            {config.icon}
            <span className={`text-sm font-medium ${config.color}`}>{status}</span>
        </div>
    );
};

const ChecklistItem: React.FC<ChecklistItemProps> = ({ status, children }) => {
    return (
        <li className="flex items-start space-x-4 py-4">
            <div>
                <StatusIndicator status={status} />
            </div>
            <div className="flex-1 text-gray-300">
                {children}
            </div>
        </li>
    );
};

const RoadmapModule: React.FC = () => {
    return (
        <div className="animate-fadeIn p-4 md:p-6 lg:p-8 space-y-8">
            <h1 className="text-3xl font-bold text-cyan-300 mb-6">Project Underwhere: Roadmap & Status</h1>
            
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Q3 Milestones</h2>
                <ul className="divide-y divide-gray-700">
                    <ChecklistItem status={Status.COMPLETED}>
                        <h3 className="font-bold">Core Lidar Sensor Fusion</h3>
                        <p className="text-sm text-gray-400">Integrate Infrared, RGB, and ToF data streams into a unified point cloud. Successfully demoed.</p>
                    </ChecklistItem>
                     <ChecklistItem status={Status.DEMOED}>
                        <h3 className="font-bold">AI Discovery Module (Gemini Integration)</h3>
                        <p className="text-sm text-gray-400">Connect UI to Gemini API for streaming analysis of scan data.</p>
                    </ChecklistItem>
                    <ChecklistItem status={Status.IN_PROGRESS}>
                        <h3 className="font-bold">Physics Simulation Module</h3>
                        <p className="text-sm text-gray-400">Implement FEA for wind and seismic stress on scanned structures. Backend finalization in progress.</p>
                    </ChecklistItem>
                    <ChecklistItem status={Status.PLANNED}>
                        <h3 className="font-bold">Quantum Simulation Module</h3>
                        <p className="text-sm text-gray-400">Develop proof-of-concept for gravitational lensing simulation based on high-mass object scans.</p>
                    </ChecklistItem>
                </ul>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <AcademicCapIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Reproducibility Standards Framework
                </h3>
                <p className="text-sm text-gray-400">
                    To ensure all scientific contributions can be verified and built upon, we are committed to a five-level reproducibility standard. This framework covers resource requirements, methodological information, randomness control (e.g., seed values), statistical validation, and ultimately, full verification of results.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <FunnelIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Point Cloud Preprocessing Pipeline
                </h3>
                <p className="text-sm text-gray-400">
                    Address critical preprocessing challenges inherent to raw Lidar data. Our pipeline will include modules for noise removal (e.g., Statistical Outlier Removal), data normalization, neighborhood selection for feature extraction, and harmonization of variable point densities to ensure data quality and consistency before analysis.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <EyeIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Explainable AI & Scientific Transparency
                </h3>
                <p className="text-sm text-gray-400">
                    To build trust and ensure scientific validity, we will integrate explainable AI (XAI) components, such as feature attribution for anomaly detection. We will also deploy model monitoring tools and explicitly document all scientific assumptions and threshold logic used in our analyses.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <ScaleIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    AI/ML Model & Data Integrity Strategy
                </h3>
                <p className="text-sm text-gray-400">
                    To ensure the scientific validity of our AI-driven analyses, we are committed to rigorous machine learning best practices. This includes utilizing diverse, well-labeled training and benchmark datasets, and focusing on model reproducibility by tracking experiment configurations and seed values. Furthermore, explicit error validation modules will be developed to simulate edge cases and measure critical performance metrics such as false positive/negative rates.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <SquaresPlusIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Geospatial & Raster Comparison Strategy
                </h3>
                <p className="text-sm text-gray-400">
                    Enable advanced scientific workflows by integrating with industry-standard geospatial tools. This includes building QGIS plugin hooks for direct visualization and annotation, and leveraging GRASS GIS or SAGA GIS for complex terrain analysis, raster overlays, and large-scale temporal change detection.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <InfoIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    First Launch Experience & Design System
                </h3>
                <p className="text-sm text-gray-400">
                    Prioritize a polished "first launch experience" with clear onboarding, a demo scan with annotated results front-and-center, and a consistent design system for all scientific outputs (overlays, heatmaps, scorecards). Enable rapid contextual help via tooltips for scientific and technical terms.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <PaintBrushIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    UI/UX Polish & Robustness
                </h3>
                <p className="text-sm text-gray-400">
                    Implement fail-safe data imports with clear validation and error feedback. Enhance visual hierarchy by accentuating primary actions and improving separation between UI sections. Controls for maps and visualizations will be persistent and intuitive. Add subtle micro-interactions to provide feedback on loading, errors, and task completion.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <DocumentDuplicateIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Mock Data & Demo Workflows
                </h3>
                <p className="text-sm text-gray-400">
                    To ensure full functionality can be tested without a live sensor, we will establish robust mock datasets (CSV, LAS) and error injection routines. This allows for the creation of realistic, interactive demo workflows for each module, showcasing core features and resilience.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <ArrowDownOnSquareIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Data Input & Processing Strategy
                </h3>
                <p className="text-sm text-gray-400">
                    Utilize the PDAL (Point Data Abstraction Library) for robust backend Lidar, LAS, and point cloud processing pipelines. Implement support for direct data imports from public APIs like the USGS Lidar Explorer Map and OpenTopography to leverage historical and public datasets for comparative analysis.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <MagnifyingGlassIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Geospatial Validation & Cross-Validation Testing
                </h3>
                <p className="text-sm text-gray-400">
                    To ensure scientific rigor, we will validate coordinate precision and elevation accuracy against published datasets. This includes testing cross-validation overlays to ensure correct spatial registration and temporal alignment with external data sources like GRASS GIS.
                </p>
            </div>
        </div>
    );
};

export default RoadmapModule;