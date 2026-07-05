import React from "react";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";

export const Pricing = () => {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      desc: "Perfect for drafting your master resume.",
      features: ["1 Active Resume Profile", "ATS Match Scan & Heatmaps", "Local Browser Storage", "Export PDF Resumes"],
      cta: "Get Started",
      href: "/resume-import",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "/mo",
      desc: "Accelerate your interview call rates.",
      features: ["Unlimited Active Resumes", "AI Resume Tailoring", "Cover Letter Workspace", "Unified Package Exporter (ZIP)", "Version History Log"],
      cta: "Try Pro Free",
      href: "/resume-import",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Custom structures for universities and teams.",
      features: ["Bulk PDF Parsing API", "Custom Layout Templates", "Recruiting Dashboard Tools", "Dedicated Success Support"],
      cta: "Contact Sales",
      href: "mailto:hello@resumeflow.com",
      highlight: false,
      comingSoon: true,
    },
  ];

  return (
    <section className="max-w-[1180px] mx-auto py-16 px-6 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-block rounded-full bg-indigo-500/10 px-3.5 py-1 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
          PRICING
        </div>
        <h2 className="text-3xl font-extrabold font-heading tracking-tight text-foreground">
          Simple, transparent pricing
        </h2>
        <p className="text-sm text-muted-foreground">
          Unlock premium career optimization tools in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`border rounded-2xl p-6 flex flex-col justify-between relative bg-card shadow-md transition-all duration-300 ${
              tier.highlight
                ? "border-indigo-500 shadow-indigo-500/5 -translate-y-1.5"
                : "border-border hover:border-zinc-700/60"
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                Most Popular
              </span>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{tier.name}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight font-heading text-foreground">{tier.price}</span>
                  {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{tier.desc}</p>
              </div>

              <div className="border-t border-border pt-4">
                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                      <CheckIcon className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href={tier.href}
                className={`w-full py-2.5 rounded-lg text-xs font-bold text-center block transition-all ${
                  tier.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg"
                    : "bg-secondary text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-border"
                }`}
              >
                {tier.comingSoon ? "Coming Soon" : tier.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
