import { SparklesIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { Section, SectionHeader } from "home/Section";
import { Reveal } from "home/Reveal";

const CAPABILITIES = [
  {
    title: "Contextual bullet rewriting",
    text: "Not generic thesaurus swaps — the AI reads the job description and rewrites each bullet with the role's own vocabulary.",
  },
  {
    title: "Gap detection",
    text: "Flags missing skills and suggests where in your history you can honestly evidence them.",
  },
  {
    title: "Tone-matched cover letters",
    text: "Startup-casual to executive-formal, generated from your resume and the job in one pass.",
  },
];

export const AiFeatures = () => (
  <Section id="ai">
    <SectionHeader
      kicker="AI, applied honestly"
      title="Your words, sharpened — never invented"
      subtitle="ResumeFlow strengthens what you actually did. It never fabricates experience."
    />
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
      {/* Before / after rewrite demo */}
      <Reveal>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-e3 sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <SparklesIcon className="h-4 w-4" aria-hidden="true" />
            AI bullet rewrite
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-border bg-muted/60 p-4">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Before
              </span>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Responsible for improving the deployment process for the team.
              </p>
            </div>
            <div className="flex justify-center" aria-hidden="true">
              <ArrowLongRightIcon className="h-5 w-5 rotate-90 text-primary" />
            </div>
            <div className="rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                After
              </span>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                Rebuilt CI/CD pipeline with GitHub Actions and Terraform, cutting deploy
                time from 45 to 6 minutes across 12 services.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["GitHub Actions", "Terraform", "CI/CD"].map((k) => (
                  <span
                    key={k}
                    className="rounded-md border border-success/25 bg-success/10 px-2 py-0.5 text-xs font-semibold text-success"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Capability list */}
      <div className="space-y-2">
        {CAPABILITIES.map(({ title, text }, i) => (
          <Reveal key={title} delay={i * 100}>
            <div className="rounded-2xl p-5 transition-colors duration-200 hover:bg-muted/60">
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </Section>
);
