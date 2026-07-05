"use client";
import React from "react";
import { CheckCircleIcon, WifiIcon } from "@heroicons/react/20/solid";

export const StatusBar = ({
  status = "saved",
  isOffline = false,
}: {
  status?: "saving" | "saved";
  isOffline?: boolean;
}) => {
  return (
    <div className="flex h-6 w-full select-none items-center justify-between border-t border-gray-200 bg-gray-50 px-4 text-xs text-gray-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
      <div className="flex items-center gap-1.5">
        {status === "saving" ? (
          <>
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <span>Saving changes...</span>
          </>
        ) : (
          <>
            <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
            <span>All changes saved</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isOffline ? (
          <div className="flex items-center gap-1 text-red-500">
            <WifiIcon className="h-3.5 w-3.5 opacity-60" />
            <span>Offline mode</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500">
            <WifiIcon className="h-3.5 w-3.5" />
            <span>Online</span>
          </div>
        )}
        <span className="text-gray-300 dark:text-zinc-800">|</span>
        <span>v1.1.0</span>
      </div>
    </div>
  );
};
