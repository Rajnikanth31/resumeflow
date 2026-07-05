"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { EditorPane } from "./EditorPane";
import { PreviewPane } from "./PreviewPane";
import ResumeTailorDrawer from "../resume-tailor-drawer";
import ATSScorecard from "../ats-scorecard";
import { SparklesIcon } from "@heroicons/react/24/outline";

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

  const [isTailorOpen, setIsTailorOpen] = useState(false);
  const [isATSOpen, setIsATSOpen] = useState(false);

  useEffect(() => {
    const handleSaving = () => setSaveStatus("saving");
    const handleSaved = () => setSaveStatus("saved");

    if (settings.resumeId) {
      window.addEventListener("resume-saving", handleSaving);
      window.addEventListener("resume-saved", handleSaved);
      window.addEventListener("resume-save-error", handleSaved);

      return () => {
        window.removeEventListener("resume-saving", handleSaving);
        window.removeEventListener("resume-saved", handleSaved);
        window.removeEventListener("resume-save-error", handleSaved);
      };
    } else {
      if (isFirstMount.current) {
        isFirstMount.current = false;
        return;
      }
      setSaveStatus("saving");
      const timer = setTimeout(() => {
        setSaveStatus("saved");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resume, settings]);

  return (
    <div className="flex h-[calc(100dvh-var(--top-nav-bar-height))] w-full flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950 relative">
      {/* Top Toolbar */}
      <Toolbar
        onOpenTailor={() => setIsTailorOpen(true)}
        onOpenATS={() => setIsATSOpen(true)}
      />

      {/* Dynamic Workspace split (40/60) */}
      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden p-6 lg:grid-cols-[2fr_3fr]">
        <EditorPane isLoading={isLoading}>{editorChildren}</EditorPane>
        <PreviewPane isLoading={isLoading} renderType={renderType}>
          {previewChildren}
        </PreviewPane>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar status={saveStatus} isOffline={isOffline} />

      {/* AI Tailoring Drawer */}
      {settings.resumeId && (
        <ResumeTailorDrawer
          isOpen={isTailorOpen}
          onClose={() => setIsTailorOpen(false)}
          resumeId={settings.resumeId}
        />
      )}

      {/* ATS Scorer Drawer */}
      {isATSOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l border-border bg-card p-6 shadow-xl flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h2 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-primary" />
              ATS Scorer Panel
            </h2>
            <button onClick={() => setIsATSOpen(false)} className="text-gray-400 hover:text-foreground">
              ✕
            </button>
          </div>
          {settings.resumeId ? (
            <ATSScorecard resumeId={settings.resumeId} />
          ) : (
            <p className="text-xs text-muted-foreground italic">Save the resume first to run audits.</p>
          )}
        </div>
      )}
    </div>
  );
};
