import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Reveal } from "home/Reveal";

export const FinalCta = () => (
  <section id="cta" className="relative py-16 sm:py-20 lg:py-24">
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card px-6 py-16 text-center shadow-e4 sm:px-12 lg:py-20">
          {/* Gradient lighting */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-[360px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.18),transparent)]" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,hsl(var(--accent)/0.12),transparent)]" />
          </div>

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Your next interview starts with the{" "}
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
                right resume
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              Build, score, and export a job-ready application package in minutes.
              Free to start — no credit card required.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/resume-import"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-e2 transition-all duration-200 hover:shadow-glow sm:w-auto"
              >
                Build my resume — free
                <ArrowRightIcon
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <a
                href="#ats"
                className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-7 py-3.5 text-base font-semibold text-foreground transition-colors duration-200 hover:bg-muted sm:w-auto"
              >
                See how scoring works
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
