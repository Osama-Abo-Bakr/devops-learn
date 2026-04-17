"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="rounded-lg border border-red-800 bg-red-900/20 p-8 text-center">
            <h2 className="mb-2 text-xl font-bold text-red-400">
              Something went wrong
            </h2>
            <p className="mb-4 text-gray-400">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}