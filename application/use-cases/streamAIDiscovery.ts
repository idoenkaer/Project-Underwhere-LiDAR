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

Based on the scan context and the user query, generate a concise, publication-ready report in markdown. The report MUST include these sections:
1.  **Key Feature Segmentation:** Briefly describe the main classified features from the scan.
2.  **Direct Answer to Query:** Directly address the user's question based on the data.
3.  **Potential Scientific Insights:** Propose 2-3 novel insights or hypotheses that emerge from combining the segmented features.
4.  **Recommended Next Steps:** Suggest 2 concrete actions a field researcher could take to validate these insights.

Structure your entire response clearly using markdown headings for each section. Be concise and professional.`;

  return streamFromGemini(prompt);
};