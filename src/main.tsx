import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler to catch third-party cross-origin script errors (e.g. Disqus iframe constraints)
window.onerror = function (message, source, lineno, colno, error) {
  if (
    message === 'Script error.' ||
    message === 'Script error' ||
    (typeof message === 'string' &&
      (message.includes('Disqus') ||
        message.includes('disqus') ||
        message.includes('SecurityError')))
  ) {
    return true; // Suppress cross-origin script error from bubbling up
  }
  return false;
};

window.addEventListener(
  'error',
  (event) => {
    if (
      event.message === 'Script error.' ||
      event.message === 'Script error' ||
      (typeof event.message === 'string' &&
        (event.message.includes('Disqus') ||
          event.message.includes('disqus') ||
          event.message.includes('SecurityError')))
    ) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }
  },
  true
);

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props: ErrorBoundaryProps;
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f131e] text-[#dfe2f2] flex items-center justify-center p-6">
          <div className="bg-[#1E222D] border border-[#363A45] p-6 rounded-2xl max-w-md text-center space-y-4">
            <h2 className="text-xl font-bold text-[#FF5252]">Something went wrong</h2>
            <p className="text-sm text-[#c3c5d8]">
              An unexpected error occurred. Please refresh or try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#2962ff] text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#2962ff]/80 transition-colors"
            >
              Reload Terminal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

