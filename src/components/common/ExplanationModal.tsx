
import React, { useState, useEffect, useRef } from 'react';
import { SimpleMarkdown } from './SimpleMarkdown';
import { SparklesIcon } from '../icons/SparklesIcon';

interface ExplanationModalProps {
    onClose: () => void;
    streamPromise: Promise<AsyncIterable<any>>;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({ onClose, streamPromise }) => {
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(true);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        const streamExplanation = async () => {
            try {
                const stream = await streamPromise;
                for await (const chunk of stream) {
                    if (isMounted.current) {
                        setExplanation(prev => prev + chunk.text);
                    }
                }
            } catch (e) {
                const err = e as Error;
                console.error("Explanation stream failed:", err);
                if (isMounted.current) {
                    setError(`Failed to generate explanation: ${err.message}`);
                }
            } finally {
                if (isMounted.current) {
                    setIsLoading(false);
                }
            }
        };

        streamExplanation();
    }, [streamPromise]);
    
    useEffect(() => {
        if(contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [explanation]);

    return (
        <div className="modal-overlay animate-fadeIn flex items-center justify-center p-4">
            <div className="bg-bg-secondary border border-green-dark rounded-sm shadow-2xl max-w-2xl w-full flex flex-col animate-fadeInUp h-[80vh]">
                <div className="p-6 border-b border-green-dark">
                    <h2 className="text-2xl font-bold text-text-accent font-mono flex items-center">
                        <SparklesIcon className="h-6 w-6 mr-3 text-green-bright" />
                        AI Analysis Explanation
                    </h2>
                    <p className="text-sm text-green-muted mt-1">A step-by-step breakdown of the AI's reasoning process.</p>
                </div>

                <div ref={contentRef} className="text-sm text-text-primary p-6 space-y-4 flex-1 overflow-y-auto">
                    {isLoading && !explanation && (
                        <div className="flex items-center justify-center h-full text-green-muted">
                            <p>Generating explanation...</p>
                        </div>
                    )}
                    {error && <p className="text-error">{error}</p>}
                    <SimpleMarkdown text={explanation} />
                </div>

                <div className="flex justify-end space-x-4 p-6 border-t border-green-dark">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExplanationModal;
