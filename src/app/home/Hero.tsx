"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SparklesIcon, DocumentPlusIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
const ROLES = ["Senior Frontend Engineer", "Product Designer", "Data Scientist", "Growth Marketer", "ML Engineer"];

export const Hero = () => {
  // 1. Role Typing Loop
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // 2. ATS Match Score Count Up
  const [atsScore, setAtsScore] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const activeRole = ROLES[roleIndex % ROLES.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setRoleText((prev) => prev.slice(0, -1));
        setTypingSpeed(40);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setRoleText((prev) => activeRole.slice(0, prev.length + 1));
        setTypingSpeed(100);
      }, typingSpeed);
    }

    if (!isDeleting && roleText === activeRole) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && roleText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => prev + 1);
      setTypingSpeed(150);
    }

    return () => clearTimeout(timer);
  }, [roleText, isDeleting, roleIndex, typingSpeed]);

  useEffect(() => {
    let currentScore = 0;
    const interval = setInterval(() => {
      if (currentScore < 94) {
        currentScore += 2;
        setAtsScore(currentScore);
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-card text-foreground rounded-3xl px-8 lg:px-16 shadow-2xl border border-border">
      {/* Ambient glowing radial light overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,170,92,0.08),transparent_45%)] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
        {/* Left Messaging Panel */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
            <SparklesIcon className="h-3.5 w-3.5" />
            AI CAREER OPERATING SYSTEM
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-heading leading-[1.05] bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent">
            Build a resume that gets{" "}
            <span className="bg-gradient-to-r from-[color:var(--theme-gold)] to-[color:var(--theme-gold-secondary)] bg-clip-text text-transparent">
              interviews
            </span>
            ,<br /> not{" "}
            <span className="text-muted-foreground/60 line-through decoration-rose-500 decoration-2">
              rejections
            </span>
            .
          </h1>

          <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
            AI-tailored. ATS-optimized. Job-ready. ResumeFlow rewrites your bullet points to match any job, verifies ATS compliance, and exports a complete application package in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              href="/resume-import"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 transition-all"
            >
              <DocumentPlusIcon className="h-5 w-5" />
              Build Your Resume
            </Link>
            <a
              href="#score"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              Watch Demo
            </a>
          </div>

          <div className="flex items-center gap-4 pt-8 border-t border-border text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
              Privacy-first · local storage
            </span>
            <span>•</span>
            <span>No credit card required</span>
            <span>•</span>
            <span className="font-mono">40k+ resumes optimized</span>
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="lg:col-span-5 relative">
          {/* Main Mockup Document card */}
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-1.5 shadow-2xl backdrop-blur-sm group hover:border-indigo-500/30 transition-all duration-500">
            <div className="rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-border flex flex-col min-h-[380px] p-6 shadow-inner">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="width-3.5 h-3.5 w-3.5 rounded-full bg-rose-500/70 inline-block"></span>
                  <span className="width-3.5 h-3.5 w-3.5 rounded-full bg-amber-500/70 inline-block"></span>
                  <span className="width-3.5 h-3.5 w-3.5 rounded-full bg-emerald-500/70 inline-block"></span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">alex_morgan_resume.pdf</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xl font-bold font-heading">Alex Morgan</div>
                  <div className="font-mono text-xs text-indigo-500 dark:text-indigo-400 h-5 mt-0.5">
                    {roleText}
                    <span className="inline-block w-[2px] h-3.5 bg-indigo-500 ml-0.5 animate-pulse" />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase block mb-2">EXPERIENCE</span>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold">Senior Engineer · Stripe</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      Led a team of 5 to ship a search platform used by 40k daily users; drove signup rate up <span className="text-emerald-500 font-mono font-bold">20%</span>.
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase block mb-2">SKILLS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["React", "TypeScript", "Node.js", "GraphQL"].map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono border border-border">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Score Badge Widget */}
            <div className="absolute -top-6 -right-6 bg-card border border-border rounded-xl p-4 shadow-xl flex flex-col justify-between w-28 h-24 hover:scale-105 transition-transform">
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">ATS MATCH</span>
              <span className="text-2xl font-black font-heading text-indigo-500 dark:text-indigo-400">{atsScore}%</span>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-1 rounded-full transition-all duration-300" style={{ width: `${atsScore}%` }} />
              </div>
            </div>

            {/* Floating Keyword Badge Widget */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-3.5 shadow-xl flex items-center gap-3 hover:scale-105 transition-transform">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">✓</div>
              <div>
                <div className="text-xs font-bold">+6 keywords matched</div>
                <div className="text-[9px] text-muted-foreground font-mono">Next.js · PostgreSQL added</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
