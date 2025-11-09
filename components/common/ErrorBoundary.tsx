import React, { Component, ErrorInfo, ReactNode } from "react";
import { ExclamationTriangleIcon } from "../icons/ExclamationTriangleIcon";
import { captureException, captureUserFeedback } from "../../services/sentryService";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  eventId?: string;
  userFeedback: string;
  feedbackSent: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
    eventId: undefined,
    userFeedback: '',
    feedbackSent: false,
  };

  public static getDerivedStateFromError(error: Error): Pick<State, 'hasError' | 'error'> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[React Error]", error, errorInfo);
    const eventId = captureException(error, { extra: { componentStack: errorInfo.componentStack } });
    this.setState({ eventId });
  }
  
  private handleReload = () => {
    window.location.reload();
  };

  private handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.state.eventId || !this.state.userFeedback.trim()) return;

    captureUserFeedback({
        event_id: this.state.eventId,
        comments: this.state.userFeedback,
        // Mock user data
        name: "Dr. Evelyn Reed", 
        email: "e.reed@example.com",
    });
    this.setState({ feedbackSent: true });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-bg-primary text-text-primary p-4">
          <div className="bg-error/10 border border-error text-error p-8 rounded-sm max-w-2xl text-center">
              <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-error" />
              <h1 className="text-3xl font-bold text-error mt-4 font-mono">SYSTEM FAILURE</h1>
              <p className="mt-4 text-text-primary">A critical error has occurred. Our team has been notified.</p>
               {this.state.error && (
                  <pre className="mt-4 text-left text-xs bg-bg-primary/50 p-3 rounded-sm overflow-auto max-h-24 font-mono">
                      {this.state.error.message || this.state.error.toString()}
                  </pre>
               )}
              
              <div className="mt-6 text-left">
                  {this.state.feedbackSent ? (
                      <div className="bg-green-primary/20 text-green-primary p-3 rounded-sm text-center font-semibold">
                          Thank you! Your feedback has been submitted.
                      </div>
                  ) : (
                    <form onSubmit={this.handleFeedbackSubmit}>
                        <label htmlFor="feedback" className="block text-sm font-semibold text-text-primary mb-2">Help us fix this faster:</label>
                        <textarea
                            id="feedback"
                            value={this.state.userFeedback}
                            onChange={(e) => this.setState({ userFeedback: e.target.value })}
                            placeholder="What were you doing when this happened?"
                            className="w-full h-20 bg-bg-primary border border-green-dark rounded-sm p-2 text-text-primary placeholder:text-green-muted text-sm font-mono"
                        />
                        <button type="submit" disabled={!this.state.userFeedback.trim()} className="mt-2 w-full p-2 bg-green-muted text-bg-primary rounded-sm hover:bg-green-bright transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                            Submit Feedback
                        </button>
                    </form>
                  )}
              </div>

              <button onClick={this.handleReload} className="mt-8 px-6 py-3 bg-transparent border-2 border-error text-error font-mono rounded-sm uppercase tracking-wider hover:bg-error hover:text-bg-primary transition-all duration-200">
                  Reload Application
              </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;