"use client";
import React from "react";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  PaintBrushIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export const Toolbar = () => {
  return (
    <div className="flex h-12 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-6 text-zinc-600 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400">
      <div className="flex items-center gap-4">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-4 dark:border-zinc-800">
          <button
            type="button"
            className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Undo"
            title="Undo"
          >
            <ArrowUturnLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Redo"
            title="Redo"
          >
            <ArrowUturnRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Save / Version History */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-4 dark:border-zinc-800">
          <button
            type="button"
            className="flex items-center gap-1 rounded px-2.5 py-1 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Save draft"
          >
            <CloudArrowUpIcon className="h-4 w-4" />
            <span>Save</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded px-2.5 py-1 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Version history"
          >
            <ClockIcon className="h-4 w-4" />
            <span>History</span>
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Zoom out"
          >
            <MagnifyingGlassMinusIcon className="h-4 w-4" />
          </button>
          <span className="w-12 select-none text-center text-sm font-medium">
            100%
          </span>
          <button
            type="button"
            className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Zoom in"
          >
            <MagnifyingGlassPlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Settings */}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800"
          aria-label="Change theme"
        >
          <PaintBrushIcon className="h-4 w-4" />
          <span>Themes</span>
        </button>

        {/* Download */}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded bg-primary px-3 py-1 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          aria-label="Download resume"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};
