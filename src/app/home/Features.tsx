import {
  SparklesIcon,
  CpuChipIcon,
  DocumentTextIcon,
  FolderArrowDownIcon
} from "@heroicons/react/24/outline";

const FEATURES = [
  {
    icon: SparklesIcon,
    title: "AI Resume Tailoring",
    text: "Rewrite and refine your bullet points instantly matching target job descriptions. Leverage optimized action verbs to boost interview chances.",
    badge: "AI Powered"
  },
  {
    icon: CpuChipIcon,
    title: "ATS Intelligence Scan",
    text: "Verify resume compatibility before applying. Get matching scores, keyword coverage maps, missing skills analysis, and scoring guidelines.",
    badge: "Analytics"
  },
  {
    icon: DocumentTextIcon,
    title: "Cover Letter Canvas",
    text: "Generate tailored cover letters matching target roles. Select recruiter tones, toggle layouts (Modern, Executive, Startup), and track versions history.",
    badge: "Workspace"
  },
  {
    icon: FolderArrowDownIcon,
    title: "Unified Package Exports",
    text: "Bundle and download your application package. Exports compiled PDF resumes, Word-compatible DOCX cover letters, and ATS score summaries in a ZIP archive.",
    badge: "Automation"
  }
];

export const Features = () => {
  return (
    <section className="py-20 lg:py-28 bg-card text-foreground rounded-3xl px-8 lg:px-16 border border-border mt-12">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Platform Features</h2>
        <p className="text-sm text-muted-foreground">Everything you need to optimize your applications, pass resume screeners, and land the interview.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, text, badge }) => (
          <div key={title} className="group relative border border-border bg-card p-6 rounded-2xl hover:border-indigo-500/40 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">{badge}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
