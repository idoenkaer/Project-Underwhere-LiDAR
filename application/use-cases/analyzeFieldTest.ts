import { streamFromGemini } from '../../infrastructure/ai/GeminiService';
import { LogEntry } from '../../components/contexts/UIStateContext';

interface FieldTestReportData {
    duration: string;
    checklist: Record<string, boolean>;
    notes: string;
    logs: LogEntry[];
}

export const analyzeFieldTestReport = async (data: FieldTestReportData) => {
  const checklistString = Object.entries(data.checklist)
    .map(([key, value]) => `- ${key}: ${value ? 'COMPLETED' : 'PENDING'}`)
    .join('\n');
    
  const logString = data.logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');

  const prompt = `
You are a senior product manager and UX analyst for a scientific software company. Your task is to analyze a field test report and generate actionable engineering tickets.

**Field Test Report Data:**
---
**Automated Performance:**
- Time to First Result: ${data.duration} seconds

**Qualitative Checklist:**
${checklistString}

**User's Raw Notes:**
${data.notes}

**Detailed Event Log:**
${logString}
---

**Your Task:**
Based on all the provided data, generate a concise list of 3-5 specific, actionable engineering tickets in markdown format. For each ticket:
1.  Start with a category tag: \`[BUG]\`, \`[FEATURE]\`, or \`[UI/UX]\`.
2.  Provide a clear, descriptive title.
3.  Write a brief user story (e.g., "As a field scientist, I want... so that...").
4.  List 2-3 specific acceptance criteria.

**Example Format:**
\`\`\`markdown
### [UI/UX] Improve Sunlight Legibility
- **User Story:** As a field scientist, I want to be able to read key metrics in bright sunlight so that I can make decisions without needing to find shade.
- **Acceptance Criteria:**
  - All text on MetricCards must have a contrast ratio of at least 15:1 against the background.
  - Test the UI on a mobile device outdoors and confirm readability of values in the Topography module.
\`\`\`

Analyze the user's notes and the test data to identify friction points, bugs, or valuable feature suggestions. Be specific and professional.`;

  return streamFromGemini(prompt);
};
