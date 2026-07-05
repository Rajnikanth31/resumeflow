"use client";
import React, { useState } from "react";
import { HandThumbUpIcon, HandThumbDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface AIDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestionId: string;
  originalText: string;
  suggestedText: string;
  onApply: () => void;
}

export default function AIDiffModal({
  isOpen,
  onClose,
  suggestionId,
  originalText,
  suggestedText,
  onApply,
}: AIDiffModalProps) {
  const [feedbackSent, setFeedbackSent] = useState<"HELPFUL" | "NOT_HELPFUL" | null>(null);

  if (!isOpen) return null;

  async function handleFeedback(type: "HELPFUL" | "NOT_HELPFUL") {
    setFeedbackSent(type);
    try {
      await fetch("/api/ai/resume/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId, feedback: type }),
      });
    } catch (err) {
      console.error("Failed to submit suggestions feedback:", err);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h3 className="font-heading font-bold text-xl text-foreground mb-4">
          Compare Suggestion Diffs
        </h3>

        <div className="space-y-4 text-sm font-mono">
          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-950/40">
            <div className="text-[10px] text-red-500 font-bold uppercase mb-1">Original Text</div>
            <div className="text-red-700 dark:text-red-400 line-through whitespace-pre-wrap">
              {originalText || "(Empty)"}
            </div>
          </div>

          <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 border border-green-100 dark:border-green-950/40">
            <div className="text-[10px] text-green-500 font-bold uppercase mb-1">Suggested Change</div>
            <div className="text-green-700 dark:text-green-400 whitespace-pre-wrap">
              {suggestedText}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border mt-6 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Was this suggestion helpful?</span>
            <button
              onClick={() => handleFeedback("HELPFUL")}
              className={`rounded p-1 hover:bg-gray-100 ${
                feedbackSent === "HELPFUL" ? "text-primary bg-primary/10" : "text-gray-400"
              }`}
            >
              <HandThumbUpIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleFeedback("NOT_HELPFUL")}
              className={`rounded p-1 hover:bg-gray-100 ${
                feedbackSent === "NOT_HELPFUL" ? "text-red-500 bg-red-50" : "text-gray-400"
              }`}
            >
              <HandThumbDownIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApply();
                onClose();
              }}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/95"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
