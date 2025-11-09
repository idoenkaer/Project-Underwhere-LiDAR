import React, { useState, useRef, useEffect } from 'react';
import { isConfigured, configurationError } from '../../infrastructure/ai/GeminiService';
import { streamAIDiscovery } from '../../application/use-cases/streamAIDiscovery';
import { SparklesIcon } from '../icons/SparklesIcon';
import { useUIStateContext } from '../contexts/UIStateContext';
import { SimpleMarkdown } from '../common/SimpleMarkdown';
import { HandThumbUpIcon } from '../icons/HandThumbUpIcon';
import { HandThumbDownIcon } from '../icons/HandThumbDownIcon';
import { QuestionMarkCircleIcon } from '../icons/QuestionMarkCircleIcon';
import { explainAIAnalysis } from '../../application/use-cases/explainAIAnalysis';
import ExplanationModal from '../common/ExplanationModal';


const suggestedQueries = [
    "Correlate the fault line with moisture content.",
    "Assess the stability of the silicate rock formations.",
    "Propose a hypothesis for the forest density variation.",
];

const AIDiscoveryModule: React.FC = () => {
  const { addLog, addAlert } = useUIStateContext();
  const [userInput, setUserInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const responseContainerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  // New state
  const [feedback, setFeedback] = useState<'none' | 'good' | 'bad'>('none');
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (responseContainerRef.current) {
        responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  }, [aiResponse]);

  const handleQuerySubmit = async (query: string) => {
    if (!query.trim() || isLoading || !isConfigured) return;

    addLog(`AI Discovery query submitted: "${query}"`);
    setCurrentQuery(query);
    setIsLoading(true);
    setError(null);
    setAiResponse('');
    setUserInput('');
    setFeedback('none');
    setShowExplanation(false);

    try {
      const responseStream = await streamAIDiscovery(query);
      for await (const chunk of responseStream) {
        if(isMounted.current) {
            setAiResponse((prev) => prev + chunk.text);
        }
      }
    } catch (err) {
      console.error(err);
      const errorMessage = (err as Error).message || 'An unknown error occurred.';
      if(isMounted.current) {
          const fullError = `Failed to get response from AI. ${errorMessage}`;
          setError(fullError);
          addAlert(fullError, 'error');
          addLog(`AI Discovery Error: ${errorMessage}`);
      }
    } finally {
      if(isMounted.current) {
          setIsLoading(false);
          addLog('AI Discovery stream finished.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuerySubmit(userInput);
  };
  
  const handleFeedback = (newFeedback: 'good' | 'bad') => {
    setFeedback(current => {
        const finalFeedback = current === newFeedback ? 'none' : newFeedback;
        addLog(`AI response feedback given: ${finalFeedback}`);
        return finalFeedback;
    });
  };

  const handleExplain = () => {
      addLog("'Explain this Analysis' requested.");
      setShowExplanation(true);
  };
  
  return (
    <>
      {showExplanation && (
          <ExplanationModal
              onClose={() => setShowExplanation(false)}
              streamPromise={explainAIAnalysis(currentQuery, aiResponse)}
          />
      )}
      <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto animate-fadeIn">
        <div className="flex-1 bg-bg-secondary/50 rounded-t-sm border border-b-0 border-green-dark p-6 flex flex-col" ref={responseContainerRef}>
          <div className="flex-grow overflow-y-auto">
            {aiResponse ? (
                <SimpleMarkdown text={aiResponse} />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-green-muted">
                    <SparklesIcon className="h-16 w-16 mb-4 text-green-bright"/>
                    <h2 className="text-2xl font-bold text-text-accent font-mono">AI Semantic Reporting</h2>
                    {isConfigured ? (
                        <>
                           <p className="mt-2 max-w-md">Analyze processed scan data to generate a publication-ready scientific report.</p>
                           <div className="mt-6 border-t border-green-dark w-full max-w-sm pt-4">
                             <h4 className="text-sm font-semibold text-green-muted mb-3 font-mono">SUGGESTED QUERIES</h4>
                             <div className="space-y-2">
                                {suggestedQueries.map((q) => (
                                    <button 
                                        key={q}
                                        onClick={() => handleQuerySubmit(q)}
                                        disabled={isLoading}
                                        className="w-full text-left p-2 bg-bg-primary/50 hover:bg-bg-primary rounded-sm transition font-mono text-sm text-green-bright disabled:opacity-50"
                                    >
                                        &gt; {q}
                                    </button>
                                ))}
                             </div>
                           </div>
                        </>
                    ) : (
                         <div className="mt-4 text-sm bg-error/10 border border-error/50 text-error p-4 rounded-sm">
                            <p className="font-bold text-base">AI Service Not Configured</p>
                            <p className="mt-1">Could not initialize the AI service. Please ensure the API_KEY is set correctly. ({configurationError})</p>
                        </div>
                    )}
                </div>
            )}
            {isLoading && !aiResponse && <p className="text-green-bright animate-pulse font-mono">Generating semantic report...</p>}
          </div>

          {aiResponse && !isLoading && (
              <div className="mt-6 border-t border-green-dark pt-4 flex items-center justify-between flex-shrink-0 animate-fadeInUp">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleFeedback('good')}
                    className={`p-2 rounded-full transition-colors ${feedback === 'good' ? 'bg-green-primary/20 text-green-primary' : 'text-green-muted hover:text-green-bright'}`}
                    title="Good response (Contribute to peer review)"
                  >
                    <HandThumbUpIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleFeedback('bad')}
                    className={`p-2 rounded-full transition-colors ${feedback === 'bad' ? 'bg-error/20 text-error' : 'text-green-muted hover:text-error'}`}
                    title="Report issue (Contribute to peer review)"
                  >
                    <HandThumbDownIcon className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={handleExplain}
                  className="flex items-center space-x-2 text-sm text-data-blue hover:text-green-bright transition font-semibold"
                >
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                  <span>Explain this Analysis</span>
                </button>
              </div>
            )}
        </div>
        <div className="border-t border-green-dark p-4 bg-bg-secondary/80 rounded-b-sm">
             {error && <p className="text-error text-sm mb-2 font-mono bg-error/10 p-2 rounded-sm border border-error/50">{error}</p>}
             <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={!isConfigured ? "AI is not configured" : (isLoading ? "Analyzing..." : "Or type your own query here...")}
                    className="flex-1 bg-bg-primary border border-green-dark rounded-sm px-4 py-2 focus:ring-2 focus:ring-green-bright focus:outline-none transition disabled:opacity-50 font-mono text-green-bright placeholder:text-green-muted"
                    disabled={isLoading || !isConfigured}
                />
                <button 
                    type="submit"
                    disabled={isLoading || !userInput.trim() || !isConfigured}
                    className="px-4 py-2 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright disabled:bg-green-dark disabled:cursor-not-allowed transition flex items-center font-semibold"
                >
                     {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                     ) : <SparklesIcon className="h-5 w-5 mr-2"/> }
                    Generate
                </button>
             </form>
        </div>
      </div>
    </>
  );
};

export default AIDiscoveryModule;