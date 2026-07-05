"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectResume, setResume } from "lib/redux/resumeSlice";
import { SparklesIcon, CheckIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface JobDescription {
  id: string;
  title: string;
  company: string;
}

interface ResumeTailorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resumeId: string;
}

export default function ResumeTailorDrawer({ isOpen, onClose, resumeId }: ResumeTailorDrawerProps) {
  const dispatch = useAppDispatch();
  const currentResume = useAppSelector(selectResume);

  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tailoredData, setTailoredData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchJobs();
    }
  }, [isOpen]);

  async function fetchJobs() {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
        if (data.length > 0) {
          setSelectedJobId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleTailor() {
    if (!selectedJobId) return;
    setIsLoading(true);
    setTailoredData(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/tailor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJobId }),
      });
      if (res.ok) {
        const data = await res.json();
        setTailoredData(data.tailored);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAccept() {
    if (!tailoredData) return;

    const updatedResume = {
      ...currentResume,
      profile: {
        ...currentResume.profile,
        summary: tailoredData.summary,
      },
      workExperiences: currentResume.workExperiences.map((w) => {
        const match = tailoredData.workExperiences.find(
          (tw: any) => tw.company.toLowerCase().trim() === w.company.toLowerCase().trim()
        );
        return match ? { ...w, descriptions: match.descriptions } : w;
      }),
      projects: currentResume.projects.map((p) => {
        const match = tailoredData.projects.find(
          (tp: any) => tp.project.toLowerCase().trim() === p.project.toLowerCase().trim()
        );
        return match ? { ...p, descriptions: match.descriptions } : p;
      }),
    };

    dispatch(setResume(updatedResume));
    onClose();
  }

  async function handleSaveAsNew() {
    if (!tailoredData) return;

    const targetJob = jobs.find((j) => j.id === selectedJobId);
    const versionName = targetJob ? `Tailored for ${targetJob.company}` : "Tailored Version";

    try {
      const updatedResume = {
        ...currentResume,
        profile: {
          ...currentResume.profile,
          summary: tailoredData.summary,
        },
        workExperiences: currentResume.workExperiences.map((w) => {
          const match = tailoredData.workExperiences.find(
            (tw: any) => tw.company.toLowerCase().trim() === w.company.toLowerCase().trim()
          );
          return match ? { ...w, descriptions: match.descriptions } : w;
        }),
        projects: currentResume.projects.map((p) => {
          const match = tailoredData.projects.find(
            (tp: any) => tp.project.toLowerCase().trim() === p.project.toLowerCase().trim()
          );
          return match ? { ...p, descriptions: match.descriptions } : p;
        }),
      };

      const apiPayload = {
        profile: updatedResume.profile,
        workHistory: updatedResume.workExperiences.map((w) => ({
          company: w.company,
          position: w.jobTitle,
          startDate: w.date.split("-")[0] || "2026",
          descriptions: w.descriptions,
        })),
        projects: updatedResume.projects.map((p) => ({
          name: p.project,
          role: "",
          startDate: p.date.split("-")[0] || "2026",
          descriptions: p.descriptions,
        })),
      };

      await fetch(`/api/resumes/${resumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      await fetch(`/api/resumes/${resumeId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionName }),
      });

      dispatch(setResume(updatedResume));
      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l border-border bg-card p-6 shadow-xl flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-primary" />
          AI Resume Tailoring
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-foreground">
          ✕
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-xs text-gray-500 italic py-6">
          No saved jobs found. Import job descriptions in the Jobs tab first.
        </p>
      ) : (
        <div className="space-y-4">
          <label className="text-xs font-semibold text-gray-500 block">
            Select Target Job Description
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full rounded-lg border border-border bg-background p-2 text-sm focus:outline-none"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} - {job.company}
              </option>
            ))}
          </select>

          <button
            onClick={handleTailor}
            disabled={isLoading}
            className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              <SparklesIcon className="h-4 w-4" />
            )}
            {isLoading ? "Rewriting Resume..." : "Tailor Resume for Job"}
          </button>
        </div>
      )}

      {tailoredData && (
        <div className="flex-1 overflow-y-auto space-y-6 border-t border-border pt-4">
          {/* Summary Preview */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-primary block">TAILORED PROFILE SUMMARY</span>
            <p className="text-xs text-foreground bg-background border border-border rounded-lg p-3 italic">
              {tailoredData.summary}
            </p>
          </div>

          {/* Work Experiences */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-primary block">TAILORED WORK EXPERIENCE</span>
            {tailoredData.workExperiences.map((w: any, idx: number) => (
              <div key={idx} className="bg-background border border-border rounded-lg p-3 space-y-1">
                <span className="text-xs font-bold block">{w.company}</span>
                <ul className="list-disc pl-4 text-[11px] text-gray-500 space-y-1">
                  {w.descriptions.map((desc: string, i: number) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Action triggers */}
          <div className="flex gap-3 border-t border-border pt-4">
            <button
              onClick={handleAccept}
              className="flex-1 rounded-lg bg-green-600 py-2.5 text-xs font-bold text-white hover:bg-green-700 transition-all"
            >
              Accept & Apply Changes
            </button>
            <button
              onClick={handleSaveAsNew}
              className="flex-1 rounded-lg bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/95 transition-all"
            >
              Save as New Resume Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
