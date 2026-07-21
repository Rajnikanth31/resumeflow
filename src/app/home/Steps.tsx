import {
  DocumentPlusIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  FolderArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Section, SectionHeader } from "home/Section";
import { Reveal } from "home/Reveal";

/**
 * "The Flow" — your resume's journey through ResumeFlow, drawn as a
 * serpentine stream. The path draws itself in on scroll and a current
 * of small dashes travels along it endlessly. Desktop only; mobile
 * falls back to a vertical stream timeline.
 */
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

/* Node positions along the serpentine (percentages of the canvas) */
const NODES = [
  { x: 30, y: 14 },
  { x: 70, y: 38 },
  { x: 30, y: 62 },
  { x: 70, y: 86 },
];

const PATH_D =
  "M50,0 C50,7 30,7 30,14 C30,24 70,28 70,38 C70,48 30,52 30,62 C30,72 70,76 70,86 C70,93 50,93 50,100";

export const Steps = () => (
  <Section id="how-it-works">
    <SectionHeader
      kicker="The flow"
      title="Follow your resume through the stream"
      subtitle="One continuous flow: in as a rough draft, out as a complete, screener-proof application."
    />

    {/* ---------- Desktop: serpentine journey ---------- */}
    <Reveal className="relative hidden h-[760px] lg:block">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(var(--primary))" />
            <stop offset="1" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
        {/* Faint full route */}
        <path
          d={PATH_D}
          pathLength={1}
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {/* Gradient route that draws itself in */}
        <path
          className="flow-path"
          d={PATH_D}
          pathLength={1}
          stroke="url(#flowGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* The current — dashes travelling downstream */}
        <path
          className="flow-dash"
          d={PATH_D}
          pathLength={1}
          stroke="hsl(var(--accent))"
          strokeWidth="3.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.7"
        />
      </svg>

      {/* Numbered nodes sitting on the stream */}
      {NODES.map(({ x, y }, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="node-pulse absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          {i + 1}
        </div>
      ))}

      {/* Step cards on the opposite bank of each node */}
      {STEPS.map(({ icon: Icon, title, text }, i) => {
        const node = NODES[i];
        const onLeftBank = node.x > 50; // card sits opposite the node
        return (
          <div
            key={title}
            className="absolute w-[38%] -translate-y-1/2"
            style={{
              top: `${node.y}%`,
              ...(onLeftBank ? { left: "6%" } : { right: "6%" }),
            }}
          >
            <div className="group rounded-2xl border border-border bg-card p-6 shadow-e1 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-e3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold text-foreground">{title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </div>
        );
      })}
    </Reveal>

    {/* ---------- Mobile / tablet: vertical stream ---------- */}
    <ol className="relative space-y-8 pl-10 lg:hidden">
      <div
        aria-hidden="true"
        className="absolute bottom-2 left-[15px] top-2 w-px bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-transparent"
      />
      {STEPS.map(({ icon: Icon, title, text }, i) => (
        <Reveal as="li" key={title} delay={i * 90} className="relative">
          <span
            aria-hidden="true"
            className="node-pulse absolute -left-10 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary"
          >
            {i + 1}
          </span>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-e1">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-foreground">{title}</h3>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  </Section>
);
