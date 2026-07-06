import Link from "next/link";
import { Section, SectionHeader } from "home/Section";
import { Reveal } from "home/Reveal";

/**
 * Pure-CSS template previews — zero image weight, crisp at any DPI,
 * and they inherit the theme automatically.
 */
const TEMPLATES = [
  { name: "Modern", desc: "Clean single-column with accent headings. The ATS-safest layout.", accent: true },
  { name: "Executive", desc: "Serif-toned hierarchy for senior and leadership roles.", accent: false },
  { name: "Compact", desc: "Dense two-column fit for engineers with deep skill lists.", accent: false },
];

const SkeletonLine = ({ w, strong = false }: { w: string; strong?: boolean }) => (
  <div className={`h-1.5 rounded-full ${strong ? "bg-foreground/60" : "bg-muted-foreground/25"}`} style={{ width: w }} />
);

export const Templates = () => (
  <Section id="templates" className="bg-card/50 border-y border-border">
    <SectionHeader
      kicker="Templates"
      title="Recruiter-approved, ATS-safe layouts"
      subtitle="Every template parses cleanly through applicant tracking systems — no tables, no text boxes, no lost sections."
    />
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {TEMPLATES.map(({ name, desc, accent }, i) => (
        <Reveal key={name} delay={i * 100}>
          <Link
            href="/resume-builder"
            className="group block rounded-2xl border border-border bg-card p-5 shadow-e1 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-e3"
          >
            {/* Mini resume mockup */}
            <div
              aria-hidden="true"
              className="rounded-xl border border-border bg-background p-5 transition-transform duration-300 group-hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className={`h-2.5 w-24 rounded-full ${accent ? "bg-primary/70" : "bg-foreground/70"}`} />
                  <SkeletonLine w="4rem" />
                </div>
                {name === "Compact" && <div className="h-8 w-8 rounded-full bg-muted" />}
              </div>
              <div className={`mt-4 space-y-2 ${name === "Compact" ? "grid grid-cols-2 gap-x-3 space-y-0" : ""}`}>
                <div className="space-y-1.5">
                  <SkeletonLine w="3rem" strong />
                  <SkeletonLine w="100%" />
                  <SkeletonLine w="85%" />
                  <SkeletonLine w="70%" />
                </div>
                <div className="mt-3 space-y-1.5">
                  <SkeletonLine w="3.5rem" strong />
                  <SkeletonLine w="90%" />
                  <SkeletonLine w="75%" />
                </div>
              </div>
              <div className="mt-4 flex gap-1.5">
                {[0, 1, 2].map((n) => (
                  <div key={n} className={`h-3 w-10 rounded-full ${accent ? "bg-primary/15" : "bg-muted"}`} />
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">{name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
              </div>
              <span className="text-sm font-semibold text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Use →
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  </Section>
);
