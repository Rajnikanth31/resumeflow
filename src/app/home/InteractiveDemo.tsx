"use client";
import React, { useState, useEffect, useRef } from "react";

export const InteractiveDemo = () => {
  const [score, setScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Counter states for metrics
  const [interviews, setInterviews] = useState(0);
  const [tailorTime, setTailorTime] = useState(0);
  const [optimizedCount, setOptimizedCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // 1. Score circular count up
          let s = 0;
          const scoreInterval = setInterval(() => {
            if (s < 94) {
              s += 2;
              setScore(s);
            } else {
              clearInterval(scoreInterval);
            }
          }, 25);

          // 2. Interviews multiplier count up
          let i = 0.0;
          const interviewsInterval = setInterval(() => {
            if (i < 2.3) {
              i = parseFloat((i + 0.1).toFixed(1));
              setInterviews(i);
            } else {
              clearInterval(interviewsInterval);
            }
          }, 50);

          // 3. Tailor time count up
          let t = 0;
          const tailorInterval = setInterval(() => {
            if (t < 12) {
              t += 1;
              setTailorTime(t);
            } else {
              clearInterval(tailorInterval);
            }
          }, 60);

          // 4. Resumes count up
          let o = 0;
          const optimizedInterval = setInterval(() => {
            if (o < 40) {
              o += 2;
              setOptimizedCount(o);
            } else {
              clearInterval(optimizedInterval);
            }
          }, 40);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Dash Offset calculation for SVG circle (perimeter is 326.7)
  const strokeDashoffset = 326.7 * (1 - score / 100);

  return (
    <section id="score" ref={sectionRef} className="max-w-[1180px] mx-auto py-16 px-6 space-y-8">
      <div className="border border-border rounded-2xl p-8 lg:p-12 bg-gradient-to-b from-card to-card/90 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(212,170,92,0.06),transparent_45%)] pointer-events-none" />

        {/* Left Circle ring indicator */}
        <div className="flex justify-center md:col-span-1">
          <div className="relative w-52 h-52 flex-shrink-0">
            <svg width="208" height="208" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(122,140,155,0.12)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#grad1)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="326.7"
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#c99549" />
                  <stop offset="1" stopColor="#e0ba74" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-heading bg-gradient-to-r from-[color:var(--theme-gold)] to-[color:var(--theme-gold-secondary)] bg-clip-text text-transparent">
                {score}%
              </span>
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mt-1">ATS MATCH SCORE</span>
            </div>
          </div>
        </div>

        {/* Right Info pane with keyword heatmaps */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-emerald-500/10 px-3.5 py-1 text-[10px] font-bold text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
              ▲ STRONG MATCH
            </div>
            <h2 className="text-3xl font-extrabold font-heading tracking-tight text-foreground">
              See exactly why you match — and what to fix
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ResumeFlow compares your resume against the job description across skills, tech stack, seniority, and keyword coverage. It provides clear, actionable breakdowns of matched, weak, and missing terms.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <span className="font-mono text-[9px] text-emerald-500 tracking-wider block mb-2 uppercase font-bold">MATCHED</span>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Node.js", "REST API", "Git", "Agile"].map((k) => (
                  <span key={k} className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-mono text-[9px] text-amber-500 tracking-wider block mb-2 uppercase font-bold">WEAK</span>
              <div className="flex flex-wrap gap-2">
                {["GraphQL", "Docker"].map((k) => (
                  <span key={k} className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-mono text-[9px] text-rose-500 tracking-wider block mb-2 uppercase font-bold">MISSING</span>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "PostgreSQL", "Kubernetes"].map((k) => (
                  <span key={k} className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Under stats row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { title: `${interviews}x`, text: "More interviews landed" },
          { title: `${tailorTime}s`, text: "To a tailored draft" },
          { title: `${optimizedCount}k+`, text: "Resumes optimized" },
          { title: "3", text: "Export formats: PDF · DOCX · ZIP" }
        ].map((item, idx) => (
          <div key={idx} className="border border-border rounded-xl bg-card p-5 shadow-sm space-y-1">
            <span className="text-3xl font-extrabold tracking-tight font-heading text-foreground">{item.title}</span>
            <p className="text-xs text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
