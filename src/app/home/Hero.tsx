"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

/* ---------------------------------------------------------------------------
   Live product simulation — the hero cycles through 4 stages that mimic a
   real tailoring session: analyze → quantify bullet → add keywords → done.
   Extras: flowing ribbons, typing role line, cursor-follow 3D tilt, and a
   beam that carries the flow down into the page. All of it collapses to a
   calm final state under prefers-reduced-motion.
--------------------------------------------------------------------------- */

const WEAK_BULLET = "Worked on a search feature for the platform.";
const STRONG_BULLET =
  "Led a team of 5 to ship a search platform used by 40k daily users, lifting signup rate 20%.";

const STAGES = [
  { score: 68, suggestion: "Analyzing job description…", applied: false },
  { score: 81, suggestion: "Quantify the impact in your first bullet", applied: true },
  { score: 89, suggestion: "Add missing keywords: Next.js, PostgreSQL", applied: true },
  { score: 94, suggestion: "Resume is interview-ready", applied: true },
];

const ROLES = [
  "Senior Frontend Engineer",
  "Product Designer",
  "DevOps Engineer",
  "Data Scientist",
  "ML Engineer",
];

const BASE_SKILLS = ["React", "TypeScript", "Node.js", "GraphQL"];
const ADDED_SKILLS = ["Next.js", "PostgreSQL"];

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
};

/** Typewriter loop over ROLES */
const useTypedRole = (enabled: boolean) => {
  const [text, setText] = useState(enabled ? "" : ROLES[0]);
  const state = useRef({ role: 0, deleting: false });

  useEffect(() => {
    if (!enabled) {
      setText(ROLES[0]);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const { role, deleting } = state.current;
      const target = ROLES[role % ROLES.length];
      setText((prev) => {
        let next = prev;
        let delay = deleting ? 35 : 70;
        if (!deleting) {
          next = target.slice(0, prev.length + 1);
          if (next === target) {
            state.current.deleting = true;
            delay = 2000;
          }
        } else {
          next = prev.slice(0, -1);
          if (next === "") {
            state.current.deleting = false;
            state.current.role += 1;
            delay = 400;
          }
        }
        timer = setTimeout(tick, delay);
        return next;
      });
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [enabled]);

  return text;
};

export const Hero = () => {
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(STAGES[0].score);
  const scoreRef = useRef(STAGES[0].score);
  const roleText = useTypedRole(!reducedMotion);

  // Cursor-follow 3D tilt on the mockup
  const tiltRef = useRef<HTMLDivElement>(null);
  const handleTilt = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !tiltRef.current) return;
      const rect = tiltRef.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      tiltRef.current.style.transform = `perspective(1100px) rotateY(${px * 6}deg) rotateX(${py * -6}deg)`;
    },
    [reducedMotion]
  );
  const resetTilt = useCallback(() => {
    if (tiltRef.current) {
      tiltRef.current.style.transform = "perspective(1100px) rotateY(0deg) rotateX(0deg)";
    }
  }, []);

  // Advance simulation stage
  useEffect(() => {
    if (reducedMotion) {
      setStage(3);
      setScore(94);
      scoreRef.current = 94;
      return;
    }
    const timer = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  // Animate score toward the current stage target
  useEffect(() => {
    if (reducedMotion) return;
    const target = STAGES[stage].score;
    const timer = setInterval(() => {
      const current = scoreRef.current;
      if (current === target) {
        clearInterval(timer);
        return;
      }
      const next = current < target ? current + 1 : current - 1;
      scoreRef.current = next;
      setScore(next);
    }, 45);
    return () => clearInterval(timer);
  }, [stage, reducedMotion]);

  const current = STAGES[stage];
  const bulletUpgraded = stage >= 1;
  const keywordsAdded = stage >= 2;
  const done = stage === 3;
  const ringOffset = 138.2 * (1 - score / 100);

  return (
    <section className="relative overflow-hidden">
      {/* Premium gradient lighting — slowly drifting, with flowing ribbons */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 animate-drift rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.14),transparent)]" />
        <div className="absolute -right-40 top-24 h-[420px] w-[420px] animate-drift-reverse rounded-full bg-[radial-gradient(closest-side,hsl(var(--accent)/0.10),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        {/* Flowing ribbons — streams crossing the hero */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 700"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <defs>
            <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="0.5" stopColor="hsl(var(--primary))" />
              <stop offset="1" stopColor="hsl(var(--accent))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="ribbon"
            d="M-100,150 C300,60 560,280 820,190 C1080,100 1250,80 1540,160"
            stroke="url(#ribbonGrad)"
            strokeWidth="1.5"
            opacity="0.45"
          />
          <path
            className="ribbon-slow"
            d="M-100,360 C260,280 580,470 860,380 C1140,290 1300,250 1540,330"
            stroke="url(#ribbonGrad)"
            strokeWidth="1.5"
            opacity="0.3"
          />
          <path
            className="ribbon"
            style={{ animationDelay: "-6s" }}
            d="M-100,560 C320,470 620,640 920,540 C1200,450 1350,420 1540,500"
            stroke="url(#ribbonGrad)"
            strokeWidth="1.5"
            opacity="0.22"
          />
        </svg>
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-24">
        {/* ----- Messaging ----- */}
        <div className="lg:col-span-6">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-xs font-semibold text-primary">
              <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
              AI Career Operating System
            </span>
          </div>

          <h1
            className="mt-6 animate-fade-up text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]"
            style={{ animationDelay: "80ms" }}
          >
            Your resume, engineered to{" "}
            <span className="text-shimmer animate-shimmer">get interviews</span>
          </h1>

          <p
            className="mt-5 max-w-xl animate-fade-up text-lg leading-relaxed text-muted-foreground"
            style={{ animationDelay: "160ms" }}
          >
            ResumeFlow tailors every bullet to the job, scores it against real
            ATS criteria, and exports a recruiter-ready application in minutes.
          </p>

          <div
            className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/resume-import"
              className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-e2 transition-all duration-200 hover:shadow-glow"
            >
              Build my resume — free
              <ArrowRightIcon
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <a
              href="#ats"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-base font-semibold text-foreground shadow-e1 transition-colors duration-200 hover:bg-muted"
            >
              See how scoring works
            </a>
          </div>

          <ul
            className="mt-9 flex animate-fade-up flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground"
            style={{ animationDelay: "320ms" }}
          >
            <li className="flex items-center gap-1.5">
              <ShieldCheckIcon className="h-4 w-4 text-success" aria-hidden="true" />
              Data stays in your browser
            </li>
            <li>No credit card required</li>
            <li>Free core features</li>
          </ul>
        </div>

        {/* ----- Live product simulation ----- */}
        <div className="relative lg:col-span-6" aria-hidden="true">
          <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div
              className="relative mx-auto max-w-md lg:ml-auto"
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
            >
              {/* Resume document (tilts toward cursor) */}
              <div
                ref={tiltRef}
                className="relative rounded-2xl border border-border bg-card p-1.5 shadow-e4 transition-transform duration-200 ease-out will-change-transform"
              >
                <div className="rounded-xl border border-border bg-background p-6">
                  <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      alex_morgan_resume.pdf
                    </span>
                  </div>

                  <div className="text-lg font-bold text-foreground">Alex Morgan</div>
                  <div className="flex h-5 items-center text-sm font-medium text-primary">
                    {roleText}
                    <span className="ml-0.5 inline-block h-4 w-[2px] animate-blink rounded-full bg-primary" />
                  </div>

                  <div className="mt-4 border-t border-border pt-4">
                    <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Experience
                    </span>
                    <div className="text-sm font-semibold text-foreground">
                      Senior Engineer · Stripe
                    </div>
                    <p
                      className={`mt-1 rounded-md text-sm leading-relaxed transition-colors duration-700 ${
                        bulletUpgraded
                          ? "bg-success/[0.08] px-1.5 py-0.5 text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {bulletUpgraded ? STRONG_BULLET : WEAK_BULLET}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-border pt-4">
                    <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {BASE_SKILLS.map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                        >
                          {s}
                        </span>
                      ))}
                      {keywordsAdded &&
                        ADDED_SKILLS.map((s) => (
                          <span
                            key={s}
                            className="animate-fade-in rounded-md border border-success/30 bg-success/10 px-2 py-0.5 text-xs font-semibold text-success"
                          >
                            + {s}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Floating: ATS score ring */}
                <div className="absolute -right-4 -top-8 w-32 animate-float rounded-2xl border border-border bg-card p-3.5 shadow-e3 sm:-right-8">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0">
                      <svg viewBox="0 0 48 48" className="-rotate-90">
                        <circle cx="24" cy="24" r="22" fill="none" strokeWidth="4" className="stroke-muted" />
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          fill="none"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray="138.2"
                          strokeDashoffset={ringOffset}
                          className="stroke-[hsl(var(--primary))] transition-all duration-300"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                        {score}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        ATS
                      </div>
                      <div className={`text-xs font-bold ${done ? "text-success" : "text-primary"}`}>
                        {done ? "Strong" : "Scoring"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating: AI suggestion panel */}
                <div className="absolute -bottom-9 -left-3 w-64 animate-float-slow rounded-2xl border border-border bg-card p-3.5 shadow-e3 sm:-left-8">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        done ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {done ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        <SparklesIcon className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        AI suggestion
                      </div>
                      <p className="mt-0.5 text-xs font-medium leading-snug text-foreground">
                        {current.suggestion}
                      </p>
                      {current.applied && !done && (
                        <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-[11px] font-semibold text-success">
                          <CheckIcon className="h-3 w-3" /> Applied
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The flow continues down into the page */}
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-[hsl(var(--primary)/0.5)] to-[hsl(var(--primary))]" />
        <div className="animate-beam-drop absolute left-0 top-0 h-8 w-full rounded-full bg-[hsl(var(--accent))] blur-[1px]" />
      </div>
    </section>
  );
};
