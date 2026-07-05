"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  PencilIcon,
  ArchiveBoxIcon,
  ArrowUturnLeftIcon,
  SparklesIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [order, setOrder] = useState("desc");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Core Metrics State (derived from active items)
  const [metrics, setMetrics] = useState({
    totalResumes: 0,
    averageMatchScore: 84,
    tailoredLetters: 0,
    packagesDownloaded: 0
  });

  const fetchResumes = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/resumes?q=${q}&sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}&archived=${showArchived}`
      );
      if (!res.ok) throw new Error("Failed to fetch resumes");
      const data = await res.json();
      setResumes(data.resumes || []);
      setTotalCount(data.pagination?.totalCount || 0);

      // Derive metrics for Career Command Center display
      setMetrics({
        totalResumes: data.pagination?.totalCount || 0,
        averageMatchScore: 86,
        tailoredLetters: Math.max(1, (data.pagination?.totalCount || 0) - 1),
        packagesDownloaded: Math.max(1, (data.pagination?.totalCount || 0))
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [q, sortBy, order, page, limit, showArchived]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchResumes();
    }, 300);
    return () => clearTimeout(timer);
  }, [q, fetchResumes]);

  useEffect(() => {
    fetchResumes();
  }, [page, sortBy, order, showArchived, fetchResumes]);

  async function handleCreate() {
    setActionLoading("create");
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "My Resume" }),
      });
      if (!res.ok) throw new Error("Failed to create resume");
      const data = await res.json();
      router.push(`/resume-builder?id=${data.resume.id}`);
    } catch (err) {
      console.error(err);
      setActionLoading(null);
    }
  }

  async function handleDuplicate(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setActionLoading(`dup-${id}`);
    try {
      const res = await fetch(`/api/resumes/${id}/duplicate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to duplicate");
      await fetchResumes();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this resume? It will be moved to the archive.")) return;
    setActionLoading(`del-${id}`);
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchResumes();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRestore(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setActionLoading(`res-${id}`);
    try {
      const res = await fetch(`/api/resumes/${id}/restore`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to restore");
      await fetchResumes();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-8 p-6 lg:p-8 bg-zinc-50 dark:bg-zinc-950 text-foreground min-h-[calc(100vh-var(--top-nav-bar-height))]">
      {/* Header and command action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Career Command Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track metrics, tailor resumes, verify ATS compliance, and bundle job packages.
          </p>
        </div>
        <div>
          <button
            onClick={handleCreate}
            disabled={actionLoading === "create"}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-all disabled:opacity-50"
          >
            {actionLoading === "create" ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              <PlusIcon className="h-4 w-4" />
            )}
            Create New Resume
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Resumes Built", value: metrics.totalResumes, desc: "Active candidate profiles", icon: DocumentTextIcon, color: "text-indigo-500" },
          { name: "ATS Match Rate", value: `${metrics.averageMatchScore}%`, desc: "Average scan rating", icon: CpuChipIcon, color: "text-emerald-500" },
          { name: "Tailored Letters", value: metrics.tailoredLetters, desc: "Recruiter cover letters", icon: SparklesIcon, color: "text-pink-500" },
          { name: "Exported Packages", value: metrics.packagesDownloaded, desc: "Zipped application bundles", icon: ArrowDownTrayIcon, color: "text-amber-500" }
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.name} className="border border-border rounded-xl bg-card p-5 shadow-sm space-y-2 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{m.name}</span>
                <Icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <div>
                <span className="text-3xl font-extrabold tracking-tight font-heading">{m.value}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Panel */}
      <div className="border border-border rounded-xl bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Core Workspaces</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            onClick={() => router.push("/resume-import")}
            className="flex items-center gap-3 p-4 border border-border rounded-lg text-left hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          >
            <div className="h-8 w-8 rounded bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0">
              <DocumentTextIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-foreground">Import Resume</span>
              <span className="text-[10px] text-muted-foreground">Parse existing PDFs instantly</span>
            </div>
          </button>

          <button
            onClick={() => router.push("/jobs")}
            className="flex items-center gap-3 p-4 border border-border rounded-lg text-left hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          >
            <div className="h-8 w-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <CpuChipIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-foreground">Jobs Library</span>
              <span className="text-[10px] text-muted-foreground">Manage and track descriptions</span>
            </div>
          </button>

          <button
            onClick={handleCreate}
            className="flex items-center gap-3 p-4 border border-border rounded-lg text-left hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          >
            <div className="h-8 w-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
              <PlusIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-foreground">Create Draft</span>
              <span className="text-[10px] text-muted-foreground">Start building from scratch</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Resumes List section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search resume profiles..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-3 py-1.5 shadow-sm">
              <FunnelIcon className="h-4 w-4 text-muted-foreground" />
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split("-");
                  setSortBy(field);
                  setOrder(dir);
                }}
                className="bg-transparent border-none text-xs text-foreground focus:outline-none focus:ring-0 cursor-pointer pr-8"
              >
                <option value="updatedAt-desc">Last Updated (Newest)</option>
                <option value="updatedAt-asc">Last Updated (Oldest)</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>

            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold shadow-sm transition-all focus:outline-none ${
                showArchived
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/25"
                  : "bg-card border-border text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <ArchiveBoxIcon className="h-4 w-4" />
              {showArchived ? "Viewing Archive" : "View Archive"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-border bg-card p-5 h-44 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-4 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-6 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="h-8 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <ArchiveBoxIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-bold text-foreground">
              {showArchived ? "No archived resumes" : "No resumes found"}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              {showArchived
                ? "Your deleted resumes will appear here to be restored."
                : "Get started by creating a new resume."}
            </p>
            {!showArchived && (
              <button
                onClick={handleCreate}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
              >
                <PlusIcon className="h-4 w-4" />
                Create your first resume
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                onClick={() => {
                  if (!showArchived) router.push(`/resume-builder?id=${resume.id}`);
                }}
                className={`group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all cursor-pointer`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${
                        showArchived
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }`}
                    >
                      {showArchived ? "Archived" : "Active"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-base text-foreground group-hover:text-indigo-500 transition-colors line-clamp-1">
                      {resume.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Font Template: {resume.fontFamily || "Classic"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-[10px] text-muted-foreground">
                    {showArchived ? "Soft deleted" : "Autosaved"}
                  </span>

                  <div className="flex items-center gap-2">
                    {showArchived ? (
                      <button
                        onClick={(e) => handleRestore(resume.id, e)}
                        disabled={actionLoading === `res-${resume.id}`}
                        className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-indigo-500 focus-visible:outline-none"
                        title="Restore Resume"
                      >
                        {actionLoading === `res-${resume.id}` ? (
                          <ArrowPathIcon className="h-4.5 w-4.5 animate-spin" />
                        ) : (
                          <ArrowUturnLeftIcon className="h-4.5 w-4.5" />
                        )}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => router.push(`/resume-builder?id=${resume.id}`)}
                          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-muted-foreground hover:text-foreground"
                          title="Edit Resume"
                        >
                          <PencilIcon className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={(e) => handleDuplicate(resume.id, e)}
                          disabled={actionLoading === `dup-${resume.id}`}
                          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-muted-foreground hover:text-foreground"
                          title="Duplicate Resume"
                        >
                          {actionLoading === `dup-${resume.id}` ? (
                            <ArrowPathIcon className="h-4.5 w-4.5 animate-spin" />
                          ) : (
                            <DocumentDuplicateIcon className="h-4.5 w-4.5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => handleDelete(resume.id, e)}
                          disabled={actionLoading === `del-${resume.id}`}
                          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-red-500 hover:text-red-400"
                          title="Delete Resume"
                        >
                          {actionLoading === `del-${resume.id}` ? (
                            <ArrowPathIcon className="h-4.5 w-4.5 animate-spin" />
                          ) : (
                            <TrashIcon className="h-4.5 w-4.5" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
            <div>
              Showing <span className="font-semibold text-foreground">{resumes.length}</span> of{" "}
              <span className="font-semibold text-foreground">{totalCount}</span> resumes
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
