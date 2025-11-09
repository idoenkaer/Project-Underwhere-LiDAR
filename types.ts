

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
    spacetime: SpaceTimeAnalysis;
}