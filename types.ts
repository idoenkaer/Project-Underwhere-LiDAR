// FIX: Added missing type definitions for various data modules and updated the root ScientificDatabase interface.
export enum Module {
  ROADMAP = 'Roadmap',
  MEASUREMENT = 'Measurement',
  TOPOGRAPHY = 'Topography',
  EXPORT_SHARE = 'Export & Share',
  VALIDATION = 'Validation',
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
}

// Data structure for Topography Module
export interface TopographyAnalysis {
    recommendations: Recommendation[];
}

// Data structure for Environmental Module
interface Material {
    name: string;
    value: number;
    description: string;
    properties: { [key: string]: string };
    common_uses: string;
}

interface FeatureAttribution {
    feature: string;
    contribution: number;
}

export interface EnvironmentalAnalysis {
    materialComposition: Material[];
    scanMetrics: Stat[];
    airQuality: Stat[];
    explainability: {
        summary: string;
        featureAttributions: FeatureAttribution[];
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

export interface PhysicsScenario {
    id: string;
    windSpeed: number;
    windDirection: 'N' | 'E' | 'S' | 'W';
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

// Data structure for SpaceTime Module
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
