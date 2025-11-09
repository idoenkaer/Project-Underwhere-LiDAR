

export enum Module {
  MEASUREMENT = 'Measurement',
  ENVIRONMENTAL = 'Environmental',
  TOPOGRAPHY = 'Topography',
  BIOLOGICAL = 'Biological',
  PHYSICS = 'Physics Sims',
  SPACETIME = 'Space-Time',
  AI_DISCOVERY = 'AI Discovery',
  RESEARCH = 'Collaboration',
  QUANTUM = 'Quantum',
  ROADMAP = 'Roadmap',
}

// Universal Recommendation structure
export type RecommendationPriority = 'High' | 'Medium' | 'Low';
export interface Recommendation {
    text: string;
    priority: RecommendationPriority;
}

// Data structure for Environmental Analysis Module
export interface Material {
  name: string;
  value: number;
  description: string;
  properties: Record<string, string>;
  common_uses: string;
}

// Universal Stat object for metric cards
export interface Stat {
  label: string;
  value: string;
  unit?: string;
  tooltip?: string;
}

// Structure for Explainable AI
export interface FeatureAttribution {
    feature: string;
    contribution: number; // as a percentage
}

export interface AIExplainability {
    summary: string;
    featureAttributions: FeatureAttribution[];
}

export interface EnvironmentalAnalysis {
  materialComposition: Material[];
  scanMetrics: Stat[];
  airQuality: Stat[];
  explainability: AIExplainability;
  assumptions: string;
}

// Data structure for Biological Analysis Module
export interface BiologicalAnalysis {
  canopyStats: Stat[];
  faunaStats: Stat[];
  recommendations: Recommendation[];
}

// Data structure for Topography Module
export interface TopographyAnalysis {
    recommendations: Recommendation[];
}

// Benchmark results structure
export interface BenchmarkResults {
    config: string;
    accuracy: number;
    precision: number;
    latency: number; // in ms
    memory: number; // in MB
}

// Data structure for Physics Module
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
    benchmark: BenchmarkResults;
}

export interface PhysicsAnalysis {
    scenarios: PhysicsScenario[];
}

// Data structure for Space-Time Module
export interface SpaceTimeEvent {
  month: number;
  title: string;
  description: string;
  type: 'baseline' | 'growth' | 'erosion' | 'deformation';
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
    environmental: EnvironmentalAnalysis;
    biological: BiologicalAnalysis;
    topography: TopographyAnalysis;
    physics: PhysicsAnalysis;
    spacetime: SpaceTimeAnalysis;
}