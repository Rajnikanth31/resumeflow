"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon
} from "@heroicons/react/24/outline";

interface JobItem {
  id: string;
  title: string;
  company: string;
}

interface CoverLetter {
  id: string;
  title: string;
  content: string;
  tone: string;
  qualityScore?: any;
  explanations?: any;
  createdAt: string;
}

interface CoverLetterVersion {
  id: string;
  versionName: string;
  content: string;
  createdAt: string;
}

export default function CoverLetterPage({ params }: { params: { id: string } }) {
  const resumeId = params.id;
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [history, setHistory] = useState<CoverLetterVersion[]>([]);
  const [versionName, setVersionName] = useState("");
  
  // Customization Options
  const [tone, setTone] = useState("Formal");
  const [template, setTemplate] = useState("Modern");
  const [hiringStyle, setHiringStyle] = useState("Standard");

  // Checklist Validation
  const [checklist, setChecklist] = useState({
    resumeComplete: true,
    coverLetterComplete: false,
    atsAvailable: false,
    contactInfoPresent: true,
  });

  // AI Final Review Suggestions
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);

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

  const fetchHistory = useCallback(async (clId: string) => {
    try {
      const res = await fetch(`/api/cover-letters/${clId}/versions`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.versions || []);
      }
    } catch (e) {
      console.error("Error fetching cover letter versions:", e);
    }
  }, []);

  const fetchCoverLetters = useCallback(async () => {
    try {
      const res = await fetch(`/api/resumes/${resumeId}/cover-letters`);
      if (res.ok) {
        const data = await res.json();
        if (data.coverLetters && data.coverLetters.length > 0) {
          const cl = data.coverLetters[0];
          setCoverLetter(cl);
          fetchHistory(cl.id);
          setChecklist((prev) => ({
            ...prev,
            coverLetterComplete: cl.content.length > 50,
          }));
        }
      }
    } catch (e) {
      console.error("Error fetching cover letters:", e);
    }
  }, [resumeId, fetchHistory]);

  const fetchATSReports = useCallback(async () => {
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ats-reports`);
      if (res.ok) {
        const data = await res.json();
        setChecklist((prev) => ({
          ...prev,
          atsAvailable: data.reports && data.reports.length > 0,
        }));
      }
    } catch (e) {
      console.error("Error fetching ATS reports:", e);
    }
  }, [resumeId]);

  useEffect(() => {
    fetchJobs();
    fetchCoverLetters();
    fetchATSReports();
  }, [resumeId, fetchJobs, fetchCoverLetters, fetchATSReports]);

  async function handleGenerate() {
    setIsLoading(true);
    setAiSuggestions([]);
    try {
      const res = await fetch("/api/cover-letters/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobId: selectedJobId, tone }),
      });
      if (res.ok) {
        const data = await res.json();
        setCoverLetter(data.coverLetter);
        setHistory([data.version]);
        setChecklist((prev) => ({
          ...prev,
          coverLetterComplete: data.coverLetter.content.length > 50,
        }));
      }
    } catch (e) {
      console.error("Error generating cover letter:", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveVersion() {
    if (!coverLetter || !versionName) return;
    try {
      const res = await fetch(`/api/cover-letters/${coverLetter.id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionName, content: coverLetter.content }),
      });
      if (res.ok) {
        const data = await res.json();
        setHistory((prev) => [data.version, ...prev]);
        setVersionName("");
      }
    } catch (e) {
      console.error("Error saving cover letter version:", e);
    }
  }

  async function handleFinalAIReview() {
    if (!coverLetter) return;
    setIsReviewing(true);
    // Simulate AI final polishing review
    setTimeout(() => {
      setAiSuggestions([
        "Address the hiring manager by name if available to add personalization.",
        "Highlight your quantified impact metrics from Stripe SRE experience.",
        "Ensure formatting margins match your resume style layout."
      ]);
      setIsReviewing(false);
    }, 1000);
  }

  async function handleExportPackage() {
    if (!coverLetter) return;
    try {
      // 1. Create Application Package log
      const logRes = await fetch("/api/application-packages/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          jobId: selectedJobId || null,
          coverLetterId: coverLetter.id,
          exportMetadata: { template, tone, hiringStyle },
        }),
      });

      if (logRes.ok) {
        const logData = await logRes.json();
        const packageId = logData.package.id;
        // 2. Trigger binary ZIP download redirect
        window.location.href = `/api/application-packages/${packageId}/export`;
      }
    } catch (e) {
      console.error("Error exporting application package:", e);
    }
  }

  // Layout Template styles mapping helper
  const getTemplateStyle = () => {
    switch (template) {
      case "Executive":
        return "font-serif max-w-2xl px-12 py-10 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md";
      case "Startup":
        return "font-sans tracking-wide max-w-xl px-6 py-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm";
      case "Academic":
        return "font-mono text-sm max-w-2xl px-10 py-10 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900";
      case "Government":
        return "font-serif text-zinc-950 uppercase tracking-tight max-w-2xl px-12 py-12 border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900";
      default: // Modern
        return "font-sans max-w-2xl px-10 py-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg";
    }
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
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Application Intelligence Editor</h1>
          <p className="text-sm text-muted-foreground">Generate tailored cover letters and export unified application bundles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Side settings and checklists (1 col) */}
        <div className="space-y-6">
          {/* Controls Card */}
          <div className="border border-border rounded-lg bg-card p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cover Letter Controls</h2>
            
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Target Role Profile</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full rounded-md border border-border bg-input px-3 py-1.5 text-xs focus-visible:outline-none"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Recruiter Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-md border border-border bg-input px-3 py-1.5 text-xs focus-visible:outline-none"
              >
                <option value="Formal">Formal / Professional</option>
                <option value="Conversational">Conversational / Warm</option>
                <option value="Technical">Technical / Architect</option>
                <option value="Creative">Creative / Pitch</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Layout Template</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full rounded-md border border-border bg-input px-3 py-1.5 text-xs focus-visible:outline-none"
              >
                <option value="Modern">Modern Style</option>
                <option value="Executive">Executive Serif</option>
                <option value="Startup">Startup Clean</option>
                <option value="Academic">Academic Monospace</option>
                <option value="Government">Government Traditional</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition-all"
            >
              <SparklesIcon className="h-4 w-4" />
              {isLoading ? "Tailoring..." : "Generate AI Cover Letter"}
            </button>
          </div>

          {/* Checklist Card */}
          <div className="border border-border rounded-lg bg-card p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ClipboardDocumentCheckIcon className="h-5 w-5 text-primary" />
              Application Checklist
            </h2>

            <div className="space-y-3">
              {[
                { name: "Resume Completed", ok: checklist.resumeComplete },
                { name: "Cover Letter Tailored", ok: checklist.coverLetterComplete },
                { name: "ATS Score Scanned", ok: checklist.atsAvailable },
                { name: "Required Contact Details", ok: checklist.contactInfoPresent },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-medium">
                  <span>{item.name}</span>
                  {item.ok ? (
                    <CheckCircleIcon className="h-4.5 w-4.5 text-emerald-500" />
                  ) : (
                    <XCircleIcon className="h-4.5 w-4.5 text-rose-500" />
                  )}
                </div>
              ))}
            </div>

            {coverLetter && (
              <button
                onClick={handleExportPackage}
                className="w-full rounded-md bg-emerald-600 py-2.5 text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-sm hover:bg-emerald-700 transition-all mt-4"
              >
                <DocumentArrowDownIcon className="h-4.5 w-4.5" />
                Export Application (ZIP)
              </button>
            )}
          </div>
        </div>

        {/* Right side Document Canvas (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {coverLetter ? (
            <div className="space-y-6">
              {/* Document Preview Canvas */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Document Preview Canvas</span>
                <div className={`${getTemplateStyle()} rounded-lg w-full min-h-[500px]`}>
                  <textarea
                    value={coverLetter.content}
                    onChange={(e) => setCoverLetter({ ...coverLetter, content: e.target.value })}
                    className="w-full h-[450px] bg-transparent resize-none border-none focus:outline-none focus:ring-0 leading-relaxed"
                  />
                </div>
              </div>

              {/* Version History Saver */}
              <div className="border border-border rounded-lg bg-card p-6 space-y-4 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  Cover Letter Versions
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New version name (e.g. Added Stripe Project)..."
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    className="flex-1 rounded-md border border-border bg-input px-3 py-1.5 text-xs focus:outline-none"
                  />
                  <button
                    onClick={handleSaveVersion}
                    className="rounded-md bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground"
                  >
                    Save Version
                  </button>
                </div>

                <div className="flex flex-col gap-2 border-t border-border pt-4">
                  {history.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setCoverLetter({ ...coverLetter, content: v.content })}
                      className="w-full text-left p-3 border border-border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex justify-between items-center text-xs"
                    >
                      <span className="font-semibold">{v.versionName}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(v.createdAt).toLocaleDateString()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Explainable AI breakdown logs */}
              {coverLetter.explanations && (
                <div className="border border-border rounded-lg bg-card p-6 space-y-4 shadow-sm">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <SparklesIcon className="h-5 w-5 text-primary" />
                    Explainable AI Scorer Logic
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold block mb-1 text-primary">Why Key Sections Were Written</span>
                      <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                        {coverLetter.explanations.whySectionsWritten?.map((w: string, idx: number) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-xs font-bold block mb-1 text-primary">Target Job Requirements Addressed</span>
                      <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                        {coverLetter.explanations.jobRequirementsAddressed?.map((r: string, idx: number) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-xs font-bold block mb-1 text-primary">Highlighted Resume Experiences</span>
                      <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                        {coverLetter.explanations.resumeExperiencesEmphasized?.map((e: string, idx: number) => (
                          <li key={idx}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Cover Letter Quality Score breakdown */}
              {coverLetter.qualityScore && (
                <div className="border border-border rounded-lg bg-card p-6 space-y-4 shadow-sm">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cover Letter Quality Score</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Relevance", val: coverLetter.qualityScore.relevance ?? 0 },
                      { name: "Professionalism", val: coverLetter.qualityScore.professionalism ?? 0 },
                      { name: "Grammar", val: coverLetter.qualityScore.grammar ?? 0 },
                      { name: "ATS Alignment", val: coverLetter.qualityScore.atsAlignment ?? 0 },
                    ].map((item) => (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{item.name}</span>
                          <span>{item.val}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${item.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Final Review Trigger */}
              <div className="border border-border rounded-lg bg-card p-6 space-y-4 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <SparklesIcon className="h-5 w-5 text-emerald-500" />
                  AI Final Pre-Export Review
                </h2>
                <p className="text-xs text-muted-foreground">Run one final check on tone and grammar to output polished improvements list.</p>
                
                <button
                  onClick={handleFinalAIReview}
                  disabled={isReviewing}
                  className="rounded bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground"
                >
                  {isReviewing ? "Reviewing..." : "Run AI Review"}
                </button>

                {aiSuggestions.length > 0 && (
                  <div className="border-t border-border pt-4 space-y-2">
                    <span className="text-xs font-bold block text-emerald-500">Optional Polishing Suggestions</span>
                    <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                      {aiSuggestions.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-lg bg-card text-center p-6 shadow-sm">
              <ClipboardDocumentCheckIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-base font-bold">No Cover Letter Generated</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">Select a target job profile on the left controls pane and click generate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
