"use client";
import React from "react";

interface MockResume {
  id: string;
  title: string;
  template: string;
  updatedAt: string;
  atsScore: number;
  isDraft: boolean;
}

const mockResumes: MockResume[] = [
  {
    id: "res-1",
    title: "Software Engineer Core Resume",
    template: "ATS Professional",
    updatedAt: "2 hours ago",
    atsScore: 88,
    isDraft: false,
  },
  {
    id: "res-2",
    title: "Product Manager Variant",
    template: "Executive Minimal",
    updatedAt: "3 days ago",
    atsScore: 74,
    isDraft: true,
  },
];

const trackerStats = [
  {
    label: "Applied",
    count: 12,
    borderColor: "border-blue-100 dark:border-blue-900/30",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Interviewing",
    count: 4,
    borderColor: "border-amber-100 dark:border-amber-900/30",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Offers",
    count: 2,
    borderColor: "border-emerald-100 dark:border-emerald-900/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Rejected",
    count: 1,
    borderColor: "border-rose-100 dark:border-rose-900/30",
    textColor: "text-rose-600 dark:text-rose-400",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Dashboard Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome to your ResumeFlow Career Dashboard.
          </p>
        </div>
      </div>

      {/* Application Tracker Pipeline Section */}
      <section className="space-y-4">
        <h2 className="font-heading font-semibold text-xl tracking-tight text-foreground">
          Application Tracker
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {trackerStats.map((stat) => (
            <div
              key={stat.label}
              className={`flex flex-col rounded-lg border bg-card p-5 transition-all hover:shadow-md ${stat.borderColor}`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {stat.label}
              </span>
              <span className={`mt-2 font-heading text-3xl font-extrabold ${stat.textColor}`}>
                {stat.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Resumes Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold text-xl tracking-tight text-foreground">
            My Resumes
          </h2>
          <button className="flex items-center gap-2 rounded-md bg-zinc-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockResumes.map((resume) => (
            <div
              key={resume.id}
              className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    resume.isDraft 
                      ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
                  }`}>
                    {resume.isDraft ? "Draft" : "Active"}
                  </span>
                  
                  {resume.atsScore && (
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {resume.atsScore}% Match
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {resume.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Template: {resume.template}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-gray-400">
                <span>Updated {resume.updatedAt}</span>
                
                <div className="flex items-center gap-2">
                  <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400" aria-label="Edit Resume">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400" aria-label="Duplicate Resume">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </button>
                  <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 text-red-500 dark:text-red-400" aria-label="Delete Resume">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
