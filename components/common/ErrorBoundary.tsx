import React, { Component, ErrorInfo, ReactNode } from "react";
import { ExclamationTriangleIcon } from "../icons/ExclamationTriangleIcon";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  
  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-bg-primary text-text-primary p-4">
          <div className="bg-error/10 border border-error text-error p-8 rounded-sm max-w-2xl text-center">
              <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-error" />
              <h1 className="text-3xl font-bold text-error mt-4 font-mono">SYSTEM FAILURE</h1>
              <p className="mt-4 text-text-primary">A critical error has occurred in the application.</p>
              <p className="mt-2 text-text-primary">Please reload the page to continue.</p>
               {this.state.error && (
                  <pre className="mt-4 text-left text-xs bg-bg-primary/50 p-3 rounded-sm overflow-auto max-h-40">
                      {this.state.error.stack || this.state.error.toString()}
                  </pre>
               )}
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
