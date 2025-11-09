// types.ts

// FIX: Added missing type definitions for various modules and updated ScientificDatabase.
export enum Module {
  ROADMAP = 'Roadmap',
  SCAN_CALIBRATE = 'Scan & Calibrate',
  TOPOGRAPHY = 'Topography',
  AI_DISCOVERY = 'AI Discovery',
  EXPORT_SHARE = 'Export & Share',
  VALIDATION = 'Validation',
  DEBUG = 'Debug',
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
}