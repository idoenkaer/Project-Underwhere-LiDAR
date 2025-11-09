
import React, { useState } from 'react';
import { useUIStateContext } from '../contexts/UIStateContext';

interface FeedbackModalProps {
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
    const { addLog } = useUIStateContext();
    const [feedback, setFeedback] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        addLog(`Feedback submitted: "${feedback}"`);
        setStatus('sending');
        // Simulate sending feedback
        setTimeout(() => {
            setStatus('sent');
            setTimeout(() => {
                onClose();
            }, 1500);
        }, 1000);
    };

    return (
        <div className="modal-overlay animate-fadeIn flex items-center justify-center p-4">
            <div className="bg-bg-secondary border border-green-dark rounded-sm shadow-2xl max-w-lg w-full p-8 animate-fadeInUp">
                {status === 'sent' ? (
                     <div className="text-center">
                        <h2 className="text-2xl font-bold text-green-bright mb-4 font-mono">Thank You!</h2>
                        <p className="text-text-primary">Your feedback has been submitted.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-text-accent mb-4 font-mono">Submit Feedback</h2>
                        <p className="text-sm text-green-muted mb-6">
                            Have a suggestion, bug report, or general feedback? We'd love to hear it. This helps us improve the platform for everyone.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Type your feedback here..."
                                className="w-full h-32 bg-bg-primary border border-green-dark rounded-sm p-3 focus:ring-2 focus:ring-green-bright focus:outline-none transition font-mono text-green-bright placeholder:text-green-muted text-sm"
                                disabled={status === 'sending'}
                            />
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 bg-bg-primary text-text-primary rounded-sm hover:bg-bg-primary/50 transition font-semibold"
                                    disabled={status === 'sending'}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-semibold disabled:bg-green-dark"
                                    disabled={!feedback.trim() || status === 'sending'}
                                >
                                    {status === 'sending' ? 'Sending...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;
