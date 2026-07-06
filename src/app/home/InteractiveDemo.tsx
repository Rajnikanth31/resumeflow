"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Section, SectionHeader } from "home/Section";
import { Reveal } from "home/Reveal";

const KEYWORDS = {
  matched: ["React", "TypeScript", "Node.js", "REST API", "Git", "Agile"],
  weak: ["GraphQL", "Docker"],
  missing: ["Next.js", "PostgreSQL", "Kubernetes"],
};

const STATS = [
  { value: 2.3, suffix: "x", decimals: 1, text: "more interviews for tailored resumes*" },
  { value: 12, suffix: "s", decimals: 0, text: "to a tailored draft" },
  { value: 40, suffix: "k+", decimals: 0, text: "resumes optimized" },
  { value: 3, suffix: "", decimals: 0, text: "export formats: PDF · DOCX · ZIP" },
];

export const InteractiveDemo = () => {
  const [score, setScore] = useState(0);
  const [statValues, setStatValues] = useState(STATS.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      setScore(94);
      setStatValues(STATS.map((s) => s.value));
    };
    if (reduced) {
      finish();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated) return;
        setHasAnimated(true);
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setScore(Math.round(94 * ease));
          setStatValues(STATS.map((s) => parseFloat((s.value * ease).toFixed(s.decimals))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const strokeDashoffset = 326.7 * (1 - score / 100);

  return (
    <Section id="ats">
      <SectionHeader
        kicker="Live ATS scoring"
        title="See exactly why you match — and what to fix"
        subtitle="ResumeFlow compares your resume to the job description across skills, stack, seniority, and keyword coverage."
      />
      <div ref={sectionRef}>
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 rounded-3xl border border-border bg-card p-8 shadow-e3 md:grid-cols-3 lg:p-12">
            {/* Score ring */}
            <div className="flex justify-center">
              <div
                className="relative h-52 w-52"
                role="img"
                aria-label={`ATS match score: 94 out of 100`}
              >
                <svg width="208" height="208" viewBox="0 0 120 120" className="-rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" className="stroke-muted" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="url(#atsGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="326.7"
                    strokeDashoffset={strokeDashoffset}
                  />
                  <defs>
                    <linearGradient id="atsGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="hsl(var(--primary))" />
                      <stop offset="1" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold tracking-tight text-foreground">{score}</span>
                  <span className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    ATS match score
                  </span>
                </div>
              </div>
            </div>

            {/* Keyword breakdown */}
            <div className="space-y-6 md:col-span-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-success">
                ▲ Strong match
              </span>
              {(
                [
                  ["Matched", KEYWORDS.matched, "border-success/25 bg-success/10 text-success"],
                  ["Weak", KEYWORDS.weak, "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"],
                  ["Missing", KEYWORDS.missing, "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"],
                ] as const
              ).map(([label, words, chipClass]) => (
                <div key={label}>
                  <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </span>
                  <ul className="flex flex-wrap gap-2">
                    {words.map((k) => (
                      <li
                        key={k}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${chipClass}`}
                      >
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link
                href="/resume-import"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-foreground"
              >
                Score your resume free →
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((item, idx) => (
            <Reveal key={item.text} delay={idx * 80}>
              <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-e1">
                <span className="text-3xl font-bold tracking-tight text-foreground">
                  {statValues[idx].toFixed(item.decimals)}
                  {item.suffix}
                </span>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground/80">
          *Based on aggregate interview-rate data for keyword-tailored vs. generic resumes.
        </p>
      </div>
    </Section>
  );
};
