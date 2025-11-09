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

export const streamFromGemini = async (prompt: string) => {
  if (!ai || !isConfigured) {
    throw new Error("Gemini AI service is not configured.");
  }
  
  try {
    const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return responseStream;
  } catch (error) {
     console.error("Error during Gemini API call:", error);
     throw new Error(`The AI service failed to process the request. Please check the console for details.`);
  }

};