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
import { TagIcon } from '../icons/TagIcon';
import { StopwatchIcon } from '../icons/StopwatchIcon';
import { Square2StackIcon } from '../icons/Square2StackIcon';
import { CloudArrowUpIcon } from '../icons/CloudArrowUpIcon';
import { ChartTrendingUpIcon } from '../icons/ChartTrendingUpIcon';
import { BugAntIcon } from '../icons/BugAntIcon';
import { ServerIcon } from '../icons/ServerIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { GlobeAmericasIcon } from '../icons/GlobeAmericasIcon';
import { WrenchScrewdriverIcon } from '../icons/WrenchScrewdriverIcon';
import { BuildingLibraryIcon } from '../icons/BuildingLibraryIcon';
import { ArrowPathRoundedSquareIcon } from '../icons/ArrowPathRoundedSquareIcon';
import { ShieldAlertIcon } from '../icons/ShieldAlertIcon';


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
                    <WorkflowIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Architectural Design Pattern
                </h3>
                <p className="text-sm text-gray-400">
                    The application is structured using the **Clean Architecture** pattern to ensure maintainability and separation of concerns. This creates clear boundaries: the **UI Layer** (`/components`) is decoupled from the **Application Layer** (`/application/use-cases`), which contains all business logic. The Application Layer, in turn, depends on abstract repository interfaces, with concrete implementations (like data access and external API calls) residing in the **Infrastructure Layer** (`/infrastructure`). This design makes the system independently testable and adaptable to future changes in technology or requirements.
                </p>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <BugAntIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Multi-Layered Testing Strategy
                </h3>
                <p className="text-sm text-gray-400">
                    To make testing a first-class citizen, we've implemented an **interactive Validation module**. This suite allows for the simulated execution of **automated regression tests** to prevent new features from breaking existing workflows, **performance benchmarks** to monitor processing latency and resource usage, and **accuracy validation** to compare model outputs against ground-truth datasets. This is supplemented by a planned strategy for traditional unit, integration, and E2E tests.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <WrenchScrewdriverIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Backend Integration & Processing Pipelines
                </h3>
                <p className="text-sm text-gray-400">
                    To handle mission-grade data at scale, we will integrate with industry-standard backend tools. This includes leveraging the **PDAL (Point Data Abstraction Library)** for robust Lidar processing pipelines and the **LROSE (Lidar Radar Open Software Environment)** for future radar data integration. This ensures our data processing is both powerful and interoperable with established scientific workflows.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <ServerIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Scalability & Cloud Architecture
                </h3>
                <p className="text-sm text-gray-400">
                    To ensure mission-grade scalability and cost-effective operation, we are planning a cloud-native architecture. This includes a data compression strategy (e.g., LAZ format for Lidar), a distributed processing plan using serverless functions or container orchestration for large-scale analysis, and a comprehensive disaster recovery strategy with geo-redundant storage and automated backups.
                </p>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <GlobeAmericasIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Ethical Framework & Community Engagement
                </h3>
                <p className="text-sm text-gray-400">
                    To ensure responsible innovation, we are establishing a comprehensive ethical framework. This includes protocols for data privacy, minimizing the environmental impact of field operations, and a commitment to active stakeholder engagement. We will prioritize collaboration with local and indigenous communities, ensuring our research respects their rights, knowledge, and contributes positively to their environment.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <ArrowPathRoundedSquareIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Data Science Lifecycle (DSLP)
                </h3>
                <p className="text-sm text-gray-400">
                    We are adopting the Data Science Lifecycle Process (DSLP) framework to ensure a structured and rigorous approach to all AI/ML development. This multi-phase process covers everything from initial scientific understanding and data acquisition to model deployment, monitoring, and iteration, ensuring our results are robust and reproducible.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <BuildingLibraryIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Project Governance & Coordination
                </h3>
                <p className="text-sm text-gray-400">
                    A formal governance model is being established to guide the project's strategic direction and ensure effective collaboration. This includes defining roles for Core Maintainers, establishing a Scientific Advisory Board for expert review, and creating clear protocols for communication and decision-making across interdisciplinary teams.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <ShieldAlertIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Risk Management Framework
                </h3>
                <p className="text-sm text-gray-400">
                    To ensure project resilience, we are implementing a proactive risk management framework. This involves maintaining a formal risk register to systematically identify, assess, and mitigate potential technical, scientific, and operational risks throughout the project lifecycle, from data acquisition ethics to model validation.
                </p>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <ChartTrendingUpIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    AI-Powered Predictive Modeling
                </h3>
                <p className="text-sm text-gray-400">
                    Move beyond static analysis by implementing AI-driven change detection between sequential Lidar scans. The goal is to develop predictive models for environmental impacts, such as forecasting erosion patterns or vegetation succession.
                </p>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <PuzzlePieceIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Extensible & Modular Architecture
                </h3>
                <p className="text-sm text-gray-400">
                    Commitment to a flexible, plugin-based system. This initiative will focus on creating a clear API that allows for the seamless integration of future modules, new sensor types (like Ground-Penetrating Radar or Hyperspectral imagers), and custom, mission-specific workflows.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <RocketIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    NASA Collaboration & Interoperability
                </h3>
                <p className="text-sm text-gray-400">
                    Align the project with NASA standards by benchmarking against published datasets (ICESat, Landsat), enhancing spatial referencing (WGS84/UTM) with full scientific provenance, developing custom modules for specialized workflows like planetary mapping and atmospheric Lidar, and coordinating with NASA's Earth Science teams for validation and pilot studies.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <CloudArrowUpIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Open Science & Data Federation
                </h3>
                <p className="text-sm text-gray-400">
                    Enhance the project's scientific impact by integrating with key external platforms. This includes building connectors to NASA Earthdata for satellite imagery comparison, OpenTopography for accessing public high-resolution terrain data, and open science archives like Zenodo to ensure research outputs are citable, discoverable, and preserved for the long term.
                </p>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <MagnifyingGlassIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Geospatial Validation & Ground-Truthing
                </h3>
                <p className="text-sm text-gray-400">
                    To ensure survey-grade accuracy and scientific rigor, we are establishing documented ground-truthing protocols. This involves field validation using high-precision GPS/RTK equipment to create benchmarks. These benchmarks will be used to validate the coordinate precision and elevation accuracy of our Lidar outputs, ensuring they meet the highest standards before cross-validation against published datasets or external sources like GRASS GIS.
                </p>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <PuzzlePieceIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Geospatial Data Standards & Interoperability
                </h3>
                <p className="text-sm text-gray-400">
                    Implement and document support for global geospatial standards. This includes ensuring all data services adhere to OGC protocols (WMS, WFS), standardizing on WGS84/UTM spatial references, and producing standard-compliant outputs like GeoTIFF, LAS 1.4, and netCDF. We will facilitate easy data exchange with leading platforms (QGIS, CloudCompare, PDAL) by publishing our demo datasets as open data and providing example integration scripts and connectors. This approach ensures our data is not only standard-compliant but also highly accessible to the broader scientific community.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <StopwatchIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Comprehensive Performance Benchmarking
                </h3>
                <p className="text-sm text-gray-400">
                    Establish rigorous performance baselines for all AI models and data processing pipelines using standardized metrics. This includes classification accuracy, boundary precision, processing latency, and memory consumption, evaluated across different hardware configurations to ensure real-world viability and scientific reliability.
                </p>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <TagIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    AI/ML Training & Supervision Strategy
                </h3>
                <p className="text-sm text-gray-400">
                    Acknowledging the resource-intensive nature of manual Lidar annotation, our strategy is to mitigate this bottleneck by adopting advanced training methodologies. We will investigate and implement weak supervision, semi-supervised, and self-supervised learning approaches to effectively leverage unlabeled data and reduce dependency on fully annotated datasets.
                </p>
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
                    Comprehensive Documentation
                </h3>
                <p className="text-sm text-gray-400">
                    To ensure accessibility for both scientists and developers, we are committed to creating comprehensive documentation. This includes detailed user guides for all modules, tutorials for common scientific workflows, and a formal API specification for the future plugin architecture. All documentation will be versioned and publicly accessible.
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
                    <UserGroupIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    User-Centric Design & Workflow Analysis
                </h3>
                <p className="text-sm text-gray-400">
                    To ensure the platform meets the real-world needs of scientists, we are launching a dedicated user research initiative. This involves creating detailed user personas (e.g., Field Geologist, Lab Analyst), mapping their end-to-end workflows from data acquisition to publication, and conducting iterative usability testing sessions. The goal is to refine the UI/UX to directly support and accelerate established scientific processes, preventing user frustration and ensuring high adoption.
                </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <Square2StackIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Scalable State Management
                </h3>
                <p className="text-sm text-gray-400">
                    Refactored the application's core state management by splitting the global `AppContext` into two distinct, focused contexts: `UIStateContext` for dynamic interface state and `DataContext` for stable scientific data. This separation improves performance by reducing unnecessary re-renders and establishes a more scalable and maintainable architecture for future feature development using libraries like Zustand or Jotai.
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
                    <CircleStackIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Mission-Grade Geolocation & Metadata
                </h3>
                <p className="text-sm text-gray-400">
                    Implement mission-grade data protocols by integrating RTK/PPK for survey-level positional accuracy. This initiative includes adopting standardized metadata schemas (e.g., ISO 19115) for all captured data, ensuring robust spatial referencing, and preparing datasets for long-term, interoperable archival in accordance with industry standards like STANAG 4545.
                </p>
            </div>

        </div>
    );
};

export default RoadmapModule;