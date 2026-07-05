"use client";
import React, { useState } from "react";
import { useAppDispatch } from "lib/redux/hooks";
import { applySuggestion, undoLastApply } from "lib/redux/resumeSlice";
import {
  SparklesIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import AIDiffModal from "./ai-diff-modal";

interface SuggestionItem {
  id?: string;
  suggestionText: string;
  explanation: string;
  expectedBenefit: string;
  confidenceScore: number;
  atsImpact: number;
  category: string;
}

interface AISuggestionsPanelProps {
  sectionType: "profile" | "workExperiences" | "educations" | "projects" | "skills" | "custom";
  content: string;
  idx?: number;
  field?: string;
  jobDescription?: string;
}

const CATEGORIES = [
  "Grammar",
  "ATS",
  "Keywords",
  "Action Verbs",
  "Quantification",
  "Readability",
  "Recruiter Recommendations",
];

export default function AISuggestionsPanel({
  sectionType,
  content,
  idx,
  field,
  jobDescription,
}: AISuggestionsPanelProps) {
  const dispatch = useAppDispatch();
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Grammar");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestionItem | null>(null);

  async function generateSuggestions() {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const res = await fetch("/api/ai/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          sectionType,
          jobDescription,
        }),
      });

      if (!res.ok) throw new Error("Failed to optimize section");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      if (!reader) throw new Error("No reader");

      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") continue;

          if (trimmed.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.chunk) {
                accumulated += data.chunk;
              }
            } catch (e) {
              // Ignore partial JSON chunks
            }
          }
        }
      }

      try {
        const clean = accumulated.trim();
        let jsonStr = clean;
        if (jsonStr.startsWith("```json")) {
          jsonStr = jsonStr.substring(7);
        } else if (jsonStr.startsWith("```")) {
          jsonStr = jsonStr.substring(3);
        }
        if (jsonStr.endsWith("```")) {
          jsonStr = jsonStr.substring(0, jsonStr.length - 3);
        }
        const data = JSON.parse(jsonStr.trim());
        if (data.suggestions) {
          setSuggestions(data.suggestions);
          // Set active category to first category that has suggestions
          const firstCat = CATEGORIES.find(
            (cat) => data.suggestions.filter((s: any) => s.category === cat).length > 0
          );
          if (firstCat) {
            setActiveCategory(firstCat);
          }
        }
      } catch (parseErr) {
        console.error("Failed to parse suggestion response:", parseErr);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleApply(sug: SuggestionItem) {
    dispatch(
      applySuggestion({
        section: sectionType,
        field,
        idx,
        content: sug.suggestionText,
      })
    );
    setSuggestions((prev) => prev.filter((item) => item.suggestionText !== sug.suggestionText));
  }

  function handleAcceptAll() {
    suggestions.forEach((sug) => {
      dispatch(
        applySuggestion({
          section: sectionType,
          field,
          idx,
          content: sug.suggestionText,
        })
      );
    });
    setSuggestions([]);
  }

  function handleRejectAll() {
    setSuggestions([]);
  }

  function handleAcceptCategory() {
    const categorySuggestions = suggestions.filter((sug) => sug.category === activeCategory);
    categorySuggestions.forEach((sug) => {
      dispatch(
        applySuggestion({
          section: sectionType,
          field,
          idx,
          content: sug.suggestionText,
        })
      );
    });
    setSuggestions((prev) => prev.filter((sug) => sug.category !== activeCategory));
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-primary" />
          <h2 className="font-heading font-semibold text-base text-foreground">
            AI Suggestions
          </h2>
        </div>

        <button
          onClick={() => dispatch(undoLastApply())}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-foreground font-semibold"
        >
          <ArrowUturnLeftIcon className="h-3 w-3" />
          Undo last
        </button>
      </div>

      {suggestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
          <p className="text-sm text-gray-500 italic font-medium">No suggestions generated yet.</p>
          <button
            onClick={generateSuggestions}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary/95 transition-all"
          >
            {isLoading ? (
              <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <SparklesIcon className="h-3.5 w-3.5" />
            )}
            Analyze & Optimize Section
          </button>
        </div>
      ) : (
        <div className="space-y-4 flex-1 overflow-y-auto">
          <div className="flex flex-wrap gap-2 text-[10px] font-bold border-b border-border pb-3">
            <button
              onClick={handleAcceptAll}
              className="rounded bg-primary/10 text-primary px-2.5 py-1 hover:bg-primary/20"
            >
              ACCEPT ALL
            </button>
            <button
              onClick={handleRejectAll}
              className="rounded bg-red-50 text-red-600 px-2.5 py-1 hover:bg-red-100"
            >
              REJECT ALL
            </button>
            <button
              onClick={handleAcceptCategory}
              className="rounded bg-gray-100 text-foreground px-2.5 py-1 hover:bg-gray-200"
            >
              ACCEPT CATEGORY
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count = suggestions.filter((sug) => sug.category === cat).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap border ${
                    activeCategory === cat
                      ? "bg-primary border-primary text-white"
                      : "bg-background border-border text-foreground hover:bg-gray-50"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {suggestions
              .filter((sug) => sug.category === activeCategory)
              .map((sug, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-background p-4 space-y-2 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {sug.suggestionText}
                    </p>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => setSelectedSuggestion(sug)}
                        className="rounded p-1 hover:bg-gray-100 text-primary"
                        title="Preview & Apply"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          setSuggestions((prev) =>
                            prev.filter((item) => item.suggestionText !== sug.suggestionText)
                          )
                        }
                        className="rounded p-1 hover:bg-gray-100 text-gray-400 hover:text-red-500"
                        title="Reject"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">{sug.explanation}</p>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold border-t border-border pt-2">
                    <span>ATS IMPACT: +{sug.atsImpact}</span>
                    <span>CONFIDENCE: {Math.round(sug.confidenceScore * 100)}%</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {selectedSuggestion && (
        <AIDiffModal
          isOpen={!!selectedSuggestion}
          onClose={() => setSelectedSuggestion(null)}
          suggestionId={selectedSuggestion.id || "temp-sug"}
          originalText={content}
          suggestedText={selectedSuggestion.suggestionText}
          onApply={() => handleApply(selectedSuggestion)}
        />
      )}
    </div>
  );
}
