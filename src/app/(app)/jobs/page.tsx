"use client";
import React, { useState, useEffect } from "react";
import {
  BriefcaseIcon,
  SparklesIcon,
  PlusIcon,
  HeartIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  industry?: string;
  remoteType?: string;
  salaryMin?: number;
  salaryMax?: number;
  seniority?: string;
  techStack: string[];
  hiringFocus?: string;
  matchScore?: number;
  statusCollection: "SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | "ARCHIVED";
  matchedKeywords: string[];
  weakKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  suggestedSkills: string[];
  learningRecommendations: string[];
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("ALL");
  const [isImporting, setIsImporting] = useState(false);
  const [rawText, setRawText] = useState("");
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [viewingJob, setViewingJob] = useState<JobDescription | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleImport() {
    if (!rawText.trim()) return;
    setIsImporting(true);
    try {
      const res = await fetch("/api/jobs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: rawText }),
      });
      if (res.ok) {
        setRawText("");
        await fetchJobs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsImporting(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusCollection: status }),
      });
      if (res.ok) {
        await fetchJobs();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteJob(id: string) {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchJobs();
      }
    } catch (err) {
      console.error(err);
    }
  }

  function toggleCompare(id: string) {
    setSelectedJobIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  const filteredJobs = jobs.filter(
    (j) => selectedCollection === "ALL" || j.statusCollection === selectedCollection
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground">
            Job Intelligence Platform
          </h1>
          <p className="text-sm text-gray-500">
            Import job descriptions, calculate match metrics, and tailor your applications.
          </p>
        </div>
      </div>

      {/* Grid: Import form & Jobs list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Import & Multi-job comparison */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <h2 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-primary" />
              Import Job Description
            </h2>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste job description text here..."
              rows={6}
              className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleImport}
              disabled={isImporting}
              className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary/95 transition-all"
            >
              {isImporting ? "Analyzing Job..." : "Parse & Import Description"}
            </button>
          </div>

          {/* Comparison table */}
          {selectedJobIds.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <h2 className="font-heading font-semibold text-lg text-foreground">
                Multi-Job Comparison ({selectedJobIds.length})
              </h2>
              <div className="space-y-3">
                {jobs
                  .filter((j) => selectedJobIds.includes(j.id))
                  .map((j) => (
                    <div key={j.id} className="border border-border rounded-lg p-3 bg-background">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm">{j.title}</p>
                          <p className="text-xs text-gray-500">{j.company}</p>
                        </div>
                        <span className="rounded bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold">
                          {j.matchScore}% Match
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-[10px] font-bold text-gray-400">MISSING SKILLS:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {j.missingSkills.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-red-50 text-red-600 px-1.5 py-0.5 text-[9px] font-semibold"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Jobs feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Collection Status Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
            {["ALL", "SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED", "ARCHIVED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCollection(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCollection === tab
                    ? "bg-primary text-white"
                    : "bg-card border border-border text-foreground hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Job Feed List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-all space-y-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <div onClick={() => setViewingJob(job)} className="cursor-pointer">
                    <h3 className="font-heading font-bold text-lg text-foreground hover:text-primary transition-all">
                      {job.title}
                    </h3>
                    <p className="text-sm font-semibold text-gray-600">
                      {job.company} | <span className="text-gray-400 text-xs">{job.remoteType}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary/10 text-primary px-2.5 py-1 text-xs font-bold">
                      {job.matchScore}% Match
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedJobIds.includes(job.id)}
                      onChange={() => toggleCompare(job.id)}
                      className="rounded border-border"
                      title="Compare"
                    />
                  </div>
                </div>

                {/* Company Intelligence Tags */}
                <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-400">
                  <span>SENIORITY: {job.seniority}</span>
                  <span>INDUSTRY: {job.industry}</span>
                  <span>FOCUS: {job.hiringFocus}</span>
                </div>

                {/* Heatmap/Skills view */}
                <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs">
                  <div>
                    <span className="font-bold text-green-600 block mb-1">MATCHED SKILLS</span>
                    <div className="flex flex-wrap gap-1">
                      {job.matchedSkills.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="rounded bg-green-50 text-green-700 px-2 py-0.5">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-red-500 block mb-1">MISSING SKILLS</span>
                    <div className="flex flex-wrap gap-1">
                      {job.missingSkills.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="rounded bg-red-50 text-red-600 px-2 py-0.5">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Update category status */}
                <div className="flex justify-between items-center border-t border-border pt-4">
                  <select
                    value={job.statusCollection}
                    onChange={(e) => updateStatus(job.id, e.target.value)}
                    className="rounded-lg border border-border text-xs bg-background p-1.5"
                  >
                    <option value="SAVED">Saved</option>
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>

                  <button
                    onClick={() => deleteJob(job.id)}
                    className="rounded p-1.5 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed dialog view */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-xl border border-border bg-card p-6 shadow-lg max-h-[85vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setViewingJob(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-foreground"
            >
              ✕
            </button>

            <div>
              <h2 className="font-heading font-bold text-2xl text-foreground">
                {viewingJob.title}
              </h2>
              <p className="text-sm font-semibold text-gray-500">
                {viewingJob.company} | {viewingJob.remoteType}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-y border-border py-4 text-xs font-bold text-gray-500">
              <div>SENIORITY: {viewingJob.seniority}</div>
              <div>SALARY RANGE: ${viewingJob.salaryMin || "N/A"} - ${viewingJob.salaryMax || "N/A"}</div>
              <div>MATCH SCORE: {viewingJob.matchScore}%</div>
            </div>

            {/* Keyword heatmap */}
            <div className="space-y-2">
              <h3 className="font-heading font-semibold text-sm text-foreground">Keyword Heatmap</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {viewingJob.matchedKeywords.map((w, idx) => (
                  <span key={idx} className="rounded bg-green-100 text-green-800 px-2 py-0.5 font-semibold">
                    {w}
                  </span>
                ))}
                {viewingJob.weakKeywords.map((w, idx) => (
                  <span key={idx} className="rounded bg-yellow-100 text-yellow-800 px-2 py-0.5 font-semibold">
                    {w} (Weak)
                  </span>
                ))}
                {viewingJob.missingKeywords.map((w, idx) => (
                  <span key={idx} className="rounded bg-red-100 text-red-800 px-2 py-0.5 font-semibold font-mono">
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {/* Learning path */}
            <div className="rounded-lg bg-primary/5 p-4 border border-primary/10 space-y-2">
              <h3 className="font-heading font-bold text-xs text-primary uppercase">Learning Recommendations</h3>
              <ul className="list-disc pl-5 text-xs text-foreground space-y-1">
                {viewingJob.learningRecommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Original Description</h3>
              <p className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed">
                {viewingJob.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
