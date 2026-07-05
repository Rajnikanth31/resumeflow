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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-3xl tracking-tight text-foreground">
            My Resumes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage, duplicate, search, and refine your resumes dynamically.
          </p>
        </div>
        <div>
          <button
            onClick={handleCreate}
            disabled={actionLoading === "create"}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
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

      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-3 py-1.5 shadow-sm">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [field, dir] = e.target.value.split("-");
                setSortBy(field);
                setOrder(dir);
              }}
              className="bg-transparent border-none text-sm text-foreground focus:outline-none focus:ring-0 cursor-pointer pr-8"
            >
              <option value="updatedAt-desc">Last Updated (Newest)</option>
              <option value="updatedAt-asc">Last Updated (Oldest)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>

          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary ${
              showArchived
                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50"
                : "bg-card border-border text-foreground hover:bg-gray-50 dark:hover:bg-zinc-800"
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
                <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-zinc-800" />
                <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-zinc-800" />
              </div>
              <div className="h-8 w-full rounded bg-gray-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-semibold text-foreground">
            {showArchived ? "No archived resumes" : "No resumes found"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {showArchived
              ? "Your deleted resumes will appear here to be restored."
              : "Get started by creating a new resume."}
          </p>
          {!showArchived && (
            <button
              onClick={handleCreate}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/95 transition-all"
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
              className={`group flex flex-col justify-between rounded-lg border border-border bg-card p-5 shadow-sm transition-all ${
                showArchived
                  ? "border-amber-200/50 dark:border-amber-900/30"
                  : "hover:shadow-md hover:border-primary/50 cursor-pointer"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                      showArchived
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
                    }`}
                  >
                    {showArchived ? "Archived" : "Active"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {resume.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Template: {resume.fontFamily || "Classic"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-gray-400">
                  {showArchived ? "Soft deleted" : "Autosaved"}
                </span>

                <div className="flex items-center gap-2">
                  {showArchived ? (
                    <button
                      onClick={(e) => handleRestore(resume.id, e)}
                      disabled={actionLoading === `res-${resume.id}`}
                      className="rounded p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 text-primary focus-visible:outline-none"
                      title="Restore Resume"
                    >
                      {actionLoading === `res-${resume.id}` ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUturnLeftIcon className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => router.push(`/resume-builder?id=${resume.id}`)}
                        className="rounded p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400"
                        title="Edit Resume"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDuplicate(resume.id, e)}
                        disabled={actionLoading === `dup-${resume.id}`}
                        className="rounded p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400"
                        title="Duplicate Resume"
                      >
                        {actionLoading === `dup-${resume.id}` ? (
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDelete(resume.id, e)}
                        disabled={actionLoading === `del-${resume.id}`}
                        className="rounded p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 text-red-500 dark:text-red-400"
                        title="Delete Resume"
                      >
                        {actionLoading === `del-${resume.id}` ? (
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrashIcon className="h-4 w-4" />
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-6 text-sm text-gray-500">
          <div>
            Showing <span className="font-semibold text-foreground">{resumes.length}</span> of{" "}
            <span className="font-semibold text-foreground">{totalCount}</span> resumes
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span className="text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
