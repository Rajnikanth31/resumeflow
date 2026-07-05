import React from "react";
import Link from "next/link";

export const FinalCta = () => {
  return (
    <section id="cta" className="max-w-[1180px] mx-auto py-12 px-6">
      <div className="relative border border-border rounded-3xl overflow-hidden py-16 px-8 text-center bg-gradient-to-b from-card to-card/90 shadow-2xl">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,170,92,0.08),transparent_55%)] pointer-events-none" />

        <div className="relative space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight leading-tight max-w-2xl mx-auto text-foreground">
            Your next interview starts with the{" "}
            <span className="bg-gradient-to-r from-[color:var(--theme-gold)] to-[color:var(--theme-gold-secondary)] bg-clip-text text-transparent">
              right resume
            </span>
            .
          </h2>

          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Build, score, and export a job-ready application package in minutes. Free — no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/resume-import"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 transition-all w-full sm:w-auto"
            >
              Build Your Resume
            </Link>
            <a
              href="#score"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all w-full sm:w-auto"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
