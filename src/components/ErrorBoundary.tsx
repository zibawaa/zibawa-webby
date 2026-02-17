import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                Something went wrong
              </h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Please try refreshing the page.
              </p>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
