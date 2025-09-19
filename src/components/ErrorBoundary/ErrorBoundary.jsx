/*
  Error Boundary Component
  - Catches JavaScript errors in component tree
  - Shows fallback UI instead of crashing the app
*/

import React from "react";
import Button from "../Common/Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  //   static getDerivedStateFromError(error) {
  //     return { hasError: true };
  //   }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Vous pouvez ici envoyer les erreurs à un service de rapport d'erreurs
    // Exemple : errorReportingService.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="center-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="ml-3 text-2xl font-semibold text-gray-900 dark:text-white">
                Something went wrong
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>

            <div className="flex space-x-3">
              <Button
                variant="cta"
                className="flex-1"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => (window.location.href = "/")}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
