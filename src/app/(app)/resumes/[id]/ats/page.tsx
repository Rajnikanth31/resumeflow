"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ChartBarIcon, SparklesIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface ATSReport {
  id: string;
  overallScore: number;
  keywordScore: number;
  semanticScore: number;
  experienceScore: number;
  projectScore: number;
  educationScore: number;
  qualityScore: number;
  reasoning: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  improvementSuggestions: {
    suggestion: string;
    category: string;
    estimatedScoreGain: number;
  }[];
  job?: {
    title: string;
    company: string;
  };
  createdAt: string;
}

export default function ATSDashboard({ params }: { params: { id: string } }) {
  const resumeId = params.id;
  const [reports, setReports] = useState<ATSReport[]>([]);
  const [reportAId, setReportAId] = useState("");
  const [reportBId, setReportBId] = useState("");
  const [comparison, setComparison] = useState<any | null>(null);
  const [activeReport, setActiveReport] = useState<ATSReport | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ats-reports`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
        if (data.reports && data.reports.length > 0) {
          setActiveReport(data.reports[0]);
          if (data.reports.length > 1) {
            setReportAId(data.reports[1].id);
            setReportBId(data.reports[0].id);
          }
        }
      }
    } catch (e) {
      console.error("Error fetching historical reports:", e);
    }
  }, [resumeId]);

  useEffect(() => {
    fetchHistory();
  }, [resumeId, fetchHistory]);

  async function handleCompare() {
    if (!reportAId || !reportBId) return;
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ats-reports/compare?reportIdA=${reportAId}&reportIdB=${reportBId}`);
      if (res.ok) {
        const data = await res.json();
        setComparison(data);
      }
    } catch (e) {
      console.error("Error running reports comparison:", e);
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20";
    if (score >= 50) return "text-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-950/20";
    return "text-rose-500 border-rose-500 bg-rose-50 dark:bg-rose-950/20";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="flex-1 space-y-8 p-8 overflow-y-auto h-[calc(100vh-var(--top-nav-bar-height))] bg-zinc-50 dark:bg-zinc-950 text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="space-y-1.5">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">ATS Intelligence Dashboard</h1>
          <p className="text-sm text-muted-foreground">Monitor and compare resume ATS compatibility across target roles over time.</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-lg bg-card text-center p-6">
          <ChartBarIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-base font-bold">No ATS Scan History</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">Configure audits and run scans directly from the Builder workspace toolbar menu.</p>
          <Link href={`/resume-builder?id=${resumeId}`} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Go to Builder
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Scored Metrics panel (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Audit Report Overview */}
            {activeReport && (
              <div className="border border-border rounded-lg bg-card p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold font-heading">
                      Latest Audit: {activeReport.job?.title || "Target Profile"}
                    </h2>
                    <span className="text-xs text-muted-foreground block">
                      Company: {activeReport.job?.company || "Custom Job Description"} | Scanned on {new Date(activeReport.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-xl font-extrabold ${getScoreColor(activeReport.overallScore)}`}>
                    {activeReport.overallScore}%
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">Explainable Scorer Reasoning</span>
                  <p className="text-sm leading-normal text-muted-foreground">{activeReport.reasoning}</p>
                </div>

                {/* Score Breakdown Bars */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Scores Breakdown</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { name: "Keyword Match", val: activeReport.keywordScore },
                      { name: "Semantic Match", val: activeReport.semanticScore },
                      { name: "Experience Match", val: activeReport.experienceScore },
                      { name: "Project Match", val: activeReport.projectScore },
                      { name: "Education Match", val: activeReport.educationScore },
                      { name: "Resume Quality", val: activeReport.qualityScore },
                    ].map((cat) => (
                      <div key={cat.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{cat.name}</span>
                          <span>{cat.val}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
                          <div
                            className={`h-2 rounded-full ${getScoreBarColor(cat.val)}`}
                            style={{ width: `${cat.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* matched & missing heatmaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2">Matched Keywords ({activeReport.matchedKeywords.length})</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeReport.matchedKeywords.map((k) => (
                        <span key={k} className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircleIcon className="h-3.5 w-3.5" />
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-2">Missing Keywords ({activeReport.missingKeywords.length})</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeReport.missingKeywords.map((k) => (
                        <span key={k} className="inline-flex items-center gap-1 rounded bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 text-xs text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                          <XCircleIcon className="h-3.5 w-3.5" />
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggestions List */}
                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prioritized Action Items</h3>
                  <div className="flex flex-col gap-3">
                    {activeReport.improvementSuggestions.map((item, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">{item.category}</span>
                          <p className="text-sm font-medium">{item.suggestion}</p>
                        </div>
                        <span className="inline-block rounded bg-emerald-500/10 px-2.5 py-1 text-sm font-bold text-emerald-500">+{item.estimatedScoreGain}% Gain</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (History Timeline & Comparison selector) */}
          <div className="space-y-8">
            {/* Version Timeline */}
            <div className="border border-border rounded-lg bg-card p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Scan Version Timeline</h2>
              <div className="flex flex-col gap-3">
                {reports.map((r) => {
                  const isActive = activeReport?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setActiveReport(r);
                        setComparison(null);
                      }}
                      className={`w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold block">{r.job?.title || "Target Scan"}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`text-sm font-extrabold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{r.overallScore}%</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compare Tool */}
            {reports.length > 1 && (
              <div className="border border-border rounded-lg bg-card p-6 space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Side-by-Side Comparer</h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Compare Version A (Older)</label>
                    <select
                      value={reportAId}
                      onChange={(e) => setReportAId(e.target.value)}
                      className="w-full rounded-md border border-border bg-input px-3 py-1.5 text-xs focus-visible:outline-none"
                    >
                      {reports.map((r) => (
                        <option key={r.id} value={r.id}>
                          {new Date(r.createdAt).toLocaleDateString()} - {r.job?.title || "Scan"} ({r.overallScore}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">With Version B (Newer)</label>
                    <select
                      value={reportBId}
                      onChange={(e) => setReportBId(e.target.value)}
                      className="w-full rounded-md border border-border bg-input px-3 py-1.5 text-xs focus-visible:outline-none"
                    >
                      {reports.map((r) => (
                        <option key={r.id} value={r.id}>
                          {new Date(r.createdAt).toLocaleDateString()} - {r.job?.title || "Scan"} ({r.overallScore}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleCompare}
                    className="w-full rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground"
                  >
                    Compare Reports
                  </button>
                </div>

                {/* Compare Result Rendering */}
                {comparison && (
                  <div className="border border-dashed border-border rounded-lg p-4 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Overall Progress</span>
                      <span className={comparison.delta.overallScore >= 0 ? "text-emerald-500" : "text-rose-500"}>
                        {comparison.delta.overallScore >= 0 ? "+" : ""}
                        {comparison.delta.overallScore}% score change
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] text-muted-foreground border-t border-border pt-2">
                      <div>
                        <span className="font-semibold block mb-0.5">Keyword Delta</span>
                        <span>{comparison.delta.keywordScore >= 0 ? "+" : ""}{comparison.delta.keywordScore}%</span>
                      </div>
                      <div>
                        <span className="font-semibold block mb-0.5">Semantic Delta</span>
                        <span>{comparison.delta.semanticScore >= 0 ? "+" : ""}{comparison.delta.semanticScore}%</span>
                      </div>
                    </div>

                    {comparison.delta.newlyMatchedKeywords.length > 0 && (
                      <div className="border-t border-border pt-2">
                        <span className="text-[10px] text-emerald-500 font-bold uppercase block mb-1">Newly Matched</span>
                        <div className="flex flex-wrap gap-1">
                          {comparison.delta.newlyMatchedKeywords.map((k: string) => (
                            <span key={k} className="inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] text-emerald-600 border border-emerald-200">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
