import {
  DocumentPlusIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  FolderArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Section, SectionHeader } from "home/Section";
import { Reveal } from "home/Reveal";

const STEPS = [
  {
    icon: DocumentPlusIcon,
    title: "Import your resume",
    text: "Drop in an existing PDF or start fresh in the editor. Your master profile lives in your browser.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Add the target job",
    text: "Paste the job description. ResumeFlow extracts the skills, keywords, and seniority signals that matter.",
  },
  {
    icon: SparklesIcon,
    title: "Run AI alignment",
    text: "Review your ATS score, apply AI bullet rewrites, and generate a matching cover letter.",
  },
  {
    icon: FolderArrowDownIcon,
    title: "Export & apply",
    text: "Download a complete package — PDF resume, DOCX cover letter, and ATS report — in one ZIP.",
  },
];

export const Steps = () => (
  <Section id="how-it-works" className="bg-card/50 border-y border-border">
    <SectionHeader
      kicker="How it works"
      title="From resume to application in four steps"
      subtitle="No templates to fight, no formatting rabbit holes — a workflow built around how hiring actually happens."
    />
    <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {STEPS.map(({ icon: Icon, title, text }, i) => (
        <Reveal as="li" key={title} delay={i * 110} className="relative">
          {/* connector line (desktop) */}
          {i < STEPS.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[calc(50%+2rem)] top-6 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-border to-transparent lg:block"
            />
          )}
          <div className="flex flex-col items-start gap-4 lg:items-center lg:text-center">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/[0.06] text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {i + 1}
              </span>
            </span>
            <div>
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  </Section>
);
