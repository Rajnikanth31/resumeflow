"use client";
import React from "react";

export class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Preview Boundary caught rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-650 flex h-full flex-col items-center justify-center bg-red-50 p-6 text-center dark:bg-red-950/20 dark:text-red-400">
          <h3 className="mb-2 text-lg font-bold">
            Failed to render resume preview
          </h3>
          <p className="mb-4 text-sm opacity-80">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="hover:bg-red-750 rounded bg-red-600 px-4 py-1.5 text-sm font-semibold text-white shadow"
          >
            Retry Render
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const PreviewSkeleton = () => {
  return (
    <div className="flex h-[29.7cm] w-[21cm] animate-pulse flex-col gap-6 bg-white p-12 shadow dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-48 rounded bg-gray-200 dark:bg-zinc-800" />
        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-zinc-800" />
      </div>
      <div className="h-4 w-full rounded bg-gray-200 dark:bg-zinc-800" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-36 rounded bg-gray-200 dark:bg-zinc-800" />
        <div className="h-20 rounded bg-gray-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
};

const DefaultPdfRenderer = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex h-full w-full justify-center">{children}</div>
);

const HtmlRenderer = () => (
  <div className="flex items-center justify-center p-12 text-zinc-500">
    HTML Resume Version: Coming soon
  </div>
);

const PortfolioRenderer = () => (
  <div className="flex items-center justify-center p-12 text-zinc-500">
    Interactive Portfolio Version: Coming soon
  </div>
);

const renderers: Record<string, React.ComponentType<any>> = {
  pdf: DefaultPdfRenderer,
  html: HtmlRenderer,
  portfolio: PortfolioRenderer,
};

export const PreviewRenderer = ({
  renderType = "pdf",
  children,
}: {
  renderType?: "pdf" | "html" | "portfolio";
  children?: React.ReactNode;
}) => {
  const TargetRenderer = renderers[renderType] || DefaultPdfRenderer;
  return <TargetRenderer>{children}</TargetRenderer>;
};

export const PreviewPane = ({
  children,
  renderType = "pdf",
  isLoading = false,
}: {
  children?: React.ReactNode;
  renderType?: "pdf" | "html" | "portfolio";
  isLoading?: boolean;
}) => {
  return (
    <PreviewErrorBoundary>
      <section className="flex h-full flex-col items-center justify-start overflow-y-auto rounded-lg border border-border bg-zinc-100 p-6 shadow-sm dark:bg-zinc-900">
        {isLoading ? (
          <PreviewSkeleton />
        ) : (
          <PreviewRenderer renderType={renderType}>{children}</PreviewRenderer>
        )}
      </section>
    </PreviewErrorBoundary>
  );
};
