import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
export let isConfigured = false;
export let configurationError: string | null = null;

try {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    ai = new GoogleGenAI({ apiKey: API_KEY });
    isConfigured = true;
} catch (e) {
    console.error("Failed to initialize GoogleGenAI:", e);
    configurationError = (e as Error).message;
    ai = null;
    isConfigured = false;
}

export const streamAIResponse = async (userInput: string) => {
  if (!ai || !isConfigured) {
    throw new Error("Gemini AI service is not configured.");
  }

  const prompt = `You are a world-class scientific research assistant AI. You are analyzing a complex, multi-layered Lidar scan of an area. Based on this (hypothetical) data, provide a structured and insightful answer to the following user query.

User Query: "${userInput}"

Your response MUST be formatted in markdown and MUST include the following sections:
1.  **Direct Analysis:** A concise interpretation of the scan data relevant to the query.
2.  **Suggested Hypotheses:** 2-3 novel research hypotheses that could be investigated based on the analysis.
3.  **Relevant Literature (Hypothetical):** A list of 2-3 fictional but plausible-sounding academic paper titles that would be relevant to this research. For example: "Smith, J. (2022). 'Advanced Spectral Analysis of Subsurface Geological Formations.' Journal of Geophysical Research."

Structure your entire response clearly using markdown headings for each section.`;

  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return responseStream;
};