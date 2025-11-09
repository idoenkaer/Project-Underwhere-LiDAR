import { streamFromGemini } from '../../infrastructure/ai/GeminiService';

export const explainAIAnalysis = async (query: string, response: string) => {
  const prompt = `
You are a meta-cognition AI assistant. Your task is to explain the reasoning process of another AI that generated a scientific report.

**Original User Query:**
"${query}"

**Original AI Response:**
---
${response}
---

**Your Task:**
Provide a step-by-step breakdown of how the original AI likely arrived at its conclusions. Explain the chain of thought. For example, explain how it connected the user's query to the provided scan context to generate the insights and recommendations. Where appropriate, cite hypothetical algorithm documentation (e.g., "This step is detailed in \`/docs/GeoSeg-v2.1#confidence-scoring\`).

**Structure your explanation as follows:**
1.  **Deconstruct the Query:** Identify the key terms and intent of the user's question.
2.  **Map to Scan Context:** Explain which parts of the simulated scan data were most relevant to answering the query.
3.  **Synthesize the Insight:** Describe the logical steps taken to combine the query intent with the scan data to form the scientific insights.
4.  **Justify Recommendations:** Explain how the "Recommended Next Steps" are logical follow-ups to the generated insights.

Be clear, concise, and focus on explaining the reasoning process. Use markdown for formatting.`;

  return streamFromGemini(prompt);
};