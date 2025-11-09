import React, { useState, useRef, useEffect, useMemo } from 'react';
import { isConfigured, configurationError } from '../../services/geminiService';
import { streamAIDiscovery } from '../../application/use-cases/streamAIDiscovery';
import { SparklesIcon } from '../icons/SparklesIcon';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import { BeakerIcon } from '../icons/BeakerIcon';
import { useUIStateContext } from '../contexts/UIStateContext';

// Simple HTML escaper
const escapeHtml = (unsafe: string): string => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// A simple and safer markdown renderer
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const safeText = escapeHtml(text);

    const html = safeText
        .replace(/^#### (.*$)/gim, '<h4 class="text-md font-semibold text-text-accent mb-2 mt-4">$1</h4>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-green-bright mb-2 mt-4">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-green-bright mb-3 mt-4">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-green-bright mb-4 mt-4">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-accent">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-bg-primary text-green-primary rounded px-1 py-0.5 font-mono text-sm">$1</code>')
        .replace(/(?:(?:^-|\*)\s.*(?:\n|$))+/gm, (match) => {
            const items = match.trim().split('\n').map(item => 
                `<li class="list-disc ml-5">${item.replace(/^(-|\*)\s/, '').trim()}</li>`
            ).join('');
            return `<ul class="mb-4 space-y-1">${items}</ul>`;
        })
        .replace(/\n/g, '<br />');

    return <div className="prose prose-invert max-w-none prose-p:text-text-primary" dangerouslySetInnerHTML={{ __html: html }} />;
};

const ResponseSection: React.FC<{ title: string; icon: React.ReactNode; content: string }> = ({ title, icon, content }) => (
    <div className="mb-6">
        <h3 className="flex items-center text-lg font-semibold text-green-bright mb-3 font-mono">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        <div className="pl-8 border-l-2 border-green-dark">
             <SimpleMarkdown text={content} />
        </div>
    </div>
);

const suggestedQueries = [
    "Correlate the fault line with moisture content.",
    "Assess the stability of the silicate rock formations.",
    "Propose a hypothesis for the forest density variation.",
];

const AIDiscoveryModule: React.FC = () => {
  const { addLog } = useUIStateContext();
  const [userInput, setUserInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const responseContainerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (responseContainerRef.current) {
        responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  }, [aiResponse]);

  const parsedResponse = useMemo(() => {
    const sections: { [key: string]: string } = {};
    
    const sectionRegex = /(?:#+\s*|\*\*)(.*?)(?::|\*\*)\s*([\s\S]*?)(?=(?:#+\s*|\*\*)[\w\s]+(?:[:\s]|\*\*)s*$|$)/gim;
    let match;
    while ((match = sectionRegex.exec(aiResponse)) !== null) {
        const key = match[1].trim().toLowerCase().replace(/\s+/g, '_');
        sections[key] = match[2].trim();
    }

    return sections;
  }, [aiResponse]);

  const handleQuerySubmit = async (query: string) => {
    if (!query.trim() || isLoading || !isConfigured) return;

    addLog(`AI Discovery query submitted: "${query}"`);
    setIsLoading(true);
    setError(null);
    setAiResponse('');
    setUserInput('');

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
          setError(`Failed to get response from AI. ${errorMessage}`);
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
  
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto animate-fadeIn">
        <div className="flex-1 bg-bg-secondary/50 rounded-t-sm border border-b-0 border-green-dark p-6 overflow-y-auto" ref={responseContainerRef}>
            {aiResponse ? (
                <div>
                   {Object.entries(parsedResponse).map(([key, value]) => (
                     <ResponseSection key={key} title={key.replace(/_/g, ' ').toUpperCase()} icon={<BeakerIcon className="h-5 w-5" />} content={value} />
                   ))}
                </div>
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
  );
};

export default AIDiscoveryModule;