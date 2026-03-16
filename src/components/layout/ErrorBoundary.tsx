import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
          <div className="w-full max-w-md">
            <div className="rounded-xl bg-slate-800 p-8 border border-red-500">
              <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
              <p className="text-slate-300 mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <details className="mb-6 text-sm text-slate-400">
                <summary className="cursor-pointer hover:text-slate-300">Error details</summary>
                <pre className="mt-2 overflow-auto bg-slate-900 p-3 rounded text-xs whitespace-pre-wrap break-words">
                  {this.state.error?.stack}
                </pre>
              </details>
              <button
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
