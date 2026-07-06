import React from "react";
import Link from "next/link";

const LINK_GROUPS = [
  {
    heading: "Platform",
    links: [
      ["#features", "Features"],
      ["#ats", "ATS Scorer"],
      ["#templates", "Templates"],
      ["#pricing", "Pricing"],
      ["#faq", "FAQ"],
    ],
  },
  {
    heading: "Developers",
    links: [
      ["https://github.com/Rajnikanth31/resumeflow", "GitHub"],
      ["#", "Roadmap"],
      ["#", "Privacy Policy"],
    ],
  },
];

export const Footer = () => (
  <footer className="border-t border-border bg-card/50">
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
      <div className="space-y-4 md:col-span-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] font-mono text-sm font-bold text-white">
            RF
          </div>
          <span className="text-base font-bold text-foreground">ResumeFlow</span>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          The privacy-first AI career platform. Build ATS-optimized resumes,
          tailor them to any job, and export complete application packages.
        </p>
      </div>

      {LINK_GROUPS.map(({ heading, links }) => (
        <nav key={heading} aria-label={`Footer — ${heading}`} className="space-y-4">
          <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {heading}
          </span>
          <ul className="space-y-2.5 text-sm">
            {links.map(([href, text]) => (
              <li key={text}>
                {href.startsWith("#") ? (
                  <a href={href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {text}
                  </a>
                ) : (
                  <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {text}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>

    <div className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>&copy; 2026 ResumeFlow. All rights reserved.</span>
        <span>MIT License</span>
      </div>
    </div>
  </footer>
);
