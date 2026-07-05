"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { EditorPane } from "./EditorPane";
import { PreviewPane } from "./PreviewPane";

export const ResumeBuilderLayout = ({
  editorChildren,
  previewChildren,
  renderType = "pdf",
  isLoading = false,
  isOffline = false,
}: {
  editorChildren: React.ReactNode;
  previewChildren: React.ReactNode;
  renderType?: "pdf" | "html" | "portfolio";
  isLoading?: boolean;
  isOffline?: boolean;
}) => {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved">("saved");
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      setSaveStatus("saved");
    }, 1000);
    return () => clearTimeout(timer);
  }, [resume, settings]);

  return (
    <div className="flex h-[calc(100dvh-var(--top-nav-bar-height))] w-full flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Dynamic Workspace split (40/60) */}
      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden p-6 lg:grid-cols-[2fr_3fr]">
        <EditorPane isLoading={isLoading}>{editorChildren}</EditorPane>
        <PreviewPane isLoading={isLoading} renderType={renderType}>
          {previewChildren}
        </PreviewPane>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar status={saveStatus} isOffline={isOffline} />
    </div>
  );
};
