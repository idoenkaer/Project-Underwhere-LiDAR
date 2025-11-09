import React, { useState } from 'react';
import { useUIStateContext } from '../contexts/UIStateContext';
import { Card } from '../common/Card';
import { StopwatchIcon } from '../icons/StopwatchIcon';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { DownloadIcon } from '../icons/DownloadIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { SunIcon } from '../icons/SunIcon';
import { HandRaisedIcon } from '../icons/HandRaisedIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { analyzeFieldTestReport } from '../../application/use-cases/analyzeFieldTest';
import { SimpleMarkdown } from '../common/SimpleMarkdown';

const ChecklistItem: React.FC<{
    isChecked: boolean,
    onToggle: () => void,
    icon: React.FC<any>,
    children: React.ReactNode
}> = ({ isChecked, onToggle, icon: Icon, children }) => (
    <li className="flex items-center space-x-4 p-3 bg-bg-primary/50 rounded-sm">
        <Icon className={`h-6 w-6 flex-shrink-0 ${isChecked ? 'text-green-primary' : 'text-green-muted'}`} />
        <span className={`flex-1 text-sm ${isChecked ? 'line-through text-green-muted/80' : 'text-text-primary'}`}>{children}</span>
        <button
            onClick={onToggle}
            className={`w-20 text-xs font-bold py-1 rounded-sm transition ${
                isChecked ? 'bg-green-dark text-green-primary' : 'bg-green-muted/80 text-bg-primary hover:bg-green-bright'
            }`}
        >
            {isChecked ? 'Tested' : 'Mark Done'}
        </button>
    </li>
);

const FieldTestModule: React.FC = () => {
    const { logs, testStartTime, testEndTime, addLog } = useUIStateContext();
    const [qualitativeNotes, setQualitativeNotes] = useState('');
    const [qualitativeChecklist, setQualitativeChecklist] = useState({
        sunlight: false,
        oneHanded: false,
        workflowValue: false,
        aiValue: false,
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const isMounted = React.useRef(true);

    React.useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const handleToggleChecklist = (key: keyof typeof qualitativeChecklist) => {
        setQualitativeChecklist(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            addLog(`Field test checklist item '${key}' marked as ${newState[key] ? 'complete' : 'incomplete'}.`);
            return newState;
        });
    };

    const duration = testEndTime && testStartTime ? ((testEndTime - testStartTime) / 1000) : null;
    const testSuccess = duration !== null && duration < 90;

    const handleRunAIAnalysis = async () => {
        if (!qualitativeNotes.trim()) {
            setAnalysisError("Please provide some qualitative notes before running the analysis.");
            return;
        }
        setIsAnalyzing(true);
        setAiAnalysis('');
        setAnalysisError(null);
        addLog("AI analysis of field test report initiated.");

        try {
            const reportData = {
                duration: duration ? duration.toFixed(2) : 'N/A',
                checklist: qualitativeChecklist,
                notes: qualitativeNotes,
                logs,
            };
            const responseStream = await analyzeFieldTestReport(reportData);
            for await (const chunk of responseStream) {
                if (isMounted.current) {
                    setAiAnalysis(prev => prev + chunk.text);
                }
            }
        } catch (e) {
            const err = e as Error;
            setAnalysisError(`AI analysis failed: ${err.message}`);
            addLog(`AI analysis error: ${err.message}`);
        } finally {
            if (isMounted.current) {
                setIsAnalyzing(false);
                addLog("AI analysis finished.");
            }
        }
    };

    const handleExport = () => {
        const durationString = duration ? `${duration.toFixed(2)} seconds` : 'Test not completed';
        const checklistString = Object.entries(qualitativeChecklist).map(([key, value]) => `- ${key}: ${value ? 'COMPLETED' : 'PENDING'}`).join('\n');

        const logContent = [
            `FIELD TEST REPORT - ${new Date().toISOString()}`,
            '========================================',
            '',
            'PHASE 1: AUTOMATED ONBOARDING METRICS',
            '----------------------------------------',
            `Time to First Result: ${durationString}`,
            `Success (< 90s): ${duration === null ? 'N/A' : (testSuccess ? 'PASS' : 'FAIL')}`,
            '',
            'PHASE 2: GUIDED QUALITATIVE TEST CHECKLIST',
            '----------------------------------------',
            checklistString,
            '',
            'PHASE 3: QUALITATIVE FEEDBACK & NOTES',
            '----------------------------------------',
            qualitativeNotes || 'No notes provided.',
            '',
            'PHASE 4: AI-GENERATED ACTIONABLE INSIGHTS',
            '----------------------------------------',
            aiAnalysis || 'AI analysis not performed.',
            '',
            'DETAILED EVENT LOG',
            '----------------------------------------',
            ...logs.map(log => `[${log.timestamp}] ${log.message}`)
        ].join('\n');

        const blob = new Blob([logContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `field-test-report-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addLog('Field test log exported.');
    };

    return (
        <div className="animate-fadeIn space-y-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold font-mono text-green-bright text-glow">Automated Field Test Protocol</h1>
            
            <Card icon={ClipboardListIcon} title="Phase 1: 90-Second Challenge (Automated)">
                <p className="text-sm text-text-primary mb-4">
                    The timer starts on app load and stops when the first analysis result is delivered. This measures the core "Zero-Setup, Instant Onboarding" workflow.
                </p>
                {duration !== null ? (
                     <div className="text-center bg-bg-primary/50 p-4 rounded-sm">
                        <p className="text-sm text-green-muted">TIME TO FIRST RESULT</p>
                        <p className="text-6xl font-mono text-green-bright my-2">{duration.toFixed(2)}s</p>
                        <div className={`inline-block px-4 py-1 rounded-full font-bold text-sm ${testSuccess ? 'bg-green-primary/20 text-green-primary' : 'bg-error/20 text-error'}`}>
                            {testSuccess ? 'SUCCESS (< 90s)' : 'FAIL (>= 90s)'}
                        </div>
                     </div>
                ) : (
                    <div className="text-center text-green-muted py-8 bg-bg-primary/50 p-4 rounded-sm">
                        <p>Test in progress...</p>
                        <p className="text-xs">Follow the onboarding and run an analysis to see results.</p>
                    </div>
                )}
            </Card>

            <Card icon={CheckIcon} title="Phase 2: Ergonomics & Value Test (Guided)">
                <p className="text-sm text-text-primary mb-4">
                    Perform these actions in a real-world environment and mark each as complete. Your feedback here is critical for improving the in-field user experience.
                </p>
                <ul className="space-y-2">
                    <ChecklistItem isChecked={qualitativeChecklist.sunlight} onToggle={() => handleToggleChecklist('sunlight')} icon={SunIcon}>
                        **Sunlight Readability:** View the Topography and AI Discovery modules in bright, direct sunlight.
                    </ChecklistItem>
                     <ChecklistItem isChecked={qualitativeChecklist.oneHanded} onToggle={() => handleToggleChecklist('oneHanded')} icon={HandRaisedIcon}>
                        **One-Handed Operation:** Navigate the full workflow from Scan to Topography analysis using only one hand.
                    </ChecklistItem>
                    <ChecklistItem isChecked={qualitativeChecklist.workflowValue} onToggle={() => handleToggleChecklist('workflowValue')} icon={StopwatchIcon}>
                        **Analysis Value:** Assess if the 'In-Situ Quick Analysis' provides actionable information for field decisions.
                    </ChecklistItem>
                    <ChecklistItem isChecked={qualitativeChecklist.aiValue} onToggle={() => handleToggleChecklist('aiValue')} icon={SparklesIcon}>
                        **AI Insight Value:** Generate an AI Discovery report and assess if it provides novel, valuable scientific insights.
                    </ChecklistItem>
                </ul>
            </Card>

            <Card icon={DocumentTextIcon} title="Phase 3 & 4: Final Report">
                <p className="text-sm text-text-primary mb-4">
                    Summarize your findings from the qualitative tests. Note any friction points, bugs, or ideas for improvement. Then, use our AI to automatically generate actionable engineering tickets.
                </p>
                <textarea
                    value={qualitativeNotes}
                    onChange={(e) => setQualitativeNotes(e.target.value)}
                    placeholder="Enter summary notes on ergonomics, UI clarity, workflow value..."
                    className="w-full h-32 bg-bg-primary border border-green-dark rounded-sm p-3 focus:ring-2 focus:ring-green-bright focus:outline-none transition font-mono text-green-bright placeholder:text-green-muted text-sm"
                />
                <button onClick={handleRunAIAnalysis} disabled={isAnalyzing || !qualitativeNotes.trim()} className="w-full mt-4 p-3 bg-data-blue/80 text-white rounded-sm hover:bg-data-blue transition font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <SparklesIcon className="h-5 w-5"/>
                    <span>{isAnalyzing ? 'Analyzing...' : 'Generate Actionable Insights'}</span>
                </button>
                {analysisError && <p className="text-error text-sm mt-2 font-mono bg-error/10 p-2 rounded-sm border border-error/50">{analysisError}</p>}

                {aiAnalysis && (
                    <div className="mt-6 border-t border-green-dark pt-4 animate-fadeInUp">
                        <h4 className="font-semibold text-green-bright mb-2 font-mono">AI Analysis: Actionable Tickets</h4>
                         <div className="bg-bg-primary/50 p-4 rounded-sm text-sm max-h-96 overflow-y-auto">
                            <SimpleMarkdown text={aiAnalysis} />
                        </div>
                    </div>
                )}
                
                <button onClick={handleExport} className="w-full mt-4 p-3 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-bold flex items-center justify-center space-x-2">
                    <DownloadIcon className="h-5 w-5"/>
                    <span>Export Complete Test Report</span>
                </button>
            </Card>
        </div>
    );
};

export default FieldTestModule;