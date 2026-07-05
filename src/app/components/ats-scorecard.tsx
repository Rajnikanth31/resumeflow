"use client";
import React, { useState, useEffect, useCallback } from "react";
import { SparklesIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, ChartBarIcon } from "@heroicons/react/24/outline";

interface ATSScorecardProps {
  resumeId: string;
}

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
  createdAt: string;
}

interface JobItem {
  id: string;
  title: string;
  company: string;
}

export default function ATSScorecard({ resumeId }: ATSScorecardProps) {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ATSReport | null>(null);
  const [history, setHistory] = useState<ATSReport[]>([]);
  const [compareReportId, setCompareReportId] = useState<string>("");
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        if (data.jobs && data.jobs.length > 0) {
          setSelectedJobId(data.jobs[0].id);
        }
      }
    } catch (e) {
      console.error("Error fetching jobs:", e);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ats-reports`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.reports || []);
        if (data.reports && data.reports.length > 0) {
          setReport(data.reports[0]);
        }
      }
    } catch (e) {
      console.error("Error fetching scan history:", e);
    }
  }, [resumeId]);

  useEffect(() => {
    fetchJobs();
    fetchHistory();
  }, [resumeId, fetchJobs, fetchHistory]);

  async function handleScan() {
    if (!selectedJobId) return;
    setIsLoading(true);
    setComparisonResult(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ats-scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJobId }),
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
        fetchHistory();
      }
    } catch (e) {
      console.error("Error running ATS scan:", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCompare() {
    if (!report || !compareReportId) return;
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ats-reports/compare?reportIdA=${compareReportId}&reportIdB=${report.id}`);
      if (res.ok) {
        const data = await res.json();
        setComparisonResult(data);
      }
    } catch (e) {
      console.error("Error comparing reports:", e);
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
    <div className="flex flex-col gap-6 p-4 bg-card border border-border rounded-lg text-card-foreground">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-primary" />
          ATS Scorecard & Scorer
        </h2>
      </div>

      {/* Scorer Config Actions */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Job Profile</label>
        <div className="flex gap-2">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="flex-1 rounded-md border border-border bg-input px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.company})
              </option>
            ))}
          </select>
          <button
            onClick={handleScan}
            disabled={isLoading || !selectedJobId}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              <ChartBarIcon className="h-4 w-4" />
            )}
            Audit
          </button>
        </div>
      </div>

      {/* ATS Scores Gauge & Reasonings */}
      {report && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-xl font-extrabold ${getScoreColor(report.overallScore)}`}>
              {report.overallScore}%
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Overall Match Score</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{report.reasoning}</p>
            </div>
          </div>

          {/* Sub-categories Breakdown Metrics */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detailed Metric Scores</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Keywords", val: report.keywordScore },
                { name: "Semantic", val: report.semanticScore },
                { name: "Experience", val: report.experienceScore },
                { name: "Project", val: report.projectScore },
                { name: "Education", val: report.educationScore },
                { name: "Quality", val: report.qualityScore },
              ].map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>{category.name}</span>
                    <span>{category.val}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className={`h-1.5 rounded-full ${getScoreBarColor(category.val)}`}
                      style={{ width: `${category.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keyword Heatmaps */}
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Keyword Match Heatmap</h3>
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-xs text-emerald-500 font-semibold block mb-1">Matched Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {report.matchedKeywords.map((k) => (
                    <span key={k} className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircleIcon className="h-3 w-3" />
                      {k}
                    </span>
                  ))}
                  {report.matchedKeywords.length === 0 && (
                    <span className="text-xs text-muted-foreground italic">None identified</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs text-rose-500 font-semibold block mb-1">Missing Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {report.missingKeywords.map((k) => (
                    <span key={k} className="inline-flex items-center gap-1 rounded bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 text-xs text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      <XCircleIcon className="h-3 w-3" />
                      {k}
                    </span>
                  ))}
                  {report.missingKeywords.length === 0 && (
                    <span className="text-xs text-muted-foreground italic">None identified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Prioritized Action Recommendations */}
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ATS Improvement Suggestions</h3>
            <div className="flex flex-col gap-3">
              {report.improvementSuggestions.map((item, idx) => (
                <div key={idx} className="p-3 border border-border rounded-md bg-muted/30 hover:bg-muted/50 transition-all flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">{item.category}</span>
                    <p className="text-xs leading-normal">{item.suggestion}</p>
                  </div>
                  <span className="inline-block rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs font-bold text-emerald-500">+{item.estimatedScoreGain}%</span>
                </div>
              ))}
              {report.improvementSuggestions.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No suggestions required. Resume matches target requirements perfectly!</p>
              )}
            </div>
          </div>

          {/* Report Comparison Tool */}
          {history.length > 1 && (
            <div className="flex flex-col gap-3 border-t border-border pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Compare with Past Version</h3>
              <div className="flex gap-2">
                <select
                  value={compareReportId}
                  onChange={(e) => setCompareReportId(e.target.value)}
                  className="flex-1 rounded-md border border-border bg-input px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">Select past scan...</option>
                  {history
                    .filter((h) => h.id !== report.id)
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {new Date(h.createdAt).toLocaleDateString()} (Score: {h.overallScore}%)
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleCompare}
                  disabled={!compareReportId}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50"
                >
                  Compare
                </button>
              </div>

              {/* Comparison Output */}
              {comparisonResult && (
                <div className="p-3 border border-dashed border-border rounded-md bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Overall Progress</span>
                    <span className={comparisonResult.delta.overallScore >= 0 ? "text-emerald-500" : "text-rose-500"}>
                      {comparisonResult.delta.overallScore >= 0 ? "+" : ""}
                      {comparisonResult.delta.overallScore}% score change
                    </span>
                  </div>
                  {comparisonResult.delta.newlyMatchedKeywords.length > 0 && (
                    <div>
                      <span className="text-[10px] text-emerald-500 font-bold uppercase block mb-1">Newly Matched</span>
                      <div className="flex flex-wrap gap-1">
                        {comparisonResult.delta.newlyMatchedKeywords.map((k: string) => (
                          <span key={k} className="inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-600 border border-emerald-200">
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
      )}
    </div>
  );
}
