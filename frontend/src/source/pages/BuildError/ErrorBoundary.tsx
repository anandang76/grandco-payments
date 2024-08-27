import React, { Component, ReactNode } from 'react';
import ErrorPage from './ErrorPage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error; // Optional property to hold the error object
}

function logErrorToService(error: Error, errorInfo: React.ErrorInfo): void {
  console.error('Logged error:', error, errorInfo);
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: undefined
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error: error // Update error property with the caught error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log(error);
        this.setState({ hasError: true });
        this.setState({ error: error});
        logErrorToService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorPage error={this.state.error} />;
        } else {
            return this.props.children;
        }
    }
}

export default ErrorBoundary;
