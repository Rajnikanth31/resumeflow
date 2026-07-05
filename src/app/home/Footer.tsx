import React from "react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/60 mt-20">
      <div className="max-w-[1180px] mx-auto py-12 px-6 grid grid-cols-1 gap-8 md:grid-cols-4 items-start">
        {/* Brand block */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[color:var(--theme-gold)] to-[color:var(--theme-gold-secondary)] text-zinc-950 flex items-center justify-center font-mono font-bold text-sm">
              RF
            </div>
            <span className="text-base font-bold text-foreground">ResumeFlow</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            ResumeFlow is the privacy-first AI Career Platform designed to help candidates optimize job application pipelines.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Platform</span>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            </li>
            <li>
              <a href="#score" className="text-muted-foreground hover:text-foreground transition-colors">ATS Scorer</a>
            </li>
            <li>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Developers</span>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="https://github.com/Rajnikanth31/resumeflow" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Roadmap</Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-[1180px] mx-auto py-6 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[10px] text-muted-foreground font-mono">
          <span>&copy; 2026 ResumeFlow. All rights reserved.</span>
          <span>MIT License</span>
        </div>
      </div>
    </footer>
  );
};
