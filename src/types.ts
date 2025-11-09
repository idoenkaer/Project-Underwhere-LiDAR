// types.ts

export enum Module {
  ROADMAP = 'Roadmap',
  SCAN_CALIBRATE = 'Scan & Calibrate',
  TOPOGRAPHY = 'Topography',
  ENVIRONMENTAL = 'Environmental',
  BIOLOGICAL = 'Biological',
  PHYSICS = 'Physics',
  SPACETIME = '4D Spacetime',
  QUANTUM = 'Quantum Simulation',
  AI_DISCOVERY = 'AI Discovery',
  EXPORT_SHARE = 'Export & Share',
  VALIDATION = 'Validation',
  ACTIVITY = 'Activity',
  PLUGINS = 'Plugins',
  FIELD_TEST = 'Field Test',
  DEBUG = 'Debug',
  SETTINGS = 'Settings',
}

// Universal Recommendation structure
export type RecommendationPriority = 'High' | 'Medium' | 'Low';
export interface Recommendation {
    text: string;
    priority: RecommendationPriority;
}

// Universal Stat object for metric cards
export interface Stat {
  label: string;
  value: string;
  unit?: string;
  tooltip?: string;
  status?: 'good' | 'warning' | 'critical';
}

// Alert structure for toast notifications
export interface Alert {
    id: number;
    message: string;
    type: 'error' | 'warning' | 'info';
}

// Structure for logging analysis runs for reproducibility
export interface AnalysisRun {
    timestamp: string;
    module: string;
    parameters: object;
}

// Universal payload for navigating between modules
export type ModulePayload = Record<string, any>;

// Accessibility types
export type FontSize = 'sm' | 'base' | 'lg';

// Batch file processing status
export type BatchFileStatus = {
    id: number;
    name: string;
    size: number;
    status: 'pending' | 'validating' | 'processing' | 'processed' | 'error';
    error?: string;
};


// Data structure for Topography Module
export interface TopographyAnalysis {
    recommendations: Recommendation[];
}

// Data structure for Environmental Module
export interface EnvironmentalAnalysis {
    materialComposition: {
        name: string;
        value: number;
        description: string;
        properties: Record<string, string>;
        common_uses: string;
    }[];
    scanMetrics: Stat[];
    airQuality: Stat[];
    explainability: {
        summary: string;
        featureAttributions: {
            feature: string;
            contribution: number;
        }[];
    };
    assumptions: string;
}

// Data structure for Biological Module
export interface BiologicalAnalysis {
    canopyStats: Stat[];
    faunaStats: Stat[];
    recommendations: Recommendation[];
}

// Data structure for Physics Module
export interface BenchmarkResults {
    config: string;
    accuracy: number;
    precision: number;
    latency: number;
    memory: number;
}

export type PhysicsWindDirection = 'N' | 'E' | 'S' | 'W';

export interface PhysicsScenario {
    id: string;
    windSpeed: number;
    windDirection: PhysicsWindDirection;
    results: {
        stress: number;
        deformation: number;
        integrity: number;
    };
    recommendations: Recommendation[];
    benchmark?: BenchmarkResults;
}

export interface PhysicsAnalysis {
    scenarios: PhysicsScenario[];
}

// Data structure for Spacetime Module
export type SpaceTimeEventType = 'baseline' | 'growth' | 'erosion' | 'deformation';

export interface SpaceTimeEvent {
    month: number;
    title: string;
    description: string;
    type: SpaceTimeEventType;
}

export interface SpaceTimeAnalysis {
    events: SpaceTimeEvent[];
}

export interface Activity {
    id: string;
    user: string;
    action: string;
    timestamp: string;
}

export interface AppNotification {
    id: string;
    read: boolean;
    text: string;
    timestamp: string;
}

export interface PluginVetting {
    status: 'Verified' | 'Community' | 'Experimental';
    security: { passed: boolean; details: string; };
    quality: { score: number; details: string; };
    peerReview: { status: 'Complete' | 'Pending' | 'Not Submitted'; details: string; };
}

export interface Plugin {
    id: string;
    name: string;
    author: string;
    version: string;
    description: string;
    installed: boolean;
    vetting: PluginVetting;
}


// Root database structure
export interface ScanMetadata {
    id: string;
    timestamp: string;
    location: string;
}

export interface ScientificDatabase {
    scanMeta: ScanMetadata;
    topography: TopographyAnalysis;
    environmental: EnvironmentalAnalysis;
    biological: BiologicalAnalysis;
    physics: PhysicsAnalysis;
    spacetime: SpaceTimeAnalysis;
    activity: Activity[];
    notifications: AppNotification[];
    plugins: Plugin[];
}

export interface Command {
  id: string;
  label: string;
  action: () => void;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  category: string;
}

export interface Snapshot {
    timestamp: string;
    note: string;
    state: {
      database: ScientificDatabase;
      analysisRuns: AnalysisRun[];
    };
}
