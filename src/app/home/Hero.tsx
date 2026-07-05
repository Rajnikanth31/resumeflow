import Link from "next/link";
import { SparklesIcon, DocumentPlusIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { AutoTypingResume } from "home/AutoTypingResume";

export const Hero = () => {
  return (
    <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-card text-foreground rounded-3xl px-8 lg:px-16 shadow-2xl border border-border">
      {/* Ambient glowing radial light overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
        {/* Left Messaging Panel */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
            <SparklesIcon className="h-3.5 w-3.5" />
            AI Career Platform v1.0.0-beta
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-heading leading-[1.1] bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent">
            Land your next interview. <br />
            Powered by AI.
          </h1>

          <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
            ResumeFlow is the premium AI Career Platform built to optimize your job application outcomes. Verify ATS compliance, tailor resume versions, and export unified cover letter packages in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              href="/resume-import"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/15 transition-all"
            >
              <DocumentPlusIcon className="h-5 w-5" />
              Build Your Resume
            </Link>
            <Link
              href="/resume-parser"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              Verify ATS Score
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-8 border-t border-border text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
              Privacy Focused (Local Storage)
            </span>
            <span>•</span>
            <span>No Credit Card Required</span>
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-1.5 shadow-2xl backdrop-blur-sm group hover:border-indigo-500/40 transition-all duration-500">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition duration-1000 blur-sm pointer-events-none" />
            <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center min-h-[380px] p-4">
              <AutoTypingResume />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
