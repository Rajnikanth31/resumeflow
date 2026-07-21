import React from "react";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Section, SectionHeader } from "home/Section";
import { Reveal } from "home/Reveal";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    desc: "Perfect for drafting your master resume.",
    features: ["1 active resume profile", "ATS match scan & heatmaps", "Local browser storage", "PDF export"],
    cta: "Get started",
    href: "/resume-import",
    highlight: false,
    disabled: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/mo",
    desc: "Accelerate your interview call rate.",
    features: [
      "Unlimited active resumes",
      "AI resume tailoring",
      "Cover letter workspace",
      "Application package exporter (ZIP)",
      "Version history",
    ],
    cta: "Try Pro free",
    href: "/resume-import",
    highlight: true,
    disabled: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For universities and career teams.",
    features: ["Bulk PDF parsing API", "Custom layout templates", "Recruiting dashboard", "Dedicated support"],
    cta: "Coming soon",
    href: "",
    highlight: false,
    disabled: true,
  },
];

export const Pricing = () => (
  <Section id="pricing" glow="right">
    <SectionHeader
      kicker="Pricing"
      title="Simple, transparent pricing"
      subtitle="Start free. Upgrade when you're applying at volume."
    />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
      {TIERS.map((tier, i) => (
        <Reveal key={tier.name} delay={i * 100} className="h-full">
          <div
            className={`relative flex h-full flex-col justify-between rounded-2xl border bg-card p-7 transition-all duration-300 ${
              tier.highlight
                ? "border-primary/50 shadow-glow md:-translate-y-2"
                : "border-border shadow-e1 hover:border-primary/25 hover:shadow-e2"
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                Most popular
              </span>
            )}

            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {tier.name}
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">{tier.price}</span>
                {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{tier.desc}</p>

              <ul className="mt-6 space-y-3 border-t border-border pt-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              {tier.disabled ? (
                <span
                  aria-disabled="true"
                  className="block w-full cursor-not-allowed rounded-xl border border-border bg-muted py-3 text-center text-sm font-semibold text-muted-foreground"
                >
                  {tier.cta}
                </span>
              ) : (
                <Link
                  href={tier.href}
                  className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 ${
                    tier.highlight
                      ? "bg-primary text-primary-foreground shadow-e2 hover:shadow-glow"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {tier.cta}
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);
