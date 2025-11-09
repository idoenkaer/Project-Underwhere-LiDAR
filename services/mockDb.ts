import { ScientificDatabase } from '../types';

export const db: ScientificDatabase = {
  scanMeta: {
    id: 'scan_dataset_0A4F',
    timestamp: '2024-07-15T10:30:00Z',
    location: 'Coastal Range, CA',
  },
  environmental: {
    materialComposition: [
      { name: 'Silicate Rock', value: 70, description: 'Crystalline compounds based on silica (SiO2). Forms the bulk of Earth\'s crust. High density and thermal resistance.', properties: { density: '2.6-3.3 g/cm³', conductivity: 'Low' }, common_uses: 'Construction (concrete, bricks), glassmaking, geology samples.' },
      { name: 'Organic Matter', value: 15, description: 'Carbon-based compounds from living organisms. Key component of soil, affecting fertility and water retention.', properties: { density: '0.8-1.4 g/cm³', conductivity: 'Very Low' }, common_uses: 'Agriculture (compost, soil amendment), biofuels, carbon sequestration studies.' },
      { name: 'Moisture', value: 10, description: 'Water (H2O) present in the scanned sample. Detected via spectral and thermal analysis. Affects material stability and biological activity.', properties: { density: '1.0 g/cm³', conductivity: 'Variable' }, common_uses: 'Hydrological modeling, material stability analysis, biological habitat assessment.' },
      { name: 'Trace Metals', value: 5, description: 'Small quantities of metallic elements (e.g., Iron, Copper). Detected via high-resolution spectral analysis. Can indicate mineralization.', properties: { density: 'Variable', conductivity: 'High' }, common_uses: 'Mining exploration, environmental contamination studies, alloy development.' },
    ],
    scanMetrics: [
      { label: 'Humidity', value: '65.2', unit: '%' },
      { label: 'Ambient Temp.', value: '18.5', unit: '°C' },
      { label: 'Reflectivity', value: '0.8', unit: 'Albedo', tooltip: 'The proportion of the incident light or radiation that is reflected by a surface, typically that of a planet or moon.' },
      { label: 'Est. Density', value: '2.1', unit: 'g/cm³' },
    ],
    airQuality: [
      { label: 'PM2.5', value: '12', unit: 'µg/m³', tooltip: 'Fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller. An indicator of air pollution.' },
      { label: 'Ozone (O₃)', value: '35', unit: 'ppb' },
      { label: 'VOCs', value: '210', unit: 'ppb' },
    ],
    explainability: {
        summary: 'The elevated VOC reading is the primary air quality anomaly.',
        featureAttributions: [
            { feature: 'High spectral signature of organic compounds', contribution: 75 },
            { feature: 'Localized thermal anomalies (off-gassing)', contribution: 25 },
        ]
    },
    assumptions: 'Air quality alerts are triggered based on EPA guidelines: PM2.5 > 12 µg/m³, Ozone > 55 ppb, VOCs > 150 ppb.'
  },
  biological: {
    canopyStats: [
        { label: "Avg. Canopy Height", value: "28.5 m" },
        { label: "Total Canopy Cover", value: "72.3 %" },
        { label: "Leaf Area Index (LAI)", value: "4.1", tooltip: "A dimensionless quantity that characterizes plant canopies. It is defined as the one-sided green leaf area per unit ground surface area." },
        { label: "Understory Density", value: "Moderate" },
    ],
    faunaStats: [
        { label: "Estimated Population", value: "14" },
        { label: "Avg. Body Mass (Est.)", value: "350 kg" },
        { label: "Density (Sector Beta)", value: "5.6/km²" },
        { label: "Primary Species", value: "Elk" },
    ],
    recommendations: [
        { text: 'Monitor Sector Beta for changes in fauna population density over the next quarter.', priority: 'Medium' },
        { text: 'Investigate the moderate understory density to ensure it provides sufficient cover for juvenile fauna.', priority: 'Low' },
    ]
  },
  topography: {
    recommendations: [
        { text: 'Conduct field verification of the detected fault line (FL-01) to assess its geological significance.', priority: 'High' },
        { text: 'Implement erosion control measures in Anomaly Zone Alpha to mitigate further land degradation.', priority: 'Medium' },
        { text: 'Use the generated hydrological model for further geotechnical and environmental impact studies.', priority: 'Low' },
    ]
  },
  physics: {
    scenarios: [
        {
            id: 'wind-90-w',
            windSpeed: 90,
            windDirection: 'W',
            results: { stress: 65, deformation: 5.4, integrity: 95.7 },
            recommendations: [
                { text: 'Structure is stable under current conditions. No immediate action required.', priority: 'Low' }
            ]
        },
        {
            id: 'wind-180-w',
            windSpeed: 180,
            windDirection: 'W',
            results: { stress: 260, deformation: 10.8, integrity: 88.2 },
            recommendations: [
                { text: 'Physical inspection of primary arch connection is recommended due to high stress concentration.', priority: 'Medium' },
                { text: 'Monitor for material fatigue if high-wind events are frequent.', priority: 'Medium' },
            ]
        },
        {
            id: 'wind-250-e',
            windSpeed: 250,
            windDirection: 'E',
            results: { stress: 451, deformation: 30.2, integrity: 64.1 },
            recommendations: [
                { text: 'Immediate structural reinforcement is required at identified critical stress points.', priority: 'High' },
                { text: 'Risk of cascading failure under sustained load. Limit structural access until remediation is complete.', priority: 'High' },
            ]
        }
    ]
  },
  spacetime: {
    events: [
      { month: 0, title: 'Baseline Scan', description: 'Initial high-resolution scan of the area establishes the baseline for all future analysis.', type: 'baseline' },
      { month: 2, title: 'Vegetation Growth', description: 'Noticeable increase in canopy density in Sector Alpha.', type: 'growth' },
      { month: 5, title: 'Minor Erosion Event', description: 'Rill erosion detected on the northern slope after heavy rainfall.', type: 'erosion' },
      { month: 8, title: 'Land Deformation', description: '0.5cm subsidence detected near the primary fault line.', type: 'deformation' },
      { month: 11, title: 'Seasonal Foliage Change', description: 'Deciduous foliage shows significant change, impacting surface reflectivity.', type: 'growth' },
    ]
  }
};