import { streamFromGemini } from '../../infrastructure/ai/GeminiService';

export const streamAIDiscovery = async (userInput: string) => {
  const prompt = `You are a world-class geospatial analyst AI. Your task is to analyze the results from a Lidar scan and provide a semantic report.

**Scan Context:**
- **File:** \`scan_dataset_0A4F.las\`
- **Location:** Coastal Range, CA
- **Simulated Segmentation Output:** The scan has been processed, revealing distinct clusters corresponding to:
    1.  **Dense Coniferous Forest:** High point density, significant canopy structure.
    2.  **Exposed Silicate Rock:** High reflectivity, low vegetation signature.
    3.  **Topographical Anomaly:** A sharp, linear depression consistent with a fault line.
    4.  **Moisture Concentration Zone:** High spectral absorption indicative of a potential spring or water flow path.

**User Query:** "${userInput}"

Based on the scan context and the user query, generate a concise, publication-ready report in markdown. 

Your response MUST be formatted in markdown and begin with a metadata block. The report MUST include the following sections:

### Analysis Metadata
- **Primary Model:** [Simulated model name, e.g., GeoSeg-v2.1]
- **Language Model:** Gemini-2.5-Flash
- **Key Parameters:** [Simulated parameters, e.g., {segmentation_threshold: 0.7}]
- **Overall Confidence:** [A percentage, e.g., 92%]
---

1.  **Key Feature Segmentation:** Briefly describe the main classified features from the scan.
2.  **Direct Answer to Query:** Directly address the user's question based on the data.
3.  **Potential Scientific Insights:** Propose 2-3 novel insights or hypotheses. **For each insight, include a confidence score (e.g., Confidence: 85%).**
4.  **Recommended Next Steps:** Suggest 2 concrete actions a field researcher could take to validate these insights.
5.  **Model & Data Citations:** Include a section citing the simulated models and data sources used (e.g., "Segmentation Model: GeoSeg-v2.1", "Data Source: USGS 3DEP Lidar").

Structure your entire response clearly using markdown headings for each section. Be concise and professional.`;

  return streamFromGemini(prompt);
};