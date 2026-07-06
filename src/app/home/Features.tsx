import {
  SparklesIcon,
  CpuChipIcon,
  DocumentTextIcon,
  FolderArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Section, SectionHeader } from "home/Section";
import { Reveal } from "home/Reveal";

const FEATURES = [
  {
    icon: SparklesIcon,
    title: "AI resume tailoring",
    text: "Rewrites your bullet points to match any job description — stronger verbs, quantified impact, and the exact language recruiters search for.",
    badge: "AI",
  },
  {
    icon: CpuChipIcon,
    title: "ATS intelligence scan",
    text: "Know your match score before you apply. Keyword coverage, missing skills, and formatting checks across every dimension screeners measure.",
    badge: "Analytics",
  },
  {
    icon: DocumentTextIcon,
    title: "Cover letter canvas",
    text: "Generate tailored cover letters in your choice of tone and layout — Modern, Executive, or Startup — with full version history.",
    badge: "Workspace",
  },
  {
    icon: FolderArrowDownIcon,
    title: "One-click application package",
    text: "Export everything at once: print-ready PDF resume, Word-compatible cover letter, and your ATS report in a single ZIP.",
    badge: "Export",
  },
];

export const Features = () => (
  <Section id="features">
    <SectionHeader
      kicker="Features"
      title="Everything between you and the interview, handled"
      subtitle="Four tools that turn one master resume into a tailored, screener-proof application for every job."
    />
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {FEATURES.map(({ icon: Icon, title, text, badge }, i) => (
        <Reveal key={title} delay={i * 90}>
          <article className="group relative h-full rounded-2xl border border-border bg-card p-7 shadow-e1 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-e3">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="rounded-full border border-primary/20 bg-primary/[0.06] px-2.5 py-0.5 text-xs font-semibold text-primary">
                {badge}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </article>
        </Reveal>
      ))}
    </div>
  </Section>
);
