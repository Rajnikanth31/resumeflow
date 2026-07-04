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

const atsHistory = [
  { date: "May 10", score: 60 },
  { date: "May 22", score: 68 },
  { date: "Jun 05", score: 72 },
  { date: "Jun 18", score: 81 },
  { date: "Jul 04", score: 88 },
];

const atsMetrics = [
  { name: "Keyword Match", score: 92, color: "bg-indigo-600 dark:bg-indigo-500" },
  { name: "Format & Structure", score: 95, color: "bg-emerald-600 dark:bg-emerald-500" },
  { name: "Quantifiable Impact", score: 78, color: "bg-amber-600 dark:bg-amber-500" },
];

const mockActivities = [
  { id: "act-1", text: "Optimized Software Engineer Core Resume using AI", time: "2 hours ago" },
  { id: "act-2", text: "Scanned Product Manager Variant against Amazon JD", time: "1 day ago" },
  { id: "act-3", text: "Applied to Senior Engineer position at Stripe", time: "2 days ago" },
];

const mockNotifications = [
  { id: "not-1", text: "AI Suggestion: Add 'GraphQL API design' key phrase to maximize match score", type: "suggestion" },
  { id: "not-2", text: "ResumeFlow v1.1 update: NestJS API routing upgrades are live", type: "update" },
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

      {/* Main Content Layout Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Side: Primary Content Panel (2 columns) */}
        <div className="lg:col-span-2 space-y-8">
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

          {/* ATS Diagnostics & Analytics Section */}
          <section className="space-y-4">
            <h2 className="font-heading font-semibold text-xl tracking-tight text-foreground">
              ATS Diagnostics & Analytics
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Chart Panel */}
              <div className="rounded-lg border border-border bg-card p-5 md:col-span-2 space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Score Scan History
                </h3>
                <div className="h-44 w-full flex items-end justify-between pt-4">
                  {atsHistory.map((scan) => (
                    <div key={scan.date} className="flex flex-col items-center gap-2 flex-1">
                      <div className="relative flex flex-col justify-end w-full h-32 items-center">
                        <span className="absolute -top-6 text-xs font-bold text-primary">
                          {scan.score}%
                        </span>
                        <div 
                          style={{ height: `${scan.score}%` }}
                          className="w-10 rounded-t bg-gradient-to-t from-primary/30 to-primary transition-all duration-500 hover:opacity-80"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">
                        {scan.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metric Breakdown Panel */}
              <div className="rounded-lg border border-border bg-card p-5 space-y-5">
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Diagnostic Breakdown
                </h3>
                <div className="space-y-4">
                  {atsMetrics.map((metric) => (
                    <div key={metric.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-500 dark:text-gray-400">{metric.name}</span>
                        <span className="font-semibold text-foreground">{metric.score}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-800">
                        <div 
                          className={`h-full rounded-full ${metric.color}`}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Resumes Grid Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-xl tracking-tight text-foreground">
                My Resumes
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
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

        {/* Right Side: Quick Action Sidebar Controls (1 column) */}
        <div className="space-y-8">
          {/* Subscription Status Card */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Subscription
              </h3>
              <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                PRO Member
              </span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Resumes Limit</span>
                  <span className="font-semibold text-foreground">2 of 10</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-primary" style={{ width: "20%" }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">AI Tokens Scans</span>
                  <span className="font-semibold text-foreground">85% remaining</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: "85%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Quick Actions
            </h3>
            <div className="grid gap-3">
              <button className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-left text-sm font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Resume
              </button>
              <button className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-left text-sm font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload & Parse PDF
              </button>
              <button className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-left text-sm font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                ATS Match Scanner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Splits: Recent Activity & Notifications */}
      <div className="grid gap-6 md:grid-cols-2 border-t border-border pt-8">
        {/* Recent Activity */}
        <section className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h2 className="font-heading font-semibold text-lg tracking-tight text-foreground">
            Recent Activity
          </h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {mockActivities.map((activity, i) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {i !== mockActivities.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-zinc-800" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-foreground">{activity.text}</p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-gray-400">
                          <time>{activity.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h2 className="font-heading font-semibold text-lg tracking-tight text-foreground">
            Notifications
          </h2>
          <div className="space-y-4">
            {mockNotifications.map((notif) => (
              <div 
                key={notif.id}
                className={`flex gap-3 rounded-lg border p-4 bg-card ${
                  notif.type === "suggestion"
                    ? "border-primary/20 bg-primary/5 text-primary"
                    : "border-border text-foreground"
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{notif.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
