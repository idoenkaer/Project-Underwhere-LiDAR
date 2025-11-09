import React, { useState, useRef, useEffect, useMemo } from 'react';
import { isConfigured, configurationError } from '../../infrastructure/ai/GeminiService';
import { streamAIDiscovery } from '../../application/use-cases/streamAIDiscovery';
import { SparklesIcon } from '../icons/SparklesIcon';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import { BeakerIcon } from '../icons/BeakerIcon';

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
    // First, escape all HTML to prevent XSS
    const safeText = escapeHtml(text);

    // Then, apply safe markdown formatting
    const html = safeText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-cyan-300 rounded px-1 py-0.5 font-mono text-sm">$1</code>')
        // Find blocks of list items and wrap them in a <ul> tag
        .replace(/(?:(?:^-|\*)\s.*(?:\n|$))+/gm, (match) => {
            const items = match.trim().split('\n').map(item => 
                `<li class="list-disc ml-5">${item.replace(/^(-|\*)\s/, '').trim()}</li>`
            ).join('');
            return `<ul class="mb-4">${items}</ul>`;
        })
        .replace(/\n/g, '<br />');

    return <div className="prose prose-invert max-w-none prose-p:text-gray-300" dangerouslySetInnerHTML={{ __html: html }} />;
};

const ResponseSection: React.FC<{ title: string; icon: React.ReactNode; content: string }> = ({ title, icon, content }) => (
    <div className="mb-6">
        <h3 className="flex items-center text-lg font-semibold text-cyan-300 mb-2">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        <div className="pl-8 border-l-2 border-gray-700">
             <SimpleMarkdown text={content} />
        </div>
    </div>
);


const AIDiscoveryModule: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const responseContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (responseContainerRef.current) {
        responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  }, [aiResponse]);

  const parsedResponse = useMemo(() => {
    const sections: { [key: string]: string } = {};
    const directAnalysisMatch = aiResponse.match(/(\*\*Direct Analysis:\*\*|Direct Analysis)([\s\S]*?)(?=\*\*Suggested Hypotheses:\*\*|Suggested Hypotheses|$)/i);
    const hypothesesMatch = aiResponse.match(/(\*\*Suggested Hypotheses:\*\*|Suggested Hypotheses)([\s\S]*?)(?=\*\*Relevant Literature \(Hypothetical\):\*\*|Relevant Literature \(Hypothetical\)|$)/i);
    const literatureMatch = aiResponse.match(/(\*\*Relevant Literature \(Hypothetical\):\*\*|Relevant Literature \(Hypothetical\))([\s\S]*)/i);

    if (directAnalysisMatch) sections['analysis'] = directAnalysisMatch[2].trim();
    if (hypothesesMatch) sections['hypotheses'] = hypothesesMatch[2].trim();
    if (literatureMatch) sections['literature'] = literatureMatch[2].trim();

    return sections;
  }, [aiResponse]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !isConfigured) return;

    setIsLoading(true);
    setError(null);
    setAiResponse('');

    try {
      const responseStream = await streamAIDiscovery(userInput);
      
      for await (const chunk of responseStream) {
        setAiResponse((prev) => prev + chunk.text);
      }

    } catch (err) {
      console.error(err);
      setError('Failed to get response from AI. Please check your API key and network connection.');
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto animate-fadeIn">
        <div className="flex-1 bg-gray-800/50 rounded-t-lg p-6 overflow-y-auto" ref={responseContainerRef}>
            {aiResponse ? (
                <div>
                   {parsedResponse.analysis && <ResponseSection title="Direct Analysis" icon={<BeakerIcon className="h-5 w-5" />} content={parsedResponse.analysis} />}
                   {parsedResponse.hypotheses && <ResponseSection title="Suggested Hypotheses" icon={<SparklesIcon className="h-5 w-5" />} content={parsedResponse.hypotheses} />}
                   {parsedResponse.literature && <ResponseSection title="Relevant Literature" icon={<BookOpenIcon className="h-5 w-5" />} content={parsedResponse.literature} />}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <SparklesIcon className="h-16 w-16 mb-4 text-cyan-400"/>
                    <h2 className="text-2xl font-bold text-gray-200">AI Discovery Assistant</h2>
                    {isConfigured ? (
                        <>
                           <p className="mt-2">Cross-reference scan results with scientific literature to generate hypotheses.</p>
                           <p className="mt-4 text-sm bg-gray-700/50 p-2 rounded-md">e.g., "What could cause the thermal anomaly in sector gamma?"</p>
                        </>
                    ) : (
                         <div className="mt-4 text-sm bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-md">
                            <p className="font-bold text-base">AI Service Not Configured</p>
                            <p className="mt-1">Could not initialize the AI service. Please ensure the API_KEY is set correctly. ({configurationError})</p>
                        </div>
                    )}
                </div>
            )}
            {isLoading && !aiResponse && <p className="text-cyan-300 animate-pulse">Analyzing scan data and cross-referencing literature...</p>}
        </div>
        <div className="border-t border-gray-700 p-4 bg-gray-800/80 rounded-b-lg">
             {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
             <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={!isConfigured ? "AI is not configured" : (isLoading ? "Thinking..." : "Ask the AI to analyze the scan...")}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition disabled:opacity-50"
                    disabled={isLoading || !isConfigured}
                />
                <button 
                    type="submit"
                    disabled={isLoading || !userInput.trim() || !isConfigured}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center"
                >
                     {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                     ) : <SparklesIcon className="h-5 w-5 mr-2"/> }
                    Analyze
                </button>
             </form>
        </div>
    </div>
  );
};

export default AIDiscoveryModule;