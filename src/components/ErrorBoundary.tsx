import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-[#1c1a17] border-2 border-stone-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7 text-rose-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-cinzel text-white">
                {this.props.fallbackTitle || 'Unable to Load View'}
              </h2>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                An unexpected interface error occurred. You can reload or return to the main dashboard.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-[11px] font-mono text-rose-300 text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 bg-[#81b64c] hover:bg-[#92cc56] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  if (typeof window !== 'undefined') {
                    window.location.href = '/';
                  }
                }}
                className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
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
