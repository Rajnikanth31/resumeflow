"use client";
import React from "react";

export const EditorSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col gap-6 p-6">
      {/* Skeleton block for Personal Details */}
      <div className="rounded-lg bg-gray-100 p-4 dark:bg-zinc-900">
        <div className="mb-4 h-4 w-32 rounded bg-gray-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-8 rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-8 rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-8 rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-8 rounded bg-gray-200 dark:bg-zinc-800" />
        </div>
      </div>
      {/* Skeleton blocks for Experiences */}
      <div className="rounded-lg bg-gray-100 p-4 dark:bg-zinc-900">
        <div className="mb-4 h-4 w-40 rounded bg-gray-200 dark:bg-zinc-800" />
        <div className="mb-2 h-8 rounded bg-gray-200 dark:bg-zinc-800" />
        <div className="h-20 rounded bg-gray-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
};

export const EditorPane = ({
  children,
  isLoading = false,
}: {
  children?: React.ReactNode;
  isLoading?: boolean;
}) => {
  return (
    <section className="flex h-full flex-col overflow-y-auto rounded-lg border border-border bg-card shadow-sm">
      {isLoading ? <EditorSkeleton /> : children}
    </section>
  );
};
