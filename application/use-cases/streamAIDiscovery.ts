import { streamFromGemini } from '../../infrastructure/ai/GeminiService';

export const streamAIDiscovery = async (userInput: string) => {
  const prompt = `You are a world-class scientific research assistant AI. You are analyzing a complex, multi-layered Lidar scan of an area. Based on this (hypothetical) data, provide a structured and insightful answer to the following user query.

User Query: "${userInput}"

Your response MUST be formatted in markdown and MUST include the following sections:
1.  **Direct Analysis:** A concise interpretation of the scan data relevant to the query.
2.  **Suggested Hypotheses:** 2-3 novel research hypotheses that could be investigated based on the analysis.
3.  **Relevant Literature (Hypothetical):** A list of 2-3 fictional but plausible-sounding academic paper titles that would be relevant to this research. For example: "Smith, J. (2022). 'Advanced Spectral Analysis of Subsurface Geological Formations.' Journal of Geophysical Research."

Structure your entire response clearly using markdown headings for each section.`;

  return streamFromGemini(prompt);
};
